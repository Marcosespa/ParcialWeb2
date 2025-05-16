/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';

@Injectable()
export class EstudianteService {
  constructor(
    @InjectRepository(EstudianteEntity)
    private readonly estudianteRepository: Repository<EstudianteEntity>,
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearEstudiante(estudiante: EstudianteEntity): Promise<EstudianteEntity> {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!estudiante.correo || !emailRegex.test(estudiante.correo)) {
      throw new BadRequestException('correo electrónico no valido');
    }
    if (
      !estudiante.semestre ||
      estudiante.semestre < 1 ||
      estudiante.semestre > 10
    ) {
      throw new BadRequestException('semestre debe estar entre 1 y 10');
    }
    const estudiantefin = this.estudianteRepository.create(estudiante);
    return await this.estudianteRepository.save(estudiantefin);
  }

  async findEstudianteById(id: string): Promise<EstudianteEntity> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id },
      relations: ['actividades', 'resenas'],
    });
    if (!estudiante) {
      throw new NotFoundException('estudiante no encontrado');
    }
    return estudiante;
  }

  async inscribirseActividad(
    estudianteId: string,
    actividadId: string,
  ): Promise<void> {
    const estudiante = await this.findEstudianteById(estudianteId);
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadId },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('actividad no encontrada');
    }
    if (actividad.estado !== 0) {
      throw new BadRequestException(
        'no hay cupo',
      );
    }
    if (actividad.estudiantes.length >= actividad.cupomax) {
      throw new BadRequestException('no hay cupos');
    }
    if (actividad.estudiantes.some(e => e.id === estudianteId)) {
      throw new BadRequestException('ya esta inscrito previamente');
    }
    actividad.estudiantes.push(estudiante);
    await this.actividadRepository.save(actividad);
  }
}
