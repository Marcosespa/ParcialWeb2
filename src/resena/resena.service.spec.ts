import { Test, TestingModule } from '@nestjs/testing';
import { ResenaService } from './resena.service';
import { ResenaEntity } from './resena.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('ResenaService', () => {
  let service: ResenaService;
  let resenaRepo: Repository<ResenaEntity>;
  let estudianteRepo: Repository<EstudianteEntity>;
  let actividadRepo: Repository<ActividadEntity>;
  let estudiantesList: EstudianteEntity[];
  let actividadesList: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ResenaService],
    }).compile();

    service = module.get<ResenaService>(ResenaService);
    resenaRepo = module.get<Repository<ResenaEntity>>(
      getRepositoryToken(ResenaEntity),
    );
    estudianteRepo = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepo = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await resenaRepo.clear();
    await estudianteRepo.clear();
    await actividadRepo.clear();

    estudiantesList = [];
    actividadesList = [];

    const est = new EstudianteEntity();
    est.cedula = faker.number.int({ min: 10000000, max: 99999999 });
    est.nombre = faker.person.fullName();
    est.correo = faker.internet.email();
    est.programa = 'Ingeniería';
    est.semestre = 5;
    est.actividades = [];
    est.resenas = [];
    await estudianteRepo.save(est);
    estudiantesList.push(est);

    const act = new ActividadEntity();
    act.titulo = faker.lorem.words(3);
    act.fecha = '2025-05-20';
    act.cupomax = 5;
    act.estado = 2;
    act.estudiantes = [estudiantesList[0]];
    act.resenas = [];
    await actividadRepo.save(act);
    actividadesList.push(act);
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('agregarResena', () => {
    it('crea un reviwe con data', async () => {
      const estudiante = estudiantesList[0];
      const actividad = actividadesList[0];
      const comentario = faker.lorem.sentence();
      const calificacion = faker.number.int({ min: 1, max: 5 });

      await service.agregarResena(
        estudiante.id,
        actividad.id,
        comentario,
        calificacion,
      );

      const stored = await resenaRepo.findOne({
        where: {
          estudiante: { id: estudiante.id },
          actividad: { id: actividad.id },
        },
        relations: ['estudiante', 'actividad'],
      });

      expect(stored).not.toBeNull();
      expect(stored!.comentario).toBe(comentario);
      expect(stored!.calificacion).toBe(calificacion);
      expect(stored!.estudiante.id).toBe(estudiante.id);
      expect(stored!.actividad.id).toBe(actividad.id);
    });

    it('si el estudiante no existe error', async () => {
      const actividad = actividadesList[0];
      await expect(
        service.agregarResena(9999, actividad.id, 'comentario', 3),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
