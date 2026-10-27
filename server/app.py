import json
import os
import subprocess
import sys
import tempfile

import gradio as gr
import scipy.io.wavfile
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# worker.py loads these on every request, so /health checks they are on the mounted volume.
MODEL_FILES = [
    os.path.join("models", "coqui", "config.json"),
    os.path.join("models", "coqui", "vocab.json"),
    os.path.join("models", "coqui", "dvae.pth"),
    os.path.join("models", "coqui", "mel_stats.pth"),
    os.path.join("models", "best_model_822.pth"),
    os.path.join("models", "sample5.wav"),
]

# The Gradio API is public, so every value is checked here rather than trusting the UI's sliders. CPU inference takes
# roughly as long as the speech it produces, so the text is capped to keep one request from holding the queue.
MAX_TEXT_CHARS = 1000
WORKER_TIMEOUT_SECONDS = 600


def generate_speech_stateless(text, temperature=0.7, top_p=0.85, top_k=50, seed=42):
    text = (text or "").strip()
    if not text:
        return None, "Please enter some text."
    if len(text) > MAX_TEXT_CHARS:
        return None, f"Please keep the text under {MAX_TEXT_CHARS} characters."

    try:
        params = {
            "text": text,
            "temperature": min(max(float(temperature), 0.1), 1.0),
            "top_p": min(max(float(top_p), 0.1), 1.0),
            "top_k": min(max(int(top_k), 1), 100),
            "seed": int(seed),
        }
    except (TypeError, ValueError):
        return None, "Temperature, Top P, Top K and Seed must be numbers."

    # Each request gets its own directory, so overlapping requests cannot read each other's audio.
    with tempfile.TemporaryDirectory() as workdir:
        params["output"] = os.path.join(workdir, "output.wav")
        try:
            # The model runs in a fresh process that exits afterwards, so its memory is returned after every request.
            # The parameters go over stdin rather than argv, so user text can never be read as a worker option.
            result = subprocess.run(
                [sys.executable, "worker.py"],
                input=json.dumps(params),
                capture_output=True,
                text=True,
                check=True,
                timeout=WORKER_TIMEOUT_SECONDS,
            )
            print(result.stdout)  # Forward stdout to docker logs
        except subprocess.TimeoutExpired:
            print(f"Inference timed out after {WORKER_TIMEOUT_SECONDS}s")
            return None, "❌ Generation took too long. Try a shorter text."
        except subprocess.CalledProcessError as e:
            # The traceback stays in the logs; callers only learn that it failed.
            print(f"Inference process crashed:\n{e.stderr}")
            return None, "❌ Inference failed. Please try again."

        if not os.path.exists(params["output"]):
            return None, "❌ Error: Worker finished but output file was not found."

        # Read into memory so the directory can be removed; Gradio writes the array back out as a WAV for the client.
        sample_rate, audio = scipy.io.wavfile.read(params["output"])
        return (sample_rate, audio), "✅ Audio generated successfully!"


# ── Gradio UI ─────────────────────────────────────────────────────────────────
with gr.Blocks(title="Voice Clone - Pedro") as demo:
    gr.Markdown(
        """
        # 🎙️ Voice Cloning Demo
        ### AI-powered voice synthesis using XTTS v2

        Enter your text in Spanish and adjust the parameters to generate speech
        in the cloned voice. Play with the settings to find your preferred output!

        > ⚠️ **First generation takes longer** — the model loads on demand.
        """
    )

    with gr.Row():
        with gr.Column(scale=2):
            text_input = gr.Textbox(
                label="Text to Synthesize",
                placeholder="A todo el mundo le gusta el jarabe para la tos...",
                lines=3,
                value=(
                    "A todo el mundo le gusta el jarabe para la tos, el olor del jarabe para la tos. "
                    "Pero nadie lo usa como perfume."
                ),
            )

            with gr.Accordion("Advanced Parameters", open=False):
                temperature = gr.Slider(
                    0.1,
                    1.0,
                    value=0.7,
                    step=0.05,
                    label="Temperature",
                    info="Controls randomness — higher = more varied prosody",
                )
                top_p = gr.Slider(
                    0.1, 1.0, value=0.85, step=0.05, label="Top P", info="Nucleus sampling — controls diversity"
                )
                top_k = gr.Slider(1, 100, value=50, step=1, label="Top K", info="Limits vocabulary selection")
                seed = gr.Number(value=42, label="Seed", info="Random seed for reproducibility", precision=0)

            generate_btn = gr.Button("🎵 Generate Speech", variant="primary", size="lg")

        with gr.Column(scale=1):
            audio_output = gr.Audio(label="Generated Audio", type="filepath")
            status_output = gr.Textbox(label="Status", interactive=False)

    gr.Markdown(
        """
        ### Tips for best results:
        - **Temperature**: Lower (0.3–0.5) for consistent, clear speech. Higher (0.7–0.9) for more natural variation.
        - **Top P & Top K**: Defaults work well for most cases.
        - **Seed**: Use the same seed to reproduce identical audio from the same text.

        ---
        *Powered by [Coqui XTTS v2](https://github.com/coqui-ai/TTS) | Fine-tuned for Spanish*
        """
    )

    generate_btn.click(
        fn=generate_speech_stateless,
        inputs=[text_input, temperature, top_p, top_k, seed],
        outputs=[audio_output, status_output],
        api_name="generate_speech",
    )

    gr.Examples(
        examples=[
            ["Hola, soy Pedro. Bienvenidos a mi demostración de clonación de voz.", 0.7, 0.85, 50, 67],
            ["La inteligencia artificial ha avanzado mucho en los últimos años.", 0.5, 0.9, 40, 42],
            ["¿Cómo va todo? Espero que estés teniendo un excelente día.", 0.8, 0.8, 60, 123],
        ],
        inputs=[text_input, temperature, top_p, top_k, seed],
    )

app = FastAPI()


# The model loads in a fresh worker for each request, so there is nothing resident to check: the server is ready if it
# answers and the model files are mounted. version is the commit the image was built from, so the deploy's smoke test
# can tell the new container is the one answering.
# HEAD is listed because the README's status badge (Shields) checks with it, and FastAPI does not add it to GET routes.
@app.api_route("/health", methods=["GET", "HEAD"])
def health():
    missing = [f for f in MODEL_FILES if not os.path.exists(f)]
    body = {"status": "error" if missing else "ok", "version": os.environ.get("GIT_SHA", "dev")}
    if missing:
        body["missing"] = missing
    return JSONResponse(body, status_code=503 if missing else 200)


# Gradio is mounted on FastAPI rather than launched on its own so /health can sit beside it on the same port.
app = gr.mount_gradio_app(app, demo, path="", ssr_mode=False)

# ── Launch ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7860)
