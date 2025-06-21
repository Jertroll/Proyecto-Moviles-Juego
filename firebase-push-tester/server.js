const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin'); // Ya lo tienes
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

const { VertexAI } = require('@google-cloud/vertexai'); // Asegúrate de que el nombre del paquete sea correcto

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Variables para el estado de Firebase
let firebaseInitialized = false;
let firebaseError = null;

// NUEVO: Variables para el cliente de Vertex AI
let vertexAIClient = null;
let generativeModel = null;

// Función para inicializar Firebase Admin
function initializeFirebase(credentials) {
  try {
    // Si ya está inicializado, no hacer nada
    if (admin.apps.length > 0) {
      return true;
    }

    if (credentials) {
      admin.initializeApp({
        credential: admin.credential.cert(credentials)
      });
      
      console.log('Firebase Admin inicializado correctamente');
      firebaseInitialized = true;
      firebaseError = null;


       // NUEVO: Inicializar Vertex AI después de que Firebase se inicialice correctamente
    // Necesitarás el Project ID y la región. Puedes obtener el Project ID de las credenciales
    // o configurarlo explícitamente.
    const projectId = credentials.project_id || process.env.GOOGLE_CLOUD_PROJECT;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'; // O la región que uses

    if (!projectId) {
        console.error('Error: No se pudo determinar el Project ID para Vertex AI.');
        // Podrías decidir si esto es un error fatal para la inicialización de Vertex AI
        return true; // Firebase se inicializó, pero Vertex AI podría no estarlo.
    }

    vertexAIClient = new VertexAI({ project: projectId, location: location });
    
    // Configura el modelo específico que quieres usar
    // Reemplaza 'gemini-1.5-flash-001' con tu modelo deseado
    generativeModel = vertexAIClient.getGenerativeModel({
        model: 'gemini-1.5-flash-001', 
        generationConfig: {
            responseMimeType: "application/json", // Para que Gemini intente devolver JSON
        },
        // safetySettings: [...] // Configura tus safety settings si es necesario
    });
    console.log(`Vertex AI Client y modelo ${'gemini-1.5-flash-001'} inicializados para el proyecto ${projectId} en ${location}.`);

      return true;
    } else {
      throw new Error('No se proporcionaron credenciales válidas');
    }
  } catch (error) {
    console.error('Error al inicializar Firebase Admin:', error);
    firebaseError = error.message;
    firebaseInitialized = false;
    return false;
  }
}

// Intentar inicializar Firebase con diferentes métodos
function tryInitializeFirebase() {
  // Método 1: Intentar cargar desde serviceAccountKey.json
  try {
    if (fs.existsSync('./serviceAccountKey.json')) {
      const serviceAccount = require('./serviceAccountKey.json');
      return initializeFirebase(serviceAccount);
    }
  } catch (e) {
    console.log('No se encontró archivo serviceAccountKey.json');
  }

  // Método 2: Intentar usar variables de entorno
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      const credentials = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      return initializeFirebase(credentials);
    } catch (e) {
      console.log('Error al analizar FIREBASE_SERVICE_ACCOUNT:', e);
    }
  }

  console.log('No se pudo inicializar Firebase. Por favor, configura las credenciales en la interfaz web.');
  return false;
}

// Intento inicial de inicialización
tryInitializeFirebase();

// Endpoint para configurar Firebase manualmente
app.post('/api/configure-firebase', (req, res) => {
  try {
    const { credentials } = req.body;
    
    if (!credentials) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron credenciales'
      });
    }
    
    // Guardar las credenciales en un archivo
    fs.writeFileSync('./serviceAccountKey.json', JSON.stringify(credentials, null, 2));
    
    // Inicializar Firebase con las nuevas credenciales
    if (initializeFirebase(credentials)) {
      res.status(200).json({
        success: true,
        message: 'Firebase configurado correctamente'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Error al inicializar Firebase con las credenciales proporcionadas',
        error: firebaseError
      });
    }
  } catch (error) {
    console.error('Error al configurar Firebase:', error);
    res.status(500).json({
      success: false,
      message: 'Error al configurar Firebase',
      error: error.message
    });
  }
});

