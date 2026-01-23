import { useState, useRef } from 'react';
import { Loader2, Mic2, Volume2, Settings, Sparkles } from 'lucide-react';

export default function VoiceCloneGenerator() {
  const [text, setText] = useState('Hola, ¿cómo estás? Esta es una demostración de clonación de voz.');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.85);
  const [seed, setSeed] = useState(42);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  interface Example {
    text: string;
    temp: number;
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setAudioUrl('');

    try {
      // Import Gradio client dynamically
      const { Client } = await import("@gradio/client");
      
      const client = await Client.connect("jonorl/voice-clone");

      const result = await client.predict("/generate_speech", {
        text: text,
        temperature: temperature,
        top_p: topP,
        top_k: topK,
        seed: seed,
      });

      console.log("Full API response:", result);
      
      // The result.data is an array: [audioObject, statusMessage]
      // audioObject has structure: { url: "https://...", path: "..." }
      const resultData = result.data as any;
      
      let audioFileUrl = null;
      
      // Handle different possible response structures
      if (Array.isArray(resultData)) {
        // If first element is an object with url property
        if (resultData[0]?.url) {
          audioFileUrl = resultData[0].url;
        } 
        // If first element is a string (direct URL)
        else if (typeof resultData[0] === 'string') {
          audioFileUrl = resultData[0];
        }
      } 
      // If data itself is an object with url
      else if (resultData?.url) {
        audioFileUrl = resultData.url;
      }
      
      console.log("Extracted audio URL:", audioFileUrl);
      
      if (audioFileUrl) {
        setAudioUrl(audioFileUrl);
        // Auto-play after generation
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(err => {
              console.log("Auto-play prevented by browser:", err);
            });
          }
        }, 100);
      } else {
        setError('No audio generated. Please try again.');
        console.error("Could not extract audio URL from:", result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to generate audio: ${errorMessage}`);
      console.error("Connection Error:", err);
      console.error("Error details:", JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const examples: Example[] = [
    { text: 'Hola, soy Pedro. Bienvenidos a mi demostración de clonación de voz.', temp: 0.7 },
    { text: 'La inteligencia artificial ha avanzado mucho en los últimos años.', temp: 0.5 },
    { text: '¿Cómo va todo? Espero que estés teniendo un excelente día.', temp: 0.8 },
    { text: 'A todo el mundo le gusta el jarabe para la tos, el olor del jarabe para la tos.', temp: 0.7 },
  ];

  const loadExample = (example: Example) => {
    setText(example.text);
    setTemperature(example.temp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🎙️ Voice Cloning Demo
          </h1>
          <p className="text-xl text-gray-700">
            AI-Powered Voice Synthesis with XTTS v2
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Project</h2>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              This project showcases state-of-the-art voice cloning technology using XTTS v2, 
              a cutting-edge text-to-speech model. I fine-tuned the model on Spanish voice samples 
              to create a personalized voice synthesis system that can generate natural-sounding speech 
              from any text input.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-purple-700 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Technical Approach
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Model:</strong> Coqui XTTS v2 (Fine-tuned)</li>
                  <li>• <strong>Framework:</strong> PyTorch & TTS Library</li>
                  <li>• <strong>Training:</strong> Custom Spanish voice dataset</li>
                  <li>• <strong>Deployment:</strong> Gradio API on Hugging Face Spaces</li>
                  <li>• <strong>Architecture:</strong> GPT-based autoregressive TTS</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Key Features
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Zero-shot voice cloning capability</li>
                  <li>• Natural prosody and intonation</li>
                  <li>• Multi-language support (Spanish optimized)</li>
                  <li>• Adjustable generation parameters</li>
                  <li>• Real-time synthesis</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-semibold text-purple-700 mb-3 flex items-center gap-2">
                <Mic2 className="w-5 h-5" />
                How Voice Cloning Works
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The system uses a two-stage process: First, it analyzes a reference audio sample to extract 
                voice characteristics (timbre, pitch, speaking style). Then, it generates speech from text 
                while maintaining these vocal traits. The XTTS v2 model employs advanced neural vocoding 
                and GPT-based sequence modeling to produce high-quality, natural-sounding speech. Fine-tuning 
                on Spanish samples improves pronunciation, rhythm, and accent authenticity.
              </p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 mt-6 border-l-4 border-yellow-400">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">⚙️ Model Parameters</h3>
              <p className="text-gray-700 text-sm">
                <strong>Temperature</strong> controls speech variation (lower = more consistent, higher = more expressive). 
                <strong> Top-p and Top-k</strong> sampling parameters affect the diversity of phoneme selection. 
                <strong> Seed</strong> ensures reproducibility—same text + same seed = identical audio output.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Try It Yourself</h2>

          {/* Quick Examples */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-600 mb-3">Quick Examples (Spanish):</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-sm font-medium transition-colors"
                >
                  {example.text.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mic2 className="w-4 h-4" />
                  Text to Synthesize (Spanish)
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  placeholder="Escribe tu texto en español aquí..."
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {text.length} characters
                </p>
              </div>

              {/* Advanced Settings */}
              <div className="pt-4">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                >
                  <Settings className="w-4 h-4" />
                  {showAdvanced ? '∧ Hide' : '∨ Show'} Advanced Parameters
                </button>
              </div>

              {showAdvanced && (
                <div className="space-y-4 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Temperature
                      </label>
                      <span className="text-sm font-mono text-purple-600">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Lower = consistent, Higher = expressive
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Top-k Sampling
                      </label>
                      <span className="text-sm font-mono text-purple-600">{topK}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      step="1"
                      value={topK}
                      onChange={(e) => setTopK(parseInt(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Limits vocabulary selection
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Top-p (Nucleus)
                      </label>
                      <span className="text-sm font-mono text-purple-600">{topP.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Controls diversity of output
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Random Seed
                      </label>
                      <span className="text-sm font-mono text-purple-600">{seed}</span>
                    </div>
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="67"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      For reproducible results
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !text.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    Generate Speech
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Generated Audio
              </label>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 min-h-[400px] border-2 border-gray-200 flex flex-col items-center justify-center">
                {loading && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
                    <p className="text-gray-600 text-sm">Processing voice synthesis...</p>
                    <p className="text-gray-400 text-xs">This may take 10-30 seconds</p>
                  </div>
                )}
                
                {error && (
                  <div className="w-full">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <p className="font-semibold">Error</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {audioUrl && !loading && (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <audio
                      ref={audioRef}
                      controls
                      src={audioUrl}
                      className="w-full"
                    />
                    
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      ✓ Audio generated successfully! Click play to listen.
                    </div>

                    <a
                      href={audioUrl}
                      download="voice_clone_output.wav"
                      className="block w-full text-center bg-white border-2 border-purple-500 text-purple-600 font-semibold py-2 px-4 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      Download Audio File
                    </a>
                  </div>
                )}
                
                {!loading && !error && !audioUrl && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <Mic2 className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">
                      Your generated audio will appear here...
                    </p>
                    <p className="text-sm text-center mt-2">
                      Enter text and click "Generate Speech"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border-l-4 border-blue-400">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 Tips for Best Results</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li>• <strong>Punctuation matters:</strong> Use commas and periods to improve natural pauses</li>
              <li>• <strong>Temperature:</strong> Try 0.5-0.7 for clear speech, 0.7-0.9 for more natural variation</li>
              <li>• <strong>Reproducibility:</strong> Same text + same parameters + same seed = identical audio</li>
              <li>• <strong>Best results:</strong> Spanish text works best as the model was fine-tuned on Spanish samples</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Technical Implementation</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Training Process</h3>
              <p className="text-sm text-gray-600">
                Fine-tuned XTTS v2 on custom Spanish voice dataset using GPT-based architecture 
                with 10 epochs and AdamW optimizer
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Model Size</h3>
              <p className="text-sm text-gray-600">
                5.6GB checkpoint with ~1.87B base parameters, optimized for Spanish phonemes 
                and prosody patterns
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-5">
              <h3 className="font-semibold text-gray-800 mb-2">Inference Speed</h3>
              <p className="text-sm text-gray-600">
                ~5 seconds per generation on GPU (T4), ~30 seconds on CPU for typical sentences
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm">
            Built with Coqui TTS, PyTorch, Gradio, and React • Model hosted on Hugging Face Spaces
          </p>
          <p className="text-xs mt-2 text-gray-500">
            XTTS v2 by Coqui AI • Fine-tuned for Spanish voice synthesis
          </p>
        </div>
      </div>
    </div>
  );
}