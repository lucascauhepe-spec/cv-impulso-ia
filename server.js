import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8' };
const systemPrompt = `Sos un especialista en seleccion de talento y redaccion de CVs. Analiza el CV en espanol sin inventar experiencia, estudios, fechas, habilidades ni metricas. Devolve SOLO JSON valido con esta estructura: {"perfil":"string", "puntaje":number, "fortalezas":["string"], "oportunidades":["string"], "palabrasClave":["string"], "cvOptimizado":"string", "recomendaciones":["string"]}. El puntaje es 0 a 100. cvOptimizado debe conservar solo hechos presentes en el texto y usar secciones claras.`;

function send(res, status, body, type='application/json') {
  res.writeHead(status, {'Content-Type':type});
  res.end(Buffer.isBuffer(body) || typeof body === 'string' ? body : JSON.stringify(body));
}
async function body(req) { let value=''; for await (const chunk of req) value += chunk; return JSON.parse(value || '{}'); }

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/optimize') {
    try {
      const { cv, apiKey } = await body(req);
      if (!cv?.trim()) return send(res, 400, { error: 'Ingresá el texto de tu CV.' });
      const key = apiKey || process.env.OPENAI_API_KEY;
      if (!key) return send(res, 400, { error: 'Falta OPENAI_API_KEY. Elegí el modo demostración para probar sin una clave.' });
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST', headers: { 'Content-Type':'application/json', Authorization:`Bearer ${key}` },
        body: JSON.stringify({ model:'gpt-4.1-mini', input:[{role:'system', content:systemPrompt},{role:'user',content:`CV a analizar:\n${cv}`}], text:{format:{type:'json_object'}} })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || 'No se pudo procesar la solicitud.');
      send(res, 200, JSON.parse(payload.output_text));
    } catch (error) { send(res, 500, { error:error.message || 'Error inesperado.' }); }
    return;
  }
  const file = req.url === '/' ? 'index.html' : req.url.slice(1);
  if (file.includes('..')) return send(res, 403, 'Prohibido', 'text/plain');
  try { const content = await readFile(join(root, file)); send(res, 200, content, mime[extname(file)] || 'application/octet-stream'); }
  catch { send(res, 404, 'No encontrado', 'text/plain'); }
});
server.listen(process.env.PORT || 3000, () => console.log('CV IA SaaS: http://localhost:3000'));
