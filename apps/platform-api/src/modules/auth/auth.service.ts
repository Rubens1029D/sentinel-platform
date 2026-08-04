import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService, type UserRecord } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'active' | 'suspended';
  emailVerified: boolean;
  createdAt: Date;
}

export interface AuthenticationResponse {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthenticationResponse> {
    const email = dto.email.trim().toLowerCase();
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.usersService.create({
      displayName: dto.name,
      email,
      passwordHash,
    });

    return this.createAuthenticationResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthenticationResponse> {
    const email = dto.email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedException('This account is suspended');
    }

    return this.createAuthenticationResponse(user);
  }

  private async createAuthenticationResponse(
    user: UserRecord,
  ): Promise<AuthenticationResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.displayName,
        email: user.email,
        status: user.status,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
    };
  }
}
