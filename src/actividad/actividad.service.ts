import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ActividadEntity } from './actividad.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActividadService {
  constructor(
    @InjectRepository(ActividadEntity)
    private readonly actividadRepository: Repository<ActividadEntity>,
  ) {}

  async crearActividad(
    data: Partial<ActividadEntity>,
  ): Promise<ActividadEntity> {
    if (!data.titulo || data.titulo.length < 15) {
      throw new BadRequestException(
        'No cumple requetimientos',
      );
    }
    const actividad = this.actividadRepository.create({ ...data, estado: 0 });
    return await this.actividadRepository.save(actividad);
  }

  async cambiarEstado(
    actividadID: string,
    estado: number,
  ): Promise<ActividadEntity> {
    const actividad = await this.actividadRepository.findOne({
      where: { id: actividadID },
      relations: ['estudiantes'],
    });
    if (!actividad) {
      throw new NotFoundException('actrividad no encontrada');
    }
    if (estado < 0 || estado > 2) {
      throw new BadRequestException('estado inválido');
    }
    if (
      estado === 1 &&
      actividad.estudiantes.length < 0.8 * actividad.cupomax
    ) {
      throw new BadRequestException('no se puede cerrar la actividad');
    }
    if (estado === 2 && actividad.estudiantes.length < actividad.cupomax) {
      throw new BadRequestException('no se puede finalizar la actividad');
    }
    actividad.estado = estado;
    return await this.actividadRepository.save(actividad);
  }

  async findAllActividadesByDate(fecha: string): Promise<ActividadEntity[]> {
    return await this.actividadRepository.find({
      where: { fecha },
    });
  }
}
