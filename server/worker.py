import argparse
import os
import torch
import scipy.io.wavfile
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True)
    parser.add_argument("--temperature", type=float, default=0.7)
    parser.add_argument("--top_p", type=float, default=0.85)
    parser.add_argument("--top_k", type=int, default=50)
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--output", default="/tmp/output.wav")
    args = parser.parse_args()

    # Environment Setup
    BASE_MODEL_PATH = os.path.join("models", "coqui")
    CHECKPOINT_FILE = os.path.join("models", "best_model_822.pth")
    SPEAKER_WAV     = os.path.join("models", "sample5.wav")
    DEVICE          = "cuda" if torch.cuda.is_available() else "cpu"

    torch.manual_seed(args.seed)
    if DEVICE == "cuda":
        torch.cuda.manual_seed_all(args.seed)

    # 1. Load configuration and initialize model
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

    # 2. Extract Speaker Embedding
    gpt_cond_latent, speaker_embedding = model.get_conditioning_latents(
        audio_path=SPEAKER_WAV,
        gpt_cond_len=3,
    )

    # 3. Generate
    outputs = model.inference(
        args.text,
        language="es",
        gpt_cond_latent=gpt_cond_latent,
        speaker_embedding=speaker_embedding,
        temperature=args.temperature,
        top_p=args.top_p,
        top_k=args.top_k,
    )

    # 4. Save file
    scipy.io.wavfile.write(args.output, 24000, outputs["wav"])
    print("Inference completed successfully. Exiting worker process.")

if __name__ == "__main__":
    main()