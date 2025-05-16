import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResenaEntity, EstudianteEntity, ActividadEntity]),
  ],
  providers: [ResenaService],
})
export class ResenaModule {}
