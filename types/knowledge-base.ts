/**
 * Knowledge Base 관련 타입 정의
 */

export interface KnowledgeBaseEntry {
  id: string
  question: string
  answer: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface UploadResult {
  success: boolean
  count?: number
  error?: string
}

export interface AddResult {
  success: boolean
  id?: string
  error?: string
}

export interface DeleteResult {
  success: boolean
  error?: string
}

export interface ListResult {
  success: boolean
  data?: KnowledgeBaseEntry[]
  error?: string
}

