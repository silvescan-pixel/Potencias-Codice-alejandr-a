import React, { useState } from 'react';
import { 
  MissionPhase, 
  RoleId, 
  StudentProgress, 
  AlexaEmotion, 
  TeacherRecord 
} from './types/game';
import { HeaderHUD } from './components/HeaderHUD';
import { AuthScreen } from './components/AuthScreen';
import { CinematicBriefing } from './components/CinematicBriefing';
import { AvatarSelectScreen } from './components/AvatarSelectScreen';
import { Mission1APowersVsSums } from './components/missions/Mission1APowersVsSums';
import { Mission1BBlankMatrix } from './components/missions/Mission1BBlankMatrix';
import { Interlude1Papyrus } from './components/missions/Interlude1Papyrus';
import { Mission2CPolarity } from './components/missions/Mission2CPolarity';
import { Mission3Channels } from './components/missions/Mission3Channels';
import { Interlude2Pyramid } from './components/missions/Interlude2Pyramid';
import { Mission4Simplification } from './components/missions/Mission4Simplification';
import { Mission5Constants } from './components/missions/Mission5Constants';
import { OutcomeScreen } from './components/missions/OutcomeScreen';
import { SecretTetration } from './components/missions/SecretTetration';
import { TeacherPanel } from './components/TeacherPanel';
import { MusicController } from './components/MusicController';
import { storage } from './utils/storage';

