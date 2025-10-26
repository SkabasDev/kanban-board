import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { ColumnEntity } from '../columns/column.entity'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => ColumnEntity, (c) => c.tasks, { onDelete: 'CASCADE' })
  column!: ColumnEntity

  @CreateDateColumn({ type: 'timestamptz' })
  created_at!: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at!: Date

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deleted_at?: Date | null
}
