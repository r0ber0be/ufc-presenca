import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'

import ClassCard from '@/components/ClassCard'
import { ThemedView } from '@/components/ThemedView'
import { getToken } from '@/hooks/useAuthToken'
import { getStudentId } from '@/hooks/useStudentData'
import { useEffect, useState } from 'react'

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

export default function HomeScreen() {
  const [classes, setClasses] = useState<ClassInfo[]>([])
  const [error, setError] = useState<string | null>()

  useEffect(() => {
    async function loadClasses() {
      const studentId = await getStudentId();
      const token = await getToken();

      const res = await fetch(`http://192.168.3.6:3333/api/${studentId}/turmas`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      const data = await res.json()

      if(data.message) {
        setError(data.message)
      } else {
        setClasses(data)
      }
    }
    loadClasses()
    console.log(classes)
  }, [])

  if(error) {
    return (
      <View>
        <Text style={styles.text}>{error}</Text>
      </View>
    )
  }

  if (classes.length === 0) {
    return (
      <View>
        <Text style={styles.text}>Bem vindo! Você não está matriculado em nenhuma turma</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView>
          { classes.map((classe: ClassInfo, index) => (
            <ClassCard key={index} {...classe} />
          ))}
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
  }
})
