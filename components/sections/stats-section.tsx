"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Users, UserCheck, Eye, TrendingUp, Heart } from "lucide-react"

interface StatItem {
  icon: React.ReactNode
  label: string
  value: number
  suffix: string
  color: string
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  const stats: StatItem[] = [
    {
      icon: <Users className="w-8 h-8" />,
      label: "Registered Farmers",
      value: 28312,
      suffix: "",
      color: "text-blue-500",
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      label: "Field Livestock Workers",
      value: 83,
      suffix: "",
      color: "text-green-500",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      label: "Breeds Detected",
      value: 2230,
      suffix: "",
      color: "text-purple-500",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: "Accuracy Rate",
      value: 89.5,
      suffix: "%",
      color: "text-orange-500",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      label: "Heat Detection Rate",
      value: 92.3,
      suffix: "%",
      color: "text-red-500",
    },
  ]

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Transforming Livestock Management</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time statistics showcasing the impact of AI-powered livestock management across India
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.label} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className={`${stat.color} mb-4 flex justify-center`}>{stat.icon}</div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-foreground">
                  {isVisible ? (
                    <CountUpAnimation end={stat.value} duration={2000} delay={index * 200} suffix={stat.suffix} />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Data updated in real-time • Covering 15+ states across India</p>
        </div>
      </div>
    </section>
  )
}

// Simple count-up animation component
function CountUpAnimation({
  end,
  duration = 2000,
  delay = 0,
  suffix = "",
}: {
  end: number
  duration?: number
  delay?: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }, delay)

    return () => clearTimeout(timer)
  }, [end, duration, delay])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
