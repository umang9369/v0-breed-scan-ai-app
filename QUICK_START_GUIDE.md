# 🚀 Quick Start Guide - PashuSuchak AI Project

## 🎯 **How to Run the Complete Project**

### **Step 1: Start the Backend Server**

Open a **Command Prompt** or **PowerShell** and run:

```cmd
cd C:\Users\NewUser\v0-breed-scan-ai-app-1\backend
py main-simple.py
```

**Expected Output:**
```
Starting PashuSuchak AI Backend...
Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/docs
INFO:     Started server process [xxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### **Step 2: Start the Frontend Server**

Open a **NEW Command Prompt** or **PowerShell** window and run:

```cmd
cd C:\Users\NewUser\v0-breed-scan-ai-app-1
pnpm dev
```

**Expected Output:**
```
> my-v0-project@0.1.0 dev
> next dev

  ▲ Next.js 14.2.16
  - Local:        http://localhost:3000
  - Network:      http://192.168.x.x:3000

 ✓ Ready in 2.3s
```

## 🌐 **Access Your Application**

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Breed Identification**: http://localhost:3000/breed-identification
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🧪 **Test the System**

1. **Go to**: http://localhost:3000/breed-identification
2. **Upload an image** of cattle or buffalo
3. **Watch the AI** analyze and predict the breed
4. **See explanations** when confidence is low

## 🔧 **Troubleshooting**

### **Backend Won't Start:**
- Make sure you're in the `backend` directory
- Check that Python is installed: `py --version`
- Try: `py -m uvicorn main-simple:app --host 0.0.0.0 --port 8000`

### **Frontend Won't Start:**
- Make sure you're in the main project directory
- Check that pnpm is installed: `pnpm --version`
- Try: `npm run dev` instead

### **Port Already in Use:**
- Backend: Change port in `main-simple.py` from `8000` to `8001`
- Frontend: Change port in `next.config.mjs` or use `pnpm dev --port 3001`

## 📊 **What You'll See**

### **Backend Response:**
```json
{
  "detection": { /* Roboflow detection results */ },
  "breed_prediction": {
    "breed": "Sahiwal",
    "confidence": 0.85
  },
  "rag_response": "This appears to be a Sahiwal cattle...",
  "clarifying_questions": "Could you provide more details...",
  "timestamp": "2024-01-15T10:30:00"
}
```

### **Frontend Features:**
- ✅ Beautiful upload interface
- ✅ Real-time progress tracking
- ✅ Breed prediction display
- ✅ AI explanations
- ✅ Clarifying questions
- ✅ Mobile-friendly design

## 🎉 **Your AI System is Ready!**

Your PashuSuchak AI system includes:
- **Roboflow Integration**: Advanced cattle detection and breed classification
- **OpenAI RAG**: Intelligent explanations when uncertain
- **Beautiful Frontend**: Modern, responsive interface
- **Real API Keys**: All configured and ready to use

---

**🔥 Start both servers and revolutionize cattle breed identification!** 🐄✨
