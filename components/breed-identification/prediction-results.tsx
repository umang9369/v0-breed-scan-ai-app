import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Star } from "lucide-react"
import type { BreedPrediction } from "@/lib/types"

interface PredictionResultsProps {
  predictions: BreedPrediction[]
}

export function PredictionResults({ predictions }: PredictionResultsProps) {
  if (!predictions || predictions.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">No predictions available</p>
      </Card>
    )
  }

  const topPrediction = predictions[0]
  const confidenceLevel = topPrediction.confidence >= 0.8 ? "high" : topPrediction.confidence >= 0.6 ? "medium" : "low"

  const confidenceColor =
    confidenceLevel === "high" ? "text-green-600" : confidenceLevel === "medium" ? "text-yellow-600" : "text-red-600"

  return (
    <div className="space-y-4">
      {/* Top Prediction */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-foreground">Top Prediction</h3>
        </div>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xl font-bold text-foreground">{topPrediction.breed}</h4>
              <p className="text-sm text-muted-foreground">Most likely breed</p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${confidenceColor}`}>
                {(topPrediction.confidence * 100).toFixed(1)}%
              </div>
              <Badge variant={confidenceLevel === "high" ? "default" : "secondary"}>{confidenceLevel} confidence</Badge>
            </div>
          </div>
          <Progress value={topPrediction.confidence * 100} className="h-2" />
        </Card>
      </div>

      {/* All Predictions */}
      {predictions.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">All Predictions</h3>
          </div>

          <div className="space-y-2">
            {predictions.map((prediction, index) => (
              <Card key={prediction.breed} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="font-medium text-foreground">{prediction.breed}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24">
                      <Progress value={prediction.confidence * 100} className="h-1" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground min-w-[3rem]">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Confidence Explanation */}
      <Card className="p-4 bg-muted/30">
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Understanding Confidence Scores</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • <span className="text-green-600 font-medium">High (80%+)</span>: Very confident prediction
            </p>
            <p>
              • <span className="text-yellow-600 font-medium">Medium (60-79%)</span>: Moderately confident
            </p>
            <p>
              • <span className="text-red-600 font-medium">Low (&lt;60%)</span>: Uncertain, may be crossbreed
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
