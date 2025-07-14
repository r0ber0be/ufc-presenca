'use client'

import { atualizarPresencas } from '@/services/presenca';

// Store para as alterações de presença
let presencaChanges: { alunoId: string; date: string, lessonId: string, presenca: boolean }[] = [];

// Lista de callbacks para notificar sobre mudanças
type ChangeListener = () => void;
const listeners: ChangeListener[] = [];

// Função para adicionar listeners
export function addChangeListener(callback: ChangeListener) {
  listeners.push(callback)
  return () => {
    const index = listeners.indexOf(callback)
    if (index !== -1) {
      listeners.splice(index, 1)
    }
  };
}

// Função para notificar todas as alterações
function notifyChanges() {
  listeners.forEach(listener => listener())
}

// Função para adicionar ou atualizar uma alteração
export function updatePresencaChanges(alunoId: string, date: string, lessonId: string, presenca: boolean, initialValue: boolean) {
  console.log("dte", date, lessonId)
  const changeExists = presencaChanges.find(change => change.alunoId === alunoId && change.date === date)
  
  if (changeExists) {
    // Remove a alteração caso o valor volte ao seu estado original
    if (initialValue === presenca) {
      presencaChanges = presencaChanges.filter(change => !(change.alunoId === alunoId && change.date === date))
    } else {
      // Caso contrário, atualizamos o valor da presença
      presencaChanges = presencaChanges.map(change =>
        change.alunoId === alunoId && change.date === date ? { ...change, presenca } : change
      )
    }
  } else {
    presencaChanges = [...presencaChanges, { alunoId, date, lessonId, presenca }]
  }
  notifyChanges()
  
  return presencaChanges
}

// Função para obter o estado atual de um checkbox
export function getCheckedState(alunoId: string, date: string, defaultPresenca: boolean) {
  const change = presencaChanges.find(change => change.alunoId === alunoId && change.date === date)
  if (change) {
    return change.presenca
  }
  return defaultPresenca
}

// Função para obter todas as alterações
export function getPresencaChanges() {
  return presencaChanges
}

export async function salvarPresencas(turmaId: string) {
  if (presencaChanges.length === 0) return false
  
  await atualizarPresencas(presencaChanges, turmaId)
  return true
}