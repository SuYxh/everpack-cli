interface DownloadError extends Error {
  code?: string
  cause?: Error
}

export function parseDownloadError(error: unknown): string {
  const err = error as DownloadError
  const message = err.message || String(error)
  const cause = err.cause?.message || ''

  if (message.includes('EEXIST') || message.includes('already exists')) {
    return '目标目录已存在，请使用 --force 选项覆盖或选择其他项目名称'
  }

  if (message.includes('EACCES') || message.includes('permission denied')) {
    return '权限不足，请检查目录写入权限'
  }

  if (
    message.includes('ENOTFOUND') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ECONNREFUSED') ||
    message.includes('network') ||
    message.includes('fetch failed') ||
    cause.includes('fetch failed')
  ) {
    return '网络连接失败，请检查网络设置或稍后重试'
  }

  if (message.includes('404') || message.includes('not found')) {
    return '模板仓库不存在，请检查模板配置'
  }

  if (message.includes('rate limit')) {
    return 'GitHub API 请求频率超限，请稍后重试'
  }

  return message
}
