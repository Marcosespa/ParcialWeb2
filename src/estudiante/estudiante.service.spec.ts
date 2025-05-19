import { Test, TestingModule } from '@nestjs/testing';
import { EstudianteService } from './estudiante.service';
import { EstudianteEntity } from './estudiante.entity';
import { ActividadEntity } from '../actividad/actividad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('EstudianteService', () => {
  let service: EstudianteService;
  let estudianteRepository: Repository<EstudianteEntity>;
  let actividadRepository: Repository<ActividadEntity>;
  let estudiantesList: EstudianteEntity[];
  let actividadesList: ActividadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EstudianteService],
    }).compile();

    service = module.get<EstudianteService>(EstudianteService);
    estudianteRepository = module.get<Repository<EstudianteEntity>>(
      getRepositoryToken(EstudianteEntity),
    );
    actividadRepository = module.get<Repository<ActividadEntity>>(
      getRepositoryToken(ActividadEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await estudianteRepository.clear();
    await actividadRepository.clear();
    estudiantesList = [];
    actividadesList = [];

    for (let i = 0; i < 5; i++) {
      const estudiante: EstudianteEntity = await estudianteRepository.save({
        cedula: 1234567890 + i,
        nombre: `Estudiante ${i}`,
        correo: `estudiante${i}@example.com`,
        programa: 'Ingeniería',
        semestre: 5,
        actividades: [],
        resenas: [],
      });
      estudiantesList.push(estudiante);
    }

    for (let i = 0; i < 3; i++) {
      const actividad: ActividadEntity = await actividadRepository.save({
        titulo: faker.lorem.words(4),
        fecha: `2025-05-${10 + i}`,
        cupomax: 5,
        estado: i,
        estudiantes: [],
        resenas: [],
      });
      actividadesList.push(actividad);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    it('should create a valid estudiante', async () => {
      const newEstudiante = new EstudianteEntity();
      newEstudiante.cedula = 1234567899;
      newEstudiante.nombre = 'Nuevo Estudiante';
      newEstudiante.correo = 'nuevo@example.com';
      newEstudiante.programa = 'Ingeniería';
      newEstudiante.semestre = 5;
      newEstudiante.actividades = [];
      newEstudiante.resenas = [];

      const result: EstudianteEntity =
        await service.crearEstudiante(newEstudiante);
      expect(result).not.toBeNull();
      expect(result.id).toBeDefined();
      expect(result.nombre).toEqual(newEstudiante.nombre);
    });

    it('email invalido', async () => {
      const newEstudiante = new EstudianteEntity();
      newEstudiante.cedula = 1234567899;
      newEstudiante.nombre = 'Nuevo Estudiante';
      newEstudiante.correo = 'invalid-email';
      newEstudiante.programa = 'Ingeniería';
      newEstudiante.semestre = 5;
      newEstudiante.actividades = [];
      newEstudiante.resenas = [];

      await expect(
        service.crearEstudiante(newEstudiante),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('si el semestre es invalido', async () => {
      const newEstudiante = new EstudianteEntity();
      newEstudiante.cedula = 1234567899;
      newEstudiante.nombre = 'Nuevo Estudiante';
      newEstudiante.correo = 'nuevo@example.com';
      newEstudiante.programa = 'Ingeniería';
      newEstudiante.semestre = 11;
      newEstudiante.actividades = [];
      newEstudiante.resenas = [];

      await expect(
        service.crearEstudiante(newEstudiante),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('findEstudianteById', () => {
    it('debe retornar el id del estudiante', async () => {
      const estudiante = estudiantesList[0];
      const result = await service.findEstudianteById(estudiante.id);
      expect(result).not.toBeNull();
      expect(result.id).toEqual(estudiante.id);
    });

    it('tira error si el estudiante no existe', async () => {
      await expect(service.findEstudianteById(9999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('inscribirseActividad', () => {
    it('debe inscribir a un estudiante en una actividad con un cupo disponible', async () => {
      const estudiante = estudiantesList[0];
      const actividad = actividadesList[0];

      await service.inscribirseActividad(estudiante.id, actividad.id);

      const updatedActividad = await actividadRepository.findOne({
        where: { id: actividad.id },
        relations: ['estudiantes'],
      });

      if (!updatedActividad) {
        throw new Error('actividad no encontrado');
      }

      expect(updatedActividad.estudiantes).toHaveLength(1);
      expect(updatedActividad.estudiantes[0].id).toEqual(estudiante.id);
    });

    it('la actividad no existe', async () => {
      const estudiante = estudiantesList[0];
      await expect(
        service.inscribirseActividad(estudiante.id, 9999),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('actividad no esta abierta estado 0)', async () => {
      const estudiante = estudiantesList[0];
      const actividad = actividadesList[1];
      await expect(
        service.inscribirseActividad(estudiante.id, actividad.id),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('error el cupoest lleno', async () => {
      const estudiante = estudiantesList[0];
      const actividad = actividadesList[0];
      actividad.estudiantes = estudiantesList.slice(0, 5);
      await actividadRepository.save(actividad);

      await expect(
        service.inscribirseActividad(estudiante.id, actividad.id),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('el estudiante ya esta inscrito ', async () => {
      const estudiante = estudiantesList[0];
      const actividad = actividadesList[0];
      actividad.estudiantes = [estudiante];
      await actividadRepository.save(actividad);

      await expect(
        service.inscribirseActividad(estudiante.id, actividad.id),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
