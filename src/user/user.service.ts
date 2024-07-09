import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      status,
      profile: {
        name,
        gender,
        dateOfBirth,
        phoneNumber,
        image,
        education,
        maritalStatus,
        nationality,
        insurance,
        taxCode,
        address,
        idCard,
      },
      roleIds,
    } = createUserDto;
    const { street, province, district, ward } = address || {};
    const { number, issuePlace, issueDate } = idCard || {};
    const user = await this.prisma.user.create({
      data: {
        email,
        status,
        profile: {
          create: {
            name,
            gender,
            dateOfBirth,
            email,
            phoneNumber,
            image,
            education,
            maritalStatus,
            nationality,
            insurance,
            taxCode,
            address: address && {
              create: {
                street,
                province: {
                  name: province.name,
                  code: province.code,
                },
                district: {
                  name: district.name,
                  code: district.code,
                },
                ward: {
                  name: ward.name,
                  code: ward.code,
                },
              },
            },
            idCard: idCard && {
              create: {
                number,
                issuePlace,
                issueDate,
              },
            },
          },
        },
        roles: {
          connect: roleIds.map((id) => ({ id })),
        },
      },
      include: {
        profile: {
          include: {
            address: true,
            idCard: true,
          },
        },
        roles: true,
      },
    });
    return user;
  }

  async findMany(findUserDto: FindUserDto) {
    const { id, take, skip, order, field } = findUserDto;
    const users = await this.prisma.user.findMany({
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        profile: {
          include: {
            address: true,
            idCard: true,
          },
        },
        roles: true,
      },
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: {
        profile: {
          include: {
            address: true,
            idCard: true,
          },
        },
        roles: true,
      },
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { status, roleIds } = updateUserDto;
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        status,
        roles: roleIds &&
          roleIds.length > 0 && {
            set: roleIds.map((id) => ({ id })),
          },
      },
      include: {
        profile: {
          include: {
            address: true,
            idCard: true,
          },
        },
        roles: true,
      },
    });
    return user;
  }

  async updateUserProfile(
    profileId: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ) {
    const {
      name,
      gender,
      dateOfBirth,
      phoneNumber,
      image,
      education,
      maritalStatus,
      nationality,
      insurance,
      taxCode,
      address,
      idCard,
    } = updateUserProfileDto;
    const { street, province, district, ward } = address || {};
    const { number, issuePlace, issueDate } = idCard || {};
    const profile = await this.prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        name,
        gender,
        dateOfBirth,
        phoneNumber,
        image,
        education,
        maritalStatus,
        nationality,
        insurance,
        taxCode,
        address: address && {
          upsert: {
            where: {
              profileId,
            },
            update: {
              street,
              province: {
                name: province.name,
                code: province.code,
              },
              district: {
                name: district.name,
                code: district.code,
              },
              ward: {
                name: ward.name,
                code: ward.code,
              },
            },
            create: {
              street,
              province: {
                name: province.name,
                code: province.code,
              },
              district: {
                name: district.name,
                code: district.code,
              },
              ward: {
                name: ward.name,
                code: ward.code,
              },
            },
          },
        },
        idCard: idCard && {
          upsert: {
            where: {
              profileId,
            },
            update: {
              number,
              issuePlace,
              issueDate,
            },
            create: {
              number,
              issuePlace,
              issueDate,
            },
          },
        },
      },
      include: {
        address: true,
        idCard: true,
      },
    });
    return profile;
  }

  async delete(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
      include: {
        profile: {
          include: {
            address: true,
            idCard: true,
          },
        },
        roles: true,
      },
    });
    return user;
  }

  async deleteMany(ids: number[]) {
    const result = await this.prisma.user.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result;
  }
}
