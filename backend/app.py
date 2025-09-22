from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uuid

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------
# Models
# -----------------
class Profile(BaseModel):
    role: str | None = None
    experience_level: str | None = None
    skills: list[str] | None = []
    recent_project: str | None = None
    preferred_difficulty: str | None = None
    progress: int | None = 0
    current_round: int | None = 1

sessions = {}

# -----------------
# Routes
# -----------------
@app.post("/start_session")
def start_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {
        "profile": {"progress": 0, "current_round": 1},
        "used_questions": [],
        "qa_history": []
    }
    return {"session_id": session_id}

@app.post("/update_profile/{session_id}")
async def update_profile(session_id: str, request: Request):
    if session_id not in sessions:
        return {"error": "Invalid session_id"}
    data = await request.json()
    sessions[session_id]["profile"].update(data)
    return {"message": "Profile updated", "profile": sessions[session_id]["profile"]}

@app.get("/get_profile/{session_id}")
def get_profile(session_id: str):
    if session_id not in sessions:
        return {"error": "Invalid session_id"}
    return sessions[session_id]["profile"]

@app.post("/update_progress/{session_id}")
async def update_progress(session_id: str, request: Request):
    if session_id not in sessions:
        return {"error": "Invalid session_id"}
    data = await request.json()
    new_progress = data.get("progress", 0)
    sessions[session_id]["profile"]["progress"] = new_progress
    return {"message": "Progress updated", "progress": new_progress}
