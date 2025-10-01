'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import {
  uploadFile,
  addQnA,
  deleteEntry,
  deleteAll,
  listEntries,
  getIndexStats,
} from '@/actions/knowledge-base'
import type { KnowledgeBaseEntry } from '@/types/knowledge-base'

export default function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [adding, setAdding] = useState(false)
  const [addMessage, setAddMessage] = useState('')

  const [entries, setEntries] = useState<KnowledgeBaseEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  const [stats, setStats] = useState<{ totalVectors: number; dimension: number } | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // 파일 업로드
  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('파일을 선택해주세요.')
      return
    }

    setUploading(true)
    setUploadMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadFile(formData)

      if (result.success) {
        setUploadMessage(`✅ ${result.count}개의 항목이 성공적으로 업로드되었습니다.`)
        setFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        // 통계 갱신
        loadStats()
      } else {
        setUploadMessage(`❌ 오류: ${result.error}`)
      }
    } catch (error) {
      setUploadMessage(`❌ 업로드 중 오류가 발생했습니다: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  // 개별 QnA 추가
  const handleAddQnA = async () => {
    if (!question || !answer) {
      setAddMessage('질문과 답변을 모두 입력해주세요.')
      return
    }

    setAdding(true)
    setAddMessage('')

    try {
      const result = await addQnA(question, answer)

      if (result.success) {
        setAddMessage(`✅ QnA가 성공적으로 추가되었습니다. (ID: ${result.id})`)
        setQuestion('')
        setAnswer('')
        // 통계 갱신
        loadStats()
      } else {
        setAddMessage(`❌ 오류: ${result.error}`)
      }
    } catch (error) {
      setAddMessage(`❌ 추가 중 오류가 발생했습니다: ${error}`)
    } finally {
      setAdding(false)
    }
  }

  // 데이터 조회
  const handleSearch = async () => {
    setLoading(true)
    setEntries([])

    try {
      const result = await listEntries(searchQuery || undefined, 50)

      if (result.success && result.data) {
        setEntries(result.data)
      } else {
        alert(`조회 실패: ${result.error}`)
      }
    } catch (error) {
      alert(`조회 중 오류가 발생했습니다: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  // 개별 항목 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 항목을 삭제하시겠습니까?')) {
      return
    }

    try {
      const result = await deleteEntry(id)

      if (result.success) {
        alert('✅ 삭제되었습니다.')
        // 목록 갱신
        handleSearch()
        // 통계 갱신
        loadStats()
      } else {
        alert(`❌ 오류: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ 삭제 중 오류가 발생했습니다: ${error}`)
    }
  }

  // 전체 삭제
  const handleDeleteAll = async () => {
    if (!confirm('⚠️ 정말 모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return
    }

    if (!confirm('⚠️ 한 번 더 확인합니다. 모든 데이터가 삭제됩니다!')) {
      return
    }

    try {
      const result = await deleteAll()

      if (result.success) {
        alert('✅ 모든 데이터가 삭제되었습니다.')
        setEntries([])
        // 통계 갱신
        loadStats()
      } else {
        alert(`❌ 오류: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ 삭제 중 오류가 발생했습니다: ${error}`)
    }
  }

  // 통계 조회
  const loadStats = async () => {
    setStatsLoading(true)
    try {
      const result = await getIndexStats()
      if (result.success && result.stats) {
        setStats(result.stats)
      }
    } catch (error) {
      console.error('통계 조회 실패:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  // 초기 로드 시 통계 조회
  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Knowledge Base 관리</h1>

      {/* 통계 */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">인덱스 통계</h2>
        <div className="flex gap-8">
          <div>
            <p className="text-sm text-gray-600">총 벡터 수</p>
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.totalVectors || 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">차원</p>
            <p className="text-2xl font-bold">
              {statsLoading ? '...' : stats?.dimension || 1024}
            </p>
          </div>
          <Button onClick={loadStats} disabled={statsLoading} variant="outline" size="sm">
            새로고침
          </Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* 파일 업로드 섹션 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">1. 파일 업로드</h2>
          <p className="text-sm text-gray-600 mb-4">
            CSV 또는 TXT 파일을 업로드하여 Knowledge Base에 추가합니다.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="file">파일 선택 (CSV, TXT)</Label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                accept=".csv,.txt"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={uploading}
              />
              {file && (
                <p className="text-sm text-gray-600 mt-2">선택된 파일: {file.name}</p>
              )}
            </div>

            <Button onClick={handleFileUpload} disabled={uploading || !file} className="w-full">
              {uploading ? '업로드 중...' : '업로드'}
            </Button>

            {uploadMessage && (
              <p className="text-sm mt-2">{uploadMessage}</p>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded text-xs">
            <p className="font-semibold mb-2">CSV 형식:</p>
            <pre className="text-xs">
              {`"Question","Answer"
"질문1","답변1"
"질문2","답변2"`}
            </pre>
          </div>
        </Card>

        {/* 개별 QnA 추가 섹션 */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">2. 개별 QnA 추가</h2>
          <p className="text-sm text-gray-600 mb-4">
            질문과 답변을 직접 입력하여 추가합니다.
          </p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="question">질문</Label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="질문을 입력하세요"
                disabled={adding}
              />
            </div>

            <div>
              <Label htmlFor="answer">답변</Label>
              <Textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="답변을 입력하세요"
                rows={5}
                disabled={adding}
              />
            </div>

            <Button
              onClick={handleAddQnA}
              disabled={adding || !question || !answer}
              className="w-full"
            >
              {adding ? '추가 중...' : 'QnA 추가'}
            </Button>

            {addMessage && (
              <p className="text-sm mt-2">{addMessage}</p>
            )}
          </div>
        </Card>
      </div>

      {/* 데이터 조회 섹션 */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">3. 데이터 조회</h2>
        <p className="text-sm text-gray-600 mb-4">
          검색어를 입력하여 유사한 항목을 조회합니다. (최대 50개)
        </p>

        <div className="flex gap-4 mb-6">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어 입력 (선택사항)"
            disabled={loading}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? '조회 중...' : '조회'}
          </Button>
        </div>

        {entries.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-2">{entries.length}개의 항목</p>
            {entries.map((entry) => (
              <div key={entry.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-600">질문:</p>
                    <p className="mb-2">{entry.question}</p>
                    <p className="font-semibold text-sm text-gray-600">답변:</p>
                    <p className="text-sm">{entry.answer}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    삭제
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ID: {entry.id} | {entry.createdAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 전체 삭제 섹션 */}
      <Card className="p-6 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-600">⚠️ 위험 구역</h2>
        <p className="text-sm text-gray-600 mb-4">
          모든 데이터를 삭제합니다. 이 작업은 되돌릴 수 없습니다!
        </p>
        <Button onClick={handleDeleteAll} variant="destructive">
          전체 데이터 삭제
        </Button>
      </Card>
    </div>
  )
}

