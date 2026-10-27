import json
import os
import subprocess
import sys
from pathlib import Path

import numpy as np
import pytest
import scipy.io.wavfile

# The tests import app.py directly and never start worker.py, so they run without the model or coqui-tts loading it.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

SAMPLE_RATE = 24000


@pytest.fixture(scope="session")
def app_module():
    os.environ["GIT_SHA"] = "test-sha"
    import app

    return app


@pytest.fixture
def client(app_module):
    from fastapi.testclient import TestClient

    return TestClient(app_module.app)


@pytest.fixture
def model_dir(app_module, tmp_path, monkeypatch):
    """Runs the test from a directory holding empty stand-ins for every file /health looks for."""
    monkeypatch.chdir(tmp_path)
    for path in app_module.MODEL_FILES:
        (tmp_path / path).parent.mkdir(parents=True, exist_ok=True)
        (tmp_path / path).touch()
    return tmp_path


class FakeWorker:
    """Stands in for subprocess.run: records each call and writes a short tone where the worker would."""

    def __init__(self):
        self.calls = []
        self.failure = None
        self.writes_output = True

    def __call__(self, cmd, **kwargs):
        self.calls.append((cmd, kwargs))
        if self.failure:
            raise self.failure
        if self.writes_output:
            params = json.loads(kwargs["input"])
            tone = np.sin(np.linspace(0, 440 * 2 * np.pi, SAMPLE_RATE)).astype(np.float32)
            scipy.io.wavfile.write(params["output"], SAMPLE_RATE, tone)
        return subprocess.CompletedProcess(cmd, 0, stdout="ok", stderr="")


@pytest.fixture
def worker(app_module, monkeypatch):
    fake = FakeWorker()
    monkeypatch.setattr(app_module.subprocess, "run", fake)
    return fake
