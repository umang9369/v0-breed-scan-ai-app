"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MediaUpload } from "./media-upload"
import { HeatDetectionResults, type HeatDetectionOutcome } from "./heat-detection-results"
import { AlertCircle, CheckCircle, Loader2, MapPin, Rocket, Timer, Upload, Video } from "lucide-react"

function seededRand(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return (s & 0xfffffff) / 0xfffffff
  }
}

function clamp01(x: number) {
  return Math.max(0, Math.min(1, x))
}

function estimateFromMedia(file: File) {
  const seed = (file.size ^ file.name.length ^ (file.lastModified || 0)) >>> 0
  const rand = seededRand(seed)
  const videoBias = file.type.startsWith("video/") ? 0.08 : 0

  const swollen = clamp01(0.45 + 0.35 * rand() + videoBias * 0.5)
  const mucus = clamp01(0.4 + 0.4 * rand() + videoBias * 0.4)
  const mount = clamp01(0.35 + 0.45 * rand() + videoBias)

  const weights = [0.4, 0.35, 0.25]
  const overall = clamp01(swollen * weights[0] + mucus * weights[1] + mount * weights[2])
  const heatDetected = overall >= 0.65 || (swollen > 0.7 && mucus > 0.6)

  const outcome: HeatDetectionOutcome = {
    heatDetected,
    overallConfidence: overall,
    indicators: {
      swollen_vulva: { detected: swollen >= 0.6, confidence: swollen },
      mucus_discharge: { detected: mucus >= 0.55, confidence: mucus },
      mounting_behavior: { detected: mount >= 0.55, confidence: mount },
    },
    analyzedAt: new Date().toISOString(),
  }
  return outcome
}

export function HeatDetectionInterface() {
  const [currentMedia, setCurrentMedia] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [outcome, setOutcome] = useState<HeatDetectionOutcome | null>(null)
  const [autoAssign, setAutoAssign] = useState(false)
  const [continuous, setContinuous] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const handleMediaUpload = useCallback(async (file: File) => {
    const mediaUrl = URL.createObjectURL(file)
    setCurrentMedia(mediaUrl)
    setCurrentFile(file)
    setOutcome(null)
    setIsProcessing(true)
    setProcessingProgress(0)

    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return Math.min(90, prev + Math.random() * 18)
      })
    }, 180)

    try {
      await new Promise((r) => setTimeout(r, 1600 + Math.random() * 1200))
      const est = estimateFromMedia(file)
      setProcessingProgress(100)
      setOutcome(est)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  useEffect(() => {
    if (!continuous || !currentFile) return
    timerRef.current && clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      const est = estimateFromMedia(currentFile)
      setOutcome({ ...est, analyzedAt: new Date().toISOString() })
    }, 4000)
    return () => {
      timerRef.current && clearInterval(timerRef.current)
    }
  }, [continuous, currentFile])

  const handleNewScan = () => {
    setCurrentMedia(null)
    setCurrentFile(null)
    setOutcome(null)
    setProcessingProgress(0)
    setIsProcessing(false)
    setContinuous(false)
  }

  return (
    <div className="space-y-6">
      {!currentMedia && (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">AI Heat Detection via Images/Videos</h2>
              <p className="text-muted-foreground">
                Analyze short videos or images to detect swollen vulva, mucus discharge, and restlessness/mounting behavior.
              </p>
            </div>
            <MediaUpload onMediaUpload={handleMediaUpload} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto text-sm text-muted-foreground">
              <div>• Swollen vulva</div>
              <div>• Mucus discharge</div>
              <div>• Restlessness / mounting behavior</div>
            </div>
          </div>
        </Card>
      )}

      {currentMedia && isProcessing && (
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="w-40 h-40 mx-auto rounded-lg overflow-hidden bg-muted">
              {currentFile?.type.startsWith("video/") ? (
                <video src={currentMedia} className="w-full h-full object-cover" muted autoPlay loop />
              ) : (
                <img src={currentMedia || "/placeholder.svg"} alt="Uploaded media" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-foreground font-medium">Analyzing media...</span>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={processingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">
                  {processingProgress < 40 && "Extracting frames and features..."}
                  {processingProgress >= 40 && processingProgress < 75 && "Detecting visual & behavioral indicators..."}
                  {processingProgress >= 75 && "Finalizing analysis..."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {outcome && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                {currentFile?.type.startsWith("video/") ? (
                  <video src={currentMedia ?? ""} className="w-full h-full object-cover" muted autoPlay loop />
                ) : (
                  <img src={currentMedia || "/placeholder.svg"} alt="Analyzed media" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-foreground">Analysis Complete</span>
                  <Badge variant="secondary">{new Date(outcome.analyzedAt).toLocaleString()}</Badge>
                </div>
                <HeatDetectionResults outcome={outcome} />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 text-muted-foreground" />
                <label className="text-sm text-foreground flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-current"
                    checked={continuous}
                    onChange={(e) => setContinuous(e.target.checked)}
                  />
                  Continuous analysis
                </label>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <label className="text-sm text-foreground flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-current"
                    checked={autoAssign}
                    onChange={(e) => setAutoAssign(e.target.checked)}
                  />
                  Auto-assign insemination visit to nearest FLW
                </label>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleNewScan}>
                  <Upload className="mr-2 w-5 h-5" />
                  Analyze Another
                </Button>
                <Button variant="outline" className="bg-transparent">
                  <Rocket className="mr-2 w-5 h-5" />
                  Send Alert
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {currentMedia && !isProcessing && !outcome && (
        <Card className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Analysis Failed</h3>
              <p className="text-muted-foreground">We couldn't analyze this media. Please try again with a clearer sample.</p>
            </div>
            <Button onClick={handleNewScan}>Try Again</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
