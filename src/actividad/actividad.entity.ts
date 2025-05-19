/* eslint-disable prettier/prettier */
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { ResenaEntity } from '../resena/resena.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActividadEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  titulo: string;
  @Column()
  fecha: string;
  @Column()
  cupomax: number;
  @Column()
  estado: number;


  @ManyToMany(() => EstudianteEntity, (estudiante) => estudiante.actividades)
  estudiantes: EstudianteEntity[];

  @OneToMany(() => ResenaEntity, (resena) => resena.actividad)
  resenas: ResenaEntity[];

}
