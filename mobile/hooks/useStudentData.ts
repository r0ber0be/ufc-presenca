import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'
import { getToken } from './useAuthToken'

type StudentData = {
  id: string,
  name: string,
  registrationNumber: number,
  role: string,
}

const STUDENT_ID_KEY = 'ufcPresencaStudentId'
const STUDENT_NAME_KEY = 'ufcPresencaStudentName'
const STUDENT_REGISTRATION_KEY = 'ufcPresencaStudentRegistration'
const STUDENT_ROLE_KEY = 'ufcPresencaStudentRole'

export async function saveStudentData() {
  const token = await getToken()

  if (!token) throw new Error('Missing info')
  const decoded = jwtDecode<StudentData>(token)

  await SecureStore.setItemAsync(STUDENT_ID_KEY, decoded.id)
  await SecureStore.setItemAsync(STUDENT_NAME_KEY, decoded.name)
  await SecureStore.setItemAsync(STUDENT_REGISTRATION_KEY, decoded.registrationNumber.toString())
  await SecureStore.setItemAsync(STUDENT_ROLE_KEY, decoded.role)
}

export async function getStudentId() {
  return await SecureStore.getItemAsync(STUDENT_ID_KEY)
}

export async function getStudentName() {
  return await SecureStore.getItemAsync(STUDENT_NAME_KEY)
}

export async function getStudentRegistration() {
  return await SecureStore.getItemAsync(STUDENT_REGISTRATION_KEY)
}

export async function getStudentRole() {
  return await SecureStore.getItemAsync(STUDENT_ROLE_KEY)
}

export async function removeStudentData() {
  await SecureStore.deleteItemAsync(STUDENT_ID_KEY)
  await SecureStore.deleteItemAsync(STUDENT_NAME_KEY)
  await SecureStore.deleteItemAsync(STUDENT_REGISTRATION_KEY)
  await SecureStore.deleteItemAsync(STUDENT_ROLE_KEY)
}