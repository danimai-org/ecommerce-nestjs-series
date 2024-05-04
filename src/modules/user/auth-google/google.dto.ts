import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleOAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
