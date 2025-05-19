import { ActividadEntity } from '../actividad/actividad.entity';
import { ResenaEntity } from '../resena/resena.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class EstudianteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cedula: number;
  @Column()
  nombre: string;
  @Column()
  correo: string;
  @Column()
  programa: string;
  @Column()
  semestre: number;

  @OneToMany(() => ResenaEntity, (resena) => resena.estudiante)
  resenas: ResenaEntity[];

  // Esta es la dueña de la relacion many to many
  @ManyToMany(() => ActividadEntity, (actividad) => actividad.estudiantes)
  @JoinTable()
  actividades: ActividadEntity[];
}
