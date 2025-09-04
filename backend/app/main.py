from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import redis

r = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", "6379")),
    db=0,
    decode_responses=True,  # bytes yerine str döndürsün
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

class Contact(BaseModel):
    name: str
    phone: str

@app.get("/api/contacts", response_model=List[Contact])
def list_contacts():
    data = r.hgetall("contacts")  # tek bir hash: name -> phone
    return [{"name": k, "phone": v} for k, v in data.items()]

@app.post("/api/contacts", status_code=201)
def add_contact(c: Contact):
    if r.hexists("contacts", c.name):
        raise HTTPException(status_code=409, detail="Bu isim zaten var")
    r.hset("contacts", c.name, c.phone)
    return {"ok": True}

@app.delete("/api/contacts/{name}")
def delete_contact(name: str):
    removed = r.hdel("contacts", name)
    if removed == 0:
        raise HTTPException(status_code=404, detail="Kayıt bulunamadı")
    return {"ok": True}

@app.delete("/api/contacts")
def clear_contacts():
    r.delete("contacts")
    return {"ok": True}


# @app.get("/health")
# def health(request: Request):
#     try:
#         request.app.state.redis.ping()
#         return {"status": "ok"}
#     except redis.exceptions.RedisError:
#         raise HTTPException(status_code=503, detail="redis unavailable")

# @app.get("/contacts")
# def list_contacts(request: Request):
#     r = request.app.state.redis
#     ids = sorted(r.smembers("contacts:ids"))
#     return [{"id": cid, **r.hgetall(f"contact:{cid}")} for cid in ids]
