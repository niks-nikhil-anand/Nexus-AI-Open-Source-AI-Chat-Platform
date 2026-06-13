'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface MarkdownProps {
  content: string
  isStreaming?: boolean
}

export function Markdown({ content, isStreaming = false }: MarkdownProps) {
  const displayContent = content + (isStreaming ? ' ▍' : '')

  return (
    <div className="markdown-body text-[15px] leading-normal text-[var(--nc-text-primary)] break-words w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-3 last:mb-0 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-3 last:mb-0 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="leading-relaxed marker:text-[var(--nc-text-secondary)]" {...props} />,
          h1: ({ node, ...props }) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-lg font-bold mt-4 mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-base font-bold mt-3 mb-1.5" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-[var(--nc-text-secondary)]" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-[var(--nc-accent)] hover:underline font-medium break-all"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="my-3 w-full overflow-x-auto rounded-xl border border-[var(--nc-border)] bg-[var(--nc-surface-2)]">
              <table className="w-full text-left text-sm" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-[var(--nc-surface-3)] border-b border-[var(--nc-border)]" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold text-[var(--nc-text-primary)]" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3 border-b border-[var(--nc-border)] last:border-0" {...props} />,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = inline !== undefined ? inline : (!match && !className?.includes('hljs'))
            if (isInline) {
              return (
                <code className="bg-[var(--nc-surface-3)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--nc-accent)] border border-[var(--nc-border)]" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={`${className || ''} block p-4`} {...props}>
                {children}
              </code>
            )
          },
          pre: ({ node, ...props }) => (
            <pre className="mt-1.5 mb-3 last:mb-0 overflow-x-auto rounded-xl border border-[var(--nc-border)] bg-[#0f172a] dark:bg-[#0d1117] text-[13px] py-3" {...props} />
          ),
          hr: ({ node, ...props }) => <hr className="my-4 border-[var(--nc-border)]" {...props} />
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  )
}