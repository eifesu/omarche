import resend from "./resend";

const proMail = ["omarchesarl@gmail.com"];
const emailAddresses: string[] = [
  "lougbess@gmail.com",
  "audreybohoussou88@gmail.com",
  "Broumambeyomarievictoire@gmail.com",
  "gracekouma286@gmail.com",
  "koffiyohann86@gmail.com",
  "samirakiebre6@gmail.com",
];
const testMail = ["yessochrisa@gmail.com"];

export async function notifyOrderCreated() {
  const message = "Une nouvelle commande a été créée dans la base de données.";
  const recipients = [...proMail, ...emailAddresses, ...testMail];
  const subject = "Nouvelle commande";
  await sendMail(message, recipients, subject);
}

export async function sendMail(
  message: string,
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
    throw new Error(error.message);
  }

  return data;
}
