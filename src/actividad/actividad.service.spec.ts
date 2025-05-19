import { Test, TestingModule } from '@nestjs/testing';
import { ActividadService } from './actividad.service';
import { ActividadEntity } from './actividad.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { EstudianteEntity } from '../estudiante/estudiante.entity';

describe('ActividadService', () => {
  let service: ActividadService;
  let repo: Repository<ActividadEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;
  let actividades: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ActividadService],
    }).compile();

    service = module.get<ActividadService>(ActividadService);
    repo = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );
    estudianteRepo = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repo.clear();
    await estudianteRepo.clear();
    actividades = [];

    for (let i = 0; i < 5; i++) {
      const actividad = new ActividadEntity();
      actividad.titulo = faker.lorem.words(4);
      actividad.fecha = `2025-05-${10 + i}`;
      actividad.cupomax = faker.number.int({ min: 5, max: 15 });
      actividad.estado = 0;
      actividad.estudiantes = [];
      actividad.resenas = [];
      await repo.save(actividad);
      actividades.push(actividad);
    }
  };

  describe('crearActividad', () => {
    it('crea la actividad si el titulo es mayor de 15', async () => {
      const data = new ActividadEntity();
      data.titulo = faker.lorem.sentence(3);
      data.fecha = '2025-05-30';
      data.cupomax = 10;
      data.estado = 0;
      data.estudiantes = [];
      data.resenas = [];

      const result = await service.crearActividad(data);
      expect(result.id).toBeDefined();
      expect(result.titulo.length).toBeGreaterThanOrEqual(15);
    });

    it('titulo corto', async () => {
      const data = new ActividadEntity();
      data.titulo = faker.lorem.words(1);
      data.fecha = '2025-05-30';
      data.cupomax = 10;
      data.estado = 0;
      data.estudiantes = [];
      data.resenas = [];

      await expect(service.crearActividad(data)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });


  describe('findAllActividadesByDate', () => {
    it('devuelve actividades por fecha especifica', async () => {
      const fecha = actividades[2].fecha;
      const result = await service.findAllActividadesByDate(fecha);
      expect(result.every((a) => a.fecha === fecha)).toBe(true);
    });

    it('negativo devuelve el array vacio si no hay', async () => {
      const result = await service.findAllActividadesByDate('2025-01-01');
      expect(result).toEqual([]);
    });
  });
});
