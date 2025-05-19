import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Param,
  Get,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { ActividadService } from './actividad.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ActividadEntity } from './actividad.entity';

@Controller('actividad')
@UseInterceptors(BusinessErrorsInterceptor)
export class ActividadController {
  constructor(private readonly actividadService: ActividadService) {}

  @Post()
  async crearActividad(
    @Body() actividad: ActividadEntity,
  ): Promise<ActividadEntity> {
    return await this.actividadService.crearActividad(actividad);
  }

  @Put(':id/estado/:estado')
  async cambiarEstado(
    @Param('id') id: number,
    @Param('estado', ParseIntPipe) estado: number,
  ): Promise<ActividadEntity> {
    return await this.actividadService.cambiarEstado(id, estado);
  }

  @Get('fecha/:fecha')
  async findAllActividadesByDate(
    @Param('fecha') fecha: string,
  ): Promise<ActividadEntity[]> {
    return await this.actividadService.findAllActividadesByDate(fecha);
  }
}
