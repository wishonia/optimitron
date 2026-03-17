import "@/lib/server-env";
import { Resend } from "resend";
import { render } from "@react-email/components";

interface ResendMessage {
  html: string;
  subject: string;
  text: string;
  to: string;
}

interface ResendReactMessage {
  react: React.ReactElement;
  subject: string;
  to: string;
}

let resendClient: Resend | null = null;

export function getEmailFromAddress() {
  return process.env.EMAIL_FROM ?? "";
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY && getEmailFromAddress());
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendResendEmail(message: ResendMessage) {
  if (!isResendConfigured()) {
    return { status: "disabled" as const };
  }

  const resend = getResendClient();
  const response = await resend.emails.send({
    from: getEmailFromAddress(),
    to: [message.to],
    subject: message.subject,
    html: message.html,
    text: message.text,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    status: "sent" as const,
    id: response.data?.id ?? null,
  };
}

export async function sendReactEmail(message: ResendReactMessage) {
  if (!isResendConfigured()) {
    return { status: "disabled" as const };
  }

  const resend = getResendClient();
  const html = await render(message.react);
  const text = await render(message.react, { plainText: true });

  const response = await resend.emails.send({
    from: getEmailFromAddress(),
    to: [message.to],
    subject: message.subject,
    html,
    text,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return {
    status: "sent" as const,
    id: response.data?.id ?? null,
  };
}
