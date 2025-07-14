export function changeBgByTime() {
  const hour = new Date().getHours()
  if (hour >= 18 || hour < 5) {
    return '/assets/bg-night.png' // Noite: das 18h até 5h
  } else {
    return '/assets/bg-day.png' // Dia: das 5h às 18h
  }
}