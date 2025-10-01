import { GoogleGenAI } from '@google/genai'

/**
 * Gemini AI 클라이언트 생성
 * 서버 사이드에서만 사용 가능
 */
export function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.')
  }

  return new GoogleGenAI({ apiKey })
}

/**
 * RAG 컨텍스트와 함께 질문에 답변 생성
 * 
 * @param question 사용자 질문
 * @param context Pinecone에서 검색한 관련 컨텍스트
 * @returns AI 생성 답변
 */
export async function generateAnswer(
  question: string,
  context: string
): Promise<string> {
  const ai = createGeminiClient()

  const prompt = `당신은 키위마켓 고객 지원 AI 챗봇입니다.
사용자의 질문에 친절하고 정확하게 답변해주세요.

[참고 정보]
${context}

[사용자 질문]
${question}

[답변 지침]
1. 참고 정보를 바탕으로 정확하게 답변하세요
2. 참고 정보에 없는 내용은 추측하지 말고 "확인이 필요합니다"라고 답변하세요
3. 친절하고 이해하기 쉽게 설명하세요
4. 답변은 한국어로 작성하세요
5. 필요시 단계별로 설명하세요

답변:`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        maxOutputTokens: 500,
        temperature: 0.3, // 일관성 있는 답변을 위해 낮게 설정
      },
    })

    return response.text || '답변을 생성할 수 없습니다.'
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('AI 답변 생성에 실패했습니다.')
  }
}

/**
 * 스트리밍 방식으로 답변 생성
 * 
 * @param question 사용자 질문
 * @param context Pinecone에서 검색한 관련 컨텍스트
 * @returns AsyncIterable<string> 스트림
 */
export async function* generateAnswerStream(
  question: string,
  context: string
): AsyncIterable<string> {
  const ai = createGeminiClient()

  const prompt = `당신은 키위마켓 고객 지원 AI 챗봇입니다.
사용자의 질문에 친절하고 정확하게 답변해주세요.

[참고 정보]
${context}

[사용자 질문]
${question}

[답변 지침]
1. 참고 정보를 바탕으로 정확하게 답변하세요
2. 참고 정보에 없는 내용은 추측하지 말고 "확인이 필요합니다"라고 답변하세요
3. 친절하고 이해하기 쉽게 설명하세요
4. 답변은 한국어로 작성하세요
5. 필요시 단계별로 설명하세요

답변:`

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        maxOutputTokens: 500,
        temperature: 0.3,
      },
    })

    for await (const chunk of response) {
      if (chunk.text) {
        yield chunk.text
      }
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error('AI 답변 생성에 실패했습니다.')
  }
}

