import { removeToken } from '@/hooks/useAuthToken'
import { removeStudentData } from '@/hooks/useStudentData'
import { router } from 'expo-router'
import { Appbar } from 'react-native-paper'

const logout = async() => {
  await removeToken()
  await removeStudentData()
  router.replace('/sign-in')
}

const Header = () => (
  <Appbar.Header>
    <Appbar.Content title="UFC PRESENÇAS" />
    <Appbar.Action icon="cog-outline" onPress={() => {logout()}} />
  </Appbar.Header>
)

export default Header