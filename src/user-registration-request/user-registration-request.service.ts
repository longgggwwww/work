import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'nestjs-prisma';
import { SettingService } from 'src/setting/setting.service';
import { FindUserRegistrationRequestDto } from './dto/find-user-registration-request.dto';
import {
  ApproveUserRegistrationRequestDto,
  UpdateUserRegistrationRequestDto,
} from './dto/update-user-registration-request.dto';

@Injectable()
export class UserRegistrationRequestService {
  constructor(
    private prismaService: PrismaService,
    private settingService: SettingService,
  ) {}

  async findMany(
    findUserRegistrationRequestDto: FindUserRegistrationRequestDto,
  ) {
    const { id, take, skip, field, order } = findUserRegistrationRequestDto;
    const requests = await this.prismaService.userRegistrationRequest.findMany({
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        account: {
          include: {
            user: {
              include: {
                profile: {
                  include: {
                    address: true,
                    idCard: true,
                  },
                },
                roles: true,
              },
            },
          },
        },
      },
    });
    return requests;
  }

  async findOne(id: number) {
    const request =
      await this.prismaService.userRegistrationRequest.findUniqueOrThrow({
        where: { id },
        include: {
          account: {
            include: {
              user: {
                include: {
                  profile: {
                    include: {
                      address: true,
                      idCard: true,
                    },
                  },
                  roles: true,
                },
              },
            },
          },
        },
      });
    return request;
  }

  async update(
    updateUserRegistrationRequestDto: UpdateUserRegistrationRequestDto,
  ) {
    const { idToken, name, gender, dateOfBirth } =
      updateUserRegistrationRequestDto;
    const { uid } = await admin.auth().verifyIdToken(idToken);
    const request = await this.prismaService.userRegistrationRequest.update({
      where: {
        accountId: uid,
        status: 'PROCESSING',
      },
      data: {
        name,
        gender,
        dateOfBirth,
      },
      include: {
        account: {
          include: {
            user: {
              include: {
                profile: {
                  include: {
                    address: true,
                    idCard: true,
                  },
                },
                roles: true,
              },
            },
          },
        },
      },
    });
    return request;
  }

  async approveRequest(
    id: number,
    approveUserRegistrationRequestDto: ApproveUserRegistrationRequestDto,
  ) {
    const { status } = approveUserRegistrationRequestDto;
    const request = await this.prismaService.userRegistrationRequest.update({
      where: {
        id,
        status: 'PROCESSING',
      },
      data: {
        status,
      },
      include: {
        account: {
          include: {
            user: {
              include: {
                profile: {
                  include: {
                    address: true,
                    idCard: true,
                  },
                },
                roles: true,
              },
            },
          },
        },
      },
    });
    if (status === 'ACCEPTED') {
      const { email, name, gender, dateOfBirth, accountId } = request;
      const { roleId } = await this.settingService.get();
      await this.prismaService.user.create({
        data: {
          email,
          profile: {
            create: {
              name,
              gender,
              dateOfBirth,
            },
          },
          accountId,
          roles: {
            connect: [
              {
                id: roleId,
              },
            ],
          },
        },
      });
    }
    return request;
  }

  async delete(id: number) {
    const request = await this.prismaService.userRegistrationRequest.delete({
      where: { id },
      include: {
        account: true,
      },
    });
    return request;
  }

  async deleteMany(ids: number[]) {
    const result = await this.prismaService.userRegistrationRequest.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    return result;
  }
}
