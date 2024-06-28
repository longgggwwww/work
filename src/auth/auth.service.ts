import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as admin from 'firebase-admin';
import { PrismaService } from 'nestjs-prisma';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async genTokens(user: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        id: user.id,
        permissions: [],
        companies: [
          {
            companyId: 1,
            functions: [],
          },
        ],
      }),
      this.jwtService.signAsync(
        { id: user.id },
        {
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(token: string) {
    const { uid } = await admin.auth().verifyIdToken(token);

    const account = await this.prismaService.account.update({
      where: {
        uid,
      },
      data: {
        signedAt: new Date().toISOString(),
      },
      include: {
        request: true,
        user: {
          include: {
            profile: true,
            roles: true,
            employees: true,
          },
        },
      },
    });

    if (account.user) {
      const { accessToken, refreshToken } = await this.genTokens(account.user);
      return {
        hasUser: true,
        accessToken,
        refreshToken,
        account,
      };
    }
    return {
      hasUser: false,
      account,
    };
  }

  async register(registerDto: RegisterDto) {
    const { token, name, gender, dateOfBirth } = registerDto;

    const { uid } = await admin.auth().verifyIdToken(token);
    const {
      email,
      providerData: [provider, ..._rest],
    } = await admin.auth().getUser(uid);

    const account = await this.prismaService.account.create({
      data: {
        uid,
        identifier: email,
        provider: provider.providerId,
        request: {
          create: {
            name,
            email,
            gender,
            dateOfBirth,
          },
        },
      },
      include: {
        request: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });
    return account;
  }

  async refreshToken(token: string) {
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        id: decoded.id,
      },
      include: {
        roles: true,
      },
    });
    return await this.genTokens(user);
  }
}
