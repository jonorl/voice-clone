import json
import os
import sys

import scipy.io.wavfile
import torch
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts


def main():
    # app.py sends the parameters as JSON on stdin, already validated.
    params = json.load(sys.stdin)

    # Environment Setup
    BASE_MODEL_PATH = os.path.join("models", "coqui")
    CHECKPOINT_FILE = os.path.join("models", "best_model_822.pth")
    SPEAKER_WAV = os.path.join("models", "sample5.wav")
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

    torch.manual_seed(params["seed"])
    if DEVICE == "cuda":
        torch.cuda.manual_seed_all(params["seed"])

    # 1. Load configuration and initialize model
    config = XttsConfig()
    config.load_json(os.path.join(BASE_MODEL_PATH, "config.json"))
    config.model_args.tokenizer_file = os.path.join(BASE_MODEL_PATH, "vocab.json")
    config.model_args.dvae_checkpoint = os.path.join(BASE_MODEL_PATH, "dvae.pth")
    config.model_args.mel_norm_file = os.path.join(BASE_MODEL_PATH, "mel_stats.pth")

    model = Xtts(config)
    model.load_checkpoint(
        config,
        checkpoint_path=CHECKPOINT_FILE,
        vocab_path=os.path.join(BASE_MODEL_PATH, "vocab.json"),
        use_deepspeed=False,
    )

    if DEVICE == "cuda":
        model.cuda()

    # 2. Extract Speaker Embedding
    gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(
        audio_path=SPEAKER_WAV,
        gpt_cond_len=3,
    )

    # 3. Generate
    outputs = model.inference(
        params["text"],
        language="es",
        gpt_cond_latent=gpt_cond_latent,
        speaker_embedding=speaker_embedding,
        temperature=params["temperature"],
        top_p=params["top_p"],
        top_k=params["top_k"],
    )

    # 4. Save file
    scipy.io.wavfile.write(params["output"], 24000, outputs["wav"])
    print("Inference completed successfully. Exiting worker process.")


if __name__ == "__main__":
    main()
