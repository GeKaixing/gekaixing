import { beforeEach, describe, expect, it, vi } from "vitest";

const { headersMock, constructEventMock, updateManyMock, queryRawMock, executeRawMock } = vi.hoisted(() => ({
  headersMock: vi.fn(),
  constructEventMock: vi.fn(),
  updateManyMock: vi.fn(),
  queryRawMock: vi.fn(),
  executeRawMock: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: headersMock,
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: constructEventMock,
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      updateMany: updateManyMock,
    },
    $queryRaw: queryRawMock,
    $executeRaw: executeRawMock,
  },
}));

import { POST } from "@/app/api/stripe/webhook/route";

describe("POST /api/stripe/webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
    headersMock.mockResolvedValue({
      get: vi.fn((key: string) => (key === "stripe-signature" ? "sig_123" : null)),
    });
    updateManyMock.mockResolvedValue({ count: 1 });
    queryRawMock.mockResolvedValue([]);
    executeRawMock.mockResolvedValue(1);
  });

  it("returns 400 when stripe signature is missing", async () => {
    headersMock.mockResolvedValue({
      get: vi.fn(() => null),
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Missing stripe-signature");
  });

  it("returns 500 when webhook secret is missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Missing STRIPE_WEBHOOK_SECRET");
  });

  it("returns 400 when webhook signature validation fails", async () => {
    constructEventMock.mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Webhook error");
  });

  it("skips duplicate processed event", async () => {
    queryRawMock.mockResolvedValueOnce([{ status: "PROCESSED" }]);
    constructEventMock.mockReturnValue({
      id: "evt_done",
      type: "checkout.session.completed",
      data: {
        object: {
          customer: "cus_123",
          subscription: "sub_123",
        },
      },
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(200);
    expect(updateManyMock).not.toHaveBeenCalled();
  });

  it("marks user as active premium on checkout completed", async () => {
    constructEventMock.mockReturnValue({
      id: "evt_checkout_done",
      type: "checkout.session.completed",
      data: {
        object: {
          customer: "cus_123",
          subscription: "sub_123",
        },
      },
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(200);
    expect(updateManyMock).toHaveBeenCalledWith({
      where: { stripeCustomerId: "cus_123" },
      data: {
        isPremium: true,
        stripeSubId: "sub_123",
        subscriptionStatus: "ACTIVE",
      },
    });
  });

  it("maps canceled subscription to non-premium state", async () => {
    constructEventMock.mockReturnValue({
      id: "evt_sub_deleted",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_123",
          customer: "cus_123",
          status: "canceled",
          cancel_at_period_end: false,
          items: { data: [{ price: { id: "price_123" } }] },
          current_period_end: 1767225600,
        },
      },
    });

    const response = await POST(
      new Request("http://localhost/api/stripe/webhook", {
        method: "POST",
        body: "{}",
      }),
    );

    expect(response.status).toBe(200);
    expect(updateManyMock).toHaveBeenCalledWith({
      where: {
        OR: [{ stripeSubId: "sub_123" }, { stripeCustomerId: "cus_123" }],
      },
      data: {
        stripeSubId: "sub_123",
        stripePriceId: "price_123",
        isPremium: false,
        subscriptionStatus: "CANCELED",
        premiumExpiresAt: new Date(1767225600 * 1000),
        premiumGraceEndsAt: null,
      },
    });
  });
});
