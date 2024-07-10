import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://locahost:3000/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: 'Calvary Bible Fellowship. <reachout@cbf-church.org>',
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`,
  });
};