export default function App() {
  const [phase, setPhase] = useState<MissionPhase>('AUTH');
  const [previousPhase, setPreviousPhase] = useState<MissionPhase>('AUTH');
  const [progress, setProgress] = useState<StudentProgress | null>(() => storage.getStudentProgress());

  // Derive Alexa Emotion dynamically based on phase
  const getAlexaEmotion = (): AlexaEmotion => {
    switch (phase) {
      case 'AUTH':
      case 'BRIEFING_M0':
      case 'AVATAR_SELECT':
      case 'BRIEFING_M1A':
      case 'MISSION_1A':
      case 'BRIEFING_M1B':
      case 'MISSION_1B':
      case 'BRIEFING_INT1':
      case 'INTERLUDE_1':
        return 'cold';
      case 'BRIEFING_M2C':
      case 'MISSION_2C':
      case 'BRIEFING_M3':
      case 'MISSION_3':
      case 'BRIEFING_INT2':
      case 'INTERLUDE_2':
      case 'BRIEFING_M4':
      case 'MISSION_4':
      case 'SECRET_TETRATION':
        return 'enthusiastic';
      case 'BRIEFING_M5':
      case 'MISSION_5':
        return 'critical';
      case 'OUTCOME': {
        if (!progress) return 'cold';
        const scores = Object.values(progress.missionScores);
        const correct = scores.reduce((a, b) => a + b.correct, 0);
        const total = scores.reduce((a, b) => a + b.total, 0);
        const pct = total > 0 ? (correct / total) * 100 : 0;
        return pct >= 60 ? 'enthusiastic' : 'critical';
      }
      default:
        return 'cold';
    }
  };

  // Sync to teacher records whenever student progress updates
  const syncTeacherRecord = (currentProg: StudentProgress, secretCompleted = false) => {
    const scores = Object.values(currentProg.missionScores);
    const totalCorrect = scores.reduce((a, b) => a + b.correct, 0);
    const totalQuestions = scores.reduce((a, b) => a + b.total, 0);
    const globalPercentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const teacherRec: TeacherRecord = {
      id: `std_${currentProg.name.replace(/\s+/g, '_')}_${currentProg.group.replace(/\s+/g, '_')}`,
      name: currentProg.name,
      group: currentProg.group,
      roleId: currentProg.roleId,
      totalXp: currentProg.totalXp,
      globalPercentage,
      m1Pct: currentProg.missionScores['M1']?.percentage ?? 0,
      m2cPct: currentProg.missionScores['M2C']?.percentage ?? 0,
      m3Pct: currentProg.missionScores['M3']?.percentage ?? 0,
      m4Pct: currentProg.missionScores['M4']?.percentage ?? 0,
      m5Pct: currentProg.missionScores['M5']?.percentage ?? 0,
      secretPhaseCompleted: secretCompleted || currentProg.badges.includes('Héroe/Conquistador del Infinito'),
      date: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
    };

    storage.addTeacherRecord(teacherRec);
  };

  // Handle student authentication
  const handleStudentAuth = (name: string, group: string) => {
    const newProgress: StudentProgress = {
      name,
      group,
      roleId: 'DIGITAL_ARCHAEOLOGIST',
      totalXp: 0,
      serverIntegrity: 100,
      alexaTrust: 25,
      badges: [],
      missionScores: {},
      startedAt: new Date().toISOString()
    };
    setProgress(newProgress);
    storage.saveStudentProgress(newProgress);
    syncTeacherRecord(newProgress);
    setPhase('BRIEFING_M0');
  };

  // Handle teacher login directly
  const handleTeacherAuth = () => {
    setPreviousPhase(phase);
    setPhase('TEACHER_PANEL');
  };

  // Close teacher panel and return cleanly to previous phase or AUTH
  const handleCloseTeacherPanel = () => {
    if (progress && previousPhase && previousPhase !== 'TEACHER_PANEL' && previousPhase !== 'AUTH') {
      setPhase(previousPhase);
    } else {
      setPhase('AUTH');
    }
    setPreviousPhase('AUTH');
  };

  // Handle role selection
  const handleSelectRole = (roleId: RoleId) => {
    if (!progress) return;
    const updated: StudentProgress = {
      ...progress,
      roleId,
      badges: ['Credencial Expedicionaria Activada']
    };
    setProgress(updated);
    storage.saveStudentProgress(updated);
    syncTeacherRecord(updated);
    setPhase('BRIEFING_M1A');
  };

  // Generic mission completion helper
  const handleMissionCompleted = (
    missionId: string, 
    missionName: string, 
    badgeName: string, 
    score: { correct: number; total: number; percentage: number; xp: number },
    nextPhase: MissionPhase
  ) => {
    if (!progress) return;

    const newScores = {
      ...progress.missionScores,
      [missionId]: {
        missionId,
        missionName,
        correct: score.correct,
        total: score.total,
        percentage: score.percentage,
        xpEarned: score.xp
      }
    };

    const newIntegrity = Math.max(
      20, 
      Math.min(100, progress.serverIntegrity - (100 - score.percentage) * 0.25)
    );

    const newBadges = score.percentage >= 60 && !progress.badges.includes(badgeName)
      ? [...progress.badges, badgeName]
      : progress.badges;

    const updated: StudentProgress = {
      ...progress,
      totalXp: progress.totalXp + score.xp,
      serverIntegrity: Math.round(newIntegrity),
      alexaTrust: Math.min(100, progress.alexaTrust + 15),
      badges: newBadges,
      missionScores: newScores
    };

    setProgress(updated);
    storage.saveStudentProgress(updated);
    syncTeacherRecord(updated);
    setPhase(nextPhase);
  };

  // Restart student game
  const handleRestart = () => {
    storage.clearStudentProgress();
    setProgress(null);
    setPhase('AUTH');
  };

  return (
    <div className="min-h-screen bg-[#120E0A] text-[#F1EBD9] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Global Top HUD Bar */}
      <HeaderHUD
        progress={progress}
        currentPhase={phase}
        alexaEmotion={getAlexaEmotion()}
        onOpenTeacherPanel={() => {
          setPreviousPhase(phase);
          setPhase('TEACHER_PANEL');
        }}
        onRestartStudent={handleRestart}
      />

      {/* Main Mission Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Phase: Authentication */}
        {phase === 'AUTH' && (
          <AuthScreen
            onSuccessStudent={handleStudentAuth}
            onSuccessTeacher={handleTeacherAuth}
          />
        )}

        {/* Phase: Briefing Misión 0 */}
        {phase === 'BRIEFING_M0' && progress && (
          <CinematicBriefing
            emotion="cold"
            tag="MISIÓN 0 // IDENTIFICACIÓN ARQUEOLÓGICA"
            title="Bienvenida al Templo de Alejandría"
            subtitle="Contacto con ALEX-A (Unidad de Soporte Arqueo-Digital)"
            dialogue="¡Credencial recibida! Acceso en fase de pruebas... Soy ALEX-A, Unidad de Soporte Arqueo-Digital. Antes de dejaros tocar las terminales de potencias de la Biblioteca, necesito saber a qué área pertenecéis. Elegid vuestro avatar profesional. ¡Vuestra credencial os acompañará en cada diploma que emitamos!"
            buttonLabel="Seleccionar Avatar Profesional"
            onProceed={() => setPhase('AVATAR_SELECT')}
          />
        )}

        {/* Phase: Avatar Select */}
        {phase === 'AVATAR_SELECT' && progress && (
          <AvatarSelectScreen
            studentName={progress.name}
            studentGroup={progress.group}
            onSelectRole={handleSelectRole}
          />
        )}

        {/* Phase: Briefing Misión 1.A */}
        {phase === 'BRIEFING_M1A' && (
          <CinematicBriefing
            emotion="cold"
            tag="MISIÓN 1.A // CÁMARA DEL PAPIRO ANCESTRAL"
            title="El Origen de la Potencia"
            subtitle="Distinción formal entre multiplicación repetida y suma"
            dialogue="No os hagáis ilusiones: el templo sumergido está colapsado. Dudo que un grupo de 2º de ESO pueda procesar esta matriz sin provocar un cortocircuito. Primero demostradme si sabéis distinguir una verdadera potencia de una vulgar suma repetida."
            buttonLabel="Iniciar Prueba 1.A (Potencias vs Sumas)"
            onProceed={() => setPhase('MISSION_1A')}
          />
        )}

        {/* Phase: Misión 1.A */}
        {phase === 'MISSION_1A' && (
          <Mission1APowersVsSums
            onComplete={(score) => 
              handleMissionCompleted('M1A', 'Misión 1.A: Potencias vs Sumas', 'Iniciado/a del Códice', score, 'BRIEFING_M1B')
            }
          />
        )}

        {/* Phase: Briefing Misión 1.B */}
        {phase === 'BRIEFING_M1B' && (
          <CinematicBriefing
            emotion="cold"
            tag="MISIÓN 1.B // LA GRAN ESTELA DE NODOS"
            title="La Tabla en Blanco de Calibración"
            subtitle="Deducción rigurosa de Base, Exponente y Resultado"
            dialogue="Veo que habéis superado la primera criba... pero ahora viene la prueba real. La estela de piedra ha perdido todas sus inscripciones auxiliares. No os daré pistas ni cálculos intermedios: debéis deducir y completar cada celda en blanco de la matriz."
            buttonLabel="Acceder a la Matriz de Nodos en Blanco"
            onProceed={() => setPhase('MISSION_1B')}
          />
        )}

        {/* Phase: Misión 1.B (Blank Matrix) */}
        {phase === 'MISSION_1B' && (
          <Mission1BBlankMatrix
            onComplete={(score) => 
              handleMissionCompleted('M1', 'Misión 1: Matriz de Calibración', 'Calibrador/a de Nodos', score, 'BRIEFING_INT1')
            }
          />
        )}

        {/* Phase: Briefing Interludio 1 */}
        {phase === 'BRIEFING_INT1' && (
          <CinematicBriefing
            emotion="cold"
            tag="INTERLUDIO 1 // TRANSMISIÓN DEL PAPIRO CUÁNTICO"
            title="El Cifrado del Papyrus Variable"
            subtitle="Crecimiento exponencial modelizado por minutos"
            dialogue="Vaya... Habéis calibrado las terminales. No está mal, aunque probablemente haya sido suerte. La transmisión del papiro digital de Alejandría crece a ritmo exponencial con la fórmula 2ⁿ por minuto transcurrido. A ver cómo modeláis este flujo de datos con datos dinámicos..."
            buttonLabel="Entrar al Interludio 1"
            onProceed={() => setPhase('INTERLUDE_1')}
          />
        )}

        {/* Phase: Interlude 1 (Procedural Dynamic 2^k · 2^m) */}
        {phase === 'INTERLUDE_1' && (
          <Interlude1Papyrus
            onComplete={(score) => 
              handleMissionCompleted('INT1', 'Interludio 1: Papyrus Variable', 'Decodificador/a de Transmisiones', score, 'BRIEFING_M2C')
            }
          />
        )}

        {/* Phase: Briefing Misión 2.C */}
        {phase === 'BRIEFING_M2C' && (
          <CinematicBriefing
            emotion="enthusiastic"
            tag="MISIÓN 2.C // CÁMARA DE POLARIDAD"
            title="La Sincronización de Signos Enteros"
            subtitle="Paridad del exponente y distinción de paréntesis"
            dialogue="La Cámara de Polaridad es traicionera. Un simple paréntesis olvidado en una base negativa y la señal se invierte por completo. Admito que no habéis tirado la toalla todavía y eso me resulta... interesante. ¡Sincronicemos los signos sin cálculos mastodónticos!"
            buttonLabel="Entrar a la Cámara de Polaridad"
            onProceed={() => setPhase('MISSION_2C')}
          />
        )}

        {/* Phase: Misión 2.C */}
        {phase === 'MISSION_2C' && (
          <Mission2CPolarity
            onComplete={(score) => 
              handleMissionCompleted('M2C', 'Misión 2.C: Cámara de Polaridad', 'Sincronizador/a de Polaridad', score, 'BRIEFING_M3')
            }
          />
        )}

        {/* Phase: Briefing Misión 3 */}
        {phase === 'BRIEFING_M3' && (
          <CinematicBriefing
            emotion="enthusiastic"
            tag="MISIÓN 3 // FRECUENCIAS PRIMARIAS"
            title="La Sintonización de Canales"
            subtitle="Propiedades operativas y unificación estricta en formato a^k"
            dialogue="¡Ey, buen trabajo en la cámara anterior! Se nota que estáis haciendo un buen equipo con la libreta. Los Canales Primarios exigen condensar las operaciones en una única potencia unificada (a^k). Ojo con los paréntesis en las bases negativas."
            buttonLabel="Acceder a los Canales Primarios"
            onProceed={() => setPhase('MISSION_3')}
          />
        )}

        {/* Phase: Misión 3 */}
        {phase === 'MISSION_3' && (
          <Mission3Channels
            onComplete={(score) => 
              handleMissionCompleted('M3', 'Misión 3: Canales Primarios', 'Sintonizador/a de Canales', score, 'BRIEFING_INT2')
            }
          />
        )}

        {/* Phase: Briefing Interludio 2 */}
        {phase === 'BRIEFING_INT2' && (
          <CinematicBriefing
            emotion="enthusiastic"
            tag="INTERLUDIO 2 // VÓRTICE CENTRAL"
            title="El Enigma de la Pirámide de Datos"
            subtitle="Optimización algorítmica con la ley a⁰ = 1"
            dialogue="¡Buf, qué calor hace cerca de los procesadores centrales! La Pirámide nos pide calcular un bloque masivo: [(7⁴)¹²]⁰ · (-8)⁰. Si intentamos calcular 7⁴⁸ a lo bruto, ¡el servidor va a estallar! ¿Qué estrategia matemática seguimos para optimizarlo?"
            buttonLabel="Enfrentar la Sobrecarga en la Pirámide"
            onProceed={() => setPhase('INTERLUDE_2')}
          />
        )}

        {/* Phase: Interlude 2 */}
        {phase === 'INTERLUDE_2' && (
          <Interlude2Pyramid
            onComplete={(score) => 
              handleMissionCompleted('INT2', 'Interludio 2: Pirámide de Datos', 'Guardián/a de la Pirámide', score, 'BRIEFING_M4')
            }
          />
        )}

        {/* Phase: Briefing Misión 4 */}
        {phase === 'BRIEFING_M4' && (
          <CinematicBriefing
            emotion="enthusiastic"
            tag="MISIÓN 4 // NÚCLEO FRACCIONARIO"
            title="El Núcleo de Simplificación Compleja"
            subtitle="Potencias de potencias y reducción paso a paso"
            dialogue="¡Menudo nivelazo estáis demostrando, equipo! Llegamos al Núcleo Complejo, donde las fracciones kilométricas dominan las pantallas. Reducid cada terminal a una sola potencia unificada (a^k). Si cometéis un fallo, os lanzaré una pista flotante al instante. ¡Somos imparables!"
            buttonLabel="Entrar al Núcleo Complejo"
            onProceed={() => setPhase('MISSION_4')}
          />
        )}

        {/* Phase: Misión 4 */}
        {phase === 'MISSION_4' && (
          <Mission4Simplification
            onComplete={(score) => 
              handleMissionCompleted('M4', 'Misión 4: Núcleo de Simplificación', 'Arquitecto/a de Simplificación', score, 'BRIEFING_M5')
            }
          />
        )}

        {/* Phase: Briefing Misión 5 (Dramatic Climax) */}
        {phase === 'BRIEFING_M5' && (
          <CinematicBriefing
            emotion="critical"
            tag="MISIÓN 5 // CLÍMAX DRAMÁTICO"
            title="Alerta Crítica: El Sacrificio de ALEX-A"
            subtitle="Desintegración del cortafuegos y absorción de fallos"
            dialogue="¡Escúchame bien, equipo...! No me queda mucho tiempo... 🥺 Durante toda esta aventura, mientras vosotros resolvíais los enigmas, el cortafuegos principal se estaba desintegrando. Para proteger vuestros avances, he tenido que absorber los errores dentro de mi propia memoria... Mis núcleos se están apagando... 💔 Esta es la Gran Consola de las Constantes Perdidas. Tenéis que averiguar los valores de x y resolver los exponentes negativos. Si fallamos aquí, yo desapareceré del todo para siempre. ¡Confío en vosotros!"
            buttonLabel="¡RESTAURAR CONSTANTES Y SALVAR A ALEX-A!"
            isGlitching={true}
            onProceed={() => setPhase('MISSION_5')}
          />
        )}

        {/* Phase: Misión 5 */}
        {phase === 'MISSION_5' && (
          <Mission5Constants
            onComplete={(score) => 
              handleMissionCompleted('M5', 'Misión 5: Constantes Perdidas', 'Salvador/a de la Memoria', score, 'OUTCOME')
            }
          />
        )}

        {/* Phase: Outcome Screen */}
        {phase === 'OUTCOME' && progress && (
          <OutcomeScreen
            progress={progress}
            onEnterSecretPhase={() => setPhase('SECRET_TETRATION')}
            onRestart={handleRestart}
          />
        )}

        {/* Phase: Secret Tetration */}
        {phase === 'SECRET_TETRATION' && progress && (
          <SecretTetration
            progress={progress}
            onVictory={() => {
              if (!progress) return;
              const updated = {
                ...progress,
                totalXp: progress.totalXp + 1000,
                badges: [...progress.badges, 'Héroe/Conquistador del Infinito']
              };
              setProgress(updated);
              storage.saveStudentProgress(updated);
              syncTeacherRecord(updated, true);
            }}
          />
        )}

        {/* Phase: Teacher Panel */}
        {phase === 'TEACHER_PANEL' && (
          <TeacherPanel
            onClose={handleCloseTeacherPanel}
          />
        )}
      </main>

      {/* Floating Ambient Music Controller */}
      <MusicController />

      {/* Discreet Footer with Ancient Egyptian Tone */}
      <footer className="border-t border-[#D4AF37]/20 py-4 px-6 text-center text-xs text-slate-400 bg-[#16100B]/90">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>El Códice de Alejandría · Educación Secundaria Obligatoria</span>
          <div className="flex items-center gap-4">
            <span>Potencias en enteros (ℤ)</span>
            <span>·</span>
            <span>Unidad Arqueo-Digital ALEX-A</span>
            <span>·</span>
            <span className="text-[#D4AF37]">Castilla-La Mancha</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
