import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Param,
  Get,
  ParseIntPipe,
} from '@nestjs/common';
import { EstudianteService } from './estudiante.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { EstudianteEntity } from './estudiante.entity';

@Controller('estudiante')
@UseInterceptors(BusinessErrorsInterceptor)
export class EstudianteController {
  constructor(private readonly estudianteService: EstudianteService) {}

  @Post()
  async crearEstudiante(
    @Body() estudiante: EstudianteEntity,
  ): Promise<EstudianteEntity> {
    return await this.estudianteService.crearEstudiante(estudiante);
  }

  @Get(':id')
  async findEstudianteById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EstudianteEntity> {
    return await this.estudianteService.findEstudianteById(id);
  }

  @Post(':estudianteId/actividad/:actividadId')
  async inscribirseActividad(
    @Param('estudianteId', ParseIntPipe) estudianteId: number,
    @Param('actividadId', ParseIntPipe) actividadId: number,
  ): Promise<void> {
    return await this.estudianteService.inscribirseActividad(
      estudianteId,
      actividadId,
    );
  }
}
