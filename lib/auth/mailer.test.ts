import { describe, expect, it, vi } from "vitest";

const { sendMailMock, createTransportMock } = vi.hoisted(() => {
  const sendMail = vi.fn();
  const createTransport = vi.fn(() => ({
    sendMail,
  }));
  return {
    sendMailMock: sendMail,
    createTransportMock: createTransport,
  };
});

vi.mock("nodemailer", () => ({
  default: {
    createTransport: createTransportMock,
  },
}));

import { buildSmtpAttempts, sendVerificationEmail } from "@/lib/auth/mailer";

describe("mailer", () => {
  it("builds smtp attempts with fallback from 587 to 465", () => {
    const attempts = buildSmtpAttempts({
      NODE_ENV: "test",
      SMTP_HOST: "smtp.gmail.com",
      SMTP_PORT: "587",
      SMTP_PROXY: "http://127.0.0.1:7891",
    } as NodeJS.ProcessEnv);

    expect(attempts).toEqual([
      {
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        proxy: "http://127.0.0.1:7891",
      },
      {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        proxy: "http://127.0.0.1:7891",
      },
    ]);
  });

  it("retries next smtp attempt when the first send fails", async () => {
    createTransportMock.mockReset();
    sendMailMock.mockReset();
    sendMailMock
      .mockRejectedValueOnce(new Error("first failed"))
      .mockResolvedValueOnce({ accepted: ["to@example.com"] });

    await sendVerificationEmail({
      to: "to@example.com",
      verifyLink: "http://localhost:3000/api/auth/verify-email?token=t",
      env: {
        NODE_ENV: "test",
        SMTP_HOST: "smtp.gmail.com",
        SMTP_PORT: "587",
        SMTP_PROXY: "http://127.0.0.1:7891",
        SMTP_USER: "user@example.com",
        SMTP_PASS: "password",
        SMTP_FROM: "user@example.com",
      } as NodeJS.ProcessEnv,
    });

    expect(createTransportMock).toHaveBeenCalledTimes(2);
    expect(sendMailMock).toHaveBeenCalledTimes(2);
  });
});
