'use server'

import { getKiwiRagIndex } from '@/lib/pinecone/client'
import { generateQueryEmbedding } from '@/lib/pinecone/embedding'
import { generateAnswer } from '@/lib/gemini/client'

export interface SearchResult {
  id: string
  question?: string
  answer?: string
  content?: string
  score: number
}

export interface SupportResponse {
  success: boolean
  answer?: string
  sources?: SearchResult[]
  error?: string
}

/**
 * 사용자 질문에 대한 RAG 기반 답변 생성
 * 
 * 1. 질문을 임베딩으로 변환
 * 2. Pinecone에서 유사한 QnA 검색
 * 3. 검색 결과를 컨텍스트로 Gemini AI에 전달
 * 4. AI 답변 반환
 * 
 * @param question 사용자 질문
 * @param topK 검색할 최대 결과 수 (기본값: 5)
 * @returns SupportResponse 답변 및 출처 정보
 */
export async function askQuestion(
  question: string,
  topK: number = 5
): Promise<SupportResponse> {
  try {
    // 입력 검증
    if (!question || question.trim().length === 0) {
      return {
        success: false,
        error: '질문을 입력해주세요.',
      }
    }

    if (question.length > 500) {
      return {
        success: false,
        error: '질문이 너무 깁니다. 500자 이내로 입력해주세요.',
      }
    }

    // 1. 질문을 임베딩으로 변환
    const queryEmbedding = await generateQueryEmbedding(question)

    // 2. Pinecone에서 유사한 QnA 검색
    const index = await getKiwiRagIndex()
    const searchResults = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    })

    // 검색 결과가 없는 경우
    if (!searchResults.matches || searchResults.matches.length === 0) {
      return {
        success: true,
        answer: '죄송합니다. 해당 질문에 대한 정보를 찾을 수 없습니다. 다른 질문을 시도하거나 고객센터로 직접 문의해주세요.',
        sources: [],
      }
    }

    // 3. 검색 결과를 컨텍스트로 변환
    const sources: SearchResult[] = searchResults.matches.map((match) => ({
      id: match.id,
      question: (match.metadata?.question as string) || undefined,
      answer: (match.metadata?.answer as string) || undefined,
      content: (match.metadata?.content as string) || undefined,
      score: match.score || 0,
    }))

    // 컨텍스트 구성
    const context = sources
      .map((source, idx) => {
        if (source.question && source.answer) {
          return `[${idx + 1}] Q: ${source.question}\nA: ${source.answer}`
        } else if (source.content) {
          return `[${idx + 1}] ${source.content}`
        }
        return ''
      })
      .filter((text) => text.length > 0)
      .join('\n\n')

    // 4. Gemini AI로 답변 생성
    const answer = await generateAnswer(question, context)

    return {
      success: true,
      answer,
      sources,
    }
  } catch (error) {
    console.error('Error answering question:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '답변 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }
  }
}

/**
 * 관련 QnA 목록만 검색 (AI 답변 없이)
 * 
 * @param question 사용자 질문
 * @param topK 검색할 최대 결과 수 (기본값: 10)
 * @returns SearchResult[] 검색 결과
 */
export async function searchKnowledgeBase(
  question: string,
  topK: number = 10
): Promise<{ success: boolean; results?: SearchResult[]; error?: string }> {
  try {
    if (!question || question.trim().length === 0) {
      return {
        success: false,
        error: '검색어를 입력해주세요.',
      }
    }

    const queryEmbedding = await generateQueryEmbedding(question)
    const index = await getKiwiRagIndex()

    const searchResults = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    })

    const results: SearchResult[] = searchResults.matches.map((match) => ({
      id: match.id,
      question: (match.metadata?.question as string) || undefined,
      answer: (match.metadata?.answer as string) || undefined,
      content: (match.metadata?.content as string) || undefined,
      score: match.score || 0,
    }))

    return {
      success: true,
      results,
    }
  } catch (error) {
    console.error('Error searching knowledge base:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '검색 중 오류가 발생했습니다.',
    }
  }
}

