// TypeScript type definitions for BreedScan AI

export interface User {
  id: number
  email: string
  role: "farmer" | "flw" | "admin"
  fullName: string
  phone?: string
  village?: string
  district?: string
  state?: string
  createdAt: string
  isActive: boolean
}

export interface Animal {
  id: number
  ownerId: number
  tagNumber?: string
  species: "cattle" | "buffalo"
  breed?: string
  gender?: "male" | "female"
  dateOfBirth?: string
  weight?: number
  healthStatus: string
  createdAt: string
}

export interface BreedPrediction {
  breed: string
  confidence: number
}

export interface BreedScan {
  id: number
  userId: number
  animalId?: number
  imageUrl: string
  predictedBreed?: string
  confidenceScore?: number
  topPredictions?: BreedPrediction[]
  userFeedback?: "confirmed" | "rejected" | "uncertain"
  actualBreed?: string
  scanLocation?: [number, number] // [lat, lng]
  createdAt: string
}

export interface HeatScan {
  id: number
  userId: number
  animalId?: number
  mediaUrl: string
  mediaType: "image" | "video"
  heatDetected?: boolean
  confidenceScore?: number
  signsDetected?: {
    swollen_vulva?: boolean
    mucus?: boolean
    mounting_behavior?: boolean
  }
  alertSent: boolean
  createdAt: string
}

export interface Metric {
  id: number
  metricName: string
  metricValue: number
  metricDate: string
  district?: string
  state?: string
  createdAt: string
}

export interface UserAchievement {
  id: number
  userId: number
  achievementType: string
  points: number
  badgeLevel: "bronze" | "silver" | "gold"
  earnedAt: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  status: "unread" | "read" | "replied"
  createdAt: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Dashboard data types
export interface DashboardStats {
  totalFarmers: number
  totalFlws: number
  breedsDetected: number
  accuracyRate: number
  conceptionRate: number
  calvingRate: number
}

export interface ChartData {
  name: string
  value: number
  date?: string
}
