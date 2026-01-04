import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    console.log('Attempting login for email:', email);
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const refreshToken = uuidv4();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.prisma.refreshToken.create({
      data: {
        user_id: user.id,
        token: hashedRefreshToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken: await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
      }),
    };
  }

  async register(email: string, password: string, password_again: string) {
    const userExists = await this.prisma.user.findFirst({
      where: { email },
    });

    if (userExists) throw new ConflictException('User already exists');

    if (password !== password_again) {
      throw new ConflictException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    return { id: user.id, email: user.email };
  }

  async getStatus(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        _count: {
          select: {
            cards: true,
          },
        },
      },
    });
  }

  async changePassword(userId: string, dto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const validPassword = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );
    
    if (!validPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (dto.newPassword !== dto.confirmPassword) {
      throw new ConflictException(
        'New password and confirm password do not match',
      );
    }

    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.password,
    );

    if (samePassword) {
      throw new ConflictException(
        'New password must be different from the current password',
      );
    }

    const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to change password');
    }

    return user;
  }
}
