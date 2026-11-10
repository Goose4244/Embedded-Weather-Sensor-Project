from fastapi import FastAPI

app = FastAPI()

@app.get("/item/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}