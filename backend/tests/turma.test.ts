import { prisma } from '../src/lib/prisma'
import app from '../src/server'

beforeAll(async () => {
  await app.ready()
})

beforeEach(async () => {
  await prisma.classAttendanceRecord.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.class.deleteMany()
  await prisma.teacher.deleteMany()
  await prisma.student.deleteMany()
})

describe('GET Turma', () => {
  it('Deve retornar 401 se o professor não for encontrado', async () => {
    const token = app.jwt.sign({ id: '12345' })

    const response = await app.inject({
      method: 'GET',
      url: '/api/turmas',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(401)
    expect(response.json()).toEqual({ message: 'Não autorizado' })
  })

  it('Deve retornar 404 se professor não tiver turmas', async () => {
    const token = app.jwt.sign({ id: '12345' })

    await prisma.teacher.create({
      data: {
        uid: '12345',
        name: 'Professor Sem Turmas',
        email: 'prof@gmail.com',
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/turmas',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({ message: 'Nenhuma turma encontrada' })
  })

  it('Deve retornar 200 e as turmas do professor', async () => {
    const token = app.jwt.sign({ id: '12345' })

    const teacher = await prisma.teacher.create({
      data: {
        email: 'a@gmail.com',
        uid: '12345',
        name: 'Professor X',
      },
    })

    const turma = await prisma.class.create({
      data: {
        name: 'Turma 1',
        teacherId: teacher.id,
        code: 'TURQXD',
        numberOfStudents: 20,
      },
    })

    const response = await app.inject({
      method: 'GET',
      url: '/api/turmas',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: turma.id,
          name: turma.name,
        }),
      ]),
    )
  })

  describe('POST Turmas', () => {
    it('Deve criar uma aula e gerar presença inicial falsa para todos os alunos da turma', async () => {
      const token = app.jwt.sign({ id: '12345' })

      const teacher = await prisma.teacher.create({
        data: {
          uid: '12345',
          name: 'Professor Aulas',
          email: 'prof@gmail.com',
        },
      })

      const turma = await prisma.class.create({
        data: {
          name: 'Turma Presença Regras',
          teacherId: teacher.id,
          code: 'TURDDD',
          numberOfStudents: 20,
        },
      })

      const student1 = await prisma.student.create({
        data: { name: 'Aluno A', enrollmentId: '433232' },
      })
      const student2 = await prisma.student.create({
        data: { name: 'Aluno B', enrollmentId: '578111' },
      })

      await prisma.enrollment.createMany({
        data: [
          { classId: turma.id, studentId: student1.id },
          { classId: turma.id, studentId: student2.id },
        ],
      })

      const response = await app.inject({
        method: 'POST',
        url: `/api/${turma.id}/aula`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {},
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toEqual({ message: 'Aula cadastrada!' })

      const lesson = await prisma.lesson.findFirst({
        where: { classId: turma.id },
      })

      expect(lesson).toBeDefined()

      const attendanceRecords = await prisma.classAttendanceRecord.findMany({
        where: { lessonId: lesson!.id },
      })

      expect(attendanceRecords).toHaveLength(2)

      const studentIds = [student1.id, student2.id]
      for (const record of attendanceRecords) {
        expect(studentIds).toContain(record.studentId)
        expect(record.lessonId).toBe(lesson!.id)
        if ('present' in record) {
          expect(record.present).toBe(false)
        }
      }
    })

    it('Deve retornar 404 se usar um id inválido ao criar aula', async () => {
      const token = app.jwt.sign({ id: '12345' })

      const response = await app.inject({
        method: 'POST',
        url: `/api/invalid-id/aula`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {},
      })

      expect(response.statusCode).toBe(404)
      expect(response.json()).toEqual({
        message: 'Turma não encontrada.',
      })
    })

    it('Deve retornar 201 e criar aula sem registros de presença se não houver alunos matriculados', async () => {
      const token = app.jwt.sign({ id: '12345' })

      const teacher = await prisma.teacher.create({
        data: {
          uid: '12345',
          name: 'Professor Sem Alunos',
          email: 'prof@gmail.com',
        },
      })

      const turma = await prisma.class.create({
        data: {
          name: 'Turma Vazia',
          teacherId: teacher.id,
          code: 'TGGDDD',
          numberOfStudents: 0,
        },
      })

      const response = await app.inject({
        method: 'POST',
        url: `/api/${turma.id}/aula`,
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {},
      })

      expect(response.statusCode).toBe(201)
      expect(response.json()).toEqual({ message: 'Aula cadastrada!' })

      const lesson = await prisma.lesson.findFirst({
        where: { classId: turma.id },
      })
      expect(lesson).toBeDefined()

      const attendanceRecords = await prisma.classAttendanceRecord.findMany({
        where: { lessonId: lesson!.id },
      })

      // Neste cenário, não deve haver registros de presença
      expect(attendanceRecords).toHaveLength(0)
    })
  })
})
