"use client"

import { useRef, useEffect, useState } from "react"
import { useChatStore } from "@/lib/store"

// ─── Constants ────────────────────────────────────────────────────────────────

const BAR_COUNT = 48
const BAR_W = 2
const GAP = 3
const CANVAS_WIDTH = BAR_COUNT * (BAR_W + GAP) // 240px
const CANVAS_HEIGHT = 32
const ACCENT_COLOR = "#7C6AFF"

// ─── Draw Waveform ────────────────────────────────────────────────────────────

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  isGenerating: boolean,
  frame: number,
  barCount: number,
  accentColor: string
): void {
  const width = ctx.canvas.width
  const height = ctx.canvas.height

  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Set bar color with appropriate opacity
  const opacity = isGenerating ? 0.85 : 0.35
  ctx.fillStyle = accentColor

  for (let i = 0; i < barCount; i++) {
    let barHeight: number

    if (isGenerating) {
      // Generating mode: noise-driven oscillation
      barHeight =
        4 +
        Math.abs(Math.sin(frame * 0.3 + i * 0.7)) * 14 +
        Math.random() * 4
    } else {
      // Idle mode: sine wave with slow pulse
      barHeight = Math.abs(Math.sin(frame * 0.02 + i * 0.25)) * 3 + 3
    }

    // Clamp bar height
    barHeight = Math.max(2, Math.min(barHeight, height))

    // Center bars vertically
    const x = i * (BAR_W + GAP)
    const y = (height - barHeight) / 2

    // Draw rounded bar
    ctx.globalAlpha = opacity
    ctx.beginPath()
    if (ctx.roundRect) {
      ctx.roundRect(x, y, BAR_W, barHeight, 1)
    } else {
      // Fallback for browsers without roundRect
      ctx.rect(x, y, BAR_W, barHeight)
    }
    ctx.fill()
  }

  // Reset alpha
  ctx.globalAlpha = 1
}

// ─── WaveformBar Component ────────────────────────────────────────────────────

export function WaveformBar() {
  const { state } = useChatStore()
  const isGenerating = state.isGenerating

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const [canvasSupported, setCanvasSupported] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setCanvasSupported(false)
      return
    }

    // Animation loop
    function animate() {
      frameRef.current++
      drawWaveform(ctx!, isGenerating, frameRef.current, BAR_COUNT, ACCENT_COLOR)
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    // Cleanup on unmount or when isGenerating changes
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isGenerating])

  // Static gradient fallback when canvas is unavailable
  if (!canvasSupported) {
    return (
      <div className="mx-auto my-2 flex items-center justify-center">
        <div
          className="rounded-sm"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            background: `linear-gradient(90deg, transparent, ${ACCENT_COLOR}40, transparent)`,
          }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto my-2 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        aria-hidden="true"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      />
    </div>
  )
}
