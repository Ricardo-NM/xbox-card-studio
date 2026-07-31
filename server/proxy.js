const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;

// ============================================
// MIDDLEWARE - ESTO ESTABA FALTANDO
// ============================================
app.use(cors());
app.use(express.json()); //
app.use(express.urlencoded({ extended: true }));

// Logger para depuración
app.use((req, res, next) => {
  console.log(`[Proxy] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('[Proxy] Body:', JSON.stringify(req.body, null, 2).substring(0, 200));
  }
  next();
});

// ============================================
// RUTA DE PRUEBA
// ============================================
app.get('/api/xbox/test', (req, res) => {
  res.json({ status: 'Proxy funcionando correctamente' });
});

// ============================================
// PROXY PARA USER AUTHENTICATE
// ============================================
app.post('/api/xbox/user-authenticate', async (req, res) => {
  console.log('[Proxy] user-authenticate');
  
  // Validar que el body existe
  if (!req.body || !req.body.Properties) {
    console.error('[Proxy] Body inválido');
    return res.status(400).json({ 
      error: 'Body inválido',
      details: 'Se espera Properties en el body'
    });
  }

  try {
    const response = await axios.post('https://user.auth.xboxlive.com/user/authenticate', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('[Proxy] Xbox respondió:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy] Error en user-authenticate:', error.message);
    
    if (error.response) {
      console.error('[Proxy] Status:', error.response.status);
      console.error('[Proxy] Data:', JSON.stringify(error.response.data, null, 2));
      res.status(error.response.status).json({
        error: 'Error de Xbox Live',
        status: error.response.status,
        details: error.response.data
      });
    } else if (error.request) {
      res.status(500).json({ 
        error: 'Sin respuesta de Xbox Live',
        details: 'El servidor de Xbox no respondió'
      });
    } else {
      res.status(500).json({ 
        error: 'Error interno del proxy',
        details: error.message
      });
    }
  }
});

// ============================================
// PROXY PARA XSTS AUTHORIZE
// ============================================
app.post('/api/xbox/xsts-authorize', async (req, res) => {
  console.log('[Proxy] xsts-authorize');

  if (!req.body || !req.body.Properties) {
    return res.status(400).json({ error: 'Body inválido' });
  }

  try {
    const response = await axios.post('https://xsts.auth.xboxlive.com/xsts/authorize', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000
    });
    
    console.log('[Proxy] XSTS respondió:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy] Error en xsts-authorize:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ============================================
// PROXY PARA PERFIL
// ============================================
app.get('/api/xbox/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('[Proxy] profile');

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const response = await axios.get(
      'https://profile.xboxlive.com/users/me/profile/settings?settings=Gamertag,GameDisplayPicRaw,Gamerscore,RealName,AccountTier,UniqueModernGamertag',
      {
        headers: {
          'Authorization': authHeader,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('[Proxy] Profile respondió:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy] Error en profile:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ============================================
// PROXY PARA SOCIAL SUMMARY
// ============================================
app.get('/api/xbox/social-summary', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('[Proxy] social-summary');

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const response = await axios.get(
      'https://social.xboxlive.com/users/me/summary',
      {
        headers: {
          'Authorization': authHeader,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('[Proxy] Social Summary respondió:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy] Error en social-summary:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ============================================
// PROXY PARA PEOPLE
// ============================================
app.get('/api/xbox/people', async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('[Proxy] people');

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const response = await axios.get(
      'https://social.xboxlive.com/users/me/people',
      {
        headers: {
          'Authorization': authHeader,
          'x-xbl-contract-version': '2',
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );
    
    console.log('[Proxy] People respondió:', response.status);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Proxy] Error en people:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// ============================================
// PROXY PARA TITLEHUB
// ============================================
app.get('/api/xbox/titlehub/:xuid', async (req, res) => {
  const authHeader = req.headers.authorization;
  const { xuid } = req.params;
  
  console.log(`[Proxy] titlehub para XUID: ${xuid}`);

  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  if (!xuid || xuid === 'undefined' || xuid === 'null') {
    return res.status(400).json({ 
      error: 'XUID inválido',
      details: 'El XUID proporcionado no es válido'
    });
  }

  try {
    const titlehubUrl = `https://titlehub.xboxlive.com/users/xuid(${xuid})/titles/titlehistory/decoration/detail?maxItems=10`;
    console.log(`[Proxy] URL: ${titlehubUrl}`);
    
    const response = await axios.get(titlehubUrl, {
      headers: {
        'Authorization': authHeader,
        'x-xbl-contract-version': '2',
        'Accept': 'application/json',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br'
      },
      timeout: 30000
    });
    
    console.log('[Proxy] TitleHub respondió con status:', response.status);
    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error('[Proxy] Error en titlehub:');
    
    if (error.response) {
      console.error('[Proxy] Status:', error.response.status);
      console.error('[Proxy] Data:', error.response.data);
      
      // Intentar con el endpoint /me si falla
      if (error.response.status === 400 || error.response.status === 401) {
        console.log('[Proxy] Intentando con endpoint /me...');
        try {
          const meUrl = 'https://titlehub.xboxlive.com/users/me/titles/titlehistory/decoration/detail?maxItems=10';
          
          const meResponse = await axios.get(meUrl, {
            headers: {
              'Authorization': authHeader,
              'x-xbl-contract-version': '2',
              'Accept': 'application/json',
              'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            timeout: 30000
          });
          
          console.log('[Proxy] TitleHub (/me) respondió con status:', meResponse.status);
          return res.status(meResponse.status).json(meResponse.data);
        } catch (meError) {
          console.error('[Proxy] Error en TitleHub (/me):', meError.message);
          if (meError.response) {
            return res.status(meError.response.status).json(meError.response.data);
          }
        }
      }
      
      res.status(error.response.status).json({
        error: 'Error de TitleHub',
        status: error.response.status,
        details: error.response.data
      });
    } else if (error.request) {
      res.status(500).json({ 
        error: 'Sin respuesta de TitleHub',
        details: 'El servidor de TitleHub no respondió'
      });
    } else {
      res.status(500).json({ 
        error: 'Error interno del proxy',
        details: error.message
      });
    }
  }
});

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================
app.use((req, res) => {
  console.log(`[Proxy] Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.url,
    method: req.method
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('=========================================');
  console.log(`Proxy Xbox Live corriendo en puerto ${PORT}`);
  console.log(`Escuchando en http://localhost:${PORT}/api/`);
  console.log('=========================================');
});
