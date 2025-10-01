import { createPineconeClient } from './client'

/**
 * multilingual-e5-large 모델을 사용하여 텍스트를 임베딩으로 변환
 * 
 * @param text 임베딩할 텍스트
 * @returns 1024차원의 임베딩 벡터
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = createPineconeClient()

  try {
    // Pinecone Inference API 사용
    const response = await client.inference.embed(
      'multilingual-e5-large',
      [text],
      { inputType: 'passage' }
    )

    const embeddings = Array.isArray(response) ? response : response.data || []

    if (!embeddings || embeddings.length === 0) {
      throw new Error('Failed to generate embedding')
    }

    return embeddings[0].values || []
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * 여러 텍스트를 한 번에 임베딩으로 변환
 * 
 * @param texts 임베딩할 텍스트 배열
 * @returns 임베딩 벡터 배열
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const client = createPineconeClient()

  try {
    const response = await client.inference.embed(
      'multilingual-e5-large',
      texts,
      { inputType: 'passage' }
    )

    const embeddings = Array.isArray(response) ? response : response.data || []

    if (!embeddings || embeddings.length === 0) {
      throw new Error('Failed to generate embeddings')
    }

    return embeddings.map((e) => e.values || [])
  } catch (error) {
    console.error('Error generating embeddings:', error)
    throw new Error('Failed to generate embeddings')
  }
}

/**
 * 쿼리용 임베딩 생성
 * 
 * @param query 검색 쿼리
 * @returns 1024차원의 임베딩 벡터
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const client = createPineconeClient()

  try {
    const response = await client.inference.embed(
      'multilingual-e5-large',
      [query],
      { inputType: 'query' }
    )

    const embeddings = Array.isArray(response) ? response : response.data || []

    if (!embeddings || embeddings.length === 0) {
      throw new Error('Failed to generate query embedding')
    }

    return embeddings[0].values || []
  } catch (error) {
    console.error('Error generating query embedding:', error)
    throw new Error('Failed to generate query embedding')
  }
}

