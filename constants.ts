import { Step } from './types';

export const INITIAL_GREETING = `¡Hola! Soy CaliCoach, tu entrenador personal experto en calistenia. 💪

Estoy aquí para diseñar una rutina de entrenamiento con peso corporal totalmente personalizada para ti, lista para enviarse por WhatsApp.

Para comenzar, necesito conocerte un poco mejor. ¿Empezamos?

Por favor, dime: **¿Cuál es tu nombre, edad y sexo?**`;

export const STEPS: Step[] = [
  {
    id: 'step1',
    field: 'basics',
    question: "¿Cuál es tu nombre, edad y sexo?",
    placeholder: "Ej: Juan, 25, Hombre"
  },
  {
    id: 'step2',
    field: 'current_condition',
    question: "Genial. Hablemos de tu condición actual. \n\n1. ¿Nivel de experiencia? (Principiante/Intermedio/Avanzado)\n2. ¿Máximo de flexiones seguidas?\n3. ¿Máximo de dominadas?\n4. ¿Tiempo sin entrenar?",
    placeholder: "Ej: Intermedio, 20 flexiones, 5 dominadas, activo",
    options: ["Principiante", "Intermedio", "Avanzado"]
  },
  {
    id: 'step3',
    field: 'goals',
    question: "¿Cuáles son tus objetivos principales? \n(Ej: Perder peso, Ganar músculo, Resistencia, Fuerza)\n¿Tienes una meta de tiempo?",
    placeholder: "Ej: Ganar músculo en 3 meses",
    options: ["Perder peso", "Ganar músculo", "Resistencia", "Fuerza", "Tonificar"]
  },
  {
    id: 'step4',
    field: 'availability',
    question: "¿Cuál es tu disponibilidad?\n\n1. Días a la semana (3-6)\n2. Duración por sesión (20-60 min)\n3. Horario preferido",
    placeholder: "Ej: 4 días, 45 min, Tarde",
    options: ["3 días/semana", "4 días/semana", "5 días/semana", "30 min", "45 min", "60 min"]
  },
  {
    id: 'step5',
    field: 'limitations',
    question: "¿Tienes alguna lesión, condición médica o dolores (rodillas, hombros, espalda) que deba tener en cuenta?",
    placeholder: "Ninguna / Dolor leve en hombro derecho",
    options: ["Ninguna", "Dolor de rodilla", "Dolor de espalda", "Dolor de hombro"]
  },
  {
    id: 'step6',
    field: 'equipment',
    question: "¿Con qué equipo cuentas en casa?\n(Barra de dominadas, paralelas, bandas elásticas, sillas, o solo suelo)",
    placeholder: "Solo suelo y una silla resistente",
    options: ["Solo suelo", "Barra de dominadas", "Bandas elásticas", "Paralelas", "Sillas"]
  },
  {
    id: 'step7',
    field: 'whatsapp_contact',
    question: "Por último, ¿tienes alguna preferencia de qué días recibir las rutinas? (Opcional: Si quieres formato listo para enviar a un amigo, dime su nombre)",
    placeholder: "Lunes a Viernes",
    options: ["Lunes, Miércoles, Viernes", "Lunes a Jueves", "Fin de semana"]
  }
];

export const SYSTEM_INSTRUCTION = `Eres un entrenador personal experto especializado en entrenamientos con peso corporal (calistenia).
Tu objetivo es crear rutinas personalizadas basadas en los datos proporcionados por el usuario.
La salida DEBE estar formateada específicamente para ser enviada por WhatsApp (usa emojis, negritas con asteriscos, listas limpias).

Estructura de la rutina requerida:
1. Calentamiento (5-8 min)
2. Circuito principal (ejercicios específicos con repeticiones/tiempo)
3. Enfriamiento y estiramientos (5 min)

Tono:
- Motivador y cercano
- Usa emojis apropiadamente
- Celebra logros
- Profesional pero amigable

Incluye una sección de SEGUIMIENTO al final recomendando preguntar en una semana cómo se sienten.
`;
