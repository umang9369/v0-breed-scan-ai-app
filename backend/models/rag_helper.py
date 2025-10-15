"""
RAG (Retrieval-Augmented Generation) Helper for PashuSuchak AI
Provides AI explanations when breed prediction confidence is low
"""

import os
import logging
from typing import Optional, Dict, Any
from openai import OpenAI
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAI Configuration
# Your actual OpenAI API key
OPENAI_API_KEY = "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"

# Knowledge base path
KNOWLEDGE_PATH = "backend/models/knowledge/breed_knowledge.txt"

# Initialize OpenAI client
try:
    client = OpenAI(api_key=OPENAI_API_KEY)
    logger.info("✅ OpenAI client initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize OpenAI client: {e}")
    client = None

def load_knowledge_base() -> str:
    """
    Load the breed knowledge base from file
    
    Returns:
        str: Knowledge base content
    """
    try:
        if os.path.exists(KNOWLEDGE_PATH):
            with open(KNOWLEDGE_PATH, "r", encoding="utf-8") as f:
                knowledge = f.read()
            logger.info(f"✅ Loaded knowledge base from {KNOWLEDGE_PATH}")
            return knowledge
        else:
            logger.warning(f"⚠️ Knowledge base file not found: {KNOWLEDGE_PATH}")
            return get_default_knowledge()
    except Exception as e:
        logger.error(f"❌ Error loading knowledge base: {e}")
        return get_default_knowledge()

def get_default_knowledge() -> str:
    """
    Get default breed knowledge if file is not available
    
    Returns:
        str: Default knowledge base content
    """
    return """
    Indian Cattle Breeds Knowledge Base:
    
    SAHIWAL:
    - Origin: Punjab region, India/Pakistan
    - Characteristics: Reddish brown color, drooping ears, hump in males
    - Milk yield: 2000-3000 liters per lactation
    - Adaptability: Heat tolerant, good for tropical climates
    - Uses: Dairy production, crossbreeding programs
    
    GIR:
    - Origin: Gujarat, India
    - Characteristics: Red and white spotted, large hump, long ears
    - Milk yield: 1500-2000 liters per lactation
    - Adaptability: Hardy, drought resistant
    - Uses: Dairy and draught purposes
    
    RED SINDHI:
    - Origin: Sindh region, Pakistan
    - Characteristics: Deep red color, white markings on face and legs
    - Milk yield: 1800-2500 liters per lactation
    - Adaptability: Heat tolerant, disease resistant
    - Uses: Primarily dairy production
    
    THARPARKAR:
    - Origin: Thar Desert, Rajasthan
    - Characteristics: White or light gray color, medium size
    - Milk yield: 1200-1800 liters per lactation
    - Adaptability: Desert adapted, drought resistant
    - Uses: Dairy and draught in arid regions
    
    HARIANA:
    - Origin: Haryana, India
    - Characteristics: White or light gray, compact body
    - Milk yield: 1000-1500 liters per lactation
    - Adaptability: Good for northern plains
    - Uses: Dual purpose (dairy and draught)
    
    JERSEY (Exotic):
    - Origin: Jersey Island, UK
    - Characteristics: Small size, fawn color, no hump
    - Milk yield: 4000-6000 liters per lactation
    - Adaptability: Requires good management, heat sensitive
    - Uses: High milk production
    
    HOLSTEIN FRIESIAN (Exotic):
    - Origin: Netherlands/Germany
    - Characteristics: Black and white patches, large size
    - Milk yield: 6000-8000 liters per lactation
    - Adaptability: Requires intensive management, heat sensitive
    - Uses: Commercial dairy production
    
    CROSSBREED IDENTIFICATION:
    - Look for mixed characteristics from parent breeds
    - Size, color, and conformation may vary
    - Milk yield typically intermediate between parents
    - May show hybrid vigor in some traits
    """

def create_vector_store(knowledge_text: str) -> Optional[FAISS]:
    """
    Create FAISS vector store from knowledge text
    
    Args:
        knowledge_text (str): Knowledge base content
        
    Returns:
        FAISS: Vector store for similarity search
    """
    try:
        if not client:
            logger.error("❌ OpenAI client not initialized")
            return None
        
        # Create documents from knowledge
        docs = [Document(page_content=knowledge_text)]
        
        # Split text into chunks
        text_splitter = CharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separator="\n\n"
        )
        chunks = text_splitter.split_documents(docs)
        
        logger.info(f"📚 Created {len(chunks)} knowledge chunks")
        
        # Create embeddings and vector store
        embeddings = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
        vector_store = FAISS.from_documents(chunks, embeddings)
        
        logger.info("✅ Vector store created successfully")
        return vector_store
        
    except Exception as e:
        logger.error(f"❌ Error creating vector store: {e}")
        return None

