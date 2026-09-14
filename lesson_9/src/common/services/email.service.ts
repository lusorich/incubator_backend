import nodemailer from "nodemailer";
import { EMAIL_TRANSPORT_SETTINGS } from "../types/email.types";
import { DEFAULT_TRANSPORT_SETTINGS } from "../constants/email.constants";
import { randomUUID } from "crypto";
import { add } from "date-fns";
import { UserEmailConfirmation } from "../../types";

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

  generateEmailTemplate = ({
    link = "localhost:3003/auth/registration-confirmation",
    code,
  }: {
    link?: string;
    code: string | null;
  }) => `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='http://${link}?code=${code}'>complete registration</a>
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
