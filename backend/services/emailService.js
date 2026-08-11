import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendReminderEmail = async (subject, htmlBody) => {
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.MOM_EMAIL,
    subject,
    html: htmlBody,
  });
};