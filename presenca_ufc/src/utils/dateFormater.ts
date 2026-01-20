type DatePart = 'day' | 'month' | 'year' | 'full'

export const dateFormat = (isoDate: string, part: DatePart = 'full') => {
  const date = new Date(isoDate)

  switch(part) {
    case 'day':
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
      }).format(date)
      
    case 'full':
    default:
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(date)
  }
}