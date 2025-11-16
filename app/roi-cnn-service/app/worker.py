import asyncio
import json
import redis.asyncio as redis

STREAM_KEY = "cnn_jobs"
GROUP = "cnn_workers"
CONSUMER = "worker-1"

async def create_group_if_not_exists(r: redis.Redis):
    try:
        await r.xgroup_create(STREAM_KEY, GROUP, id="0", mkstream=True)
        print(f"Group {GROUP} created on stream {STREAM_KEY}")
    except redis.ResponseError as e:
        if "BUSYGROUP" in str(e):
            print(f"Group {GROUP} already exists")
        else:
            raise

async def process_message(r: redis.Redis, msg_id: str, fields: dict):
    print("Raw fields:", fields)
    job_id = fields.get("job_id")          # <-- ตอนนี้เป็น str แล้ว
    image_path = fields.get("image_path")
    roi = json.loads(fields.get("roi") or "{}")
    model = fields.get("model", "default")

    print(f"Processing job_id={job_id}, image_path={image_path}, model={model}")

    # update status -> processing
    await r.hset(f"job:{job_id}", mapping={"status": "processing"})
    print(f"Set job:{job_id} status=processing")

    # TODO: run CNN จริง ๆ
    result = {"volume": 123.45, "extra": "demo"}  # mock

    await r.hset(
        f"job:{job_id}",
        mapping={
            "status": "done",
            "result": json.dumps(result),
            "finished_at": "2025-11-16T00:00:00Z",
        },
    )
    print(f"Set job:{job_id} status=done")

async def worker():
    r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)
    print("Starting worker...")
    await create_group_if_not_exists(r)
    print("Worker started...")

    while True:
        print("Waiting for message...")
        resp = await r.xreadgroup(
            groupname=GROUP,
            consumername=CONSUMER,
            streams={STREAM_KEY: '>'},
            count=1,
            block=5000,
        )

        if not resp:
            print("No new messages, waiting...")
            continue

        print("Received message:", resp)

        for _, messages in resp:
            for msg_id, fields in messages:
                try:
                    print("Processing message:", msg_id)
                    await process_message(r, msg_id, fields)
                    print("Message processed:", msg_id)
                    await r.xack(STREAM_KEY, GROUP, msg_id)
                except Exception as e:
                    print("Error:", e)
                    job_id = fields.get("job_id")
                    if job_id:
                        await r.hset(f"job:{job_id}", mapping={"status": "failed"})

if __name__ == "__main__":
    asyncio.run(worker())
