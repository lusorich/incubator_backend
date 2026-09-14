import * as jwt from "jsonwebtoken";
import { SETTINGS } from "../../constants";
import { formatISO, fromUnixTime, parseISO } from "date-fns";

export class JwtService {
  constructor(private provider = jwt) {
    this.provider = provider;
  }

  create(id: string, expires: string = "1h", deviceId?: string) {
    const token = this.provider.sign(
      { id, deviceId },
      SETTINGS.JWT_SECRET_KEY,
      {
        expiresIn: expires,
      }
    );

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

  getDeviceIdFromToken(token: string) {
    const decoded = this.decode(token);

    if (decoded) {
      return decoded.deviceId;
    }

    return null;
  }

  getIatFromToken(token: string) {
    const decoded = this.decode(token);

    if (decoded && decoded.iat) {
      return parseISO(formatISO(fromUnixTime(decoded.iat)));
    }

    return null;
  }

  getExpFromToken(token: string) {
    const decoded = this.decode(token);

    if (decoded && decoded.exp) {
      return parseISO(formatISO(fromUnixTime(decoded.exp)));
    }

    return null;
  }
}

export const jwtService = new JwtService();
