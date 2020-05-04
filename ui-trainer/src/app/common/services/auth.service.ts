import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';

export const TOKEN_NAME: string = 'jwt_token';

@Injectable()
export class AuthService {

  constructor() { }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  checkValidToken(token: string): boolean {
    try {
      const decoded = jwt_decode(token);
      if (decoded !== undefined) {
        return true;
      }
    } catch (Error) {
      if (Error.message) {
        return false;
      }
    }
  }

  getExtractedToken(): object {
    const decoded = jwt_decode(this.getToken());
    return decoded;
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);
    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    if (token === 'undefined') {
      return true
    } else {
      const date = this.getTokenExpirationDate(token);
      if(date === undefined) return false;
      return !(date.valueOf() > new Date().valueOf());
    }
  }

}