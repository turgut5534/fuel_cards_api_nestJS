import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/middlewares/jwt-guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @Post('login')
  async loginAdmin(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.repeatPassword);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getStatus(@Req() req) {

    const user = req.user.sub
    return this.authService.getStatus(user);
  }

  @Post('changePassword')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    
    const userId = req.user.sub;

    return this.authService.changePassword(userId, dto); 
  } 
}
