import * as jwt from "jsonwebtoken";
import { SETTINGS } from "../../constants";

export class JwtService {
  constructor(private provider = jwt) {
    this.provider = provider;
  }

  create(id: string) {
    const token = this.provider.sign({ id }, SETTINGS.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    return token;
  }

  isValid(token: string) {
    try {
      const decoded = jwt.verify(token, SETTINGS.JWT_SECRET_KEY);

      return decoded;
    } catch (e) {
      return null;
    }
  }

  decode(token: string) {
    try {
      const decoded = jwt.decode(token);

      return decoded as jwt.JwtPayload;
    } catch (e) {
      return null;
    }
  }

  getIdFromToken(token: string) {
    const decoded = this.decode(token);

    if (decoded) {
      return decoded.id;
    }

    return null;
  }
}

export const jwtService = new JwtService();
