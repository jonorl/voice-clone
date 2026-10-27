import gradio as gr
import subprocess
import os

import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse

# worker.py loads these on every request, so /health checks they are on the mounted volume.
MODEL_FILES = [
    os.path.join("models", "coqui", "config.json"),
    os.path.join("models", "best_model_822.pth"),
    os.path.join("models", "sample5.wav"),
]

def generate_speech_stateless(text, temperature=0.7, top_p=0.85, top_k=50, seed=42):
    if not text.strip():
        return None, "Please enter some text."

    # A fixed output target for the isolated worker script
    output_wav = "/tmp/output.wav"
    if os.path.exists(output_wav):
        os.remove(output_wav)

    try:
        # Spin up a dedicated, isolated Python process to run inference
        cmd = [
            "python3", "worker.py",
            "--text", text,
            "--temperature", str(temperature),
            "--top_p", str(top_p),
            "--top_k", str(top_k),
            "--seed", str(seed),
            "--output", output_wav
        ]
        
        # This blocks until the worker completely finishes and terminates
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(result.stdout) # Forward stdout to docker logs

        if os.path.exists(output_wav):
            return output_wav, "✅ Audio generated successfully!"
        else:
            return None, "❌ Error: Worker finished but output file was not found."

    except subprocess.CalledProcessError as e:
        error_msg = f"❌ Inference process crashed:\n{e.stderr}"
        print(error_msg)
        return None, error_msg

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
                value="A todo el mundo le gusta el jarabe para la tos, el olor del jarabe para la tos. Pero nadie lo usa como perfume."
            )

            with gr.Accordion("Advanced Parameters", open=False):
                temperature = gr.Slider(0.1, 1.0, value=0.7,  step=0.05, label="Temperature", info="Controls randomness — higher = more varied prosody")
                top_p       = gr.Slider(0.1, 1.0, value=0.85, step=0.05, label="Top P",        info="Nucleus sampling — controls diversity")
                top_k       = gr.Slider(1,   100, value=50,   step=1,    label="Top K",        info="Limits vocabulary selection")
                seed        = gr.Number(value=42, label="Seed", info="Random seed for reproducibility", precision=0)

            generate_btn = gr.Button("🎵 Generate Speech", variant="primary", size="lg")

        with gr.Column(scale=1):
            audio_output  = gr.Audio(label="Generated Audio", type="filepath")
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
        api_name="generate_speech"
    )

    gr.Examples(
        examples=[
            ["Hola, soy Pedro. Bienvenidos a mi demostración de clonación de voz.", 0.7, 0.85, 50, 67],
            ["La inteligencia artificial ha avanzado mucho en los últimos años.",    0.5, 0.9,  40, 42],
            ["¿Cómo va todo? Espero que estés teniendo un excelente día.",           0.8, 0.8,  60, 123],
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
