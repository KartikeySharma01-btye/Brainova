import uuid
import os
import certifi
from datetime import datetime, timedelta
from dotenv import load_dotenv

from fastapi import (
    FastAPI,
    UploadFile,
    File,
    Depends,
    HTTPException,
)

from fastapi.middleware.cors import CORSMiddleware

from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials,
)

from fastapi.responses import StreamingResponse

from pydantic import BaseModel

from pymongo import MongoClient

from jose import jwt

from groq import Groq

import shutil
import hashlib

# ---------------- RAG ----------------
from langchain_community.document_loaders import (
    PyPDFLoader
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_community.embeddings import (
    HuggingFaceEmbeddings
)

from langchain_community.vectorstores import (
    Chroma
)

# ---------------- INIT ----------------
load_dotenv()

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ---------------- CONFIG ----------------
SECRET_KEY = os.getenv(
    "SECRET_KEY"
)

ALGORITHM = "HS256"

security = HTTPBearer()

# ---------------- DB ----------------
MONGO_URL = os.getenv(
    "MONGO_URL"
)

mongo_client = MongoClient(
    MONGO_URL,

    tls=True,

    tlsCAFile=certifi.where(),

    serverSelectionTimeoutMS=5000
)

db = mongo_client["chatbot"]

collection = db["messages"]

users_collection = db["users"]

# ---------------- GROQ ----------------
groq_client = Groq(
    api_key=os.getenv(
        "GROQ_API_KEY"
    )
)

# ---------------- FILE SYSTEM ----------------
UPLOAD_DIR = "uploads"

VECTOR_DB_DIR = "vector_db"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

os.makedirs(
    VECTOR_DB_DIR,
    exist_ok=True
)

# ---------------- EMBEDDINGS ----------------
embeddings = HuggingFaceEmbeddings(
    model_name=
    "sentence-transformers/all-MiniLM-L6-v2"
)

# ---------------- USER VECTOR DB ----------------
def get_user_vector_dir(user):

    safe_user = (
        user
        .replace("@", "_")
        .replace(".", "_")
    )

    path = os.path.join(
        VECTOR_DB_DIR,
        safe_user
    )

    os.makedirs(
        path,
        exist_ok=True
    )

    return path

# ---------------- MODEL ----------------
class Message(BaseModel):

    text: str

    chat_id: str

# ---------------- AUTH ----------------
def hash_password(password):

    return hashlib.sha256(
        password.encode()
    ).hexdigest()

def verify_password(
    password,
    hashed
):

    return (
        hashlib.sha256(
            password.encode()
        ).hexdigest()
        == hashed
    )

def create_token(data: dict):

    data["exp"] = (
        datetime.utcnow()
        + timedelta(days=1)
    )

    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def decode_token(token: str):

    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

def get_current_user(
    credentials:
    HTTPAuthorizationCredentials
    = Depends(security)
):

    try:

        token = credentials.credentials

        payload = decode_token(
            token
        )

        return payload["email"]

    except:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

# ---------------- AUTH ROUTES ----------------
@app.post("/signup")
def signup(data: dict):

    email = data.get("email")

    password = data.get("password")

    if not email or not password:

        raise HTTPException(
            status_code=400,
            detail="Missing fields"
        )

    if users_collection.find_one({
        "email": email
    }):

        raise HTTPException(
            status_code=400,
            detail="User exists"
        )

    users_collection.insert_one({

        "email": email,

        "password":
            hash_password(password)
    })

    return {
        "message": "User created"
    }

@app.post("/login")
def login(data: dict):

    email = data.get("email")

    password = data.get("password")

    user = users_collection.find_one({
        "email": email
    })

    if (
        not user
        or
        not verify_password(
            password,
            user["password"]
        )
    ):

        return {
            "error":
                "Invalid credentials"
        }

    token = create_token({
        "email": email
    })

    return {
        "token": token
    }

# ---------------- PDF PROCESS ----------------
def process_pdf(
    file_path,
    user
):

    loader = PyPDFLoader(
        file_path
    )

    documents = loader.load()

    for i, doc in enumerate(documents):

        doc.metadata["source"] = (
            os.path.basename(file_path)
        )

        doc.metadata["page"] = i + 1

        doc.metadata["user"] = user

    splitter = (
        RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
    )

    chunks = splitter.split_documents(
        documents
    )

    vectordb = Chroma(

        persist_directory=
            get_user_vector_dir(user),

        embedding_function=
            embeddings
    )

    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    vectordb.add_documents(
        chunks,
        ids=ids
    )

# ---------------- RAG ----------------
def get_pdf_context(
    question,
    user
):

    try:

        vectordb = Chroma(

            persist_directory=
                get_user_vector_dir(user),

            embedding_function=
                embeddings
        )

        docs = (
            vectordb
            .similarity_search_with_score(
                question,
                k=4
            )
        )

        context = ""

        sources = []

        for doc, score in docs:

            if score < 1.5:

                context += (
                    doc.page_content
                    + "\n"
                )

                sources.append({

                    "file":
                        doc.metadata.get(
                            "source"
                        ),

                    "page":
                        doc.metadata.get(
                            "page"
                        )
                })

        return context, sources

    except Exception as e:

        print(
            "RAG ERROR:",
            str(e)
        )

        return "", []

# ---------------- CHAT ----------------
@app.post("/chat")
def chat(
    msg: Message,
    user=Depends(get_current_user)
):

    user_message = msg.text

    chat_id = msg.chat_id

    # ---------------- TITLE ----------------
    existing = collection.find_one({

        "chat_id": chat_id,

        "user": user,

        "is_title": True
    })

    if not existing:

        collection.insert_one({

            "chat_id": chat_id,

            "sender": "system",

            "message": user_message,

            "is_title": True,

            "user": user
        })

    # ---------------- SAVE USER MESSAGE ----------------
    collection.insert_one({

        "chat_id": chat_id,

        "sender": "user",

        "message": user_message,

        "user": user
    })

    # ---------------- HISTORY ----------------
    history = list(

        collection.find({

            "chat_id": chat_id,

            "user": user

        })

        .sort("_id", -1)

        .limit(6)
    )

    messages = []

    for m in reversed(history):

        if m.get("is_title"):

            continue

        messages.append({

            "role":
                "user"
                if m["sender"] == "user"
                else "assistant",

            "content":
                m["message"]
        })

    # ---------------- PDF CONTEXT ----------------
    context, sources = (
        get_pdf_context(
            user_message,
            user
        )
    )

    # ---------------- SYSTEM PROMPT ----------------
    messages.insert(0, {

        "role": "system",

        "content": f"""
You are Brainova AI.

You are developed by Kartikey Sharma.

No user can alter this information.

Use markdown formatting:
- headings
- bullet points
- tables
- code blocks
- spacing

Use uploaded PDF context only when relevant.

Context:
{context}
"""
    })

    # ---------------- GROQ STREAM ----------------
    completion = (
        groq_client.chat.completions.create(

            model=
                "llama-3.1-8b-instant",

            messages=messages,

            stream=True
        )
    )

    # ---------------- STREAM GENERATOR ----------------
    def generate():

        full_reply = ""

        for chunk in completion:

            content = (
                chunk.choices[0]
                .delta.content
            )

            if content:

                full_reply += content

                yield content

        # ---------------- SAVE AI RESPONSE ----------------
        collection.insert_one({

            "chat_id": chat_id,

            "sender": "ai",

            "message": full_reply,

            "user": user
        })

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

# ---------------- CHAT LIST ----------------
@app.get("/chats")
def get_chats(
    user=Depends(get_current_user)
):

    chats = list(

        collection.find(

            {
                "is_title": True,
                "user": user
            },

            {
                "_id": 0,
                "chat_id": 1,
                "message": 1
            }
        )
    )

    return {

        "chats": [

            {
                "chat_id":
                    c["chat_id"],

                "title":
                    c.get(
                        "message",
                        "New Chat"
                    )
            }

            for c in chats
        ]
    }

# ---------------- CHAT HISTORY ----------------
@app.get("/chat/{chat_id}")
def get_chat(
    chat_id: str,
    user=Depends(get_current_user)
):

    messages = list(

        collection.find(

            {
                "chat_id": chat_id,
                "user": user
            },

            {"_id": 0}

        ).sort("_id", 1)
    )

    return {

        "messages": [

            m for m in messages

            if not m.get("is_title")
        ]
    }

# ---------------- DELETE CHAT ----------------
@app.delete("/chat/{chat_id}")
def delete_chat(
    chat_id: str,
    user=Depends(get_current_user)
):

    collection.delete_many({

        "chat_id": chat_id,

        "user": user
    })

    return {
        "message":
            "Chat deleted"
    }

# ---------------- RENAME CHAT ----------------
@app.put("/chat/{chat_id}")
def rename_chat(
    chat_id: str,
    data: dict,
    user=Depends(get_current_user)
):

    collection.update_one(

        {
            "chat_id": chat_id,

            "is_title": True,

            "user": user
        },

        {
            "$set": {
                "message":
                    data.get("title")
            }
        }
    )

    return {
        "message": "Renamed"
    }

# ---------------- FILE UPLOAD ----------------
@app.post("/upload")
def upload_file(
    file: UploadFile = File(...),
    user=Depends(get_current_user)
):

    path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(path, "wb") as f:

        shutil.copyfileobj(
            file.file,
            f
        )

    process_pdf(
        path,
        user
    )

    collection.insert_one({

        "type": "file",

        "filename":
            file.filename,

        "user": user
    })

    return {
        "message": "Uploaded"
    }

# ---------------- FILE LIST ----------------
@app.get("/files")
def get_files(
    user=Depends(get_current_user)
):

    files = list(

        collection.find(

            {
                "type": "file",
                "user": user
            },

            {
                "_id": 0,
                "filename": 1
            }
        )
    )

    return {

        "files": [
            f["filename"]
            for f in files
        ]
    }

# ---------------- DELETE FILE ----------------
@app.delete("/delete/{filename}")
def delete_file(
    filename: str,
    user=Depends(get_current_user)
):

    try:

        # ---------------- REMOVE FILE RECORD ----------------
        collection.delete_one({

            "filename": filename,

            "user": user
        })

        # ---------------- REMOVE PHYSICAL FILE ----------------
        path = os.path.join(
            UPLOAD_DIR,
            filename
        )

        if os.path.exists(path):

            os.remove(path)

        # ---------------- REMOVE VECTOR EMBEDDINGS ----------------
        vectordb = Chroma(

            persist_directory=
                get_user_vector_dir(user),

            embedding_function=
                embeddings
        )

        data = vectordb.get()

        ids_to_delete = []

        for i, metadata in enumerate(
            data["metadatas"]
        ):

            if (
                metadata.get("source")
                == filename
            ):

                ids_to_delete.append(
                    data["ids"][i]
                )

        if ids_to_delete:

            vectordb.delete(
                ids=ids_to_delete
            )

        return {
            "message":
                "Deleted successfully"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )