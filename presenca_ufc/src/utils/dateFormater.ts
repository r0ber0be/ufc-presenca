export const dateFormat = (isoDate: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
  }).format(new Date(isoDate))
}