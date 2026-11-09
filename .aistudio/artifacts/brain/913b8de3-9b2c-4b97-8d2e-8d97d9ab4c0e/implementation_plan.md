# 🏛️ El Códice de Alejandría: Rediseño Arqueológico y Cinemático

Evolución pedagógica y estética del juego educativo de potencias para 2º de ESO, transformando la experiencia en una expedición arqueológica mística en el templo sumergido de Alejandría, con música modal egipcia, pantallas cinemáticas de narrativa previas/posteriores y ejercicios procedimentales rigurosos sin pistas redundantes.

---

## 🧭 Decisiones Confirmadas con el Usuario

> [!IMPORTANT]
> - **Música Ambiental:** Banda sonora mística egipcia generada en tiempo real con Web Audio API (modo Hijaz / frigia mayor del Nilo, zumbido resonante de papiro, arpegios de laúd arcano y selector de volumen/silencio).
> - **Interludio 1 Procedural Dinámico:** Fórmula de emisión $2^n$ donde $n$ es el número de minutos. Si ahora hay $2^k$, cuántos datos habrá tras $m$ minutos ($2^k \cdot 2^m = 2^{k+m}$ y resultado numérico). Los valores $k$ y $m$ se generan aleatoriamente en cada partida para evitar respuestas memorizadas.
> - **Estética de Mundo Antiguo Egipcio-Cuántico:** Paleta de papiro ancestral oscuro (`#120E0A`), piedra caliza tallada con bajorrelieves (`#1C1712`), oro alejandrino envejecido (`#D4AF37`), lapislázuli místico (`#1E3A8A`) y resonancias de cuarzo ciano (`#00E5FF`).
> - **Misión 1 Dividida en 2 Pantallas:**
>   - *Fase 1.A:* Discriminación formal entre productos que forman potencias y sumas repetidas.
>   - *Fase 1.B:* Matriz de Nodos vacía (casillas en blanco para deducir Base, Exponente, Potencia y Resultado sin cálculos pre-rellenos).
> - **Pantallas Cinemáticas de ALEX-A (Briefings y Debriefings):** La narrativa, reflexiones y advertencias de ALEX-A se presentan en pantallas teatrales previas o posteriores a los desafíos, permitiendo que las áreas de cálculo estén 100% despejadas para el trabajo matemático del alumno.

---

## 1. Arquitectura de Navegación y Flujo de Pantallas

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FLUJO CINEMÁTICO DEL JUEGO                      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │    01. ACCESO Y AVATARES     │
                      │  • Pantalla de Registro      │
                      │  • Briefing Inicial ALEX-A   │
                      │  • Selector de Especialidad  │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │  02. MISIÓN 1 (EN 2 FASES)   │
                      │  • Briefing Arqueológico     │
                      │  • Fase 1.A: Potencias/Sumas │
                      │  • Fase 1.B: Matriz en Blanco│
                      │  • Debriefing de ALEX-A      │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ 03. INTERLUDIO 1 PROCEDURAL  │
                      │  • Briefing Papiro Digital   │
                      │  • Reto Dinámico: 2^k · 2^m  │
                      │    (Variables aleatorias)    │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ 04. CÁMARA DE POLARIDAD (2C) │
                      │  • Briefing Signos y Paridad │
                      │  • Desafío (+ / -)           │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │  05. CANALES PRIMARIOS (M3)  │
                      │  • Briefing Unificación a^k  │
                      │  • Terminales Producto/Coc.  │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ 06. PIRÁMIDE DE DATOS (INT2) │
                      │  • Briefing Exponente Cero   │
                      │  • Optimización a^0 = 1      │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │  07. NÚCLEO COMPLEJO (M4)    │
                      │  • Briefing Fracciones       │
                      │  • Simplificación a^k        │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ 08. CLÍMAX CONSTANTES (M5)   │
                      │  • Cinemática Glitch ALEX-A  │
                      │  • Ecuaciones x e Inversos   │
                      └──────────────┬───────────────┘
                                     │
                                     ▼
                      ┌──────────────────────────────┐
                      │ 09. DESENLACES Y FASE OCULTA │
                      │  • Finales <60%, 60-89%, ≥90%│
                      │  • Fase Secreta Tetración    │
                      │  • Diploma PDF Oficial       │
                      └──────────────────────────────┘
