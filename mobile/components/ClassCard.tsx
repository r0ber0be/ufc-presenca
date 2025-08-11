import { navigate } from 'expo-router/build/global-state/routing';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

type ClassInfo = {
  id: string,
  code: string,
  name: string,
  classBlock: string,
  classRoom: string,
  schedules: [{
    id: string,
    startTime: string,
    endTime: string,
    weekDay: string,
  }],
}

const teste = () => {
  console.log('dsdsf')
}

const goToClassDetails = ( id: string ) => {
  Linking.openURL('https://www.google.com/')
}

const goToPresenceScanner = () => {
  navigate('/QRcode')
}

export default function ClassCard({ ...classe }: ClassInfo) {
  const { name, code, classRoom, classBlock, schedules } = classe
  return (
    <Card mode='contained' style={styles.card}>
      <Card.Content>
        <Pressable onLongPress={teste} onPress={() => goToClassDetails(classe.id)}>
          <View style={styles.container}> 
            <View style={styles.info}>
              <Text style={styles.title} variant='titleMedium'>
                { name }
              </Text>

              {schedules.map(({ id, weekDay, startTime, endTime }) => (
                <Text key={id} style={styles.scheduleText} variant='bodyMedium'>
                  📅 {weekDay}  ⏰ {startTime} - {endTime}
                </Text>
              ))}
            </View>
      
            <Card.Actions style={styles.actions}>
              <IconButton 
                icon='qrcode-scan' 
                size={40} 
                style={styles.qrButton}
                onPress={goToPresenceScanner}
                onLongPress={teste} 
                delayLongPress={700} 
                iconColor='black'
              />
            </Card.Actions>
          </View>
        </Pressable>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
    overflow: 'hidden'
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleText: {
    marginTop: 2,
  },
  actions: {
    justifyContent: 'flex-end', // alinha o QR code à direita
    paddingHorizontal: 5,
  },
  qrButton: {
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
})