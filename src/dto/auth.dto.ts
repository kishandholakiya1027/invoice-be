import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin', description: 'Username for login' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password for login' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'admin', description: 'Username for registration' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email for registration',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Password for registration',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
