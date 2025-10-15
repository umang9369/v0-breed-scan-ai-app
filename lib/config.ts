// Configuration for the application
export const config = {
  // Backend API URL - can be overridden by environment variable
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/predict/',
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  
  // API endpoints
  endpoints: {
    predict: '/predict/',
  }
} as const
