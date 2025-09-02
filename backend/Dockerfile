FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Bağımlılıklar
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Uygulama kodu
COPY backend/app ./app

EXPOSE 8000
# FastAPI uygulaman "app.main:app" ise:
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
