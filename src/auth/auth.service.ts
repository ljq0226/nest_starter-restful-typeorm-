import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from 'src/module/user/entities/user.entity';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  //private accessTokenInfo: AccessTokenInfo;
  async login(user: Partial<User>) {
    const token = this.createToken({
      id: user.id,
      username: user.username,
    });
    return { token };
  }
  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async getUser(user) {
    return await this.userService.findOne(user.id);
  }
}
