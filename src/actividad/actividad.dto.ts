import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActividadDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNumber()
  @IsNotEmpty()
  cupomax: number;

  @IsNumber()
  @IsNotEmpty()
  estado: number;
}
