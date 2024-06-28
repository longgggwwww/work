import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { FindManyBranchDto } from './dto/find-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Controller('branchs')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create({
      data: {
        name: createBranchDto.name,
        address: createBranchDto.address,
        provinceCode: createBranchDto.districtCode,
        districtCode: createBranchDto.districtCode,
        wardCode: createBranchDto.wardCode,
        companyId: createBranchDto.companyId,
      },
      include: {
        company: true,
        employees: true,
      },
    });
  }

  @Get()
  findMany(@Query() findManyBranchDto: FindManyBranchDto) {
    return this.branchService.findMany({
      cursor: findManyBranchDto.id && {
        id: findManyBranchDto.id,
      },
      take: findManyBranchDto.take,
      skip: findManyBranchDto.skip,
      orderBy: findManyBranchDto.field && {
        [findManyBranchDto.field]: findManyBranchDto.order,
      },
      include: {
        company: true,
        employees: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.findUnique({
      where: { id },
      include: {
        company: true,
        employees: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchService.update({
      where: { id },
      data: {
        name: updateBranchDto.name,
        address: updateBranchDto.address,
        provinceCode: updateBranchDto.districtCode,
        districtCode: updateBranchDto.districtCode,
        wardCode: updateBranchDto.wardCode,
        companyId: updateBranchDto.companyId,
      },
      include: {
        company: true,
        employees: true,
      },
    });
  }

  @Delete('batch')
  removeBatch(
    @Body(
      new ParseArrayPipe({
        items: Number,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    )
    ids: number[],
  ) {
    return this.branchService.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.branchService.delete({
      where: { id },
      include: {
        company: true,
        employees: true,
      },
    });
  }
}
