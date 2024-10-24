import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';

@Injectable()
export class EmailService {
  constructor(mailerService: MailerService) {}

  generateUserEmailConfirmation = () => ({
    confirmationCode: randomUUID(),
    expire: add(new Date(), { days: 3 }),
    isConfirmed: false,
  });

  generatePasswordRecoveryConfirmation = () => ({
    recoveryCode: randomUUID(),
    expire: add(new Date(), { days: 3 }),
    isUsed: false,
  });

  generateRegistrationConfirmationEmail = ({
    link = 'localhost:3000/auth/registration-confirmation',
    code,
    title = 'Thank for your registration',
  }) =>
    `<h1>${title}</h1><p>To finish please follow the link below: <a href='http://${link}?code=${code}'>complete action</a></p>`;

  generateRecoveryPasswordEmail = ({
    link = 'localhost:3000/auth/password-recovery',
    recoveryCode,
  }) => `<h1>Recovery password</h1>
 <p>To finish please follow the link below:
     <a href='http://${link}?recoveryCode=${recoveryCode}'>complete recovery</a>
 </p>`;
}
