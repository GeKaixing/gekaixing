import nodemailer from "nodemailer";

type SmtpAttempt = {
  host: string;
  port: number;
  secure: boolean;
  proxy?: string;
};

function parsePort(value: string | undefined): number {
  const port = Number(value);
  if (!Number.isInteger(port) || port <= 0) {
    return 587;
  }
  return port;
}

export function buildSmtpAttempts(env: NodeJS.ProcessEnv = process.env): SmtpAttempt[] {
  const host = env.SMTP_HOST || "smtp.gmail.com";
  const primaryPort = parsePort(env.SMTP_PORT);
  const fallbackPort = primaryPort === 465 ? 587 : 465;
  const proxy = env.SMTP_PROXY?.trim() || undefined;

  const ports = [primaryPort, fallbackPort].filter(
    (port, index, list) => list.indexOf(port) === index,
  );

  return ports.map((port) => ({
    host,
    port,
    secure: port === 465,
    ...(proxy ? { proxy } : {}),
  }));
}

type SendVerificationEmailInput = {
  to: string;
  verifyLink: string;
  env?: NodeJS.ProcessEnv;
};

export async function sendVerificationEmail({
  to,
  verifyLink,
  env = process.env,
}: SendVerificationEmailInput): Promise<void> {
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.SMTP_FROM || user;
  if (!user || !pass || !from) {
    throw new Error("SMTP_USER, SMTP_PASS and SMTP_FROM/SMTP_USER are required");
  }

  const attempts = buildSmtpAttempts(env);
  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      const transporter = nodemailer.createTransport({
        host: attempt.host,
        port: attempt.port,
        secure: attempt.secure,
        auth: { user, pass },
        ...(attempt.proxy ? { proxy: attempt.proxy } : {}),
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 10_000,
      });

      await transporter.sendMail({
        from,
        to,
        subject: "Verify your email for Gekaixing",
        text: `Click this link to verify your email: ${verifyLink}\nThis link expires in 24 hours.`,
        html: `<p>Welcome to Gekaixing.</p><p><a href="${verifyLink}">Verify your email</a></p><p>This link expires in 24 hours.</p>`,
      });
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`port=${attempt.port}${attempt.proxy ? ` proxy=${attempt.proxy}` : ""}: ${message}`);
    }
  }

  throw new Error(`All SMTP attempts failed (${errors.join(" | ")})`);
}
