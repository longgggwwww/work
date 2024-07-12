import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { AddEmployeeDto } from './dto/add-employee.dto';
import { FindEmployeeDto } from './dto/find-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(private prismaService: PrismaService) {}

  async addEmployeeForce(addEmployeeForceDto: AddEmployeeDto) {
    const { id, userId, companyId } = addEmployeeForceDto;
    const employee = await this.prismaService.employee.create({
      data: {
        id,
        userId,
        companyId,
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employee;
  }

  async addEmployee(actorId: number, addEmloyeeDto: AddEmployeeDto) {
    const { id, userId, companyId } = addEmloyeeDto;
    await this.prismaService.company.findUniqueOrThrow({
      where: {
        id: companyId,
        ownerId: actorId,
      },
    });

    const employee = await this.prismaService.employee.create({
      data: {
        id,
        userId,
        companyId,
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employee;
  }

  async findMany(companyId: number, findEmployeeDto: FindEmployeeDto) {
    const { id, take, skip, field, order } = findEmployeeDto;
    const employees = await this.prismaService.employee.findMany({
      where: {
        companyId,
      },
      cursor: id && {
        userId_companyId: {
          userId: id,
          companyId,
        },
      },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employees;
  }

  async findOneByEmployeeId(companyId: number, employeeId: string) {
    const employee = await this.prismaService.employee.findUniqueOrThrow({
      where: {
        id_companyId: {
          id: employeeId,
          companyId,
        },
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employee;
  }

  async findOneByUserId(companyId: number, userId: number) {
    const employee = await this.prismaService.employee.findUniqueOrThrow({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employee;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return `This action updates a #${id} employee`;
  }

  async remove(actorId: number, companyId: number, userId: number) {
    const employee = await this.prismaService.employee.delete({
      where: {
        company: {
          employees: {
            some: {
              userId: actorId,
            },
          },
        },
        userId_companyId: {
          userId,
          companyId,
        },
      },
      include: {
        user: {
          include: {
            profile: {
              include: {
                address: true,
                idCard: true,
              },
            },
          },
        },
        company: {
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
        },
      },
    });
    return employee;
  }
}
