import { compareSync } from 'bcryptjs';
import { BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { IStrategyOptions, Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import User from '../../module/user/entities/user.entity';

export class LocalStorage extends PassportStrategy(Strategy) {
  //第一个参数: Strategy，你要用的策略，这里是passport-local
  //第二个参数:是策略别名，上面是passport-local,默认就是local
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    // 如果不是username、password， 在constructor中配置
    super({
      usernameField: 'username',
      passwordField: 'password',
    } as IStrategyOptions);
  }
  async validate(username: string, password: string) {
    // validate是LocalStrategy的内置方法， 主要就是现实了用户查询以及密码对比，因为存的密码是加密后的，没办法直接对比用户名密码，只能先根据用户名查出用户，再比对密码
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.username=:username', { username })
      .getOne();
    if (!user) {
      throw new BadRequestException('用户名不正确！');
    }
    console.log(password, user.password);
    if (!compareSync(password, user.password)) {
      console.log(password, user.password);
      throw new BadRequestException('密码错误！');
    }
    return user;
  }
}
