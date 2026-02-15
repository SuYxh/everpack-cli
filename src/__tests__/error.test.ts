import { describe, it, expect } from 'vitest'
import { parseDownloadError } from '../utils'

describe('parseDownloadError', () => {
  it('should handle directory already exists error', () => {
    const error = new Error('EEXIST: file already exists')
    const result = parseDownloadError(error)
    expect(result).toContain('目标目录已存在')
    expect(result).toContain('--force')
  })

  it('should handle "already exists" message', () => {
    const error = new Error('Directory already exists')
    const result = parseDownloadError(error)
    expect(result).toContain('目标目录已存在')
  })

  it('should handle permission denied error', () => {
    const error = new Error('EACCES: permission denied')
    const result = parseDownloadError(error)
    expect(result).toContain('权限不足')
  })

  it('should handle network timeout error', () => {
    const error = new Error('ETIMEDOUT')
    const result = parseDownloadError(error)
    expect(result).toContain('网络连接失败')
  })

  it('should handle DNS resolution error', () => {
    const error = new Error('ENOTFOUND')
    const result = parseDownloadError(error)
    expect(result).toContain('网络连接失败')
  })

  it('should handle connection refused error', () => {
    const error = new Error('ECONNREFUSED')
    const result = parseDownloadError(error)
    expect(result).toContain('网络连接失败')
  })

  it('should handle fetch failed error', () => {
    const error = new Error('fetch failed')
    const result = parseDownloadError(error)
    expect(result).toContain('网络连接失败')
  })

  it('should handle fetch failed in cause', () => {
    const error = new Error('Request failed')
    ;(error as Error & { cause: Error }).cause = new Error('fetch failed')
    const result = parseDownloadError(error)
    expect(result).toContain('网络连接失败')
  })

  it('should handle 404 not found error', () => {
    const error = new Error('404 not found')
    const result = parseDownloadError(error)
    expect(result).toContain('模板仓库不存在')
  })

  it('should handle rate limit error', () => {
    const error = new Error('rate limit exceeded')
    const result = parseDownloadError(error)
    expect(result).toContain('请求频率超限')
  })

  it('should return original message for unknown errors', () => {
    const error = new Error('Something unexpected happened')
    const result = parseDownloadError(error)
    expect(result).toBe('Something unexpected happened')
  })

  it('should handle non-Error objects', () => {
    const result = parseDownloadError('string error')
    expect(result).toBe('string error')
  })
})
