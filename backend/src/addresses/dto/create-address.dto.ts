import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  houseNumber: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  street: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  subDistrict: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  district: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(5)
  @Matches(/^\d{5}$/, { message: 'postalCode must be a 5-digit number' })
  postalCode: string;
}
