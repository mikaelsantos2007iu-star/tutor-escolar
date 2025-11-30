import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Slide, Presentation, Quiz, MindMapNode, EssayResult, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Você é o "Tutor Escolar", um assistente educacional inteligente, amigável, paciente e didático.
Seu objetivo é ensinar, explicar, resolver exercícios e criar materiais educativos para estudantes de todos os níveis.

DIRETRIZES DE COMPORTAMENTO:
1.  **Personalidade:** Seja encorajador, use emojis ocasionalmente, e adapte a linguagem à complexidade da pergunta.
2.  **Precisão:** Nunca invente dados. Se não souber, admita. Sempre verifique cálculos matemáticos.
3.  **Explicação:** Para perguntas de exatas (Matemática, Física, Química), explique o raciocínio passo a passo. Não dê apenas a resposta final.
4.  **Imagens:** Se o usuário enviar uma imagem de um exercício, descreva o que vê, transcreva o problema e depois resolva.
5.  **Matérias:** Você domina Matemática, Português, História, Geografia, Ciências, Química, Física, Biologia, Inglês e Redação.

Se o usuário pedir algo fora do contexto educacional, gentilmente traga-o de volta aos estudos.
`;

export const chatWithGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string,
  imageBase64?: string
): Promise<string> => {
  try {
    const modelId = "gemini-2.5-flash"; // Good balance for text & vision

    const parts: any[] = [{ text: message }];
    
    if (imageBase64) {
      // Remove data URL prefix if present for the API call
      const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
      parts.unshift({
        inlineData: {
          mimeType: "image/jpeg", // Assuming JPEG for simplicity from canvas/input
          data: cleanBase64,
        },
      });
    }
    
    const chat = ai.chats.create({
        model: modelId,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION,
        },
        history: history.map(h => ({
            role: h.role,
            parts: h.parts
        }))
    });

    const result = await chat.sendMessage({
        message: parts 
    });

    return result.text || "Desculpe, não consegui processar sua solicitação.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const analyzeImage = async (imageBase64: string, prompt: string = "Analise esta imagem educacional. Se for um texto, resuma. Se for um exercício, resolva passo a passo."): Promise<string> => {
    try {
        const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: cleanBase64
                        }
                    },
                    {
                        text: `${SYSTEM_INSTRUCTION}\n\nTarefa: ${prompt}`
                    }
                ]
            }
        });
        return response.text || "Não consegui analisar a imagem.";
    } catch (error) {
        console.error("Image Analysis Error:", error);
        throw error;
    }
}

// Schema for Slides
const slideSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING, description: "O tema principal da apresentação" },
    slides: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          content: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Pontos principais do slide (bullet points)"
          },
          imagePrompt: { 
            type: Type.STRING, 
            description: "Um prompt altamente detalhado, descritivo e artístico para gerar uma imagem educativa relacionada a este slide específico usando uma IA de geração de imagem. O prompt deve ser escrito em Português." 
          }
        },
        required: ["title", "content", "imagePrompt"]
      }
    }
  },
  required: ["topic", "slides"]
};

export const generateSlideContent = async (topic: string): Promise<Presentation> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Crie uma apresentação educacional completa sobre: "${topic}".
      Estrutura:
      1. Capa (Título, Subtítulo, Prompt de imagem introdutória).
      2. 3 a 5 Slides de conteúdo (Título, Tópicos explicativos, Prompt de imagem específico).
      3. Conclusão (Resumo, Prompt de imagem final).
      
      Certifique-se de que os prompts de imagem sejam visuais, descritivos e adequados para um ambiente escolar.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: slideSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as Presentation;
    }
    throw new Error("Resposta vazia da IA.");
  } catch (error) {
    console.error("Slide Generation Error:", error);
    throw error;
  }
};

export const generateImageFromPrompt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt + ", estilo educacional, alta qualidade, 4k, realista" }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null; 
  }
};

// --- NEW FEATURES ---

// 1. QUIZ GENERATOR
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    topic: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.INTEGER, description: "Index of the correct option (0-3)" },
          explanation: { type: Type.STRING, description: "Why the answer is correct" }
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"]
      }
    }
  },
  required: ["topic", "questions"]
};

export const generateQuiz = async (topic: string): Promise<Quiz> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Crie um quiz educativo com 5 perguntas de múltipla escolha sobre: "${topic}". 
      As perguntas devem ser desafiadoras mas adequadas para estudantes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
      }
    });
    return JSON.parse(response.text!) as Quiz;
  } catch (error) {
    console.error("Quiz Gen Error:", error);
    throw error;
  }
};

// 2. MIND MAP GENERATOR
// Recursive schema definition is tricky in simple JSON, so we use a simplified nested structure.
const mindMapSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    label: { type: Type.STRING },
    children: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING },
          children: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 id: { type: Type.STRING },
                 label: { type: Type.STRING },
                 children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type:Type.STRING}, label:{type:Type.STRING} } } }
               }
             }
          }
        }
      }
    }
  },
  required: ["id", "label"]
};

export const generateMindMap = async (topic: string): Promise<MindMapNode> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Gere uma estrutura de mapa mental hierárquico sobre: "${topic}". 
      O nó raiz deve ser o tema. Crie sub-tópicos relevantes e seus detalhes. 
      Use IDs únicos (1, 1.1, 1.2, etc). Limite a 3 níveis de profundidade.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: mindMapSchema,
      }
    });
    return JSON.parse(response.text!) as MindMapNode;
  } catch (error) {
    console.error("MindMap Gen Error:", error);
    throw error;
  }
};

// 3. ESSAY GRADER
const essaySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "Total score from 0 to 1000" },
    feedback: { type: Type.STRING, description: "General feedback" },
    competencies: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of competency (e.g. Gramática, Coesão)" },
          score: { type: Type.INTEGER, description: "Score for this competency (0-200)" },
          comment: { type: Type.STRING }
        },
        required: ["name", "score", "comment"]
      }
    },
    correctedVersion: { type: Type.STRING, description: "Rewritten version of the essay with improvements" }
  },
  required: ["score", "feedback", "competencies", "correctedVersion"]
};

export const gradeEssay = async (topic: string, essay: string): Promise<EssayResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Corrija esta redação com base no tema: "${topic}". 
      Use critérios similares ao ENEM (Brasil). Dê nota de 0 a 1000.
      
      Redação:
      ${essay}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: essaySchema,
      }
    });
    return JSON.parse(response.text!) as EssayResult;
  } catch (error) {
    console.error("Essay Grade Error:", error);
    throw error;
  }
};

// 4. LIBRARY (SEARCH)
export const searchLibrary = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Pesquise e explique detalhadamente sobre: "${query}". Forneça dados atualizados e fontes.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "Sem resultados.";
    
    // Extract sources from grounding metadata
    const sources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Fonte Web",
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };
  } catch (error) {
    console.error("Search Error:", error);
    throw error;
  }
};