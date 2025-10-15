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
import type { BreedPrediction, BackendPredictionResponse } from "@/lib/types"
import { config } from "@/lib/config"

interface ScanResult {
  id: string
  imageUrl: string
  predictions: BreedPrediction[]
  confidence: number
  timestamp: string
  status: "processing" | "completed" | "error"
  ragResponse?: string
  clarifyingQuestions?: string
  detection?: any
}

export function BreedIdentificationInterface() {
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)

  const handleImageUpload = useCallback(async (file: File) => {
    const imageUrl = URL.createObjectURL(file)
    setCurrentImage(imageUrl)
    setIsProcessing(true)
    setProcessingProgress(0)
    setScanResult(null)
    setShowFeedback(false)

    // Simulate progress updates during API call
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 200)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Call the backend API
      const response = await fetch(config.backendUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server error: ${response.status} ${errorText}`)
      }

      const backendResponse: BackendPredictionResponse = await response.json()

      // Convert backend response to our format
      const predictions: BreedPrediction[] = [
        {
          breed: backendResponse.breed_prediction.breed,
          confidence: backendResponse.breed_prediction.confidence
        }
      ]

      const result: ScanResult = {
        id: `scan_${Date.now()}`,
        imageUrl,
        predictions,
        confidence: backendResponse.breed_prediction.confidence,
        timestamp: new Date().toISOString(),
        status: "completed",
        ragResponse: backendResponse.rag_response,
        clarifyingQuestions: backendResponse.clarifying_questions,
        detection: backendResponse.detection,
      }

      setProcessingProgress(100)
      setScanResult(result)
      setShowFeedback(true)
    } catch (error) {
      console.error('Upload error:', error)
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
  }, [])

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
                <PredictionResults 
                  predictions={scanResult.predictions}
                  ragResponse={scanResult.ragResponse}
                  clarifyingQuestions={scanResult.clarifyingQuestions}
                  detection={scanResult.detection}
                />
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
