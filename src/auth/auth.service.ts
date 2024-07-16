import { BadRequestException, Injectable } from '@nestjs/common';
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

  async login(token: string) {
    try {
      const { uid } = await admin.auth().verifyIdToken(token);
      const {
        email,
        providerData: [provider, ..._rest],
      } = await admin.auth().getUser(uid);

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      const account = await this.prismaService.account.upsert({
        where: {
          uid,
          status: true,
        },
        update: {
          signedAt: new Date().toISOString(),
        },
        create: {
          uid,
          identifier: email,
          provider: provider.providerId,
          user: user
            ? {
                connect: {
                  id: user.id,
                },
              }
            : undefined,
        },
        include: {
          userRegistrationRequest: true,
          user: {
            include: {
              profile: true,
              roles: true,
              companies: true,
            },
          },
        },
      });

      if (account.user) {
        const { accessToken, refreshToken } = await this.createTokens(
          account.user,
        );
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
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const { idToken, name, gender, dateOfBirth } = registerDto;

      const { uid } = await admin.auth().verifyIdToken(idToken);
      const {
        email,
        providerData: [provider, ..._rest],
      } = await admin.auth().getUser(uid);

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new BadRequestException();
      }

      const account = await this.prismaService.account.upsert({
        where: {
          uid,
        },
        update: {
          uid,
          identifier: email,
          provider: provider.providerId,
          userRegistrationRequest: {
            create: {
              name,
              email,
              gender,
              dateOfBirth,
            },
          },
        },
        create: {
          uid,
          identifier: email,
          provider: provider.providerId,
          userRegistrationRequest: {
            create: {
              name,
              email,
              gender,
              dateOfBirth,
            },
          },
        },
        include: {
          userRegistrationRequest: true,
          user: {
            include: {
              profile: true,
            },
          },
        },
      });
      return account;
    } catch (err) {
      console.log(err);
      throw new BadRequestException();
    }
  }

  async refreshToken(token: string) {
    const { id } = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
    });
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id },
      include: {
        roles: true,
        companies: {
          include: {
            positions: true,
          },
        },
      },
    });
    const { accessToken, refreshToken } = await this.createTokens(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async createTokens(user: any) {
    const permissions = Array.from(
      user.roles.reduce((a, { permissions }) => {
        permissions.forEach(a.add, a);
        return a;
      }, new Set()),
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
        id: user.id,
        permissions,
        companies: user.companies,
      }),
      this.jwtService.signAsync(
        { id: user.id },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
