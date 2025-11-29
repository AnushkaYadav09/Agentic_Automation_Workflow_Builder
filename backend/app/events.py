import asyncio
from fastapi import Request
from fastapi.responses import StreamingResponse
import aioredis
import json
from app.config import REDIS_URL

async def log_streamer():
    redis = await aioredis.create_redis_pool(REDIS_URL)
    try:
        while True:
            msg = await redis.lpop("logs")
            if msg:
                yield f"data: {msg.decode()}\n\n"
            else:
                await asyncio.sleep(0.5)
    finally:
        redis.close()
        await redis.wait_closed()

def sse_response():
    return StreamingResponse(log_streamer(), media_type="text/event-stream")
