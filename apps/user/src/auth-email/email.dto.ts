import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

const strongPasswordConfig = {
  minLength: 8,
  minLowercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  minUppercase: 1,
};

export class RegisterDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;

  @ApiProperty({ example: 'Danimai' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Mandal' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: '77XXXX' })
  @IsString()
  phone_number: string;

  @ApiProperty({ example: '91' })
  @IsString()
  country_code: string;
}

export class EmailVerifyDto {
  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  verify_token: string;
}

export class LoginDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;
}

export class SendVerifyMailDto {
  @ApiProperty({ example: 'example@danimai.com' })
  @IsEmail()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @IsStrongPassword(strongPasswordConfig)
  password: string;

  @ApiProperty({ example: 'vhsbdjsdfsd-dfmsdfjsd-sdfnsdk' })
  @IsString()
  reset_token: string;
}
