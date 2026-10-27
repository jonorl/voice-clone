import json
import os
import subprocess

import pytest

from conftest import SAMPLE_RATE


def test_health_reports_ok_and_version_when_the_model_is_mounted(client, model_dir):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "test-sha"}


def test_health_lists_missing_model_files(client, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    response = client.get("/health")

    assert response.status_code == 503
    assert response.json()["status"] == "error"
    assert os.path.join("models", "best_model_822.pth") in response.json()["missing"]


def test_health_answers_head_for_the_status_badge(client, model_dir):
    assert client.head("/health").status_code == 200


def test_gradio_exposes_the_endpoint_the_frontend_calls(client):
    config = client.get("/config").json()

    assert "generate_speech" in [dependency.get("api_name") for dependency in config["dependencies"]]


def test_generates_audio_through_the_worker(app_module, worker):
    audio, status = app_module.generate_speech_stateless("Hola", 0.7, 0.85, 50, 42)

    sample_rate, samples = audio
    assert sample_rate == SAMPLE_RATE
    assert len(samples) == SAMPLE_RATE
    assert status.startswith("✅")


def test_sends_parameters_on_stdin_never_in_argv(app_module, worker):
    text = "--output=/app/app.py"

    app_module.generate_speech_stateless(text, 0.5, 0.9, 40, 7)

    cmd, kwargs = worker.calls[0]
    assert text not in " ".join(cmd)
    params = json.loads(kwargs["input"])
    assert params["text"] == text
    assert (params["temperature"], params["top_p"], params["top_k"], params["seed"]) == (0.5, 0.9, 40, 7)


def test_clamps_out_of_range_settings(app_module, worker):
    app_module.generate_speech_stateless("Hola", 5, -1, 1000, 1)

    params = json.loads(worker.calls[0][1]["input"])
    assert (params["temperature"], params["top_p"], params["top_k"]) == (1.0, 0.1, 100)


def test_each_request_writes_to_its_own_directory_and_removes_it(app_module, worker):
    app_module.generate_speech_stateless("uno")
    app_module.generate_speech_stateless("dos")

    outputs = [json.loads(kwargs["input"])["output"] for _, kwargs in worker.calls]
    assert outputs[0] != outputs[1]
    assert not any(os.path.exists(os.path.dirname(path)) for path in outputs)


@pytest.mark.parametrize("text", ["", "   ", None])
def test_rejects_empty_text(app_module, worker, text):
    audio, status = app_module.generate_speech_stateless(text)

    assert audio is None
    assert status == "Please enter some text."
    assert worker.calls == []


def test_rejects_text_over_the_limit(app_module, worker):
    audio, status = app_module.generate_speech_stateless("a" * (app_module.MAX_TEXT_CHARS + 1))

    assert audio is None
    assert str(app_module.MAX_TEXT_CHARS) in status
    assert worker.calls == []


def test_rejects_settings_that_are_not_numbers(app_module, worker):
    audio, status = app_module.generate_speech_stateless("Hola", "hot", 0.85, 50, 42)

    assert audio is None
    assert "must be numbers" in status
    assert worker.calls == []


def test_a_crash_is_reported_without_the_traceback(app_module, worker):
    worker.failure = subprocess.CalledProcessError(1, "worker.py", stderr="Traceback: /app/models/secret")

    audio, status = app_module.generate_speech_stateless("Hola")

    assert audio is None
    assert "Traceback" not in status
    assert "failed" in status


def test_a_timeout_is_reported(app_module, worker):
    worker.failure = subprocess.TimeoutExpired("worker.py", app_module.WORKER_TIMEOUT_SECONDS)

    audio, status = app_module.generate_speech_stateless("Hola")

    assert audio is None
    assert "too long" in status


def test_a_missing_output_file_is_reported(app_module, worker):
    worker.writes_output = False

    audio, status = app_module.generate_speech_stateless("Hola")

    assert audio is None
    assert "output file was not found" in status
