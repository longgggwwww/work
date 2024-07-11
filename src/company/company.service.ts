import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const {
      name,
      description,
      taxCode,
      logo,
      email,
      phoneNumber,
      website,
      ownerId,
      address,
    } = createCompanyDto;
    const { street, province, district, ward } = address || {};
    const company = await this.prisma.company.create({
      data: {
        name,
        description,
        taxCode,
        logo,
        email,
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
        phoneNumber,
        website,
        ownerId,
      },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return company;
  }

  async findMyCompanies(actorId: number, findCompanyDto: FindCompanyDto) {
    const { id, take, skip, field, order } = findCompanyDto;
    const companies = await this.prisma.company.findMany({
      where: {
        ownerId: actorId,
      },
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return companies;
  }

  async findMany(findCompanyDto: FindCompanyDto) {
    const { id, take, skip, field, order } = findCompanyDto;
    const companies = await this.prisma.company.findMany({
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return companies;
  }

  async findOne(id: number) {
    const company = await this.prisma.company.findUniqueOrThrow({
      where: { id },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
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
    } = updateCompanyDto;
    const { street, province, district, ward } = address || {};
    const company = await this.prisma.company.update({
      where: { id },
      data: {
        name,
        description,
        taxCode,
        logo,
        email,
        phoneNumber,
        website,
        address: address && {
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
        ownerId,
      },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return company;
  }

  async delete(id: number) {
    const company = await this.prisma.company.delete({
      where: { id },
      include: {
        address: true,
        branchs: true,
        departments: true,
        employees: {
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
            positions: true,
          },
        },
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
        positions: true,
      },
    });
    return company;
  }

  async deleteMany(ids: number[]) {
    const result = await this.prisma.company.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result;
  }
}
