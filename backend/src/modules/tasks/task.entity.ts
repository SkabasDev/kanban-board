import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { ColumnEntity } from '../columns/column.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  title!: string

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => ColumnEntity, (c) => c.tasks, { onDelete: 'CASCADE' })
  column!: ColumnEntity
}
