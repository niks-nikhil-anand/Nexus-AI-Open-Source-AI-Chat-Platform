'use client'

import React from 'react'

interface MarkdownProps {
  content: string
  isStreaming?: boolean
}

export function Markdown({ content, isStreaming = false }: MarkdownProps) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []

  let currentCodeBlock: string[] | null = null
  let currentListType: 'ul' | 'ol' | null = null
  let currentListItems: string[] = []
  let currentParagraph: string[] = []

  // Find the last index of a line that is non-empty to attach the streaming cursor
  let lastNonEmptyLineIdx = -1
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '') {
      lastNonEmptyLineIdx = i
      break
    }
  }

  const flushList = (key: number) => {
    if (!currentListType) return null
    const items = [...currentListItems]
    const type = currentListType
    currentListType = null
    currentListItems = []

    if (type === 'ul') {
      return (
        <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1.5 my-3 text-[var(--nc-text-primary)]">
          {items.map((item, i) => (
            <li key={i}>
              {parseInline(item, isStreaming && key === lastNonEmptyLineIdx && i === items.length - 1)}
            </li>
          ))}
        </ul>
      )
    } else {
      return (
        <ol key={`ol-${key}`} className="list-decimal pl-5 space-y-1.5 my-3 text-[var(--nc-text-primary)]">
          {items.map((item, i) => (
            <li key={i}>
              {parseInline(item, isStreaming && key === lastNonEmptyLineIdx && i === items.length - 1)}
            </li>
          ))}
        </ol>
      )
    }
  }

  const flushParagraph = (key: number) => {
    if (currentParagraph.length === 0) return null
    const text = currentParagraph.join(' ')
    currentParagraph = []
    return (
      <p key={`p-${key}`} className="leading-[1.6] my-2 text-[var(--nc-text-primary)] text-[15px]">
        {parseInline(text, isStreaming && key === lastNonEmptyLineIdx)}
      </p>
    )
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]
    const trimmed = line.trim()

    // 1. Code Block check
    if (trimmed.startsWith('```')) {
      if (currentCodeBlock !== null) {
        // End of code block
        const code = currentCodeBlock.join('\n')
        currentCodeBlock = null
        elements.push(
          <pre key={`code-${idx}`} className="bg-[var(--nc-surface-2)] p-4 rounded-xl my-4 overflow-x-auto border border-[var(--nc-border)] font-mono text-xs text-[var(--nc-text-primary)]">
            <code>{code}</code>
          </pre>
        )
      } else {
        // Start of code block
        // Flush any pending text or list
        const listEl = flushList(idx)
        if (listEl) elements.push(listEl)
        const pEl = flushParagraph(idx)
        if (pEl) elements.push(pEl)
        currentCodeBlock = []
      }
      continue
    }

    if (currentCodeBlock !== null) {
      currentCodeBlock.push(line)
      continue
    }

    // 2. Empty Line check
    if (trimmed === '') {
      const listEl = flushList(idx)
      if (listEl) elements.push(listEl)
      const pEl = flushParagraph(idx)
      if (pEl) elements.push(pEl)
      continue
    }

    // 3. Headers check
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/)
      if (match) {
        const listEl = flushList(idx)
        if (listEl) elements.push(listEl)
        const pEl = flushParagraph(idx)
        if (pEl) elements.push(pEl)

        const level = match[1].length
        const text = match[2]
        const showCursorHere = isStreaming && idx === lastNonEmptyLineIdx
        if (level === 1) {
          elements.push(<h1 key={`h1-${idx}`} className="text-2xl font-bold text-[var(--nc-text-primary)] mt-6 mb-3">{parseInline(text, showCursorHere)}</h1>)
        } else if (level === 2) {
          elements.push(<h2 key={`h2-${idx}`} className="text-xl font-bold text-[var(--nc-text-primary)] mt-5 mb-2.5">{parseInline(text, showCursorHere)}</h2>)
        } else if (level === 3) {
          elements.push(<h3 key={`h3-${idx}`} className="text-lg font-bold text-[var(--nc-text-primary)] mt-4 mb-2">{parseInline(text, showCursorHere)}</h3>)
        } else {
          elements.push(<h4 key={`h4-${idx}`} className="text-base font-bold text-[var(--nc-text-primary)] mt-3 mb-2">{parseInline(text, showCursorHere)}</h4>)
        }
        continue
      }
    }

    // 4. Unordered List check
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const pEl = flushParagraph(idx)
      if (pEl) elements.push(pEl)

      if (currentListType !== 'ul') {
        const listEl = flushList(idx)
        if (listEl) elements.push(listEl)
        currentListType = 'ul'
      }
      currentListItems.push(trimmed.slice(2))
      continue
    }

    // 5. Ordered List check
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/)
    if (olMatch) {
      const pEl = flushParagraph(idx)
      if (pEl) elements.push(pEl)

      if (currentListType !== 'ol') {
        const listEl = flushList(idx)
        if (listEl) elements.push(listEl)
        currentListType = 'ol'
      }
      currentListItems.push(olMatch[2])
      continue
    }

    // 6. Regular Line (accumulate into paragraph)
    if (currentListType) {
      const listEl = flushList(idx)
      if (listEl) elements.push(listEl)
    }
    currentParagraph.push(line)
  }

  // Flush remaining
  const listEl = flushList(lines.length)
  if (listEl) elements.push(listEl)
  const pEl = flushParagraph(lines.length)
  if (pEl) elements.push(pEl)

  return <div className="space-y-1">{elements}</div>
}

function parseInline(text: string, showCursor?: boolean): React.ReactNode[] {
  const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g
  const splitParts = text.split(inlineRegex)

  const nodes = splitParts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-[var(--nc-text-primary)]">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-[var(--nc-text-secondary)]">{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="bg-[var(--nc-surface-3)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--nc-accent)] border border-[var(--nc-border)]">{part.slice(1, -1)}</code>
    }
    return part
  })

  if (showCursor) {
    nodes.push(
      <span
        key="cursor"
        className="ml-0.5 inline-block h-[15px] w-[2px] align-middle bg-[var(--nc-accent)] animate-pulse"
        aria-hidden="true"
      />
    )
  }

  return nodes
}
