import { useState, useRef } from 'react';
import { Loader2, Mic2, Volume2, Settings, Languages } from 'lucide-react';

type Language = 'en' | 'es';

interface Translations {
  en: {
    title: string;
    subtitle: string;
    aboutTitle: string;
    aboutDescription: string;
    technicalApproach: string;
    keyFeatures: string;
    howItWorksTitle: string;
    howItWorksDescription: string;
    modelParameters: string;
    modelParametersDescription: string;
    examplesTitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    advancedSettings: string;
    temperatureLabel: string;
    temperatureDescription: string;
    topKLabel: string;
    topKDescription: string;
    topPLabel: string;
    topPDescription: string;
    seedLabel: string;
    seedDescription: string;
    generateButton: string;
    generatingButton: string;
    outputLabel: string;
    processingMessage: string;
    processingTime: string;
    errorTitle: string;
    successMessage: string;
    downloadButton: string;
    placeholderMessage: string;
    placeholderInstruction: string;
    tipsTitle: string;
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
    technicalImplementation: string;
    trainingProcess: string;
    trainingProcessDescription: string;
    modelSize: string;
    modelSizeDescription: string;
    inferenceSpeed: string;
    inferenceSpeedDescription: string;
    footer: string;
    viewGithub: string;
    whoIsBeingClonedTitle: string;
    whoIsBeingClonedDescription: string;
    whoIsBeingClonedText: string;
    hearOriginalVoice: string;
    hearOriginalVoiceDescription: string;
    audioNotSupported: string;
    thankYouMessage: string;
    checkOutStreams: string;
    supportMessage: string;
    beforeYouTestTitle: string;
    beforeYouTestDescription: string;
    goodEnough: string;
    beforeYouTestText: string;
    noteOnAccentTitle: string;
    noteOnAccentText: string;
    rememberText: string;
    rememberDescription: string;
    tryItYourselfTitle: string;
    textToSynthesize: string;
    enterSpanishText: string;
    controlsSpeechExpressiveness: string;
    hideShow: string;
    topKSampling: string;
    limitsVocabularyChoices: string;
    topPNucleus: string;
    controlsDiversityOfOutput: string;
    randomSeed: string;
    technicalDetails: {
      model: string;
      framework: string;
      training: string;
      deployment: string;
    };
    features: {
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
    };
  };
  es: {
    title: string;
    subtitle: string;
    aboutTitle: string;
    aboutDescription: string;
    technicalApproach: string;
    keyFeatures: string;
    howItWorksTitle: string;
    howItWorksDescription: string;
    modelParameters: string;
    modelParametersDescription: string;
    examplesTitle: string;
    inputLabel: string;
    inputPlaceholder: string;
    advancedSettings: string;
    temperatureLabel: string;
    temperatureDescription: string;
    topKLabel: string;
    topKDescription: string;
    topPLabel: string;
    topPDescription: string;
    seedLabel: string;
    seedDescription: string;
    generateButton: string;
    generatingButton: string;
    outputLabel: string;
    processingMessage: string;
    processingTime: string;
    errorTitle: string;
    successMessage: string;
    downloadButton: string;
    placeholderMessage: string;
    placeholderInstruction: string;
    tipsTitle: string;
    tip1: string;
    tip2: string;
    tip3: string;
    tip4: string;
    technicalImplementation: string;
    trainingProcess: string;
    trainingProcessDescription: string;
    modelSize: string;
    modelSizeDescription: string;
    inferenceSpeed: string;
    inferenceSpeedDescription: string;
    footer: string;
    viewGithub: string;
    whoIsBeingClonedTitle: string;
    whoIsBeingClonedDescription: string;
    whoIsBeingClonedText: string;
    hearOriginalVoice: string;
    hearOriginalVoiceDescription: string;
    audioNotSupported: string;
    thankYouMessage: string;
    checkOutStreams: string;
    supportMessage: string;
    beforeYouTestTitle: string;
    beforeYouTestDescription: string;
    goodEnough: string;
    beforeYouTestText: string;
    noteOnAccentTitle: string;
    noteOnAccentText: string;
    rememberText: string;
    rememberDescription: string;
    tryItYourselfTitle: string;
    textToSynthesize: string;
    enterSpanishText: string;
    controlsSpeechExpressiveness: string;
    hideShow: string;
    topKSampling: string;
    limitsVocabularyChoices: string;
    topPNucleus: string;
    controlsDiversityOfOutput: string;
    randomSeed: string;
    technicalDetails: {
      model: string;
      framework: string;
      training: string;
      deployment: string;
    };
    features: {
      feature1: string;
      feature2: string;
      feature3: string;
      feature4: string;
    };
  };
}

