import { RoleId, RoleInfo, AlexaEmotion } from '../types/game';

import alexaCold from '../assets/images/alexa_cold_1792324125134.jpg';
import alexaEnthusiastic from '../assets/images/alexa_enthusiastic_1792324141889.jpg';
import alexaCritical from '../assets/images/alexa_critical_1792324142209.jpg';

import avatarDataEngineer from '../assets/images/avatar_data_engineer_1792324143123.jpg';
import avatarDigitalArchaeologist from '../assets/images/avatar_digital_archeologist_1792324143680.jpg';
import avatarEnvironmentalBiologist from '../assets/images/avatar_environmental_biologist_1792324143449.jpg';

export const ALEXA_PORTRAITS: Record<AlexaEmotion, string> = {
  cold: alexaCold,
  enthusiastic: alexaEnthusiastic,
  critical: alexaCritical,
};

export const ROLES_DATA: Record<RoleId, RoleInfo> = {
  DATA_ENGINEER: {
    id: 'DATA_ENGINEER',
    title: 'Ingeniero/a de Datos',
    shortTitle: 'Ing. Datos',
    tagline: 'Arquitectura de servidores y optimización de potencias masivas',
    description: 'Especialista en estructurar flujos binarios, computación en paralelo y condensación de cargas algebraicas de gran escala.',
    iconName: 'Server',
    image: avatarDataEngineer,
    accentColor: '#00F5FF',
    badge: 'Maestría en Arquitectura de Servidores'
  },
  DIGITAL_ARCHAEOLOGIST: {
    id: 'DIGITAL_ARCHAEOLOGIST',
    title: 'Arqueólogo/a Digital',
    shortTitle: 'Arq. Digital',
    tagline: 'Descifrado de manuscritos ancestrales, reglas de signos y bases enteras',
    description: 'Experto/a en restaurar códices numéricos fragmentados de la Biblioteca de Alejandría y desentrañar la polaridad de los paréntesis.',
    iconName: 'Scroll',
    image: avatarDigitalArchaeologist,
    accentColor: '#FFD700',
    badge: 'Descifrador/a de Jeroglíficos Numéricos'
  },
  ENVIRONMENTAL_BIOLOGIST: {
    id: 'ENVIRONMENTAL_BIOLOGIST',
    title: 'Biólogo/a Ambiental',
    shortTitle: 'Biól. Ambiental',
    tagline: 'Patrones exponenciales y modelos de crecimiento en la red',
    description: 'Investigador/a de dinámicas exponenciales, mitosis algorítmica y equilibrios energéticos en ecosistemas computacionales.',
    iconName: 'Leaf',
    image: avatarEnvironmentalBiologist,
    accentColor: '#00FF88',
    badge: 'Analista de Dinámicas Exponenciales'
  }
};
