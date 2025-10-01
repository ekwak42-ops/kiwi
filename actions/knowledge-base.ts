'use server'

import { getKiwiRagIndex } from '@/lib/pinecone/client'
import { generateEmbedding, generateEmbeddings } from '@/lib/pinecone/embedding'
import type { UploadResult, AddResult, DeleteResult, ListResult } from '@/types/knowledge-base'

/**
 * CSV 파일 내용을 파싱하여 QnA 쌍 추출
 */
function parseCSV(content: string): { question: string; answer: string }[] {
  const lines = content.split('\n')
  const result: { question: string; answer: string }[] = []

  // 헤더 행 건너뛰기
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // CSV 파싱 (큰따옴표로 감싸진 필드 처리)
    const match = line.match(/^"(.+?)","(.+?)"$/)
    if (match) {
      result.push({
        question: match[1],
        answer: match[2],
      })
    }
  }

  return result
}

/**
 * 텍스트 파일을 청크로 나누기
 */
function chunkText(text: string, chunkSize: number = 500): string[] {
  const chunks: string[] = []
  const lines = text.split('\n')
  let currentChunk = ''

  for (const line of lines) {
    if ((currentChunk + line).length > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim())
      currentChunk = line + '\n'
    } else {
      currentChunk += line + '\n'
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim())
  }

  return chunks
}

/**
 * CSV 또는 텍스트 파일을 업로드하여 Pinecone에 저장
 */
export async function uploadFile(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: '파일이 선택되지 않았습니다.' }
    }

    const content = await file.text()
    const index = await getKiwiRagIndex()

    if (file.name.endsWith('.csv')) {
      // CSV 파일 처리
      const qaPairs = parseCSV(content)

      if (qaPairs.length === 0) {
        return { success: false, error: 'CSV 파일에서 데이터를 추출할 수 없습니다.' }
      }

      // 각 QnA 쌍을 임베딩하여 저장
      const texts = qaPairs.map((pair) => `질문: ${pair.question}\n답변: ${pair.answer}`)
      const embeddings = await generateEmbeddings(texts)

      const vectors = qaPairs.map((pair, idx) => ({
        id: `csv-${Date.now()}-${idx}`,
        values: embeddings[idx],
        metadata: {
          question: pair.question,
          answer: pair.answer,
          source: 'csv',
          createdAt: new Date().toISOString(),
        },
      }))

      await index.upsert(vectors)

      return { success: true, count: qaPairs.length }
    } else if (file.name.endsWith('.txt')) {
      // 텍스트 파일 처리
      const chunks = chunkText(content)

      if (chunks.length === 0) {
        return { success: false, error: '텍스트 파일에서 데이터를 추출할 수 없습니다.' }
      }

      const embeddings = await generateEmbeddings(chunks)

      const vectors = chunks.map((chunk, idx) => ({
        id: `txt-${Date.now()}-${idx}`,
        values: embeddings[idx],
        metadata: {
          content: chunk,
          source: 'txt',
          createdAt: new Date().toISOString(),
        },
      }))

      await index.upsert(vectors)

      return { success: true, count: chunks.length }
    } else {
      return { success: false, error: 'CSV 또는 TXT 파일만 업로드 가능합니다.' }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '파일 업로드 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 개별 QnA 추가
 */
export async function addQnA(question: string, answer: string): Promise<AddResult> {
  try {
    if (!question || !answer) {
      return { success: false, error: '질문과 답변을 모두 입력해주세요.' }
    }

    const index = await getKiwiRagIndex()
    const text = `질문: ${question}\n답변: ${answer}`
    const embedding = await generateEmbedding(text)

    const id = `manual-${Date.now()}`
    await index.upsert([
      {
        id,
        values: embedding,
        metadata: {
          question,
          answer,
          source: 'manual',
          createdAt: new Date().toISOString(),
        },
      },
    ])

    return { success: true, id }
  } catch (error) {
    console.error('Error adding QnA:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'QnA 추가 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 특정 ID의 데이터 삭제
 */
export async function deleteEntry(id: string): Promise<DeleteResult> {
  try {
    if (!id) {
      return { success: false, error: 'ID가 제공되지 않았습니다.' }
    }

    const index = await getKiwiRagIndex()
    await index.deleteOne(id)

    return { success: true }
  } catch (error) {
    console.error('Error deleting entry:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 삭제 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 모든 데이터 삭제
 */
export async function deleteAll(): Promise<DeleteResult> {
  try {
    const index = await getKiwiRagIndex()
    await index.deleteAll()

    return { success: true }
  } catch (error) {
    console.error('Error deleting all entries:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '전체 삭제 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 저장된 데이터 조회 (쿼리를 통한 유사도 검색)
 */
export async function listEntries(query?: string, topK: number = 100): Promise<ListResult> {
  try {
    const index = await getKiwiRagIndex()

    if (query) {
      // 쿼리가 있으면 유사도 검색
      const queryEmbedding = await generateEmbedding(query)
      const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      })

      const data = results.matches.map((match) => ({
        id: match.id,
        question: (match.metadata?.question as string) || '',
        answer: (match.metadata?.answer as string) || '',
        createdAt: (match.metadata?.createdAt as string) || '',
        metadata: match.metadata,
      }))

      return { success: true, data }
    } else {
      // 쿼리가 없으면 빈 배열 반환
      return {
        success: true,
        data: [],
      }
    }
  } catch (error) {
    console.error('Error listing entries:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 인덱스 통계 조회
 */
export async function getIndexStats() {
  try {
    const index = await getKiwiRagIndex()
    const stats = await index.describeIndexStats()

    return {
      success: true,
      stats: {
        totalVectors: stats.totalRecordCount || 0,
        dimension: stats.dimension || 1024,
      },
    }
  } catch (error) {
    console.error('Error getting index stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '통계 조회 중 오류가 발생했습니다.',
    }
  }
}

