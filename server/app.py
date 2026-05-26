import transformers.pytorch_utils
import transformers.generation.configuration_utils as utils
import os
import sys
import numpy as np
import tempfile
import logging
import gc

# ── Monkey-patches (applied once, before any other imports) ──────────────────
if not hasattr(transformers.pytorch_utils, 'isin_mps_friendly'):
    transformers.pytorch_utils.isin_mps_friendly = lambda *args, **kwargs: np.bool_(False)

def _dummy_to_diff_dict(self): return {}
utils.GenerationConfig.to_diff_dict = _dummy_to_diff_dict

logging.getLogger("transformers.generation.configuration_utils").setLevel(logging.ERROR)

# ── Core imports ─────────────────────────────────────────────────────────────
import torch
import scipy.io.wavfile
import gradio as gr

from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

# ── Paths ────────────────────────────────────────────────────────────────────
BASE_MODEL_PATH = os.path.join("models", "coqui")
CHECKPOINT_FILE = os.path.join("models", "best_model_822.pth")
SPEAKER_WAV     = os.path.join("models", "sample5.wav")
DEVICE          = "cuda" if torch.cuda.is_available() else "cpu"

if DEVICE == "cpu":
    print("GPU not available, using CPU (inference will be slower)")
    
gc.collect()
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    torch.cuda.ipc_collect()


# ── Lazy model state ─────────────────────────────────────────────────────────
_model               = None
_gpt_cond_latent     = None
_speaker_embedding   = None

def get_model():
    """Load model and pre-compute speaker latents on first call, then cache."""
    global _model, _gpt_cond_latent, _speaker_embedding

    if _model is not None:
        return _model, _gpt_cond_latent, _speaker_embedding

    print("Loading model on first request — this will take a moment...")

    config = XttsConfig()
    config.load_json(os.path.join(BASE_MODEL_PATH, "config.json"))
    config.model_args.tokenizer_file  = os.path.join(BASE_MODEL_PATH, "vocab.json")
    config.model_args.dvae_checkpoint = os.path.join(BASE_MODEL_PATH, "dvae.pth")
    config.model_args.mel_norm_file   = os.path.join(BASE_MODEL_PATH, "mel_stats.pth")

    model = Xtts.init_from_config(config)
    model.load_checkpoint(
        config,
        checkpoint_path=CHECKPOINT_FILE,
        vocab_path=os.path.join(BASE_MODEL_PATH, "vocab.json"),
        use_deepspeed=False,
    )

    if DEVICE == "cuda":
        model.cuda()

    print("Computing speaker conditioning latents...")
    gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(
        audio_path=SPEAKER_WAV,
        gpt_cond_len=3,
    )

    _model             = model
    _gpt_cond_latent   = gpt_cond_latent
    _speaker_embedding = speaker_embedding

    print("Model ready!")
    return _model, _gpt_cond_latent, _speaker_embedding

# ── Inference ─────────────────────────────────────────────────────────────────

def generate_speech(text, temperature=0.7, top_p=0.85, top_k=50, seed=42):
    if not text.strip():
        return None, "Please enter some text to synthesize."

    torch.manual_seed(int(seed))

    output_path = None
    try:
        print(f"Generating audio for: {text[:50]}...")

        model, gpt_cond_latent, speaker_embedding = get_model()

        outputs = model.inference(
            text,
            language="es",
            gpt_cond_latent=gpt_cond_latent,
            speaker_embedding=speaker_embedding,
            temperature=float(temperature),
            top_p=float(top_p),
            top_k=int(top_k),
        )

        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            output_path = f.name

        scipy.io.wavfile.write(output_path, 24000, outputs["wav"])

        return output_path, "✅ Audio generated successfully!"

    except Exception as e:
        return None, f"❌ Error: {str(e)}"

    finally:
        # Very aggressive cleanup for CPU
        global _model, _gpt_cond_latent, _speaker_embedding
        
        _model = _gpt_cond_latent = _speaker_embedding = None
        
        for var in ['outputs', 'model', 'gpt_cond_latent', 'speaker_embedding']:
            if var in locals():
                del locals()[var]
        
        gc.collect()
        torch.cuda.empty_cache() if DEVICE == "cuda" else None
        
        # Extra CPU cleanup
        if DEVICE == "cpu":
            for obj in list(gc.get_objects()):
                try:
                    if torch.is_tensor(obj):
                        del obj
                except:
                    pass
            gc.collect()
        
        print("Memory cleanup done")
        os.execv(sys.executable, ['python'] + sys.argv)

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
        fn=generate_speech,
        inputs=[text_input, temperature, top_p, top_k, seed],
        outputs=[audio_output, status_output],
    )

    gr.Examples(
        examples=[
            ["Hola, soy Pedro. Bienvenidos a mi demostración de clonación de voz.", 0.7, 0.85, 50, 67],
            ["La inteligencia artificial ha avanzado mucho en los últimos años.",    0.5, 0.9,  40, 42],
            ["¿Cómo va todo? Espero que estés teniendo un excelente día.",           0.8, 0.8,  60, 123],
        ],
        inputs=[text_input, temperature, top_p, top_k, seed],
    )

# ── Launch ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860, ssr_mode=False, share=False)