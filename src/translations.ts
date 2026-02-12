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
    loadingMessages: string[];
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
    statusReady: string;
    statusSleeping: string;
    statusChecking: string;
    statusError: string;
    wakeUpButton: string;
    wakingUp: string;
    sleepingMessage: string;
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
    loadingMessages:string[];
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
    statusReady: string;
    statusSleeping: string;
    statusChecking: string;
    statusError: string;
    wakeUpButton: string;
    wakingUp: string;
    sleepingMessage: string;
  };
}

export const translations: Translations = {
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
    loadingMessages: [
      'Analyzing text patterns...',
      'Loading voice model...',
      'Generating phonemes...',
      'Waking Pedro up...',
      'Pedro is getting a coffee...',
      'Now brushing his teeth...',
      'Gargling...',
      'Almost there, clearing his throat...',
      'Getting in front of the mic...',
      'Rendering speech output...'
    ],
    processingTime: 'This may take 50-60 seconds',
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
    whoIsBeingClonedDescription: 'The voice you\'ll hear in this demo belongs to my friend Pedro, aka',
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
    statusReady: 'Model Ready',
    statusSleeping: 'Model Sleeping',
    statusChecking: 'Checking Status...',
    statusError: 'Connection Error',
    wakeUpButton: 'Wake Up Model',
    wakingUp: 'Waking up model...',
    sleepingMessage: 'The AI model is currently sleeping. Click the button above to wake it up (this may take 30-60 seconds).',
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
    processingTime: 'Esto puede tomar 50-60 segundos',
        loadingMessages: [
      'Analizando patrones de texto...',
      'Cargando modelo de voz...',
      'Generando fonemas...',
      'Despertando a Pedro...',
      'Pedro se esta tomando un cafe...',
      'Se esta cepillando los dientes...',
      'Haciendo gargaras...',
      'Ya casi termina, se esta aclarando la garganta...',
      'Esta sentado en frente al microfono...',
      'Renderizando salida de voz...'
    ],
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
    whoIsBeingClonedDescription: 'La voz que escucharás en esta demostración pertenece a mi amigo Pedro, aka',
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
    rememberText: 'Recorda:',
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
    statusReady: 'Modelo Listo',
    statusSleeping: 'Modelo Durmiendo',
    statusChecking: 'Verificando Estado...',
    statusError: 'Error de Conexión',
    wakeUpButton: 'Despertar Modelo',
    wakingUp: 'Despertando modelo...',
    sleepingMessage: 'El modelo de IA está durmiendo actualmente. Hace clic en el botón de arriba para despertarlo (puede tardar 30-60 segundos).',
  },
};