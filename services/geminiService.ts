
import { GoogleGenAI, Type } from "@google/genai";

interface ParsedAppointment {
    title: string | null;
    date: string | null; // YYYY-MM-DD
    time: string | null; // HH:MM
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const parseAppointmentFromText = async (text: string): Promise<ParsedAppointment | null> => {
    const prompt = `
    Analyze the following text and extract the appointment details.
    Today's date is ${new Date().toISOString().split('T')[0]}.
    The current year is ${new Date().getFullYear()}.
    
    Text: "${text}"

    Return a JSON object with the following fields:
    - "title": The subject of the appointment.
    - "date": The date in "YYYY-MM-DD" format.
    - "time": The time in 24-hour "HH:MM" format.

    If any field cannot be determined, its value should be null.
    For example, 'tomorrow' should be resolved to the correct date. 'Evening' can be interpreted as '19:00'.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: {
                            type: Type.STRING,
                            description: "The title or subject of the appointment.",
                        },
                        date: {
                            type: Type.STRING,
                            description: "The date of the appointment in YYYY-MM-DD format.",
                        },
                        time: {
                            type: Type.STRING,
                            description: "The time of the appointment in 24-hour HH:MM format.",
                        },
                    },
                    required: ["title", "date", "time"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);
        
        // Basic validation
        if (typeof parsedJson.title === 'string' &&
            (parsedJson.date === null || (typeof parsedJson.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(parsedJson.date))) &&
            (parsedJson.time === null || (typeof parsedJson.time === 'string' && /^\d{2}:\d{2}$/.test(parsedJson.time)))) {
            return parsedJson as ParsedAppointment;
        }

        console.warn("Parsed JSON does not match expected format:", parsedJson);
        return null;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to parse appointment details from text.");
    }
};
