# 🎙️ Voice Clone - Pedro

AI-powered voice cloning using XTTS v2, fine-tuned for Spanish language synthesis.

## Features

- **Real-time synthesis**: Generate speech from any Spanish text
- **Adjustable parameters**: Control temperature, top_p, top_k for varied outputs
- **Reproducible**: Set seed for consistent results
- **Web interface**: Easy-to-use Gradio interface

## Usage

1. Enter your Spanish text in the text box
2. (Optional) Adjust advanced parameters for different voice characteristics
3. Click "Generate Speech" to create audio
4. Play the generated audio directly in your browser

## Parameters

- **Temperature** (0.1-1.0): Controls variation in prosody. Lower = more consistent, higher = more natural variation
- **Top P** (0.1-1.0): Nucleus sampling threshold for diversity control
- **Top K** (1-100): Limits vocabulary selection during generation
- **Seed**: Random seed for reproducible outputs

## Model Details

This model is based on [Coqui XTTS v2](https://github.com/coqui-ai/TTS) and has been fine-tuned on Spanish voice samples to clone a specific voice profile.

## API Usage

You can also use this Space via API:

```python
from gradio_client import Client

client = Client("YOUR_USERNAME/your-space-name")
result = client.predict(
    "Hola, esto es una prueba",  # text
    0.7,  # temperature
    0.85,  # top_p
    50,   # top_k
    67,   # seed
    api_name="/predict"
)
```

## License

This Space uses the XTTS v2 model which is licensed under the Coqui Public Model License.

## Acknowledgments

- [Coqui TTS](https://github.com/coqui-ai/TTS) for the XTTS v2 model
- Built with [Gradio](https://gradio.app/)