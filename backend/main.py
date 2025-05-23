from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import subprocess
import tempfile
import os
import sys
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Code Editor & Chatbot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
# You'll need to set your API key as an environment variable: GOOGLE_API_KEY
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []

class CodeExecutionRequest(BaseModel):
    code: str
    language: str

def get_llm_response(message: str, conversation_history: List[ChatMessage]) -> str:
    """
    Get response from Gemini model using the current message and conversation history
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        # Build the conversation context
        context_messages = []
        
        # Add conversation history
        for chat_msg in conversation_history:
            if chat_msg.role == "user":
                context_messages.append(f"User: {chat_msg.content}")
            elif chat_msg.role == "assistant":
                context_messages.append(f"Assistant: {chat_msg.content}")
        
        # Add current message
        context_messages.append(f"User: {message}")
        
        # Combine all messages into a single prompt
        full_prompt = "\n".join(context_messages)
        
        # Generate response
        response = model.generate_content(full_prompt)
        
        return response.text
        
    except Exception as e:
        return f"Sorry, I encountered an error while processing your request: {str(e)}"

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        response = get_llm_response(request.message, request.conversation_history)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing chat: {str(e)}")

@app.post("/api/execute")
async def execute_code(request: CodeExecutionRequest):
    """
    Execute code in various languages.
    Note: This is a basic implementation. In production, use proper sandboxing.
    """
    try:
        if request.language == "python":
            return await execute_python(request.code)
        elif request.language == "javascript":
            return await execute_javascript(request.code)
        elif request.language == "java":
            return await execute_java(request.code)
        elif request.language == "cpp":
            return await execute_cpp(request.code)
        else:
            return f"Language '{request.language}' is not supported for server-side execution.\nSupported languages: Python, JavaScript, Java, C++"
            
    except Exception as e:
        return f"Error executing code: {str(e)}"

async def execute_python(code: str) -> str:
    """Execute Python code and return output"""
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            f.flush()
            
            result = subprocess.run(
                [sys.executable, f.name],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            os.unlink(f.name)
            
            if result.returncode == 0:
                return result.stdout if result.stdout else "Code executed successfully (no output)"
            else:
                return f"Error:\n{result.stderr}"
                
    except subprocess.TimeoutExpired:
        return "Error: Code execution timed out (10 seconds limit)"
    except Exception as e:
        return f"Error: {str(e)}"

async def execute_javascript(code: str) -> str:
    """Execute JavaScript code using Node.js"""
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            f.write(code)
            f.flush()
            
            result = subprocess.run(
                ['node', f.name],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            os.unlink(f.name)
            
            if result.returncode == 0:
                return result.stdout if result.stdout else "Code executed successfully (no output)"
            else:
                return f"Error:\n{result.stderr}"
                
    except subprocess.TimeoutExpired:
        return "Error: Code execution timed out (10 seconds limit)"
    except FileNotFoundError:
        return "Error: Node.js not found. Please install Node.js to execute JavaScript code."
    except Exception as e:
        return f"Error: {str(e)}"

async def execute_java(code: str) -> str:
    """Execute Java code"""
    try:
        # Extract class name from code
        import re
        class_match = re.search(r'public class (\w+)', code)
        if not class_match:
            return "Error: No public class found. Java code must contain a public class."
        
        class_name = class_match.group(1)
        
        with tempfile.TemporaryDirectory() as temp_dir:
            java_file = os.path.join(temp_dir, f"{class_name}.java")
            with open(java_file, 'w') as f:
                f.write(code)
            
            # Compile
            compile_result = subprocess.run(
                ['javac', java_file],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            if compile_result.returncode != 0:
                return f"Compilation Error:\n{compile_result.stderr}"
            
            # Run
            run_result = subprocess.run(
                ['java', class_name],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=temp_dir
            )
            
            if run_result.returncode == 0:
                return run_result.stdout if run_result.stdout else "Code executed successfully (no output)"
            else:
                return f"Runtime Error:\n{run_result.stderr}"
                
    except subprocess.TimeoutExpired:
        return "Error: Code execution timed out (10 seconds limit)"
    except FileNotFoundError:
        return "Error: Java compiler not found. Please install Java JDK."
    except Exception as e:
        return f"Error: {str(e)}"

async def execute_cpp(code: str) -> str:
    """Execute C++ code"""
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            cpp_file = os.path.join(temp_dir, "program.cpp")
            exe_file = os.path.join(temp_dir, "program")
            
            with open(cpp_file, 'w') as f:
                f.write(code)
            
            # Compile
            compile_result = subprocess.run(
                ['g++', '-o', exe_file, cpp_file],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if compile_result.returncode != 0:
                return f"Compilation Error:\n{compile_result.stderr}"
            
            # Run
            run_result = subprocess.run(
                [exe_file],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if run_result.returncode == 0:
                return run_result.stdout if run_result.stdout else "Code executed successfully (no output)"
            else:
                return f"Runtime Error:\n{run_result.stderr}"
                
    except subprocess.TimeoutExpired:
        return "Error: Code execution timed out (10 seconds limit)"
    except FileNotFoundError:
        return "Error: C++ compiler not found. Please install g++."
    except Exception as e:
        return f"Error: {str(e)}"

@app.get("/")
async def root():
    return {"message": "Code Editor & Chatbot API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 