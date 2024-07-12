import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreatePositionDto } from './dto/create-position.dto';
import { FindPositionDto } from './dto/find-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';

@Injectable()
export class PositionService {
  constructor(private prismaService: PrismaService) {}

  async forceCreate(createPositionDto: CreatePositionDto) {
    const { companyId, name, slug, color, functions } = createPositionDto;
    const position = await this.prismaService.position.create({
      data: {
        name,
        slug,
        color,
        functions,
        companyId,
      },
      include: {
        company: {
          include: {
            address: true,
            owner: {
              include: {
                profile: true,
                roles: true,
              },
            },
          },
        },
      },
    });
    return position;
  }

  async create(actorId: number, createPositionDto: CreatePositionDto) {
    const { companyId, name, slug, color, functions } = createPositionDto;
    await this.prismaService.company.findUniqueOrThrow({
      where: {
        id: companyId,
        OR: [
          { ownerId: actorId },
          {
            employees: {
              some: {
                userId: actorId,
              },
            },
          },
        ],
      },
    });
    const position = await this.prismaService.position.create({
      data: {
        name,
        slug,
        color,
        functions,
        companyId,
      },
      include: {
        company: {
          include: {
            address: true,
            owner: {
              include: {
                profile: true,
                roles: true,
              },
            },
          },
        },
      },
    });
    return position;
  }

  async forceFindMany(findPositionDto: FindPositionDto) {
    const { companyId, id, take, skip, field, order } = findPositionDto;
    const positions = await this.prismaService.position.findMany({
      where: companyId && {
        companyId,
      },
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        company: {
          include: {
            address: true,
            owner: {
              include: {
                profile: true,
                roles: true,
              },
            },
          },
        },
      },
    });
    return positions;
  }

  async findMany(actorId: number, findPositionDto: FindPositionDto) {
    const { companyId, id, take, skip, field, order } = findPositionDto;
    const positions = await this.prismaService.position.findMany({
      where: {
        companyId,
        company: {
          employees: {
            some: {
              userId: actorId,
            },
          },
        },
      },
      cursor: id && { id },
      take,
      skip,
      orderBy: field && {
        [`${field}`]: order,
      },
      include: {
        company: {
          include: {
            address: true,
            owner: {
              include: {
                profile: true,
                roles: true,
              },
            },
          },
        },
      },
    });
    return positions;
  }

  async forceFindOne(id: number) {
    const position = await this.prismaService.position.findUniqueOrThrow({
      where: {
        id,
      },
    });
    return position;
  }

  async findOne(actorId: number, id: number) {
    const position = await this.prismaService.position.findUniqueOrThrow({
      where: {
        id,
        company: {
          OR: [
            { ownerId: actorId },
            {
              employees: {
                some: {
                  userId: actorId,
                },
              },
            },
          ],
        },
      },
    });
    return position;
  }

  async forceUpdate(id: number, updatePositionDto: UpdatePositionDto) {
    const { name, slug, color, functions } = updatePositionDto;
    const position = await this.prismaService.position.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
        color,
        functions,
      },
    });
    return position;
  }

  async update(
    actorId: number,
    id: number,
    updatePositionDto: UpdatePositionDto,
  ) {
    const { name, slug, color, functions } = updatePositionDto;
    const position = await this.prismaService.position.update({
      where: {
        id,
        company: {
          OR: [
            { ownerId: actorId },
            {
              employees: {
                some: {
                  userId: actorId,
                },
              },
            },
          ],
        },
      },
      data: {
        name,
        slug,
        color,
        functions,
      },
    });
    return position;
  }

  async forceDelete(id: number) {
    const position = await this.prismaService.position.delete({
      where: {
        id,
      },
    });
    return position;
  }

  async delete(actorId: number, id: number) {
    const position = await this.prismaService.position.delete({
      where: {
        id,
        company: {
          OR: [
            { ownerId: actorId },
            {
              employees: {
                some: {
                  userId: actorId,
                },
              },
            },
          ],
        },
      },
    });
    return position;
  }
}
