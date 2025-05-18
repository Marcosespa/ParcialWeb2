import { Module } from '@nestjs/common';
import { ResenaService } from './resena.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { ResenaController } from './resena.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResenaEntity, EstudianteEntity, ActividadEntity]),
  ],
  providers: [ResenaService],
  controllers: [ResenaController],
})
export class ResenaModule {}
