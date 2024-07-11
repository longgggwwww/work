import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCompanyRegistrationRequestDto } from './dto/create-company-registration-request.dto';
import { FindCompanyRegistrationRequestDto } from './dto/find-company-registration-request.dto';
import {
  ApproveCompanyRegistrationRequestDto,
  UpdateCompanyRegistrationRequestDto,
} from './dto/update-company-registration-request.dto';

@Injectable()
export class CompanyRegistrationRequestService {
  constructor(private prismaService: PrismaService) {}

  async register(
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
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
      },
    });
    return request;
  }

  async findMany(
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
              profile: {
                include: {
                  address: true,
                  idCard: true,
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
    actorId: number,
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
      where: {
        id,
        ownerId: actorId,
      },
      data: {
        name,
        description,
        taxCode,
        logo,
        email,
        phoneNumber,
        website,
        address: address && {
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
    });
    return request;
  }

  async approveRequest(
    actorId: number,
    id: number,
    approveCompanyRegistrationRequest: ApproveCompanyRegistrationRequestDto,
  ) {
    const { status } = approveCompanyRegistrationRequest;
    const request = await this.prismaService.companyRegistrationRequest.update({
      where: {
        id,
        ownerId: actorId,
        status: 'PROCESSING',
      },
      data: {
        status,
      },
      include: {
        address: true,
        owner: {
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
    });
    if (status === 'ACCEPTED') {
      const {
        name,
        description,
        taxCode,
        logo,
        email,
        phoneNumber,
        website,
        address,
        ownerId,
      } = request;
      const { street, province, district, ward } = address || {};
      console.log(province);
      await this.prismaService.company.create({
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
              province,
              district,
              ward,
            },
          },
          ownerId,
        },
      });
    }
    return request;
  }

  async delete(id: number) {
    const request = await this.prismaService.companyRegistrationRequest.delete({
      where: { id },
      include: {
        address: true,
        owner: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
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
