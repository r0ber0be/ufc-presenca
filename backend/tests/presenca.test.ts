import { prisma } from '../src/lib/prisma'
import app from '../src/server'

beforeAll(async () => {
  await app.ready()
})

beforeEach(async () => {
  await prisma.class.deleteMany()
  await prisma.student.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.classAttendanceRecord.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.teacher.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('GET Presença', () => {
  it('Deve retornar todos os dias de aula de uma turma', async () => {
    const token = app.jwt.sign({ id: '12345' })
    const teacher = await prisma.teacher.create({
      data: {
        email: 'teste@gmail.com',
        name: 'Nome Teste',
        isSynced: false,
        uid: 'testeuidspokdpaokdpwkpwdpawdp',
      },
    })

    const turma = await prisma.class.create({
      data: {
        code: 'TXTXTX',
        name: 'Matéria De Teste',
        numberOfStudents: 0,
        teacherId: teacher.id,
      },
    })

    const lesson = await prisma.lesson.create({
      data: {
        classId: turma.id,
        date: new Date(),
      },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/${turma.id}/presencas/aulas`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)

    const body = res.json()

    expect(body.length).toBeGreaterThanOrEqual(1)
    expect(Array.isArray(body)).toBe(true)

    expect(lesson.classId).toBe(turma.id)

    expect(
      body.every(
        (item: { classId: string }) => item.classId === lesson.classId,
      ),
    ).toBe(true)
  })

  it('Deve retornar lesson vazio se turmaId for inválido', async () => {
    const token = app.jwt.sign({ id: '12345' })
    const turmaId = '23456'

    const res = await app.inject({
      method: 'GET',
      url: `/api/${turmaId}/presencas/aulas`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(400)

    const body = res.json()
    expect(body).toEqual({ message: 'Nenhum dia de aula.' })
    expect(Array.isArray(body)).toBe(false)
  })

  it('Deve retornar a presença dos alunos de uma turma', async () => {
    const token = app.jwt.sign({ id: '12345' })

    const teacher = await prisma.teacher.create({
      data: {
        email: 'teacher@gmail.com',
        name: 'Teacher',
        isSynced: false,
        uid: 'teacher-uid',
      },
    })

    const turma = await prisma.class.create({
      data: {
        code: 'CLASS001',
        name: 'Turma Teste',
        numberOfStudents: 1,
        teacherId: teacher.id,
      },
    })

    const student = await prisma.student.create({
      data: {
        name: 'Aluno Teste',
        enrollmentId: 'ENROLL123',
      },
    })

    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: turma.id,
      },
    })

    const lesson = await prisma.lesson.create({
      data: {
        classId: turma.id,
        date: new Date(),
      },
    })

    await prisma.classAttendanceRecord.create({
      data: {
        studentId: student.id,
        lessonId: lesson.id,
        present: true,
      },
    })

    const res = await app.inject({
      method: 'GET',
      url: `/api/${turma.id}/presencas/alunos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)

    const body = res.json()

    expect(body).toHaveLength(1)
    expect(body[0]).toMatchObject({
      id: student.id,
      name: student.name,
      enrollmentId: student.enrollmentId,
      presences: [true],
    })
  })

  it('Deve retornar array vazio se turmaId for inválido ou sem alunos', async () => {
    const token = app.jwt.sign({ id: '12345' })
    const turmaId = 'turma-inexistente'

    const res = await app.inject({
      method: 'GET',
      url: `/api/${turmaId}/presencas/alunos`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)
    const body = res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(0)
  })
})

describe('POST Presenças', () => {
  it('Deve atualizar as presenças dos alunos para uma aula', async () => {
    const token = app.jwt.sign({ id: '12345' })

    const teacher = await prisma.teacher.create({
      data: {
        email: 'teacher2@gmail.com',
        name: 'Prof Atualizador',
        isSynced: false,
        uid: 'prof-atualizador',
      },
    })

    const turma = await prisma.class.create({
      data: {
        code: 'CLASS002',
        name: 'Turma Presença',
        numberOfStudents: 1,
        teacherId: teacher.id,
      },
    })

    const student = await prisma.student.create({
      data: {
        name: 'Aluno Atualizável',
        enrollmentId: 'ENROLL456',
      },
    })

    await prisma.enrollment.create({
      data: {
        studentId: student.id,
        classId: turma.id,
      },
    })

    const lesson = await prisma.lesson.create({
      data: {
        classId: turma.id,
        date: new Date(),
      },
    })

    await prisma.classAttendanceRecord.create({
      data: {
        studentId: student.id,
        lessonId: lesson.id,
        present: false,
      },
    })

    const res = await app.inject({
      method: 'POST',
      url: `/api/presencas/alunos/atualizar`,
      payload: [
        {
          alunoId: student.id,
          lessonId: lesson.id,
          date: lesson.date.toISOString(),
          presenca: true,
        },
      ],
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)

    const updated = await prisma.classAttendanceRecord.findUnique({
      where: {
        studentId_lessonId: {
          studentId: student.id,
          lessonId: lesson.id,
        },
      },
    })

    expect(updated?.present).toBe(true)
  })

  it('Deve falhar se enviar dados inválidos para atualização de presença', async () => {
    const token = app.jwt.sign({ id: '12345' })

    const res = await app.inject({
      method: 'POST',
      url: `/api/presencas/alunos/atualizar`,
      payload: [
        {
          alunoId: 'invalido',
          lessonId: 'invalido',
          date: new Date().toISOString(),
          presenca: true,
        },
      ],
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(500)
  })
})
