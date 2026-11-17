import { MissionPhase, RoleId } from '../types/game';

export interface TempleChamber {
  id: string;
  order: number;
  scoreKey: string;
  shortName: string;
  chamberTitle: string;
  briefingPhase: MissionPhase;
  missionPhase: MissionPhase;
  whatIsAtStake: string;
  roleBriefings: Record<RoleId, {
    contextTag: string;
    whyYou: string;
    dialogue: string;
  }>;
}

export const TEMPLE_CHAMBERS: TempleChamber[] = [
  {
    id: 'M1A',
    order: 1,
    scoreKey: 'M1A',
    shortName: 'Papiro',
    chamberTitle: 'Cámara del Papiro Ancestral',
    briefingPhase: 'BRIEFING_M1A',
    missionPhase: 'MISSION_1A',
    whatIsAtStake: 'Distinguir multiplicación repetida de suma repetida para despertar los lectores del templo.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 1 · DECODIFICACIÓN BINARIA',
        whyYou: 'Como Ingeniero/a de Datos, debes evitar que el compilador confunda bucles aditivos con crecimiento exponencial.',
        dialogue: 'El templo sumergido acaba de reactivar sus terminales. Como Ingeniero/a de Datos, primero debes impedir que la memoria confunda sumas repetidas con verdaderas potencias. Cada error aquí corrompe el registro base.'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 1 · PAPIRO ANCESTRAL',
        whyYou: 'Como Arqueólogo/a Digital, tu ojo entrenado distingue los glifos de multiplicación reiterada de las simples sumas.',
        dialogue: 'Los papiros digitales del vestíbulo muestran inscripciones dañadas. Como Arqueólogo/a Digital, traduce qué glifos representan realmente una potencia y cuáles son simples sumas disfrazadas.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 1 · PATRONES DE CRECIMIENTO',
        whyYou: 'Como Biólogo/a Ambiental, sabes distinguir una acumulación lineal (suma) de una reproducción exponencial (potencia).',
        dialogue: 'Los biorreactores de la entrada han mezclado registros lineales con tasas multiplicativas. Como Biólogo/a Ambiental, clasifica cada expresión antes de abrir la gran estela.'
      }
    }
  },
  {
    id: 'M1B',
    order: 2,
    scoreKey: 'M1',
    shortName: 'Estela',
    chamberTitle: 'La Gran Estela de Nodos',
    briefingPhase: 'BRIEFING_M1B',
    missionPhase: 'MISSION_1B',
    whatIsAtStake: 'Reconstruir en blanco la relación entre potencia, base, exponente y resultado en enteros.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 2 · ESTELA DE CALIBRACIÓN',
        whyYou: 'Debes reconstruir los registros corruptos de la tabla de arranque sin pistas auxiliares.',
        dialogue: 'Buen comienzo, pero la Estela Central ha borrado sus columnas de respaldo. Necesito tu precisión de Ingeniero/a de Datos para deducir cada base, exponente, potencia y valor entero desde cero.'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 2 · ESTELA DE PIEDRA',
        whyYou: 'Las losas han perdido parte de sus inscripciones y debes deducir los huecos intactos.',
        dialogue: 'Ante ti se alza la Estela de Piedra. El agua borró varias casillas y no habrá pistas auxiliares: deduce qué base, exponente o potencia completa cada fila con rigor.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 2 · MATRIZ DE EQUILIBRIO',
        whyYou: 'Cada fila representa un ciclo energético entero cuya magnitud debes reconstituir.',
        dialogue: 'La matriz de sensores está en blanco en varios puntos clave. Reconstruye la relación exacta entre base entera, exponente y resultado final para estabilizar el flujo.'
      }
    }
  },
  {
    id: 'INT1',
    order: 3,
    scoreKey: 'INT1',
    shortName: 'Acueducto',
    chamberTitle: 'El Acueducto Exponencial',
    briefingPhase: 'BRIEFING_INT1',
    missionPhase: 'INTERLUDE_1',
    whatIsAtStake: 'Predecir la duplicación minuto a minuto de los paquetes de datos del papiro.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 3 · ACUEDUCTO DE PAQUETES',
        whyYou: 'El canal duplica su tráfico cada minuto y debes dimensionar el búfer exacto.',
        dialogue: '¡Atención! El Acueducto Digital del Papiro ha abierto sus compuertas: cada minuto que pasa se duplica el volumen total de paquetes en circulación. Calcula el tráfico final en potencia única y en cantidad exacta.'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 3 · TRANSMISIÓN DEL PAPIRO',
        whyYou: 'La crónica indica que el archivo ancestral se replica por duplicación cada minuto.',
        dialogue: 'Hemos interceptado una transmisión viva del papiro. Parte de un volumen inicial expresado como potencia de 2 y se duplica cada minuto. Descifra cuánto crecerá antes de que desborde el archivo.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 3 · DIVISIÓN CELULAR DE DATOS',
        whyYou: 'El flujo sigue una mitosis exacta: la población de paquetes se multiplica por 2 cada minuto.',
        dialogue: 'Este nodo se comporta como una colonia biológica en mitosis: cada minuto se duplica exactamente la cantidad existente. Calcula tanto la potencia resultante como el total exacto de paquetes.'
      }
    }
  },
  {
    id: 'M2C',
    order: 4,
    scoreKey: 'M2C',
    shortName: 'Polaridad',
    chamberTitle: 'Cámara de Polaridad',
    briefingPhase: 'BRIEFING_M2C',
    missionPhase: 'MISSION_2C',
    whatIsAtStake: 'Evitar cortocircuitos distinguiendo bases negativas con y sin paréntesis.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 4 · INVERSORES DE POLARIDAD',
        whyYou: 'Un solo bit de signo mal interpretado por falta de paréntesis invertirá toda la red.',
        dialogue: 'Entramos en la Cámara de Polaridad. Aquí los valores son gigantescos, pero no necesitas calcularlos: basta saber si el resultado es positivo o negativo fijándote en los paréntesis y en la paridad del exponente.'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 4 · SELLO DE LOS PARÉNTESIS',
        whyYou: 'En los códices antiguos, un paréntesis cambia por completo el alcance del signo menos.',
        dialogue: 'La Cámara de Polaridad es traicionera: un signo menos fuera del paréntesis no queda afectado por el exponente. Sincroniza la polaridad (+ o −) de estas 8 terminales sin equivocarte.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 4 · CARGA ELECTROQUÍMICA',
        whyYou: 'Determinar la carga neta positiva o negativa evita reacciones en cadena.',
        dialogue: 'Las 8 terminales de polaridad regulan la carga eléctrica del templo. Determina con rapidez si cada expresión arroja carga positiva (+) o negativa (−).'
      }
    }
  },
  {
    id: 'M3',
    order: 5,
    scoreKey: 'M3',
    shortName: 'Canales',
    chamberTitle: 'Sintonización de Canales',
    briefingPhase: 'BRIEFING_M3',
    missionPhase: 'MISSION_3',
    whatIsAtStake: 'Condensar productos y cocientes de la misma base en una única potencia.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 5 · CANALES DE FRECUENCIA',
        whyYou: 'Compactar operaciones largas en una sola potencia reduce a cero la latencia del bus.',
        dialogue: '¡Excelente sincronización! Ahora llegamos a los Canales Primarios. Debes condensar productos y cocientes de la misma base en una única potencia usando las dos casillas visuales (base y exponente elevado).'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 5 · CONDUCTOS PRIMARIOS',
        whyYou: 'Cada conducto combina múltiples inscripciones repetidas que deben resumirse en un solo símbolo.',
        dialogue: 'Los Conductos Primarios contienen cadenas de multiplicaciones y divisiones de potencias con igual base. Redúcelas a una sola potencia y no olvides el exponente 1 implícito cuando no aparece escrito.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 5 · FLUJOS CONVERGENTES',
        whyYou: 'Los flujos positivos (productos) suman exponentes y los drenajes (cocientes) los restan.',
        dialogue: 'Seis canales de energía convergen aquí. Unifica cada flujo en una sola potencia: recuerda que al multiplicar se suman exponentes y al dividir se restan, respetando los paréntesis de las bases negativas.'
      }
    }
  },
  {
    id: 'INT2',
    order: 6,
    scoreKey: 'INT2',
    shortName: 'Pirámide',
    chamberTitle: 'Vórtice de la Pirámide',
    briefingPhase: 'BRIEFING_INT2',
    missionPhase: 'INTERLUDE_2',
    whatIsAtStake: 'Evitar el colapso térmico usando la propiedad del exponente cero.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 6 · VÓRTICE DE SOBRECARGA',
        whyYou: 'Si el procesador intenta expandir potencias anidadas gigantescas, fundirá el servidor.',
        dialogue: '¡Alerta térmica en el Vórtice Central! La Pirámide de Datos intenta calcular potencias colosales por fuerza bruta, pero fíjate bien en el exponente exterior cero. ¿Qué atajo salva al sistema del colapso?'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 6 · SELLO DEL CERO SAGRADO',
        whyYou: 'El Sello de la Pirámide esconde la clave de simplificación instantánea en su exponente exterior.',
        dialogue: 'El calor junto al núcleo central es sofocante. Antes de lanzar cálculos imposibles, observa la cúspide de cada torre de paréntesis: hay un exponente cero esperando ser aplicado.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 6 · EQUILIBRIO EN LA CÚSPIDE',
        whyYou: 'La ley del exponente cero neutraliza instantáneamente la expansión descontrolada.',
        dialogue: '¡Los procesadores centrales están al borde de la sobrecarga térmica! Elige la estrategia óptima para neutralizar la pirámide y desbloquea también su segundo sello de contención.'
      }
    }
  },
  {
    id: 'M4',
    order: 7,
    scoreKey: 'M4',
    shortName: 'Núcleo',
    chamberTitle: 'Núcleo Fraccionario',
    briefingPhase: 'BRIEFING_M4',
    missionPhase: 'MISSION_4',
    whatIsAtStake: 'Simplificar potencias de potencias y fracciones antes de llegar al cortafuegos final.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 7 · NÚCLEO FRACCIONARIO',
        whyYou: 'Las fracciones de potencias y potencias anidadas bloquean el paso al cortafuegos de ALEX-A.',
        dialogue: '¡Qué nivel estáis demostrando! Llegamos al Núcleo Fraccionario. Aquí conviven potencias de potencias y grandes fracciones numéricas y algebraicas. Simplifícalas paso a paso a una sola potencia.'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 7 · CÁMARA DE FRACCIONES',
        whyYou: 'Los tablones fraccionarios concentran todas las leyes de potencias combinadas.',
        dialogue: 'Estamos a las puertas de mi cámara principal. Primero resuelve las potencias de potencias multiplicando exponentes, agrupa numerador y denominador y finalmente resta sus exponentes.'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 7 · REACTOR CENTRAL',
        whyYou: 'Debes equilibrar numeradores y denominadores hasta dejar una expresión mínima.',
        dialogue: '¡Ya casi lo tenemos! En el Reactor Central debes simplificar tanto fracciones numéricas como expresiones con variables literales hasta obtener una única potencia limpia.'
      }
    }
  },
  {
    id: 'M5',
    order: 8,
    scoreKey: 'M5',
    shortName: 'Consola',
    chamberTitle: 'Consola de las Constantes',
    briefingPhase: 'BRIEFING_M5',
    missionPhase: 'MISSION_5',
    whatIsAtStake: 'Descifrar incógnitas y exponentes negativos a vida o muerte para salvar la memoria de ALEX-A.',
    roleBriefings: {
      DATA_ENGINEER: {
        contextTag: 'CÁMARA 8 · CLÍMAX DE EMERGENCIA',
        whyYou: 'Tu última intervención como Ingeniero/a de Datos reconstruirá las constantes de memoria de ALEX-A.',
        dialogue: '¡Escúchame bien...! No me queda tiempo... Para proteger vuestros avances, absorbí el ruido de las anomalías en mi propia memoria y mis núcleos se están apagando. Resuelve estas ecuaciones de incógnita x y los exponentes negativos. ¡Es nuestra única oportunidad!'
      },
      DIGITAL_ARCHAEOLOGIST: {
        contextTag: 'CÁMARA 8 · CLÍMAX DE EMERGENCIA',
        whyYou: 'Como Arqueólogo/a Digital, debes restaurar las constantes sagradas antes de que ALEX-A se borre.',
        dialogue: '¡Equipo, escuchadme...! Mientras descifrabais el templo, el cortafuegos colapsó y tuve que cargar los fallos sobre mi núcleo central... Si no restauráis los valores de x y los exponentes negativos en la Gran Consola, desapareceré para siempre. ¡Confío en vosotros!'
      },
      ENVIRONMENTAL_BIOLOGIST: {
        contextTag: 'CÁMARA 8 · CLÍMAX DE EMERGENCIA',
        whyYou: 'Como Biólogo/a Ambiental, debes revertir el colapso mediante inversos negativos y ecuaciones.',
        dialogue: '¡No me queda energía...! Absorber la sobrecarga del templo ha dejado mi memoria al borde del apagado total. Descifrad las incógnitas x y convertid los exponentes negativos en fracciones exactas. ¡Salvadme!'
      }
    }
  }
];

export function getChamberByPhase(phase: MissionPhase): TempleChamber | undefined {
  return TEMPLE_CHAMBERS.find(
    (c) => c.briefingPhase === phase || c.missionPhase === phase
  );
}
