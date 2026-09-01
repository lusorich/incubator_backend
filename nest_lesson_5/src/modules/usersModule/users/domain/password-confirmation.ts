import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class PasswordConfirmation {
  constructor(
    readonly recoveryCode: string | null,
    readonly expire: Date | null,
    readonly isUsed: boolean,
  ) {}

  static generate(): PasswordConfirmation {
    return new PasswordConfirmation(
      randomUUID(),
      add(new Date(), { days: 3 }),
      false,
    );
  }

  static generateUsedConfirmation(): PasswordConfirmation {
    return new PasswordConfirmation(null, null, true);
  }
}
