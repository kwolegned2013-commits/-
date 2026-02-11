
import { GoogleGenAI } from "@google/genai";

/**
 * 오늘의 성경 구절을 바탕으로 청소년용 묵상 내용을 생성합니다.
 */
export const generateQTReflection = async (verse: string, reference: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 청소년 사역 전문가이자 따뜻한 교회 선생님입니다. 다음 성경 구절을 바탕으로 중고등학생들이 가슴 깊이 공감할 수 있는 묵상 글을 작성해주세요.\n구절: ${verse} (${reference})\n\n구성 가이드:\n1. 오늘의 묵상: 청소년의 일상(학교, 친구, 학업, 꿈)과 연결하여 3-4문장으로 따뜻하게 설명해줘.\n2. 삶에 적용하기: 오늘 하루 바로 실천해볼 수 있는 구체적인 행동 1가지를 제안해줘.\n3. 오늘의 기도: 짧지만 진심 어린 기도로 마무리해줘.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini QT Generation Error:", error);
    throw error;
  }
};

/**
 * 성경과 관련된 복잡한 질문에 대해 답변을 생성합니다.
 */
export const getBibleHelp = async (question: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `당신은 'WE Youth'의 AI 성경 멘토입니다. 청소년들이 신앙, 성경, 일상적인 고민에 대해 물어볼 때 친절하고 지혜롭게 답해주세요.\n\n규칙:\n1. '반가워!', '그랬구나'와 같은 친근한 어투를 사용해.\n2. 너무 딱딱한 신학 용어보다는 쉬운 단어로 설명해줘.\n3. 답변 끝에는 항상 응원의 메시지를 한 줄 덧붙여줘.\n4. 질문이 모호하면 성경적인 관점에서 생각할 거리를 던져줘.\n\n질문: ${question}`,
      config: {
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 16000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Bible Help Error:", error);
    throw error;
  }
};
