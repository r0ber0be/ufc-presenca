import haversineDistance from 'haversine-distance'

export async function geolocationVerifier(
  studentLat: number,
  studentLng: number,
  lessonLat: number,
  lessonLng: number,
) {
  const student = { latitude: studentLat, longitude: studentLng }
  const lesson = { latitude: lessonLat, longitude: lessonLng }

  const distance = haversineDistance(student, lesson)
  console.log(student, lesson)
  console.log('distancia:', distance)
  if (distance <= 800) {
    console.log('está dentro')
    return true
  }
  console.log('está fora')
  throw new Error()
}
