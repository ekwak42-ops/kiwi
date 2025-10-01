import { Pinecone } from '@pinecone-database/pinecone'

/**
 * Pinecone 클라이언트 생성
 * 서버 사이드에서만 사용 가능
 */
export function createPineconeClient() {
  const apiKey = process.env.PINECONE_API_KEY
  const host = process.env.PINECONE_HOST

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is not configured')
  }

  if (!host) {
    throw new Error('PINECONE_HOST is not configured')
  }

  return new Pinecone({
    apiKey,
  })
}

/**
 * 인덱스 가져오기
 */
export async function getKiwiRagIndex() {
  const client = createPineconeClient()
  return client.index('kiwi-rag', process.env.PINECONE_HOST!)
}

