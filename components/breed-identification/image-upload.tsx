"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, Camera, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
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
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type.startsWith("image/")) {
          await onImageUpload(file)
        }
      }
    },
    [onImageUpload],
  )

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        if (file.type.startsWith("image/")) {
          await onImageUpload(file)
        }
      }
    },
    [onImageUpload],
  )

  const handleCameraCapture = useCallback(() => {
    // In a real app, this would open camera interface
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.capture = "environment" // Use rear camera on mobile
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        await onImageUpload(target.files[0])
      }
    }
    input.click()
  }, [onImageUpload])

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
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
          <p className="text-foreground font-medium mb-2">Drag and drop your image here</p>
          <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
          <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" id="file-upload" />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
              <span>
                <ImageIcon className="mr-2 w-4 h-4" />
                Choose File
              </span>
            </Button>
          </label>
        </div>
      </Card>

      {/* Camera Button */}
      <div className="text-center">
        <Button onClick={handleCameraCapture} size="lg" className="w-full sm:w-auto">
          <Camera className="mr-2 w-5 h-5" />
          Take Photo
        </Button>
      </div>
    </div>
  )
}
