# Change from 3.10 to 3.11
FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    ffmpeg libsndfile1 espeak-ng build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# The deploy passes the commit being built; /health reports it so the smoke test can tell the new container is live.
# Declared after the installs so a new commit does not invalidate the cached pip layers.
ARG GIT_SHA=dev
ENV GIT_SHA=$GIT_SHA

ENV CUDA_VISIBLE_DEVICES=""
EXPOSE 7860

# Lets `docker ps` show whether the server is up with the model mounted. The slim image has no curl or wget, so Python
# makes the request.
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:7860/health', timeout=4)"

CMD ["python", "-X tracemalloc", "app.py"]