import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateWorkoutRoutine = async (userData: UserData): Promise<string> => {
  const ai = getClient();
  
  // Construct a prompt based on collected data
  const prompt = `
    Por favor crea una rutina de calistenia personalizada para el siguiente perfil:

    - **Datos Básicos:** ${userData.basics}
    - **Condición Actual:** ${userData.current_condition}
    - **Objetivos:** ${userData.goals}
    - **Disponibilidad:** ${userData.availability}
    - **Limitaciones/Lesiones:** ${userData.limitations}
    - **Equipo Disponible:** ${userData.equipment}
    - **Preferencias de Contacto:** ${userData.whatsapp_contact}

    Genera la respuesta completa en formato texto para WhatsApp (usando *negritas*, emojis, etc.).
    No incluyas saludos genéricos como "Claro, aquí tienes la rutina", empieza directamente con el saludo motivador personalizado para el cliente.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Creativity balance
      }
    });

    return response.text || "Lo siento, hubo un error al generar la rutina. Por favor intenta de nuevo.";
  } catch (error) {
    console.error("Error generating routine:", error);
    return "Ocurrió un error de conexión con el entrenador AI. Verifica tu clave API o intenta más tarde.";
  }
};
