import { usePinchZoom } from '@/hooks/usePinchZoom';
import useResetQrLockOnFocus from '@/hooks/useResetQrLockOnFocus';
import { useIsFocused } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { navigate } from 'expo-router/build/global-state/routing';
import { useEffect, useRef, useState } from 'react';
import { Animated, Button, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { LoaderOverlay } from './LoaderOverlay';

export default function CameraQR() {
  const [permission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused()
  const qrLock = useRef(false)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const cameraRef = useRef(null)
  const { zoom, pinchGesture } = usePinchZoom()
  const [loading, setLoading] = useState(false)
  const [responseMessage, setResponseMessage] = useState<string | null>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  
  useResetQrLockOnFocus(qrLock)

  useEffect(() => {
    if (isFocused) {
      setIsCameraReady(false)
    }
  }, [isFocused])

  const onCameraReady = () => {
    setIsCameraReady(true)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start()
  }

  const handleQrScanned = async ({ data }: { data: string }) => {
    if (!data || qrLock.current || loading) return

    qrLock.current = true
    setLoading(true)
    setResponseMessage(null)

    const alunoId = '82452ca7-0e8d-48c8-98c7-8f7af409f2c2'

    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setResponseMessage('Permissão de localização negada.')
        return
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      })
      const { latitude, longitude } = location.coords
      
      const response = await fetch(`http://192.168.3.6:3333/api/${alunoId}/presenca/qr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          signedData: data,
          latitude,
          longitude
        }),
      })

      const result = await response.json()

      console.log(result)
      console.log(response.ok)

      if (response.ok) {
        setResponseMessage('Presença confirmada com sucesso!')
        navigate('/')
      } else {
        setResponseMessage(result?.message || 'Código inválido ou expirado.')
      }
    } catch (error) {
      console.error(error)
      setResponseMessage('Erro ao conectar com o servidor.')
    } finally {
      setLoading(false)
      setTimeout(() => {
        qrLock.current = false
        setResponseMessage(null)
      }, 4000)
    }
  }

  if (!permission) return <View />
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Esta aplicação precisa de permissões para acessar a câmera.</Text>
        <Button title="Conceder permissão" onPress={requestPermission} />
      </View>
    )
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: 'Scanner', headerShown: false }} />
      { Platform.OS === 'android' ? <StatusBar hidden /> : null }
      
      { isFocused && (
        <>
          {!isCameraReady && <LoaderOverlay />}
          {loading && <LoaderOverlay />}
          {responseMessage && (
            <View style={styles.responseOverlay}>
              <Text style={styles.responseText}>{responseMessage}</Text>
            </View>
          )}
          <GestureDetector gesture={pinchGesture}>
            <Animated.View style={[StyleSheet.absoluteFillObject,  { opacity: fadeAnim }]}>
              <CameraView 
                ref={cameraRef}
                style={StyleSheet.absoluteFillObject} 
                facing='back'
                mirror={true}
                zoom={zoom}
                onCameraReady={onCameraReady}
                barcodeScannerSettings={{
                  barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={handleQrScanned}
              />
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', padding: 10 },
  responseOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 11,
  },
  responseText: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
})