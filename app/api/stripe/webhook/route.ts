import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const h = await headers();
  const sig = h.get("stripe-signature");
  let event;

  if (!sig) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return new Response("Webhook error", { status: 400 });
  }

  // 订阅成功
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    if (session.customer) {
      await prisma.user.updateMany({
        where: {
          stripeCustomerId: session.customer.toString(),
        },
        data: {
          isPremium: true,
          stripeSubId: session.subscription?.toString(),
        },
      });
    }
  }

  // 取消订阅
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object;

    await prisma.user.updateMany({
      where: {
        stripeSubId: sub.id,
      },
      data: {
        isPremium: false,
      },
    });
  }

  return new Response("ok");
}
