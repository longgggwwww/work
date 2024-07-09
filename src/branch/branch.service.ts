import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindManyBranchDto } from './dto/find-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    const {
      name,
      address: { street, province, district, ward },
      companyId,
      employeeIds,
    } = createBranchDto;
    const branch = await this.prisma.branch.create({
      data: {
        name,
        address: {
          create: {
            street,
            province,
            district,
            ward,
          },
        },
        companyId,
        employees: {
          createMany: {
            data: employeeIds.map((employeeId) => ({
              employeeUserId: employeeId,
              employeeCompanyId: companyId,
            })),
            skipDuplicates: true,
          },
        },
      },
      include: {
        address: true,
        company: true,
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return branch;
  }

  async findMany(companyId: number, findManyBranchDto: FindManyBranchDto) {
    const { id, take, skip, order, field } = findManyBranchDto;
    const branchs = await this.prisma.branch.findMany({
      where: {
        companyId,
      },
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        address: true,
        company: true,
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return branchs;
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUniqueOrThrow({
      where: { id },
      include: {
        address: true,
        company: true,
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const {
      name,
      address: { street, province, district, ward },
      companyId,
      employeeIds,
    } = updateBranchDto;
    const branch = await this.prisma.branch.update({
      where: { id },
      data: {
        name,
        address: {
          update: {
            street,
            province,
            district,
            ward,
          },
        },
        companyId,
        employees: {},
      },
      include: {
        company: true,
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return branch;
  }

  async delete(id: number) {
    const branch = await this.prisma.branch.delete({
      where: { id },
      include: {
        company: true,
        employees: {
          include: {
            employee: {
              include: {
                user: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return branch;
  }

  async deleteMany(ids: number[]) {
    const result = await this.prisma.branch.deleteMany({
      where: {
        id: { in: ids },
      },
    });
    return result;
  }
}
