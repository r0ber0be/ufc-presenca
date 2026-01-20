export type TurmaT = {
  id: number,
  code: string,
  name: string,
  location: string,
  ongoingSemester: string,
  semesterBeginsIn: Date,
  semesterEndsIn: Date,
  current: boolean,
  quantityOfEnrollments: number,
  capacityOfEnrollments: number,
  acceptPresenceByQRCode: boolean,
  schedules: ScheduleT[]
}

type ScheduleT = {
  startTime: string,
  endTime: string,
  weekDay: string,
}