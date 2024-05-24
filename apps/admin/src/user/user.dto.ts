import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    example: '34567890-jhgfghjhkjl',
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar: string;

  @ApiProperty({ example: 'Danimai', required: false })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