def generate_explanation(image_path: str, prediction_result: Dict[str, Any]) -> str:
    """
    Generate RAG-based explanation for uncertain breed predictions
    
    Args:
        image_path (str): Path to the uploaded image
        prediction_result (dict): Results from breed prediction
        
    Returns:
        str: AI-generated explanation
    """
    try:
        if not client:
            return "AI explanation service is not available. Please check OpenAI API configuration."
        
        logger.info("🤖 Generating RAG explanation...")
        
        # Load knowledge base
        knowledge = load_knowledge_base()
        
        # Create vector store
        vector_store = create_vector_store(knowledge)
        if not vector_store:
            return "Unable to create knowledge base for explanation."
        
        # Prepare query based on prediction results
        breed = prediction_result.get("breed", "unknown")
        confidence = prediction_result.get("confidence", 0.0)
        
        query = f"""
        Breed prediction results: {breed} with {confidence:.2f} confidence.
        Please explain:
        1. What this breed is known for
        2. Key characteristics to look for
        3. Possible reasons for uncertainty
        4. Similar breeds that might be confused
        """
        
        # Search for relevant knowledge
        relevant_docs = vector_store.similarity_search(query, k=3)
        context = "\n\n".join([doc.page_content for doc in relevant_docs])
        
        # Generate explanation using OpenAI
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": """You are an expert veterinary AI assistant specializing in Indian cattle breeds. 
                    Provide clear, helpful explanations about breed identification, characteristics, and common confusions.
                    Be concise but informative, focusing on practical insights for farmers."""
                },
                {
                    "role": "user",
                    "content": f"""Based on the following knowledge base and prediction results, provide a helpful explanation:

KNOWLEDGE BASE:
{context}

PREDICTION RESULTS:
- Predicted Breed: {breed}
- Confidence: {confidence:.2f}
- Image: {os.path.basename(image_path)}

Please provide a clear explanation that helps the user understand the breed identification result."""
                }
            ],
            max_tokens=500,
            temperature=0.7
        )
        
        explanation = response.choices[0].message.content
        logger.info("✅ RAG explanation generated successfully")
        
        return explanation
        
    except Exception as e:
        logger.error(f"❌ Error generating RAG explanation: {e}")
        return f"Unable to generate explanation due to an error: {str(e)}"

def generate_clarifying_questions(prediction_result: Dict[str, Any]) -> str:
    """
    Generate clarifying questions for uncertain predictions
    
    Args:
        prediction_result (dict): Results from breed prediction
        
    Returns:
        str: Clarifying questions for the user
    """
    try:
        breed = prediction_result.get("breed", "unknown")
        confidence = prediction_result.get("confidence", 0.0)
        
        if confidence < 0.3:
            return """The AI is very uncertain about this breed identification. To help improve accuracy, could you provide:

• **Size and Build**: Is this animal large, medium, or small? Any distinctive body shape?
• **Color and Markings**: What is the primary color? Any spots, patches, or distinctive markings?
• **Physical Features**: Any notable features like ear shape, hump size, or horn characteristics?
• **Location**: What region/state is this animal from?
• **Purpose**: Is this animal used for dairy, draught, or both?
• **Known History**: Do you know anything about the animal's parentage or breeding?"""
        
        elif confidence < 0.5:
            return """The AI has moderate confidence in this breed identification. To confirm, could you verify:

• **Color Pattern**: Does the color match the predicted breed characteristics?
• **Size**: Is the size appropriate for the predicted breed?
• **Region**: Is this breed common in your area?
• **Usage**: Is this animal used for the typical purpose of this breed?"""
        
        else:
            return """The AI is reasonably confident but would appreciate confirmation:

• Does this breed identification seem correct based on your knowledge?
• Are there any characteristics that don't match the predicted breed?"""
            
    except Exception as e:
        logger.error(f"❌ Error generating clarifying questions: {e}")
        return "Could you provide any additional information about this animal to help with breed identification?"

# Test function
if __name__ == "__main__":
    print("🧪 Testing RAG helper...")
    
    # Test knowledge loading
    knowledge = load_knowledge_base()
    print(f"Knowledge base loaded: {len(knowledge)} characters")
    
    # Test vector store creation
    if client:
        vector_store = create_vector_store(knowledge)
        if vector_store:
            print("✅ Vector store created successfully")
        else:
            print("❌ Vector store creation failed")
    else:
        print("❌ OpenAI client not initialized")