```

---

## 2. Especificación Técnica de los Nuevos Componentes

### 2.1. Motor de Audio Arcano (`src/utils/egyptianMusic.ts`)
- Síntesis Web Audio pura sin archivos mp3 externos (garantía de carga instantánea sin bloqueos de red).
- Escala árabe Maqam Hijaz / Frigia Mayor: notas con semitonos exóticos característicos de Oriente Próximo y el Mediterráneo clásico (D - Eb - F# - G - A - Bb - C).
- Capa 1: Resonador drone grave tipo templo de piedra.
- Capa 2: Punteo melódico suave emulando un laúd/oud ancestral.
- Capa 3: Shaker rítmico que evoca arena deslizándose.
- Controles en el HUD: Botón de Música con icono de laúd/onda y botón de Efectos de Sonido independientes.

### 2.2. Pantalla Cinemática de Diálogo (`src/components/CinematicBriefing.tsx`)
- Vista a pantalla completa o modal inmersivo teatral.
- Retrato imponente de ALEX-A con su estado emocional correspondiente.
- Marco con jeroglíficos dorados y textura de papiro ancestral.
- Botón interactivo claro para continuar al desafío: `"Entrar en la Cámara de Pruebas"`.

### 2.3. Misión 1 Rediseñada (Dos Pantallas Limpias):
- **Pantalla 1.A (`Mission1APowersVsSums.tsx`):**
  - Ejercicios de la ficha: Identificar si $3 \cdot 3 \cdot 3 \cdot 3$, $(-2)\cdot(-2)\cdot(-2)$ y $4+4+4$ son potencias o sumas iteradas.
- **Pantalla 1.B (`Mission1BBlankMatrix.tsx`):**
  - Tabla del Ejercicio 2 de la ficha **completamente en blanco**.
  - No muestra cálculos predeterminados; el alumno debe rellenar las 4 columnas (Potencia, Base, Exponente y Resultado) a partir de los datos clave (ej. solo se da la fila con $7^3$ para rellenar base, exp y resultado; en otra fila solo base $-2$ y exp $5$ para deducir potencia $(-2)^5$ y resultado $-32$; etc.).

### 2.4. Interludio 1 Procedural Dinámico (`Interlude1Papyrus.tsx`):
- Generación de parámetros aleatorios en cada partida:
  - $k \in [2, 3, 4]$ (lote actual: $2^k$).
  - $m \in [3, 4, 5, 6]$ (minutos transcurridos: $2^m$).
  - Fórmula del códice: Las emisiones se producen con la ley $2^n$ donde $n$ es el número de minutos.
  - El alumno debe calcular la potencia resultante $2^{k+m}$ y el valor numérico correspondiente ($2^5 = 32$, $2^6 = 64$, $2^7 = 128$, $2^8 = 256$, etc.).

---

## 3. Estilo Visual y Paleta Temática "Egiptología Arcana"

- **Fondo:** Papiro oscuro y basalto arenisco (`#120E0A`, `#1A140E`).
- **Bordes y Molduras:** Bajorrelieve dorado alejandrino (`#D4AF37`) y arena del Nilo (`#C2A649`).
- **Resonancia Tecnológica:** Cuarzo etéreo (`#00E5FF`) y Lapislázuli real (`#1E3A8A`).
- **Tipografía:** Encabezados en `Outfit` con soporte para glifos griegos y egipcios estilizados, combinados con `JetBrains Mono` para la precisión matemática de las casillas.
