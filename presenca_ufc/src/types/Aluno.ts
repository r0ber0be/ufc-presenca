export type CheckboxValue = {
  isPresent: boolean,
  index: number,
  alunoID: string,
  checked: any, 
  onCheckedChange: (t: string) => void
}