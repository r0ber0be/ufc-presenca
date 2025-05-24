export type TurmaT = {
  id: number,
  code: string,
  name: string,
  numberOfStudents: number,
  classBlock: string | null,
  classRoom: string | null,
  acceptPresenceByQRCode: boolean,
}