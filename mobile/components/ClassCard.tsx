import { navigate } from 'expo-router/build/global-state/routing';
import { Linking, Pressable, StyleSheet, View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';

const teste = () => {
  console.log('dsdsf')
}

const goToClass = () => {
  Linking.openURL('https://www.google.com/')
}

const goToPresenceScanner = () => {
  navigate('/QRcode')
}

const ClassCard = () => (
  <Card mode='contained' style={styles.card}>
    <Card.Content>
      <Pressable onLongPress={teste} onPress={goToClass}>
        <View style={styles.container}> 
          <View style={styles.info}>
            <Text style={styles.title} variant="titleMedium">Matemática de computadores avançado em testes</Text>
            <Text variant="bodyMedium">SEG - TER</Text>
            <Text variant="bodyMedium">13:30 - 15:30</Text>
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
);

const styles = StyleSheet.create({
  card: {
    marginTop: 10,
  },
  container: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    marginLeft: 10,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    textAlign: 'center',
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
});

export default ClassCard;