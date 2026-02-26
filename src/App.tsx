import { useState, useRef, useEffect } from 'react';
import { Loader2, Mic2, Volume2, Settings, AlertCircle, Power } from 'lucide-react';
import { SiHuggingface } from "react-icons/si";
import { translations } from './translations'

type Language = 'en' | 'es';

export default function VoiceCloneGenerator() {
  const [language, setLanguage] = useState<Language>('en');
  const [text, setText] = useState('Hola, ¿cómo estás? Esta es una demostración de clonación de voz.');
  const [temperature, setTemperature] = useState(0.7);
  const [topK, setTopK] = useState(50);
  const [topP, setTopP] = useState(0.85);
  const [seed, setSeed] = useState(42);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [spaceStatus, setSpaceStatus] = useState<'checking' | 'ready' | 'sleeping' | 'error'>('checking');
  const [wakingUp, setWakingUp] = useState(false);

  interface Example {
    text: string;
    temp: number;
    topK?: number;
    topP?: number;
  }

  const t = translations[language];

  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prevIndex) => 
        (prevIndex + 1) % t.loadingMessages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [loading, t.loadingMessages.length]);

  // Check space status on mount
  useEffect(() => {
    checkSpaceStatus();
  }, []);

  const checkSpaceStatus = async () => {
    setSpaceStatus("checking");
    try {
      const { Client } = await import("@gradio/client");
      await Client.connect("jonorl/voice-clone",{
        auth: import.meta.env.VITE_HF_TOKEN,
      });
      setSpaceStatus("ready");
    } catch (err) {
      console.error("Status check error:", err);
      setSpaceStatus("sleeping");
    }
  };

  const wakeUpSpace = async () => {
    setWakingUp(true);
    try {
      const { Client } = await import("@gradio/client");
      await Client.connect("jonorl/voice-clone",{
        auth: import.meta.env.VITE_HF_TOKEN,
      });
      setSpaceStatus("ready");
    } catch (err) {
      console.error("Wake up error:", err);
      setSpaceStatus("error");
    } finally {
      setWakingUp(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setAudioUrl('');
    setLoadingMessageIndex(0);

    try {
      // Import Gradio client dynamically
      const { Client } = await import("@gradio/client");
      
      const client = await Client.connect("jonorl/voice-clone", {
        auth: import.meta.env.VITE_HF_TOKEN,
      });

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
        setSpaceStatus("ready");
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
      setSpaceStatus("sleeping");
    } finally {
      setLoading(false);
    }
  };

  const examples: Example[] = [
    { text: 'Hola, soy Pedro. Bienvenidos a mi demostración de clonación de voz.', temp: 0.7, topK: 100, topP: 0.10 },
    { text: 'La inteligencia artificial ha avanzado mucho en los últimos años.', temp: 0.5 },
    { text: '¿Cómo va todo? Espero que estés teniendo un excelente día.', temp: 0.8 },
    { text: 'A todo el mundo le gusta el jarabe para la tos, el olor del jarabe para la tos.', temp: 0.7 },
  ];

  const loadExample = (example: Example) => {
    setText(example.text);
    setTemperature(example.temp);
    setTopK(example.topK ?? 50);
    setTopP(example.topP ?? 0.85);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  const getStatusColor = () => {
    switch (spaceStatus) {
      case "ready":
        return "bg-green-900/30 border-green-700/50 text-green-300";
      case "sleeping":
        return "bg-yellow-900/30 border-yellow-700/50 text-yellow-300";
      case "checking":
        return "bg-blue-900/30 border-blue-700/50 text-blue-300";
      case "error":
        return "bg-red-900/30 border-red-700/50 text-red-300";
    }
  };

  const getStatusIcon = () => {
    switch (spaceStatus) {
      case "ready":
        return <Power className="w-4 h-4" />;
      case "sleeping":
        return <AlertCircle className="w-4 h-4" />;
      case "checking":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "error":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (spaceStatus) {
      case "ready":
        return t.statusReady || "Model Ready";
      case "sleeping":
        return t.statusSleeping || "Model Sleeping";
      case "checking":
        return t.statusChecking || "Checking Status...";
      case "error":
        return t.statusError || "Connection Error";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
            <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Language Toggle Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-100 font-semibold py-2 px-4 rounded-lg border border-gray-600 transition-all shadow-lg"
          >
            {language === 'en' ? 'ES' : 'EN'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            {t.title}
          </h1>
          <p className="text-xl text-gray-300">
            {t.subtitle}
          </p>
        </div>

        {/* Project Description */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">{t.aboutTitle}</h2>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              {t.aboutDescription}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-cyan-900">
                <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  {t.technicalApproach}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• <strong>{language === 'en' ? 'Model' : 'Modelo'}:</strong> {t.technicalDetails.model.split(': ')[1]}</li>
                  <li>• <strong>{language === 'en' ? 'Framework' : 'Framework'}:</strong> {t.technicalDetails.framework.split(': ')[1]}</li>
                  <li>• <strong>{language === 'en' ? 'Training' : 'Entrenamiento'}:</strong> {t.technicalDetails.training.split(': ')[1]}</li>
                  <li>• <strong>{language === 'en' ? 'Deployment' : 'Despliegue'}:</strong> {t.technicalDetails.deployment.split(': ')[1]}</li>
                </ul>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-blue-900">
                <h3 className="text-xl font-semibold text-blue-400 mb-3 flex items-center gap-2">
                  {t.keyFeatures}
                </h3>
                 <ul className="space-y-2 text-gray-300">
                  <li>• {t.features.feature1}</li>
                  <li>• {t.features.feature2}</li>
                  <li>• {t.features.feature3}</li>
                  <li>• {t.features.feature4}</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-900 to-slate-900 rounded-lg p-6 mt-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                {t.howItWorksTitle}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {t.howItWorksDescription}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 mt-6 border-l-4 border-amber-500">
              <h3 className="text-lg font-semibold text-amber-400 mb-2">{t.modelParameters}</h3>
              <p className="text-gray-300 text-sm">
                {t.modelParametersDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Who is Being Cloned Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">{t.whoIsBeingClonedTitle}</h2>
          
          <div className="bg-gradient-to-r from-gray-900 to-slate-900 rounded-lg p-6 border border-gray-700">
            <div className="space-y-4 text-gray-300">
              <p className="text-lg leading-relaxed break-words">
                {t.whoIsBeingClonedDescription} <strong className="text-cyan-400">PsicogamerRandomStreaming</strong>, {t.whoIsBeingClonedText}
              </p>
              
              <div className="bg-gray-900 rounded-lg p-6 mt-4 border border-gray-600">
                <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  {t.hearOriginalVoice}
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  {t.hearOriginalVoiceDescription}
                </p>
                <audio 
                  controls 
                  className="w-full"
                  preload="metadata"
                >
                  <source src="/sample.wav" type="audio/wav" />
                  {t.audioNotSupported}
                </audio>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-6 mt-4 border-l-4 border-cyan-500">
                <p className="text-lg leading-relaxed break-words text-gray-300 mb-4">
                  {t.thankYouMessage}
                </p>
                
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.571 4.714h1.715v5.143L15.43 12l-2.286 2.143v5.143h-1.715V9.143L9.286 7z"/>
                        <path d="M5.143 4.714c-1.429 0-2.572 1.143-2.572 2.572v9.143c0 1.429 1.143 2.571 2.572 2.571h13.714c1.429 0 2.572-1.142 2.572-2.571V7.286c0-1.429-1.143-2.572-2.572-2.572zm0 11.715V7.286h13.714v9.143z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200 font-semibold">{t.checkOutStreams}</p>
                    <a 
                      href="https://www.twitch.tv/psicogamerrandomstreaming" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium inline-flex items-center gap-1 mt-1 break-all"
                    >
                      twitch.tv/psicogamerrandomstreaming
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400 italic mt-4">
                {t.supportMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Before You Test It Section */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700">
          <h2 className="text-3xl font-bold text-gray-100 mb-6">{t.beforeYouTestTitle}</h2>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg leading-relaxed">
              {t.beforeYouTestDescription} <strong>{t.goodEnough}</strong>, {t.beforeYouTestText}
            </p>

            <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 rounded-lg p-6 mt-4 border-l-4 border-amber-500">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">{t.noteOnAccentTitle}</h3>
              <p className="text-gray-300 leading-relaxed">
                {t.noteOnAccentText}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-300">
                <strong>{t.rememberText}</strong> {t.rememberDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div className={`rounded-2xl p-6 mb-8 border-2 ${getStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="font-medium text-sm">{getStatusText()}</span>
            </div>
            {spaceStatus === "sleeping" && !wakingUp && (
              <button
                onClick={wakeUpSpace}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {t.wakeUpButton || "Wake Up Model"}
              </button>
            )}
            {wakingUp && (
              <span className="text-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.wakingUp || "Waking up model..."}
              </span>
            )}
          </div>
          {spaceStatus === "sleeping" && (
            <p className="text-sm mt-3 opacity-90">
              {t.sleepingMessage || "The AI model is currently sleeping. Click the button above to wake it up (this may take 30-60 seconds)."}
            </p>
          )}
        </div>

        {/* Main Interface */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">{t.tryItYourselfTitle}</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  {t.textToSynthesize}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.enterSpanishText}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none text-gray-100 placeholder-gray-500"
                  rows={6}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 block">
                  {t.examplesTitle}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {examples.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => loadExample(example)}
                  className="text-left bg-gray-900 hover:bg-gray-700 text-gray-300 text-sm px-4 py-3 rounded-lg border border-gray-600 transition-colors"
                >
                  {example.text}
                </button>
              ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    {t.temperatureLabel}
                  </label>
                  <span className="text-sm font-mono text-cyan-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {t.controlsSpeechExpressiveness}
                </p>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Settings className="w-4 h-4" />
                {showAdvanced ? t.hideShow.split('/')[0] : t.hideShow.split('/')[1]} {t.advancedSettings}
              </button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        {t.topKSampling}
                      </label>
                      <span className="text-sm font-mono text-cyan-400">{topK}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={topK}
                      onChange={(e) => setTopK(parseInt(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {t.limitsVocabularyChoices}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        {t.topPNucleus}
                      </label>
                      <span className="text-sm font-mono text-cyan-400">{topP.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={topP}
                      onChange={(e) => setTopP(parseFloat(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {t.controlsDiversityOfOutput}
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        {t.randomSeed}
                      </label>
                      <span className="text-sm font-mono text-cyan-400">{seed}</span>
                    </div>
                    <input
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-gray-100"
                      placeholder="67"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      {t.seedDescription}
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading || !text.trim() || spaceStatus !== "ready"}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.generatingButton}
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    {t.generateButton}
                  </>
                )}
              </button>
            </div>

            {/* Output Section */}
            <div>
              <label className="text-sm font-semibold text-gray-300 mb-2 block">
                 {t.outputLabel}
              </label>
              <div className="bg-gradient-to-br from-gray-900 to-slate-900 rounded-lg p-6 min-h-[400px] border-2 border-gray-700 flex flex-col items-center justify-center">
                {loading && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-cyan-500" />
                    <p className="text-gray-300 text-sm font-semibold">{t.processingMessage}</p>
                    <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg px-6 py-3 border border-cyan-500/30 min-h-[60px] flex items-center justify-center">
                      <p className="text-cyan-300 text-sm text-center transition-all duration-500 animate-pulse">
                        {t.loadingMessages[loadingMessageIndex]}
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs">{t.processingTime}</p>
                  </div>
                )}
                
                {error && (
                  <div className="w-full">
                    <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                      <p className="font-semibold">{t.errorTitle}</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="w-full">
                    <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                      <p className="font-semibold">{t.errorTitle}</p>
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                )}
                
                {audioUrl && !loading && (
                  <div className="w-full space-y-4">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                        <Volume2 className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    <audio
                      ref={audioRef}
                      controls
                      src={audioUrl}
                      className="w-full"
                    />
                    
                    <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg text-sm">
                       {t.successMessage}
                    </div>

                    <a
                      href={audioUrl}
                      download="voice_clone_output.wav"
                      className="block w-full text-center bg-gray-900 border-2 border-cyan-500 text-cyan-400 font-semibold py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      {t.downloadButton}
                    </a>
                  </div>
                )}
                
                {!loading && !error && !audioUrl && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Mic2 className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">
                      {t.placeholderMessage}
                    </p>
                    <p className="text-sm text-center mt-2">
                      {t.placeholderInstruction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-400 mb-3">{t.tipsTitle}</h3>
           <ul className="space-y-2 text-gray-300 text-sm">
              <li>• <strong>{t.tip1.split(':')[0]}:</strong> {t.tip1.split(':')[1]}</li>
              <li>• <strong>{t.tip2.split(':')[0]}:</strong> {t.tip2.split(':')[1]}</li>
              <li>• <strong>{t.tip3.split(':')[0]}:</strong> {t.tip3.split(':')[1]}</li>
              <li>• <strong>{t.tip4.split(':')[0]}:</strong> {t.tip4.split(':')[1]}</li>
            </ul>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 mt-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">{t.technicalImplementation}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold text-gray-100 mb-2">{t.trainingProcess}</h3>
              <p className="text-sm text-gray-400">
                {t.trainingProcessDescription}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
             <h3 className="font-semibold text-gray-100 mb-2">{t.modelSize}</h3>
              <p className="text-sm text-gray-400">
                {t.modelSizeDescription}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-5 border border-gray-700">
              <h3 className="font-semibold text-gray-100 mb-2">{t.inferenceSpeed}</h3>
              <p className="text-sm text-gray-400">
                {t.inferenceSpeedDescription}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              {t.footer}            
            </p>
                        <div className="flex items-center justify-center gap-6 text-sm">
              <a
                href="https://jonathan-orlowski.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Jonathan Orlowski
              </a>
              <a
                href="https://github.com/jonorl/simpsons-GPT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
                            <a
                href="https://huggingface.co/spaces/jonorl/simpsons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <SiHuggingface className="mb-1" aria-label="HuggingFace" />
                Hugging Face
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}