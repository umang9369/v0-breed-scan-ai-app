import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCircle2, XCircle } from "lucide-react"

export interface HeatIndicators {
  swollen_vulva: { detected: boolean; confidence: number }
  mucus_discharge: { detected: boolean; confidence: number }
  mounting_behavior: { detected: boolean; confidence: number }
}

export interface HeatDetectionOutcome {
  heatDetected: boolean
  overallConfidence: number
  indicators: HeatIndicators
  analyzedAt: string
}

interface HeatDetectionResultsProps {
  outcome: HeatDetectionOutcome
}

export function HeatDetectionResults({ outcome }: HeatDetectionResultsProps) {
  const { heatDetected, overallConfidence, indicators, analyzedAt } = outcome

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {heatDetected ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-muted-foreground" />
            )}
            <h3 className="text-lg font-semibold text-foreground">Heat Detection</h3>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold {heatDetected ? 'text-green-600' : 'text-foreground'}">
              {(overallConfidence * 100).toFixed(1)}%
            </div>
            <Badge variant={heatDetected ? "default" : "secondary"}>
              {heatDetected ? "heat signs detected" : "no clear signs"}
            </Badge>
          </div>
        </div>
        <Progress value={overallConfidence * 100} className="h-2" />
        <div className="text-sm text-muted-foreground mt-2">{new Date(analyzedAt).toLocaleString()}</div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {(
          [
            { key: "swollen_vulva", label: "Swollen vulva" },
            { key: "mucus_discharge", label: "Mucus discharge" },
            { key: "mounting_behavior", label: "Restlessness / mounting" },
          ] as const
        ).map(({ key, label }) => {
          const item = indicators[key]
          return (
            <Card key={key} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{label}</span>
                <Badge variant={item.detected ? "default" : "secondary"}>{item.detected ? "yes" : "no"}</Badge>
              </div>
              <Progress value={item.confidence * 100} className="h-1.5" />
              <div className="text-sm text-muted-foreground mt-1">{(item.confidence * 100).toFixed(1)}%</div>
            </Card>
          )
        })}
      </div>

      {heatDetected && (
        <Card className="p-4 bg-muted/30">
          <div className="flex items-start space-x-3">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                ⚠ Cow ID 456 shows heat signs – schedule insemination within 12 hrs.
              </div>
              <div className="text-sm text-muted-foreground">
                You can auto-assign an insemination visit to the nearest FLW.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
