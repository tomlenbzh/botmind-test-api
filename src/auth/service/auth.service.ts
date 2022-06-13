import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import { IUser } from '../../user/utils/models/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates and returns a new JSON Web Token.
   *
   * @param     { IUser }      user
   * @returns   { Observable<string> }
   */
  generateJwtToken(user: IUser): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }

  /**
   * Returns a hashed password.
   *
   * @param     { string }      password
   * @returns   { Observable<string> }
   */
  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  /**
   * Returns whether or not the given password matches with the stored hashed password.
   *
   * @param     { string }      newPassword
   * @param     { string }      passwortHash
   * @returns   { Observable<boolean> }
   */
  comparePasswords(newPassword: string, passwortHash: string): Observable<boolean> {
    return from(bcrypt.compare(newPassword, passwortHash) as Promise<boolean>);
  }
}
