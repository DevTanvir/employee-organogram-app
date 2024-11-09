import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';

@Entity('employees')
@Tree('materialized-path')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  positionId: number;

  @Column()
  positionName: string;

  @TreeParent()
  supervisor: Employee;

  @TreeChildren()
  directReports: Employee[];
  employee: {
    id: number;
    name: string;
    positionName: string;
    positionId: number;
    supervisor: null;
  };
}
