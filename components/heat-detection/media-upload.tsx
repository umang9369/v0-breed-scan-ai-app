"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Camera, Video } from "lucide-react"

interface MediaUploadProps {
  onMediaUpload: (file: File) => void
}

export function MediaUpload({ onMediaUpload }: MediaUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          onMediaUpload(file)
        }
      }
    },
    [onMediaUpload],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          onMediaUpload(file)
        }
      }
    },
    [onMediaUpload],
  )

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.capture = "environment"
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        onMediaUpload(target.files[0])
      }
    }
    input.click()
  }, [onMediaUpload])

  return (
    <div className="space-y-4">
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-foreground font-medium mb-2">Drag and drop an image or short video</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
          <input type="file" accept="image/*,video/*" onChange={handleFileInput} className="hidden" id="media-upload" />
          <label htmlFor="media-upload">
            <Button variant="outline" className="cursor-pointer bg-transparent">
              Choose File
            </Button>
          </label>
        </div>
      </Card>

      <div className="text-center">
        <Button onClick={handleCameraCapture} size="lg" className="w-full sm:w-auto">
          <Camera className="mr-2 w-5 h-5" />
          Capture Photo/Video
        </Button>
      </div>
    </div>
  )
}
