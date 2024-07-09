import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'nestjs-prisma';
import { SettingService } from 'src/setting/setting.service';
import { FindUserRegistrationRequestDto } from './dto/find-user-registration-request.dto';
import {
  ReviewUserRegistrationRequestDto,
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
        account: true,
      },
    });
    return requests;
  }

  async findOne(id: number) {
    const request =
      await this.prismaService.userRegistrationRequest.findUniqueOrThrow({
        where: { id },
        include: {
          account: true,
        },
      });
    return request;
  }

  async update(
    id: number,
    updateUserRegistrationRequestDto: UpdateUserRegistrationRequestDto,
  ) {
    const { idToken, email, name, gender, dateOfBirth } =
      updateUserRegistrationRequestDto;
    const { uid } = await admin.auth().verifyIdToken(idToken);
    const request = await this.prismaService.userRegistrationRequest.update({
      where: {
        id,
        accountId: uid,
      },
      data: {
        email,
        name,
        gender,
        dateOfBirth,
      },
      include: {
        account: true,
      },
    });
    return request;
  }

  async handleRequestApproval(
    id: number,
    reviewUserRegistrationRequestDto: ReviewUserRegistrationRequestDto,
  ) {
    const { status } = reviewUserRegistrationRequestDto;
    const request = await this.prismaService.userRegistrationRequest.update({
      where: { id },
      data: {
        status,
      },
      include: {
        account: true,
      },
    });
    if (status === 'ACCEPTED') {
      const { email, name, gender, dateOfBirth, accountId } = request;
      const setting = await this.settingService.get();
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
                id: setting.roleId,
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
