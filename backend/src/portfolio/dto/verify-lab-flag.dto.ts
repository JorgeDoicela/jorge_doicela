import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';

export class VerifyLabFlagDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El identificador del reto contiene caracteres inválidos.',
  })
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  flag: string;
}
