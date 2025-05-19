import { ActividadEntity } from '../actividad/actividad.entity';
import { EstudianteEntity } from '../estudiante/estudiante.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ResenaEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  comentario: string;
  @Column()
  calificacion: number;
  @Column()
  fecha: string;

  @ManyToOne(() => ActividadEntity, (actividad) => actividad.resenas)
  actividad: ActividadEntity;

  //   @OneToMany(() => ResenaEntity, (resena) => resena.estudiante)
  // resenas: ResenaEntity[];
  @ManyToOne(() => EstudianteEntity, (estudiante) => estudiante.resenas)
  estudiante: EstudianteEntity;
}
