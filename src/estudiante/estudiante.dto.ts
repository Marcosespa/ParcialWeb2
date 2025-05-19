import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EstudianteDto {
  @IsNumber()
  @IsNotEmpty()
  cedula: number;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @IsNotEmpty()
  programa: string;

  @IsNumber()
  @IsNotEmpty()
  semestre: number;
}
