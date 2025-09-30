"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Check, Pen } from "lucide-react"

interface SignaturePadProps {
  onSignatureComplete: (signatureDataUrl: string) => void
  title?: string
  description?: string
  disabled?: boolean
}

export function SignaturePad({ onSignatureComplete, title, description, disabled = false }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Configure drawing style
    ctx.strokeStyle = "#000000"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }, [])

  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()

    if ("touches" in event) {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      }
    } else {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
  }

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled) return

    event.preventDefault()
    const coords = getCoordinates(event)
    if (!coords) return

    setIsDrawing(true)
    setLastPoint(coords)
    setHasSignature(true)
  }

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled) return

    event.preventDefault()
    const coords = getCoordinates(event)
    if (!coords || !lastPoint) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()

    setLastPoint(coords)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    setLastPoint(null)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    console.log("[v0] Signature cleared")
  }

  const submitSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    const dataUrl = canvas.toDataURL("image/png")
    onSignatureComplete(dataUrl)
    console.log("[v0] Signature submitted")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="h-5 w-5 text-purple-600" />
          {title || "Digital Signature"}
        </CardTitle>
        {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-48 border-2 border-slate-300 rounded-lg bg-white cursor-crosshair touch-none"
            style={{ touchAction: "none" }}
          />
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-400 text-sm">Sign here with your mouse or finger</p>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearSignature}
            disabled={!hasSignature || disabled}
            className="flex-1 bg-transparent"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button
            onClick={submitSignature}
            disabled={!hasSignature || disabled}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Submit Signature
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
