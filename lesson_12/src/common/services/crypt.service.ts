import * as bcrypt from "bcrypt";

export class CryptService {
  constructor(private provider = bcrypt) {
    this.provider = provider;
  }

  async getHash({ password, salt }: { password: string; salt: string }) {
    return this.provider.hash(password, salt);
  }

  async getSalt() {
    return this.provider.genSalt();
  }

  async isValid({ password, hash }: { password: string; hash: string }) {
    return this.provider.compare(password, hash);
  }
}

export const cryptService = new CryptService();
