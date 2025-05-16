/* eslint-disable prettier/prettier */
import { EstudianteEntity } from 'src/estudiante/estudiante.entity';
import { ResenaEntity } from 'src/resena/resena.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ActividadEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;
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
