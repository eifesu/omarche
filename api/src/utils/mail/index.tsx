import * as React from "react";
import resend from "./resend";
import { area_code } from "@prisma/client";

const COMPANY_EMAILS = ["omarchesarl@gmail.com"];
const ADMIN_EMAILS: string[] = [
  "lougbess@gmail.com",
  "audreybohoussou88@gmail.com",
  "Broumambeyomarievictoire@gmail.com",
  "gracekouma286@gmail.com",
  "koffiyohann86@gmail.com",
  "samirakiebre6@gmail.com",
];
const TEST_EMAIL = ["yessochrisa@gmail.com"];
export const EMAIL_LIST = [...COMPANY_EMAILS, ...ADMIN_EMAILS, ...TEST_EMAIL];

export async function createEmailTemplate(
  template: React.FC,
  props: Record<string, unknown>
) {
  const message = React.createElement(template, props);
  return message;
}

export async function sendMail(
  message: React.ReactNode,
  recipients: string[],
  subject?: string
) {
  const { data, error } = await resend.emails.send({
    from: "O'Marché <info@omarcheivoire.ci>",
    to: recipients,
    subject: subject || "O'Marché - Notification",
    react: message,
  });

  if (error) {
    console.error("Failed to send email:", error);
    throw error;
  }

  return data;
}
