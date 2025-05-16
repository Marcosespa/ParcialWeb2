/* eslint-disable prettier/prettier */
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResenaEntity } from './resena.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class ResenaService {
  constructor(
    @InjectRepository(ResenaEntity)
    private readonly resenaRepository: Repository<ResenaEntity>,
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async agregarResena(
    estudianteId: string,
    actividadId: string,
    comentario: string,
    calificacion: number,
  ): Promise<void> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId },
      relations: ['actividades'],
    });
    if (!estudiante) {
      throw new NotFoundException('no se encontro el estudiantes');
    }

    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('no encontrada');
    }

    if (actividad.estado !== 2) {
      throw new BadRequestException(
        'actividad no finalizada',
      );
    }

    const estudianteInscrito = actividad.estudiantes.some(
      (e) => e.id === estudianteId,
    );
    if (!estudianteInscrito) {
      throw new BadRequestException(
        'no esta inscrito en la actividad',
      );
    }

    const resena = this.resenaRepository.create({
      comentario,
      calificacion,
      fecha: new Date().toISOString(),
      estudiante,
      actividad,
    });
    await this.resenaRepository.save(resena);
  }
}
