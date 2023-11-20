import { IsNotEmpty, IsEmail, IsString, MinLength, min, minLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name;

    @IsNotEmpty()
    @IsEmail()
    email;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    phone;

    @IsNotEmpty()
    @IsString()
    @minLength(8)
    address;
    
}
