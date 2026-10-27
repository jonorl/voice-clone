import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const mockPredict = jest.fn<(endpoint: string, data: unknown) => Promise<{ data: unknown }>>();
const mockConnect = jest.fn<(url: string) => Promise<{ predict: typeof mockPredict }>>();
const mockFetch = jest.fn<(url: string) => Promise<{ ok: boolean; blob: () => Promise<Blob> }>>();

jest.mock("@gradio/client", () => ({
  Client: { connect: (url: string) => mockConnect(url) },
}));

const AUDIO_URL = "https://voice.jonathan-orlowski.dev/gradio_api/file=/tmp/output.wav";

describe("App", () => {
  beforeEach(() => {
    mockConnect.mockResolvedValue({ predict: mockPredict });
    mockFetch.mockResolvedValue({ ok: true, blob: async () => new Blob(["wav"], { type: "audio/wav" }) });
    // jsdom has no fetch, object URLs or media playback.
    globalThis.fetch = mockFetch as unknown as typeof fetch;
    URL.createObjectURL = () => "blob:voice-clone-output";
    window.HTMLMediaElement.prototype.play = () => Promise.resolve();
  });

  it("switches between English and Spanish", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Voice Cloning Demo");
    await user.click(screen.getByRole("button", { name: "ES" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Demostración de Clonación de Voz");
    await user.click(screen.getByRole("button", { name: "EN" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Voice Cloning Demo");
  });

  it("labels every control", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /Advanced Settings/ }));

    for (const label of ["Text to Synthesize", "Temperature", "Top-k (Sampling)", "Top-p (Nucleus)", "Random Seed"]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByRole("group", { name: /Example/ })).toBeInTheDocument();
  });

  it("links to this project's source", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/jonorl/voice-clone");
  });

  it("loads an example into the text box", async () => {
    const user = userEvent.setup();
    render(<App />);

    const example = "La inteligencia artificial ha avanzado mucho en los últimos años.";
    await user.click(screen.getByRole("button", { name: example }));

    expect(screen.getByRole("textbox")).toHaveValue(example);
    expect(screen.getByText("0.50")).toBeInTheDocument();
  });

  it("sends the text and settings to the model and plays the result", async () => {
    mockPredict.mockResolvedValue({ data: [{ url: AUDIO_URL }] });
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.clear(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Hola");
    await user.click(screen.getByRole("button", { name: "Generate Speech" }));

    expect(await screen.findByText("Audio generated successfully! Click play to listen.")).toBeInTheDocument();
    expect(mockConnect).toHaveBeenCalledWith("https://voice.jonathan-orlowski.dev");
    expect(mockPredict).toHaveBeenCalledWith("/generate_speech", {
      text: "Hola",
      temperature: 0.7,
      top_p: 0.85,
      top_k: 50,
      seed: 42,
    });
    expect(mockFetch).toHaveBeenCalledWith(AUDIO_URL);
    expect(container.querySelector("audio[src]")).toHaveAttribute("src", "blob:voice-clone-output");
    expect(screen.getByRole("link", { name: "Download Audio File" })).toHaveAttribute("href", "blob:voice-clone-output");
  });

  it("accepts the audio URL as a plain string", async () => {
    mockPredict.mockResolvedValue({ data: [AUDIO_URL] });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Generate Speech" }));

    expect(await screen.findByText("Audio generated successfully! Click play to listen.")).toBeInTheDocument();
    expect(mockFetch).toHaveBeenCalledWith(AUDIO_URL);
  });

  it("shows an error when the model returns no audio", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockPredict.mockResolvedValue({ data: [null] });
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Generate Speech" }));

    expect(await screen.findByText("Failed to generate: No audio URL found in response")).toBeInTheDocument();
  });

  it("shows an error when the model cannot be reached", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockConnect.mockRejectedValue(new Error("offline"));
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Generate Speech" }));

    expect(await screen.findByText("Failed to generate: offline")).toBeInTheDocument();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
