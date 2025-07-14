export type TurmaT = {
  id: number,
  code: string,
  name: string,
  classBlock: string | null,
  classRoom: string | null,
  acceptPresenceByQRCode: boolean,
  schedules: ScheduleT[],
  _count: {
    enrollments: number,
  }
}

type ScheduleT = {
  startTime: string,
  endTime: string,
  weekDay: string,
}