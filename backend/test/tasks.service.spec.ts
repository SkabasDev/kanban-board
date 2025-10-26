import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository, ObjectLiteral } from 'typeorm'
import { TasksService } from '../src/modules/tasks/tasks.service'
import { Task } from '../src/modules/tasks/task.entity'
import { ColumnEntity } from '../src/modules/columns/column.entity'
import { NotFoundException } from '@nestjs/common'

type MockRepo<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>>

function createMockRepo<T extends ObjectLiteral>(): MockRepo<T> {
  return {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
  }
}

describe('TasksService (unit)', () => {
  let service: TasksService
  let tasksRepo: MockRepo<Task>
  let columnsRepo: MockRepo<ColumnEntity>

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: createMockRepo<Task>() },
        { provide: getRepositoryToken(ColumnEntity), useValue: createMockRepo<ColumnEntity>() },
      ],
    }).compile()

    service = module.get(TasksService)
    tasksRepo = module.get(getRepositoryToken(Task))
    columnsRepo = module.get(getRepositoryToken(ColumnEntity))
  })

  describe('create', () => {
    it('creates a task in a column', async () => {
      const column = { id: 1 } as ColumnEntity
      columnsRepo.findOne!.mockResolvedValue(column)
      const created = { id: 10, title: 'A', description: 'B', column } as Task
      tasksRepo.create!.mockReturnValue(created)
      tasksRepo.save!.mockResolvedValue(created)

      const out = await service.create({ columnId: 1, title: 'A', description: 'B' })
      expect(columnsRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(tasksRepo.create).toHaveBeenCalledWith({ title: 'A', description: 'B', column })
      expect(tasksRepo.save).toHaveBeenCalledWith(created)
      expect(out).toEqual(created)
    })

    it('throws if column not found', async () => {
      columnsRepo.findOne!.mockResolvedValue(null)
      await expect(service.create({ columnId: 1, title: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('update', () => {
    it('updates title/description', async () => {
      const task = { id: 7, title: 'Old', description: undefined } as any
      tasksRepo.findOne!.mockResolvedValue(task)
      tasksRepo.save!.mockImplementation(async (t: Task) => t)
      const out = await service.update(7, { title: 'New', description: 'Desc' })
      expect(tasksRepo.findOne).toHaveBeenCalledWith({ where: { id: 7 } })
      expect(out.title).toBe('New')
      expect(out.description).toBe('Desc')
    })

    it('throws if task not found', async () => {
      tasksRepo.findOne!.mockResolvedValue(null)
      await expect(service.update(99, { title: 'X' })).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('archive (delete)', () => {
    it('soft deletes the task', async () => {
      tasksRepo.findOne!.mockResolvedValue({ id: 5 })
      tasksRepo.softDelete!.mockResolvedValue({} as any)
      const out = await service.archive(5)
      expect(tasksRepo.softDelete).toHaveBeenCalledWith(5)
      expect(out).toEqual({ id: 5, archived: true })
    })

    it('throws if task not found', async () => {
      tasksRepo.findOne!.mockResolvedValue(null)
      await expect(service.archive(1)).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
