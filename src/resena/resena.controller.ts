/* eslint-disable prettier/prettier */
import {
  Controller,
  UseInterceptors,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ResenaService } from './resena.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { ResenaDto } from './resena.dto';

@Controller('resena')
@UseInterceptors(BusinessErrorsInterceptor)
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}

  @Post(':estudianteId/actividad/:actividadId')
  async agregarResena(
    @Param('estudianteId') estudianteId: number,
    @Param('actividadId') actividadId: number,
    @Body() resenaDto: ResenaDto,
  ): Promise<void> {
    return await this.resenaService.agregarResena(
      estudianteId,
      actividadId,
      resenaDto.comentario,
      resenaDto.calificacion,
    );
  }
}
