import nodemailer from "nodemailer";
import { EMAIL_TRANSPORT_SETTINGS } from "../types/email.types";
import { DEFAULT_TRANSPORT_SETTINGS } from "../constants/email.constants";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UserEmailConfirmation, UserEmailRecoveryPassword } from "../../types";

export class EmailService {
  private mailer;
  private transport;

  constructor(
    mailer = nodemailer,
    settings: EMAIL_TRANSPORT_SETTINGS = DEFAULT_TRANSPORT_SETTINGS
  ) {
    this.mailer = mailer;

    this.transport = this.mailer.createTransport(settings);
  }

  generateEmailConfirmation = (): UserEmailConfirmation => ({
    confirmationCode: randomUUID(),
    expire: add(new Date(), { days: 3 }),
    isConfirmed: false,
  });

  generatePasswordRecoveryConfirmation = (): UserEmailRecoveryPassword => ({
    recoveryCode: randomUUID(),
    expire: add(new Date(), { days: 3 }),
    isUsed: false,
  });

  generateEmailTemplate = ({
    link = "localhost:3003/auth/registration-confirmation",
    code,
    title = "Thank for your registration",
  }: {
    link?: string;
    title?: string;
    code: string | null;
  }) =>
    `<h1>${title}</h1>
 <p>To finish please follow the link below:
     <a href='http://${link}?code=${code}'>complete action</a>
 </p>`;

  generateRecoveryPasswordEmail = ({
    link = "localhost:3003/auth/password-recovery",
    recoveryCode,
  }: {
    link?: string;
    recoveryCode: string | null;
  }) =>
    `<h1>Recovery password</h1>
 <p>To finish please follow the link below:
     <a href='http://${link}?recoveryCode=${recoveryCode}'>complete recovery</a>
 </p>`;

  async sendEmail({
    to,
    from,
    subject = "Hello",
    text = "Hi",
    html,
  }: {
    to: string;
    from: string;
    subject?: string;
    text?: string;
    html?: string;
  }) {
    return this.transport.sendMail({ to, from, subject, text, html });
  }
}
