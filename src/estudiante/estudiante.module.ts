import { Module } from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteController } from './estudiante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EstudianteEntity, ActividadEntity])],
  providers: [EstudianteService],
  controllers: [EstudianteController],
})
export class EstudianteModule {}
