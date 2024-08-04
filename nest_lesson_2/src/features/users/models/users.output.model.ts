import { UserDocument } from '../domain/user.entity';

export const userOutputModelMapper = (user: UserDocument) => ({
  id: user.id,
  login: user.login,
  email: user.email,
  createdAt: user.createdAt,
});
