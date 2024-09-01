import { UserDocument } from '../domain/user.entity';

export const userOutputModelMapper = (user: UserDocument) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    login: user.login,
    email: user.email,
    createdAt: user.createdAt,
  };
};
