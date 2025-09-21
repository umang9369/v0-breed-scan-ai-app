"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, XCircle, HelpCircle, MessageSquare } from "lucide-react"
import type { BreedPrediction } from "@/lib/types"

interface FeedbackFormProps {
  scanId: string
  topPrediction: BreedPrediction
  onFeedbackSubmit: (feedback: {
    actualBreed?: string
    feedbackType: "confirmed" | "rejected" | "uncertain"
    comments?: string
  }) => void
}

const INDIAN_BREEDS = [
  "Gir",
  "Sahiwal",
  "Red Sindhi",
  "Tharparkar",
  "Hariana",
  "Kankrej",
  "Ongole",
  "Krishna Valley",
  "Deoni",
  "Khillari",
  "Malvi",
  "Nimari",
  "Murrah",
  "Nili-Ravi",
  "Surti",
  "Jaffarabadi",
  "Mehsana",
  "Bhadawari",
]

export function FeedbackForm({ scanId, topPrediction, onFeedbackSubmit }: FeedbackFormProps) {
  const [feedbackType, setFeedbackType] = useState<"confirmed" | "rejected" | "uncertain" | "">("")
  const [actualBreed, setActualBreed] = useState("")
  const [comments, setComments] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackType) return

    setIsSubmitting(true)

    try {
      await onFeedbackSubmit({
        actualBreed: actualBreed || undefined,
        feedbackType: feedbackType as "confirmed" | "rejected" | "uncertain",
        comments: comments || undefined,
      })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to submit feedback:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
          <h3 className="text-lg font-semibold text-green-800">Thank You!</h3>
          <p className="text-green-700">Your feedback helps improve our AI model for better predictions.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Help Improve Our AI</h3>
        </div>

        <p className="text-muted-foreground">
          Your feedback helps us improve breed identification accuracy. Please let us know if our prediction was
          correct.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Is "{topPrediction.breed}" the correct breed?</Label>
            <RadioGroup value={feedbackType} onValueChange={setFeedbackType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="confirmed" id="confirmed" />
                <Label htmlFor="confirmed" className="flex items-center space-x-2 cursor-pointer">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Yes, this is correct</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rejected" id="rejected" />
                <Label htmlFor="rejected" className="flex items-center space-x-2 cursor-pointer">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>No, this is incorrect</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uncertain" id="uncertain" />
                <Label htmlFor="uncertain" className="flex items-center space-x-2 cursor-pointer">
                  <HelpCircle className="w-4 h-4 text-yellow-600" />
                  <span>Uncertain / Crossbreed</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Actual Breed Selection */}
          {feedbackType === "rejected" && (
            <div className="space-y-3">
              <Label htmlFor="actual-breed" className="text-base font-medium">
                What is the actual breed?
              </Label>
              <Select value={actualBreed} onValueChange={setActualBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="Select the correct breed" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_BREEDS.map((breed) => (
                    <SelectItem key={breed} value={breed}>
                      {breed}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-3">
            <Label htmlFor="comments" className="text-base font-medium">
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Any additional information about the animal or image quality..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={!feedbackType || isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>

        <div className="text-xs text-muted-foreground">
          Your feedback is anonymous and helps train our AI model to better serve farmers across India.
        </div>
      </div>
    </Card>
  )
}
