import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ResenaDto {
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @IsNumber()
  @IsNotEmpty()
  calificacion: number;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsString()
  @IsNotEmpty()
  actividadId: string;

  @IsString()
  @IsNotEmpty()
  estudianteId: string;
} 

