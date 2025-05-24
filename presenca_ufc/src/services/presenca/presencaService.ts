'use client'

import { atualizarPresencas } from '@/services/presenca';

// Store para as alterações de presença
let presencaChanges: { alunoId: string; date: string, lessonId: string, presenca: boolean }[] = [];

// Lista de callbacks para notificar sobre mudanças
type ChangeListener = () => void;
const listeners: ChangeListener[] = [];

// Função para adicionar listeners
export function addChangeListener(callback: ChangeListener) {
  listeners.push(callback);
  return () => {
    const index = listeners.indexOf(callback);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  };
}

// Função para notificar todas as alterações
function notifyChanges() {
  listeners.forEach(listener => listener());
}

// Função para adicionar ou atualizar uma alteração
export function updatePresencaChanges(alunoId: string, date: string, lessonId: string, presenca: boolean, initialValue: boolean) {
  console.log("dte", date, lessonId)
  const changeExists = presencaChanges.find(change => change.alunoId === alunoId && change.date === date);
  
  if (changeExists) {
    // Remove a alteração caso o valor volte ao seu estado original
    if (initialValue === presenca) {
      presencaChanges = presencaChanges.filter(change => !(change.alunoId === alunoId && change.date === date));
    } else {
      // Caso contrário, atualizamos o valor da presença
      presencaChanges = presencaChanges.map(change =>
        change.alunoId === alunoId && change.date === date ? { ...change, presenca } : change
      );
    }
  } else {
    // Adiciona a nova alteração caso ela não exista
    presencaChanges = [...presencaChanges, { alunoId, date, lessonId, presenca }];
  }
  
  // Notifica os listeners sobre a mudança
  notifyChanges();
  
  return presencaChanges;
}

// Função para obter o estado atual de um checkbox
export function getCheckedState(alunoId: string, date: string, defaultPresenca: boolean) {
  const change = presencaChanges.find(change => change.alunoId === alunoId && change.date === date);
  // Se encontrar uma alteração para este checkbox, retorna o valor da alteração
  if (change) {
    return change.presenca;
  }
  // Caso contrário, retorna o valor padrão/inicial
  return defaultPresenca;
}

// Função para obter todas as alterações
export function getPresencaChanges() {
  return presencaChanges;
}

// Função para salvar as alterações
export async function salvarPresencas() {
  if (presencaChanges.length === 0) return false;
  
  await atualizarPresencas(presencaChanges);
  return true;
}