const translations: Translations = {
  en: {
    title: 'Voice Cloning Demo',
    subtitle: 'AI-Powered Voice Synthesis with XTTS v2',
    aboutTitle: 'About This Project',
    aboutDescription: 'This project showcases state-of-the-art voice cloning technology using XTTS v2, a cutting-edge text-to-speech model. I fine-tuned the model on Spanish voice samples to create a personalized voice synthesis system that can generate natural-sounding speech from any text input.',
    technicalApproach: 'Technical Approach',
    keyFeatures: 'Key Features',
    howItWorksTitle: 'How Voice Cloning Works',
    howItWorksDescription: 'The system uses a two-stage process: First, it analyzes a reference audio sample to extract voice characteristics (timbre, pitch, speaking style). Then, it generates speech from text while maintaining these vocal traits. The XTTS v2 model employs advanced neural vocoding and GPT-based sequence modeling to produce high-quality, natural-sounding speech. Fine-tuning on Spanish samples improves pronunciation, rhythm, and accent authenticity.',
    modelParameters: 'Model Parameters',
    modelParametersDescription: 'Temperature controls speech variation (lower = more consistent, higher = more expressive). Top-K and Top-P limit token sampling for coherent output. Seed ensures reproducibility.',
    examplesTitle: 'Example Prompts',
    inputLabel: 'Text to Synthesize',
    inputPlaceholder: 'Enter the text you want to convert to speech...',
    advancedSettings: 'Advanced Settings',
    temperatureLabel: 'Temperature',
    temperatureDescription: 'Controls variation in speech',
    topKLabel: 'Top K',
    topKDescription: 'Limits vocabulary choices',
    topPLabel: 'Top P',
    topPDescription: 'Nucleus sampling threshold',
    seedLabel: 'Seed',
    seedDescription: 'For reproducible results',
    generateButton: 'Generate Speech',
    generatingButton: 'Generating Audio...',
    outputLabel: 'Generated Audio',
    processingMessage: 'Processing voice synthesis...',
    processingTime: 'This may take 10-30 seconds',
    errorTitle: 'Error',
    successMessage: 'Audio generated successfully! Click play to listen.',
    downloadButton: 'Download Audio File',
    placeholderMessage: 'Your generated audio will appear here...',
    placeholderInstruction: 'Enter text and click "Generate Speech"',
    tipsTitle: 'Tips for Best Results',
    tip1: 'Punctuation matters: Use commas and periods to improve natural pauses',
    tip2: 'Temperature: Try 0.5-0.7 for clear speech, 0.7-0.9 for more natural variation',
    tip3: 'Reproducibility: Same text + same parameters + same seed = identical audio',
    tip4: 'Important: This is for Spanish only as the base model and the fine-tuning was done with Spanish samples',
    technicalImplementation: 'Technical Implementation',
    trainingProcess: 'Training Process',
    trainingProcessDescription: 'Fine-tuned XTTS v2 on custom Spanish voice dataset using GPT-based architecture with 10 epochs and AdamW optimizer',
    modelSize: 'Model Size',
    modelSizeDescription: '5.6GB checkpoint with ~1.87B base parameters, optimized for Spanish phonemes and prosody patterns',
    inferenceSpeed: 'Inference Speed',
    inferenceSpeedDescription: '~5 seconds per generation on GPU (T4), ~30 seconds on CPU for typical sentences',
    footer: 'Built with Coqui TTS, PyTorch, Gradio, and React • Model hosted on Hugging Face Spaces',
    viewGithub: 'View on GitHub',
    technicalDetails: {
      model: 'Model: Coqui XTTS v2 (Fine-tuned)',
      framework: 'Framework: PyTorch & TTS Library',
      training: 'Training: Custom Spanish voice dataset',
      deployment: 'Deployment: Gradio API on Hugging Face Spaces',
    },
    features: {
      feature1: 'Natural prosody and intonation',
      feature2: 'Optimised for Argentinean Spanish',
      feature3: 'Adjustable generation parameters',
      feature4: 'Real-time synthesis',
    },
    whoIsBeingClonedTitle: 'Who is Being Cloned?',
    whoIsBeingClonedDescription: 'The voice you\'ll hear in this demo belongs to my friend',
    whoIsBeingClonedText: 'a talented content creator and streamer from Buenos Aires, Argentina. I used a collection of WhatsApp voice messages to train this model, and I\'m incredibly grateful for his permission and support in making this project possible.',
    hearOriginalVoice: 'Hear the Original Voice',
    hearOriginalVoiceDescription: 'Listen to a sample of the original voice used for training:',
    audioNotSupported: 'Your browser does not support the audio element.',
    thankYouMessage: 'A huge thank you to PsicogamerRandomStreaming for trusting me with his voice and being part of this AI experiment! His willingness to collaborate made this demonstration possible.',
    checkOutStreams: 'Check out his streams!',
    supportMessage: 'If you enjoy this demo, consider showing some support by following and watching his content. Great streamers deserve our support!',
    beforeYouTestTitle: 'Before You Test It',
    beforeYouTestDescription: 'The goal of this project was to create something',
    goodEnough: 'good enough',
    beforeYouTestText: 'not perfect. This is a demonstration of what\'s possible with accessible AI voice cloning technology, trained on my local hardware using and AMD 6950XT GPU + ROCm.',
    noteOnAccentTitle: 'A Note on Accent',
    noteOnAccentText: 'If you understand Spanish, you may notice that the generated voice sometimes sounds a bit like "Spanish from Spain" rather than Argentinean Spanish. This is completely fine and expected given the scope of this project. The base XTTS v2 model was trained on diverse Spanish data, and with only 45 minutes of training audio, some of those base characteristics occasionally come through. It\'s a quirk that actually demonstrates how the model balances between learned voice characteristics and its pre-trained knowledge.',
    rememberText: 'Remember:',
    rememberDescription: 'This isn\'t meant to be a production-ready, flawless voice clone. It\'s a learning project that shows what you can achieve with modern AI tools, a short voice sample, and some experimentation. The results are good-enough for what they are, and that\'s exactly the point!',
    tryItYourselfTitle: 'Finally... try It Yourself!',
    textToSynthesize: 'Text to Synthesize',
    enterSpanishText: 'Enter Spanish text here...',
    controlsSpeechExpressiveness: 'Controls speech expressiveness',
    hideShow: 'Hide/Show',
    topKSampling: 'Top-k (Sampling)',
    limitsVocabularyChoices: 'Limits vocabulary choices',
    topPNucleus: 'Top-p (Nucleus)',
    controlsDiversityOfOutput: 'Controls diversity of output',
    randomSeed: 'Random Seed',
  },
  es: {
    title: 'Demostración de Clonación de Voz',
    subtitle: 'Síntesis de Voz Impulsada por IA con XTTS v2',
    aboutTitle: 'Sobre Este Proyecto',
    aboutDescription: 'Este proyecto muestra tecnología de clonación de voz de última generación utilizando XTTS v2, un modelo de texto a voz de vanguardia. Afiné el modelo con muestras de voz en español para crear un sistema de síntesis de voz personalizado que puede generar discurso de sonido natural a partir de cualquier texto.',
    technicalApproach: 'Enfoque Técnico',
    keyFeatures: 'Características Principales',
    howItWorksTitle: 'Cómo Funciona la Clonación de Voz',
    howItWorksDescription: 'El sistema utiliza un proceso de dos etapas: Primero, analiza una muestra de audio de referencia para extraer características de voz (timbre, tono, estilo de habla). Luego, genera discurso a partir del texto mientras mantiene estos rasgos vocales. El modelo XTTS v2 emplea codificación neuronal avanzada y modelado de secuencias basado en GPT para producir discurso de alta calidad y sonido natural. El ajuste fino en muestras de español mejora la pronunciación, el ritmo y la autenticidad del acento.',
    modelParameters: 'Parámetros del Modelo',
    modelParametersDescription: 'La temperatura controla la variación del habla (menor = más consistente, mayor = más expresivo). Top-K y Top-P limitan el muestreo de tokens para una salida coherente. El SEED garantiza reproducibilidad.',
    examplesTitle: 'Ejemplos de Texto',
    inputLabel: 'Texto para Sintetizar',
    inputPlaceholder: 'Ingresa el texto que deseas convertir en voz...',
    advancedSettings: 'Configuración Avanzada',
    temperatureLabel: 'Temperatura',
    temperatureDescription: 'Controla la variación en el habla',
    topKLabel: 'Top K',
    topKDescription: 'Limita las opciones de vocabulario',
    topPLabel: 'Top P',
    topPDescription: 'Umbral de muestreo por núcleo',
    seedLabel: 'SEED',
    seedDescription: 'Para resultados reproducibles',
    generateButton: 'Generar Voz',
    generatingButton: 'Generando Audio...',
    outputLabel: 'Audio Generado',
    processingMessage: 'Procesando síntesis de voz...',
    processingTime: 'Esto puede tomar 10-30 segundos',
    errorTitle: 'Error',
    successMessage: '¡Audio generado exitosamente! Haz clic en reproducir para escuchar.',
    downloadButton: 'Descargar Archivo de Audio',
    placeholderMessage: 'Tu audio generado aparecerá aquí...',
    placeholderInstruction: 'Ingresa texto y haz clic en "Generar Voz"',
    tipsTitle: 'Consejos para Mejores Resultados',
    tip1: 'La puntuación importa: Usa comas y puntos para mejorar las pausas naturales',
    tip2: 'Temperatura: Proba 0.5-0.7 para discurso claro, 0.7-0.9 para mayor variación natural',
    tip3: 'Reproducibilidad: Mismo texto + mismos parámetros + mismo SEED = audio idéntico',
    tip4: 'Importante: El texto tiene que ser en español ya que el modelo tiene base y fue afinado con muestras en español',
    technicalImplementation: 'Implementación Técnica',
    trainingProcess: 'Proceso de Entrenamiento',
    trainingProcessDescription: 'XTTS v2 afinado (fined tuned) con conjunto de datos de voz personalizado en español usando arquitectura basada en GPT con 10 épocas y optimizador AdamW',
    modelSize: 'Tamaño del Modelo',
    modelSizeDescription: 'Checkpoint de 5.6GB con ~1.87B parámetros base, optimizado para fonemas y patrones de prosodia del español',
    inferenceSpeed: 'Velocidad de Inferencia',
    inferenceSpeedDescription: '~5 segundos por generación en GPU (T4), ~30 segundos en CPU para oraciones típicas',
    footer: 'Construido con Coqui TTS, PyTorch, Gradio y React • Modelo alojado en Hugging Face Spaces',
    viewGithub: 'Ver en GitHub',
    technicalDetails: {
      model: 'Modelo: Coqui XTTS v2 (fine tuned)',
      framework: 'Framework: PyTorch y TTS',
      training: 'Entrenamiento: Conjunto de datos personalizado de voz en español de Argentina',
      deployment: 'Despliegue: API Gradio en Hugging Face Spaces',
    },
    features: {
      feature1: 'Prosodia y entonación natural',
      feature2: 'Optimizado para español Argentino',
      feature3: 'Parámetros de generación ajustables',
      feature4: 'Síntesis en tiempo real',
    },
    whoIsBeingClonedTitle: '¿De quién es la voz clonada?',
    whoIsBeingClonedDescription: 'La voz que escucharás en esta demostración pertenece a mi amigo',
    whoIsBeingClonedText: 'un talentoso creador de contenido y streamer de Buenos Aires, Argentina. Usé una colección de mensajes de voz de WhatsApp para entrenar este modelo, y estoy increíblemente agradecido por su permiso y apoyo para hacer posible este proyecto.',
    hearOriginalVoice: 'Escucha la voz original',
    hearOriginalVoiceDescription: 'Escucha una muestra de la voz original utilizada para el entrenamiento:',
    audioNotSupported: 'Tu navegador no soporta el elemento de audio.',
    thankYouMessage: '¡Un enorme agradecimiento a PsicogamerRandomStreaming por confiar en mí con su voz y ser parte de este experimento de IA! Su disposición hizo posible esta demostración.',
    checkOutStreams: '¡Mira sus transmisiones!',
    supportMessage: 'Si disfrutas esta demostración, considera mostrar apoyo siguiendo y viendo su contenido. ¡Los grandes streamers merecen nuestro apoyo!',
    beforeYouTestTitle: 'Antes de probarlo',
    beforeYouTestDescription: 'El objetivo de este proyecto era crear algo',
    goodEnough: 'suficientemente bueno',
    beforeYouTestText: 'no perfecto. Esta es una demostración de lo que es posible con tecnología accesible de clonación de voz por IA, entrenada con datos y usando mi propia computadora y GPU (AMD 6950XT).',
    noteOnAccentTitle: 'Una nota sobre el acento',
    noteOnAccentText: 'Si entendes español, podes notar que la voz generada a veces suena un poco como "español de España" en lugar de español argentino. Esto es esperado dados los parametros y objectivos de este proyecto. El modelo base XTTS v2 fue entrenado con datos diversos en español, y con solo 45 minutos de audio de entrenamiento, algunas de esas características base ocasionalmente se manifiestan. Es una peculiaridad que demuestra cómo el modelo equilibra entre las características de voz aprendidas durante el fine-tuning y su conocimiento preentrenado.',
    rememberText: 'Recuerda:',
    rememberDescription: 'Esto no pretende ser un clon de voz impecable listo para producción. Es un proyecto de aprendizaje que muestra lo que puedes lograr con herramientas modernas de IA, una muestra de voz corta y algo de experimentación. ¡Los resultados son esperables para lo que son, y ese es exactamente el punto!',
    tryItYourselfTitle: 'Finalmente... ¡probalo vos mismo!',
    textToSynthesize: 'Texto para sintetizar',
    enterSpanishText: 'Ingresa texto en español aquí...',
    controlsSpeechExpressiveness: 'Controla la expresividad del habla',
    hideShow: 'Ocultar/Mostrar',
    topKSampling: 'Top-k (Muestreo)',
    limitsVocabularyChoices: 'Limita las opciones de vocabulario',
    topPNucleus: 'Top-p (Núcleo)',
    controlsDiversityOfOutput: 'Controla la diversidad de la salida',
    randomSeed: 'SEED aleatoria',
  },
};

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
  const [error, setError] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  interface Example {
    text: string;
    temp: number;
  }

  const t = translations[language];

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

    const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
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
              <p className="text-lg leading-relaxed">
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
                <p className="text-gray-300 mb-4">
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
                      className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium inline-flex items-center gap-1 mt-1"
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
                disabled={loading || !text.trim()}
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
                    <p className="text-gray-300 text-sm">{t.processingMessage}</p>
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
                href="https://github.com/jonorl/voice-clone"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                {t.viewGithub}
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="https://jonathan-orlowski.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-yellow-400 transition-colors"
              >
                Jonathan Orlowski
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}