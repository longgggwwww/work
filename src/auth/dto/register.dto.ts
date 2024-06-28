import { ApiProperty } from '@nestjs/swagger';
import { $Enums, Gender } from '@prisma/client';
import { IsDate, IsEnum, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'Access Token sau khi login SSO từ firebase',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Tên người dùng',
    type: String,
    example: 'Nguyễn Văn A',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Giới tính',
    enum: $Enums.Gender,
    example: $Enums.Gender.OTHER,
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Ngày tháng năm sinh',
  })
  @IsDate()
  dateOfBirth: Date;
}
