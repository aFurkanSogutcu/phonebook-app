from fastapi import FastAPI, HTTPException, Request
from contextlib import asynccontextmanager
import redis, os, time

def make_redis():
    return redis.Redis(
        host=os.getenv("REDIS_HOST", "redis"),
        port=int(os.getenv("REDIS_PORT", "6379")),
        decode_responses=True
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    r = make_redis()

    # Redis hazır olana kadar retry
    for _ in range(30):
        try:
            if r.ping():
                break
        except redis.exceptions.RedisError:
            time.sleep(0.5)
    else:
        raise RuntimeError("Redis not available")

    # örnek veri seed et
    if r.scard("contacts:ids") == 0:
        r.sadd("contacts:ids", 1, 2, 3)
        r.hset("contact:1", mapping={"name": "Ayşe Yılmaz", "phone": "+90 555 111 22 33"})
        r.hset("contact:2", mapping={"name": "Mehmet Demir", "phone": "+90 555 222 33 44"})
        r.hset("contact:3", mapping={"name": "Elif Kaya", "phone": "+90 555 333 44 55"})

    app.state.redis = r
    yield   # burada uygulama çalışıyor olacak
    # uygulama kapanırken cleanup yapabilirsin (gerekirse)

app = FastAPI(lifespan=lifespan)

@app.get("/health")
def health(request: Request):
    try:
        request.app.state.redis.ping()
        return {"status": "ok"}
    except redis.exceptions.RedisError:
        raise HTTPException(status_code=503, detail="redis unavailable")

@app.get("/contacts")
def list_contacts(request: Request):
    r = request.app.state.redis
    ids = sorted(r.smembers("contacts:ids"))
    return [{"id": cid, **r.hgetall(f"contact:{cid}")} for cid in ids]
