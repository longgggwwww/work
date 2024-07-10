import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCompanyRegistrationRequestDto } from './dto/create-company-registration-request.dto';
import { FindCompanyRegistrationRequestDto } from './dto/find-company-registration-request.dto';
import { UpdateCompanyRegistrationRequestDto } from './dto/update-company-registration-request.dto';

@Injectable()
export class CompanyRegistrationRequestService {
  constructor(private prismaService: PrismaService) {}

  async create(
    ownerId: number,
    createCompanyRegistrationRequestDto: CreateCompanyRegistrationRequestDto,
  ) {
    const {
      name,
      description,
      taxCode,
      logo,
      email,
      phoneNumber,
      website,
      address,
    } = createCompanyRegistrationRequestDto;
    const { street, province, district, ward } = address || {};
    const request = await this.prismaService.companyRegistrationRequest.create({
      data: {
        name,
        description,
        taxCode,
        logo,
        email,
        phoneNumber,
        website,
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
        ownerId,
      },
      include: {
        address: true,
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });
    return request;
  }

  async findAll(
    findCompanyRegistrationRequestDto: FindCompanyRegistrationRequestDto,
  ) {
    const { id, take, skip, field, order } = findCompanyRegistrationRequestDto;
    const requests =
      await this.prismaService.companyRegistrationRequest.findMany({
        cursor: id && { id },
        take,
        skip,
        orderBy: field && {
          [`${field}`]: order,
        },
        include: {
          address: true,
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });
    return requests;
  }

  async findOne(id: number) {
    const request =
      await this.prismaService.companyRegistrationRequest.findUniqueOrThrow({
        where: { id },
        include: {
          address: true,
          owner: {
            include: {
              profile: true,
            },
          },
        },
      });
    return request;
  }

  async update(
    id: number,
    updateCompanyRegistrationRequestDto: UpdateCompanyRegistrationRequestDto,
  ) {
    const {
      name,
      description,
      taxCode,
      logo,
      email,
      phoneNumber,
      website,
      address,
    } = updateCompanyRegistrationRequestDto;
    const { street, province, district, ward } = address || {};
    const request = await this.prismaService.companyRegistrationRequest.update({
      where: { id },
      data: {
        name,
        description,
        taxCode,
        logo,
        email,
        phoneNumber,
        website,
        address: {
          upsert: {
            where: {
              companyRegistrationRequestId: id,
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
          },
        },
      },
      include: {
        address: true,
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });
    return request;
  }

  async delete(id: number) {
    const request = await this.prismaService.companyRegistrationRequest.delete({
      where: { id },
      include: {
        address: true,
        owner: {
          include: {
            profile: true,
          },
        },
      },
    });
    return request;
  }

  async deleteMany(ids: number[]) {
    const result =
      await this.prismaService.companyRegistrationRequest.deleteMany({
        where: {
          id: { in: ids },
        },
      });
    return result;
  }
}
