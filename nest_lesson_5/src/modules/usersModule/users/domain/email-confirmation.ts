import { randomUUID } from 'crypto';
import { add } from 'date-fns';

export class EmailConfirmation {
  constructor(
    readonly code: string,
    readonly expire: Date,
    readonly isConfirmed: boolean,
  ) {}

  static generate(): EmailConfirmation {
    return new EmailConfirmation(
      randomUUID(),
      add(new Date(), { days: 3 }),
      false,
    );
  }
}
