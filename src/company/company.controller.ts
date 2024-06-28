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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindManyCompanyDto } from './dto/find-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create({
      data: {
        name: createCompanyDto.name,
        description: createCompanyDto.description,
        taxCode: createCompanyDto.taxCode,
        logo: createCompanyDto.logo,
        email: createCompanyDto.email,
        website: createCompanyDto.website,
        address: createCompanyDto.address,
        provinceCode: createCompanyDto.provinceCode,
        districtCode: createCompanyDto.districtCode,
        wardCode: createCompanyDto.wardCode,
        ownerId: createCompanyDto.ownerId,
      },
      include: {
        owner: true,
        branchs: true,
        employees: true,
      },
    });
  }

  @Get()
  findMany(@Query() findManyCompanyDto: FindManyCompanyDto) {
    return this.companyService.findMany({
      cursor: findManyCompanyDto.id && {
        id: findManyCompanyDto.id,
      },
      take: findManyCompanyDto.take,
      skip: findManyCompanyDto.skip,
      orderBy: findManyCompanyDto.field && {
        [findManyCompanyDto.field]: findManyCompanyDto.order,
      },
      include: {
        owner: true,
        branchs: true,
        employees: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.findUnique({
      where: { id },
      include: {
        owner: true,
        branchs: true,
        employees: true,
      },
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update({
      where: { id },
      data: {
        name: updateCompanyDto.name,
        description: updateCompanyDto.description,
        taxCode: updateCompanyDto.taxCode,
        logo: updateCompanyDto.logo,
        email: updateCompanyDto.email,
        website: updateCompanyDto.website,
        address: updateCompanyDto.address,
        provinceCode: updateCompanyDto.provinceCode,
        districtCode: updateCompanyDto.districtCode,
        wardCode: updateCompanyDto.wardCode,
        ownerId: updateCompanyDto.ownerId,
      },
      include: {
        owner: true,
        branchs: true,
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
    return this.companyService.deleteMany({
      where: {
        id: { in: ids },
      },
    });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companyService.delete({
      where: { id },
      include: {
        owner: true,
        branchs: true,
        employees: true,
      },
    });
  }
}
