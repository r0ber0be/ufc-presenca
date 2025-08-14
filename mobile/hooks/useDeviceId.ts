import * as SecureStore from 'expo-secure-store'
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

const DEVICE_ID_KEY = 'studentDeviceID'

export async function getOrCreateDeviceId() {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY)

  if (!deviceId) {
    deviceId = uuidv4()
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId)
  }

  return deviceId
}

export async function getDeviceId() {
  return await SecureStore.getItemAsync(DEVICE_ID_KEY)
}
