import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Board } from '../boards/board.entity'
import { Task } from '../tasks/task.entity'

@Entity('columns')
export class ColumnEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @ManyToOne(() => Board, (b) => b.columns, { onDelete: 'CASCADE' })
  board!: Board

  @OneToMany(() => Task, (t) => t.column, { cascade: true })
  tasks!: Task[]
}
