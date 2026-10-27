# Voice Clone Portfolio Project

[![Test](https://github.com/jonorl/voice-clone/actions/workflows/test.yml/badge.svg)](https://github.com/jonorl/voice-clone/actions/workflows/test.yml)
[![Build and Deploy](https://github.com/jonorl/voice-clone/actions/workflows/deploy.yml/badge.svg)](https://github.com/jonorl/voice-clone/actions/workflows/deploy.yml)
[![CodeQL](https://github.com/jonorl/voice-clone/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/jonorl/voice-clone/security/code-scanning)
[![API status](https://img.shields.io/website?url=https%3A%2F%2Fvoice.jonathan-orlowski.dev%2Fhealth&label=api&up_message=healthy&down_message=down)](https://voice.jonathan-orlowski.dev/health)

<p align="center">
  <a href="https://jonathan-orlowski.dev/voice-clone/">
    <img src="docs/preview.gif" alt="Picking an example prompt in Spanish and generating it: the app works on the cloned voice, then shows an audio player with the result." width="300" />
  </a>
</p>

A web demo of Argentinean Spanish voice cloning. Type some Spanish and it is spoken in the voice of my friend Pedro, using a [Coqui XTTS v2](https://github.com/idiap/coqui-ai-TTS) model I fine-tuned on his voice messages. Try it at **https://jonathan-orlowski.dev/voice-clone/**.

There is also an [Android app](https://github.com/jonorl/voice-clone-mobile) that uses the same API.

## Architecture

- **Frontend** (repository root): a React single-page app, built by Cloudflare Pages on every push. It sends the text and settings to the model with `@gradio/client`, then plays the returned audio and offers it as a download, in English or Spanish.
- **Model API** (`/server`): a Gradio app mounted on FastAPI, which adds `/health`. It runs in Docker on a VPS behind Caddy at `voice.jonathan-orlowski.dev`. Each request starts `worker.py` in a fresh process, which loads the model, generates the audio and exits, so the model's memory is returned between requests. The fine-tuned checkpoint is not in the repository; the VPS mounts it into the container at `/app/models`.

## Project structure

```
├── src/
│   ├── App.tsx                 # The whole UI: about, settings, generation and playback
│   └── translations.ts         # English and Spanish strings
├── assets/sample.wav           # A clip of the original voice, played on the page
├── public/
│   ├── _headers                # Cloudflare Pages security headers (CSP)
│   └── gtag-init.js            # Google Analytics bootstrap
└── server/
    ├── app.py                  # Gradio + FastAPI app: validates input and runs the worker
    ├── worker.py               # Loads the model and writes one WAV file
    ├── tests/                  # pytest suite, run with a stand-in worker
    └── Dockerfile
```

## Model

- **Base:** Coqui XTTS v2, a multilingual text-to-speech model with GPT-style autoregressive decoding.
- **Data:** about 45 minutes of Pedro's WhatsApp voice messages, used with his permission.
- **Training:** fine-tuned for 10 epochs with AdamW on a local AMD 6950 XT GPU with ROCm. The resulting checkpoint is 5.6 GB.
- **Inference:** the speaker's voice is taken from one reference clip (`sample5.wav`), then the text is generated in Spanish at 24 kHz.

### Settings

| Setting         | Range       | Effect                                                                                       |
| --------------- | ----------- | -------------------------------------------------------------------------------------------- |
| **Temperature** | 0.1 – 1.0   | Randomness in the prosody. Lower sounds steadier; higher sounds more expressive.             |
| **Top P**       | 0.1 – 1.0   | Nucleus sampling threshold. Lower values reduce variety.                                      |
| **Top K**       | 1 – 100     | How many candidate tokens are considered at each step.                                        |
| **Seed**        | Any integer | The same text, settings and seed give the same audio.                                         |

The API rejects text over 1,000 characters and clamps the settings to these ranges.

### Limitations

- It runs on a CPU-only server and loads the model for every request, so each generation takes two to three minutes.
- With only 45 minutes of training audio, the base model's accent sometimes comes through, so the voice can sound more like Spain than Buenos Aires.
- Only Spanish is supported.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS and Lucide
- **Model:** Coqui TTS (XTTS v2) and PyTorch (CPU), served with Gradio and FastAPI
- **Hosting:** Cloudflare Pages for the frontend; Docker, Caddy and GHCR on the VPS for the model

## Getting started

### Frontend

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`. The app calls the production model API, so nothing else needs to run.

### Model API

You need the fine-tuned checkpoint and the XTTS v2 base files in `server/models/`:

```
models/
├── best_model_822.pth     # the fine-tuned checkpoint
├── sample5.wav            # the reference clip
└── coqui/                 # XTTS v2 base files
    ├── config.json
    ├── vocab.json
    ├── dvae.pth
    └── mel_stats.pth
```

```bash
cd server
docker build -t voice-clone .
docker run -p 7860:7860 -v "$PWD/models:/app/models" voice-clone
```

`http://localhost:7860` serves the Gradio page, and `http://localhost:7860/health` the health check, which lists any of these files that are missing.

## Testing

### Frontend

```bash
npm test                # once
npm run test:watch      # re-run on changes
npm run test:coverage   # with a coverage report
npm run typecheck       # TypeScript, without building
npm run lint            # ESLint
```

The Jest suite covers the language toggle, the examples, generating and playing audio, the error messages, form labels and the footer link, with the Gradio client mocked. It also checks that both languages have the same strings.

### Model API

```bash
cd server
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest                       # tests
ruff check . && ruff format --check .  # lint and formatting
```

The tests stand in for `worker.py`, so they need no model. They check `/health` with and without the model files, that Gradio still exposes the `generate_speech` endpoint the frontend calls, that settings reach the worker on stdin and are clamped, that oversized or invalid input is refused, and that crashes and timeouts give a clean message.

## Deployment

- **Model API:** pushing to `main` with changes under `server/` runs the `Build and Deploy` workflow. It runs the tests first, then builds the Docker image, pushes it to `ghcr.io/jonorl/voice-clone`, then pulls it on the VPS and recreates the container with Docker Compose. A final smoke test waits until `/health` reports the new commit, then checks that Gradio still exposes the endpoint the frontend calls, and fails the run otherwise.
- **Frontend:** Cloudflare Pages builds it on every push, with preview deployments for other branches.

## Security and maintenance

- **CI:** the `Test` workflow runs on every push and pull request. It type-checks, lints and tests the frontend, and lints and tests the model API.
- **Branch ruleset:** changes to `main` go through a pull request with passing tests and no new high or critical CodeQL alerts. Force-pushes and deletion are blocked; repository admins can bypass.
- **CodeQL:** scans the TypeScript, the Python and the workflows weekly and on every pull request.
- **Content Security Policy:** enforced from [`public/_headers`](public/_headers), alongside other security headers. Scripts load only from the site itself, Google Analytics and Cloudflare Web Analytics, and the page can only talk to the model API and the two analytics services.
- **Dependabot:** security updates as soon as an advisory appears, and version updates every Monday for npm, pip and the Docker base image, and monthly for GitHub Actions. Minor and patch bumps arrive grouped. The PyTorch stack, coqui-tts, transformers and scipy are held back; [`.github/dependabot.yml`](.github/dependabot.yml) explains why.
- **Secret scanning** with push protection is on.

## Ethical use

The voice belongs to a real person who agreed to this demo. Do not use it, or this code, to clone anyone's voice without their explicit permission, or to impersonate, defraud or deceive.

## Acknowledgments

- Pedro ([PsicogamerRandomStreaming](https://www.twitch.tv/psicogamerrandomstreaming)), for lending his voice.
- [Coqui TTS](https://github.com/idiap/coqui-ai-TTS), maintained by Idiap, for XTTS v2.

## Author

Developed by [Jonathan Orlowski](https://jonathan-orlowski.dev/). The code is licensed under the Apache License 2.0, see [`LICENSE`](LICENSE). The XTTS v2 model, and so the fine-tuned checkpoint, is under the [Coqui Public Model License](https://coqui.ai/cpml), which allows non-commercial use only.
