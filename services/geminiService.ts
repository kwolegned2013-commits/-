
import { GoogleGenAI } from "@google/genai";

/**
 * 오늘의 성경 구절을 바탕으로 청소년용 묵상 내용을 생성합니다.
 */
export const generateQTReflection = async (verse: string, reference: string) => {
  try {
    // 가이드에 따라 호출 시점에 인스턴스를 생성하여 환경 변수 누락으로 인한 초기 로딩 중단을 방지합니다.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `다음 성경 구절을 바탕으로 청소년들이 공감할 수 있는 묵상 글을 작성해줘.\n구절: ${verse} (${reference})\n구성:\n1. 오늘의 묵상 (3-4문장)\n2. 삶에 적용하기 (1문장)\n3. 오늘의 기도 (1문장)`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini QT Generation Error:", error);
    return "묵상 내용을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
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
      contents: `당신은 친절하고 지혜로운 교회 선생님입니다. 청소년의 눈높이에서 다음 질문에 대해 성경적이고 따뜻하게 답해주세요: ${question}`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 1000,
        thinkingConfig: { thinkingBudget: 4000 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Bible Help Error:", error);
    return "죄송해요, 답변을 준비하는 중에 문제가 생겼어요. 나중에 다시 물어봐 줄래?";
  }
};
