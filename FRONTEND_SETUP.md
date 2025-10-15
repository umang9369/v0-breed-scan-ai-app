# Frontend Setup Instructions

This document provides step-by-step instructions to set up and run the upgraded frontend that integrates with the PashuSuchak backend.

## What's Been Updated

The frontend has been upgraded to:
- Connect to the real PashuSuchak backend API (`/predict/` endpoint)
- Handle RAG responses and clarifying questions from the backend
- Display breed predictions with confidence scores
- Show AI explanations when available
- Include proper error handling and loading states

## Prerequisites

1. **Node.js** (v18 or higher)
2. **pnpm** (or npm/yarn)
3. **PashuSuchak Backend** running on `http://localhost:8000`

## Setup Steps

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Backend URL

Create a `.env.local` file in the root directory:

```bash
# Backend API Configuration
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000/predict/

# Optional: Set to 'development' to show debug information
NODE_ENV=development
```

**Note**: If you don't create `.env.local`, the app will default to `http://localhost:8000/predict/`

### 3. Start the Development Server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### 4. Start the Backend

Make sure your PashuSuchak backend is running:

```bash
# In your backend directory
uvicorn main:app --reload
```

The backend should be running on `http://localhost:8000`

## Testing the Integration

1. Open `http://localhost:3000/breed-identification`
2. Upload an image of cattle or buffalo
3. The app will:
   - Show a loading progress bar
   - Send the image to your backend `/predict/` endpoint
   - Display the breed prediction with confidence score
   - Show RAG explanations (if available)
   - Display clarifying questions (if the AI is uncertain)

## Backend API Requirements

Your backend should accept POST requests to `/predict/` with:
- **Content-Type**: `multipart/form-data`
- **Body**: FormData with a `file` field containing the image

Expected response format:
```json
{
  "detection": { /* detection results */ },
  "breed_prediction": {
    "breed": "Gir",
    "confidence": 0.8945
  },
  "rag_response": "This appears to be a Gir cattle...",
  "clarifying_questions": "Could you provide more details about..."
}
```

## CORS Configuration

Make sure your FastAPI backend includes CORS middleware:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure your backend has CORS enabled for `http://localhost:3000`

2. **Backend Not Found**: Verify your backend is running on `http://localhost:8000`

3. **File Upload Issues**: Check that your backend accepts `multipart/form-data`

4. **Environment Variables**: Make sure `.env.local` is in the root directory

### Debug Mode

Set `NODE_ENV=development` in your `.env.local` to see:
- Detection details in the results
- Console logs for debugging
- Additional error information

## File Structure

```
├── components/breed-identification/
│   ├── breed-identification-interface.tsx  # Main interface (updated)
│   ├── image-upload.tsx                    # File upload component (updated)
│   ├── prediction-results.tsx              # Results display (updated)
│   └── feedback-form.tsx                   # User feedback form
├── lib/
│   ├── config.ts                           # Configuration (new)
│   └── types.ts                            # TypeScript types (updated)
└── .env.local                              # Environment variables (create this)
```

## Next Steps

1. **Test with Real Images**: Upload various cattle/buffalo images to test the integration
2. **Customize UI**: Modify the styling in the component files as needed
3. **Add Features**: Consider adding features like:
   - Image history
   - Batch upload
   - Export results
   - User authentication

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify the backend is running and accessible
3. Check the network tab for API call details
4. Ensure all environment variables are set correctly