// Middleware para verificar si Firebase está inicializado
const checkFirebaseInitialized = (req, res, next) => {
  if (firebaseInitialized) {
    next();
  } else {
    res.status(503).json({
      success: false,
      message: 'Firebase no está inicializado. Configura las credenciales primero.',
      error: firebaseError
    });
  }
};

// NUEVO: Middleware para verificar si Vertex AI está inicializado (opcional pero recomendado)
const checkVertexAIInitialized = (req, res, next) => {
    if (generativeModel) { // Verifica si el modelo está listo
        next();
    } else {
        res.status(503).json({
            success: false,
            message: 'Vertex AI no está inicializado. Verifica la configuración del servidor.',
            // Podrías tener un error específico para Vertex AI
        });
    }
};

// Endpoint para enviar notificaciones
app.post('/api/send-notification', checkFirebaseInitialized, async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren token, título y cuerpo del mensaje',
      });
    }

    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          channelId: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            alert: {
              title,
              body,
            },
            sound: 'default',
          },
        },
      },
    };

    console.log('Enviando notificación a:', token);
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada exitosamente:', response);

    res.status(200).json({
      success: true,
      message: 'Notificación enviada exitosamente',
      messageId: response,
    });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar notificación',
      error: error.message,
    });
  }
});

// Endpoint para enviar notificación a un tema (topic)
app.post('/api/send-topic-notification', checkFirebaseInitialized, async (req, res) => {
  try {
    const { topic, title, body, data } = req.body;
    
    if (!topic || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: `Se requieren topic, título y cuerpo del mensaje topic: ${topic}, title: ${title}, body: ${body}`
      });
    }

    const message = {
      
      notification: {
        title,
        body,
      },
      data: data || {},
      topic,
      android: {
        priority: 'high',
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
      },
      webpush: {
        headers: {
          Urgency: 'high',
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('Notificación al tema enviada exitosamente:', response);
    
    res.status(200).json({
      success: true,
      message: `Notificación enviada exitosamente al tema ${topic}`,
      messageId: response
    });
  } catch (error) {
    console.error('Error al enviar notificación al tema:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar notificación al tema',
      error: error.message
    });
  }
});

// Endpoint para enviar notificación a múltiples tokens
app.post('/api/send-multicast', checkFirebaseInitialized, async (req, res) => {
  try {
    const { tokens, title, body, data } = req.body;
    
    if (!tokens || !Array.isArray(tokens) || tokens.length === 0 || !title || !body) {
      return res.status(400).json({ 
        success: false, 
        message: 'Se requieren tokens (array), título y cuerpo del mensaje' 
      });
    }

    const message = {
      notification: {
        title,
        body,
      },
      data: data || {},
      tokens
    };

    const response = await admin.messaging().sendMulticast(message);
    console.log(`Notificación enviada a ${response.successCount} dispositivos de ${tokens.length}`);
    
    res.status(200).json({
      success: true,
      message: `Notificación enviada a ${response.successCount} dispositivos de ${tokens.length}`,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    });
  } catch (error) {
    console.error('Error al enviar notificaciones múltiples:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar notificaciones múltiples',
      error: error.message
    });
  }
});

// Endpoint para verificar el estado de Firebase
app.get('/api/firebase-status', (req, res) => {
  res.json({
    initialized: firebaseInitialized,
    error: firebaseError
  });
});



