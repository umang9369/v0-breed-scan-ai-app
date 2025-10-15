"use client"

import { useState, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "./image-upload"
import { PredictionResults } from "./prediction-results"
import { FeedbackForm } from "./feedback-form"
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import type { BreedPrediction } from "@/lib/types"

interface ScanResult {
  id: string
  imageUrl: string
  predictions: BreedPrediction[]
  confidence: number
  timestamp: string
  status: "processing" | "completed" | "error"
}

export function BreedIdentificationInterface() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Extract predictions directly from Roboflow response (no custom aggregation/sorting)
  const derivePredictions = useCallback((raw: any): BreedPrediction[] => {
    const isPred = (x: any) =>
      x && typeof x === "object" &&
      (x.class != null || x.label != null || x.name != null || x.breed != null) &&
      (x.confidence != null || x.score != null || x.probability != null)

    const extractList = (node: any): any[] | null => {
      if (!node) return null
      if (Array.isArray(node)) {
        if (node.length > 0 && node.every(isPred)) return node
        for (const item of node) {
          const found = extractList(item)
          if (found) return found
        }
        return null
      }
      if (typeof node === "object") {
        const keys = ["predictions", "classifications", "results", "output", "data"]
        for (const k of keys) {
          const v = (node as any)[k]
          if (Array.isArray(v) && v.length > 0 && v.every(isPred)) return v
        }
        for (const v of Object.values(node)) {
          const found = extractList(v)
          if (found) return found
        }
      }
      return null
    }

    const list = extractList(raw) || []
    return list.map((p: any) => ({
      breed: (p.class ?? p.label ?? p.name ?? p.breed) as string,
      confidence: (p.confidence ?? p.score ?? p.probability) as number,
    }))
  }, [])

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setCurrentImage(imageUrl)
    setIsProcessing(true)
    setProcessingProgress(0)
    setScanResult(null)
    setShowFeedback(false)

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return Math.min(90, prev + Math.random() * 15)
      })
    }, 200)

    try {
      const form = new FormData()
      form.append("image", file)

      const response = await fetch("/api/roboflow", { method: "POST", body: form })
      const json = await response.json()

      if (!response.ok || !json?.success) {
        throw new Error(json?.error || "Roboflow request failed")
      }

      const predictions = derivePredictions(json.data)
      if (!predictions || predictions.length === 0) {
        throw new Error("No predictions found in response")
      }

      const result: ScanResult = {
        id: `scan_${Date.now()}`,
        imageUrl,
        predictions,
        confidence: predictions[0].confidence,
        timestamp: new Date().toISOString(),
        status: "completed",
      }

      setProcessingProgress(100)
      setScanResult(result)
      setShowFeedback(true)
    } catch (error) {
      setScanResult({
        id: `scan_${Date.now()}`,
        imageUrl,
        predictions: [],
        confidence: 0,
        timestamp: new Date().toISOString(),
        status: "error",
      })
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
    }
  }, [derivePredictions])

  const handleNewScan = () => {
    setCurrentImage(null)
    setScanResult(null)
    setShowFeedback(false)
    setProcessingProgress(0)
  }

  const handleFeedbackSubmit = (feedback: {
    actualBreed?: string
    feedbackType: "confirmed" | "rejected" | "uncertain"
    comments?: string
  }) => {
    // In real app, this would save feedback to database
    console.log("Feedback submitted:", feedback)
    // Could show a success message or update UI
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {!currentImage && (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Upload Livestock Image</h2>
              <p className="text-muted-foreground">
                Take a clear photo of your cattle or buffalo for accurate breed identification
              </p>
            </div>
            <ImageUpload onImageUpload={handleImageUpload} />
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Tips for best results:</p>
              <ul className="text-left max-w-md mx-auto space-y-1">
                <li>• Ensure good lighting and clear visibility</li>
                <li>• Capture the full animal from the side</li>
                <li>• Avoid blurry or distant shots</li>
                <li>• Include distinctive breed features</li>
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Processing Section */}
      {currentImage && isProcessing && (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden">
              <img
                src={currentImage || "/placeholder.svg"}
                alt="Uploaded livestock"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-foreground font-medium">Analyzing image...</span>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {processingProgress < 30 && "Preprocessing image..."}
                  {processingProgress >= 30 && processingProgress < 60 && "Extracting features..."}
                  {processingProgress >= 60 && processingProgress < 90 && "Running AI analysis..."}
                  {processingProgress >= 90 && "Finalizing results..."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Results Section */}
      {scanResult && scanResult.status === "completed" && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={scanResult.imageUrl || "/placeholder.svg"}
                  alt="Analyzed livestock"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">Analysis Complete</span>
                  <Badge variant="secondary">{new Date(scanResult.timestamp).toLocaleString()}</Badge>
                </div>
                <PredictionResults predictions={scanResult.predictions} />
              </div>
            </div>
          </Card>

          {/* Feedback Section */}
          {showFeedback && (
            <FeedbackForm
              scanId={scanResult.id}
              topPrediction={scanResult.predictions[0]}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleNewScan} size="lg">
              <Upload className="mr-2 w-5 h-5" />
              Scan Another Image
            </Button>
            <Button variant="outline" size="lg">
              Save to History
            </Button>
          </div>
        </div>
      )}

      {/* Error Section */}
      {scanResult && scanResult.status === "error" && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
              <p className="text-muted-foreground">
                We couldn't analyze this image. Please try again with a clearer photo.
              </p>
            </div>
            <Button onClick={handleNewScan}>Try Again</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
