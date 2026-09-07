# CV Impulso IA

Mini SaaS académico para analizar y mejorar currículums. Permite pegar texto o cargar archivos TXT, CSV, DOCX, PPTX y XLSX. Genera fortalezas, oportunidades, palabras clave y un borrador de CV optimizado.

## Ejecutar localmente

Requiere Node.js 18 o superior.

```powershell
npm start
```

## Demo en vivo

[Probar CV Impulso IA](https://cv-impulso-ia.onrender.com)

## Ejecutar localmente

Abrir http://localhost:3000 después de ejecutar `npm start`.

El modo demostración funciona sin una clave. Para IA real, configurá la variable de entorno `OPENAI_API_KEY`.

```powershell
$env:OPENAI_API_KEY="tu_clave"
npm start
```

## Publicar en Render

1. Subí esta carpeta a un repositorio nuevo de GitHub.
2. En Render, elegí **New +** → **Blueprint** y conectá ese repositorio.
3. Render detectará el archivo `render.yaml`. Confirmá la creación.
4. En la configuración del servicio, agregá la variable de entorno `OPENAI_API_KEY` con tu clave real. No la escribas en un archivo ni la subas a GitHub.
5. Cuando el deploy termine, Render mostrará la URL pública.

## Privacidad y límites

Los archivos se convierten a texto en el navegador. Si activás OpenAI, el texto extraído se envía al modelo para el análisis. El resultado es un borrador y debe verificarse antes de usarlo en una postulación.