// Endpoint adaptado de manageSubscription de Firebase Function
app.post('/api/manage-subscription', checkFirebaseInitialized, async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { token, topic, action } = req.body;
  const validActions = ['subscribe', 'unsubscribe'];

  if (!token || !topic || !validActions.includes(action)) {
    return res.status(400).json({ error: 'token, topic y action (subscribe|unsubscribe) son requeridos' });
  }

  try {
    let result;
    const snippet = token.substring(0, 10);
    if (action === 'subscribe') {
      result = await admin.messaging().subscribeToTopic(token, topic);
      console.log(`Token ${snippet}... suscrito a ${topic}`, result.successCount);
    } else {
      result = await admin.messaging().unsubscribeFromTopic(token, topic);
      console.log(`Token ${snippet}... desuscrito de ${topic}`, result.successCount);
    }
    return res.json({ success: true, result });
  } catch (error) {
    console.error(`Error en ${action} topic ${topic}:`, error);
    let message = `Failed to ${action} topic`;
    if (error.code === 'messaging/invalid-argument') {
      message = `Argumento inválido. Verifica token y topic.`;
    } else if (error.code === 'messaging/registration-token-not-registered') {
      message = `Token expirado o inválido.`;
    }
    return res.status(500).json({ success: false, error: message });
  }
});



app.post('/api/analyze-image-vertexai', checkFirebaseInitialized, checkVertexAIInitialized, async (req, res) => {
    const { imageUrl } = req.body; // La URL de la imagen enviada desde el cliente Ionic/Android

    if (!imageUrl) {
        return res.status(400).json({ success: false, message: 'Se requiere la URL de la imagen (imageUrl).' });
    }

    // El prompt que usarás para Gemini
    const prompt = `Analiza la imagen en la URL proporcionada y determina si contiene un objeto reciclable. Si es reciclable, clasifícalo en una de estas categorías: orgánico, plástico o aluminio. Si no es reciclable, indícalo. Devuelve el resultado en formato JSON como: { "isRecyclable": true, "category": "plástico" } o { "isRecyclable": false, "reason": "No es un objeto reciclable" }.`;

    try {
        console.log(`Analizando imagen con Vertex AI: ${imageUrl}`);
 
        const nodeFetch = (await import('node-fetch')).default; // Para Node.js >= 18. Para <18, usa require('node-fetch')
        const imageResponse = await nodeFetch(imageUrl);
        
        if (!imageResponse.ok) {
            console.error('Error al descargar la imagen del URL:', imageUrl, imageResponse.statusText);
            return res.status(500).json({ success: false, message: `No se pudo descargar la imagen desde la URL: ${imageResponse.statusText}` });
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const imageBase64 = Buffer.from(imageBuffer).toString('base64');
        const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'; // Obtener el mime type real

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType,
            },
        };

        const request = {
            contents: [{ role: 'user', parts: [{ text: prompt }, imagePart] }],
        };

        // Envía la petición al modelo generativo
        const streamingResp = await generativeModel.generateContentStream(request); // o generateContent si no necesitas streaming
        
        // Para obtener la respuesta completa si es un stream y esperas JSON
        const aggregatedResponse = await streamingResp.response;
        const resultText = aggregatedResponse.candidates[0].content.parts[0].text;

        console.log('Respuesta cruda de Gemini (debería ser JSON):', resultText);

        let analysisResult;
        try {
            analysisResult = JSON.parse(resultText);
        } catch (parseError) {
            console.error("Error al parsear la respuesta JSON de Gemini:", parseError);
            console.error("Respuesta recibida que no es JSON:", resultText);
            return res.status(500).json({ success: false, message: 'La respuesta del modelo no fue un JSON válido.', rawResponse: resultText });
        }

        console.log('Resultado del análisis:', analysisResult);
        res.json({ success: true, data: analysisResult });

    } catch (error) {
        console.error('Error al analizar la imagen con Vertex AI:', error);
        let errorMessage = 'Error interno del servidor al analizar la imagen.';
        if (error.message) {
            errorMessage = error.message;
        }
        // Algunos errores de Google Cloud pueden tener más detalles
        if (error.details) { 
            errorMessage += ` Detalles: ${error.details}`;
        } else if (error.response && error.response.data) { // Errores de Axios u otros HTTP clients
            errorMessage += ` Detalles: ${JSON.stringify(error.response.data)}`;
        }
        res.status(500).json({ success: false, message: errorMessage, errorDetails: error.toString() });
    }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});