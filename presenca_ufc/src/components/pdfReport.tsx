'use client'

import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer'

type StudentReport = {
  name: string
  registration: string
  presences: number
  absences: number
  percentage: number
}

type ClassReport = {
  students: StudentReport[], 
  name: string,
  totalLessons: number, 
  averagePresence: number,
}

export default function PDFReport({ report, professorName }: { report: ClassReport, professorName: string }) {
  console.log('there', report.students)
  const { students, name, totalLessons, averagePresence } = report
  return (
    <Document>
      <Page size='A4' style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text*/}
          <Image src='/assets/icon.png' style={styles.logo}/>
          <Text style={styles.title}>Universidade Federal do Ceará</Text>
          <Text style={styles.title}>Relatório de Presenças</Text>
          <Text style={styles.title}>{name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text>Professor(a) {professorName}</Text>
          <Text style={styles.separator}>|</Text>
          <Text>Período: 2025.2</Text>
        </View>

        <View style={styles.section}>
          <Text>Total de aulas: {totalLessons}</Text>
          <Text>Média geral de presença da turma: {averagePresence}%</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Nome</Text>
            <Text style={styles.tableColHeader}>Matrícula</Text>
            <Text style={styles.tableColHeader}>Presenças</Text>
            <Text style={styles.tableColHeader}>Faltas</Text>
            <Text style={styles.tableColHeader}>%</Text>
          </View>
          {students.map((student, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.tableCol}>{student.name}</Text>
              <Text style={styles.tableCol}>{student.registration}</Text>
              <Text style={styles.tableCol}>{student.presences}</Text>
              <Text style={styles.tableCol}>{student.absences}</Text>
              <Text style={styles.tableCol}>{student.percentage}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text>
            UFC PRESENÇAS
          </Text>
          <Text>
            Relatório gerado em {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </Page>
    </Document>
  )
}

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
})

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Oswald' },
  header: { textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 16, marginBottom: 5 },
  section: { marginBottom: 15 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { width: '20%', borderStyle: 'solid', borderWidth: 1, backgroundColor: '#eaeaea', padding: 5 },
  tableCol: { width: '20%', borderStyle: 'solid', borderWidth: 1, padding: 5 },
  tableCell: { fontSize: 10 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: 60,
    height: 100,
    marginBottom: 10,
    alignSelf: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    gap: 5,
  },
  separator: {
    marginHorizontal: 5,
  },
})
