export interface User {
  login: string;
  email: string;
  id: string;
  password: string;
  created_at: Date;
  email_confirmation_code: string | null;
  email_confirmation_expire: Date | null;
  email_confirmation_is_confirmed: boolean;
  password_recovery_code: string | null;
  password_recovery_is_used: boolean;
  password_recovery_expire: Date | null;
}
