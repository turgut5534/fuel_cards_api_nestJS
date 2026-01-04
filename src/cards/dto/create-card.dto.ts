import { IsNotEmpty, IsString, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  card_name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  balance: number;
}