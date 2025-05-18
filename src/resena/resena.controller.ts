import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { ResenaService } from './resena.service';

@Controller('resena')
@UseInterceptors(BusinessErrorsInterceptor)
export class ResenaController {
  constructor(private readonly resenaService: ResenaService) {}
}
