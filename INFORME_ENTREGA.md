# Trabajo final — CV Impulso IA

**Materia:** Introducción a la Inteligencia Artificial  
**Producto:** mini SaaS de optimización de currículums  
**Autor/a:** completar con nombre y fecha

## 1. Caso y objetivo

Buscar empleo requiere adaptar un CV a cada oportunidad, redactar logros con claridad e identificar las palabras clave que usan los reclutadores. Muchas personas no saben cómo hacerlo o terminan usando textos genéricos. **CV Impulso IA** recibe el CV en texto y entrega un diagnóstico, recomendaciones concretas y una versión mejorada, sin inventar antecedentes.

El objetivo del producto es reducir el tiempo de primera revisión del CV y ayudar a mejorar su calidad antes de postular. El usuario mantiene siempre el control: revisa y valida el resultado antes de usarlo.

## 2. Flujo end-to-end y arquitectura

```text
Usuario → interfaz web → validación/limpieza → prompt estructurado → modelo de IA
   ↑                                                                  ↓
CV optimizado + recomendaciones ← JSON validado ← respuesta estructurada
```

1. El usuario pega su CV o carga un archivo TXT, CSV, DOCX, PPTX o XLSX. El navegador extrae el texto localmente antes de analizarlo.
2. El frontend elimina espacios innecesarios y valida que exista contenido.
3. El backend recibe el texto, añade el prompt de sistema y consulta el modelo.
4. La IA devuelve JSON con puntaje, fortalezas, oportunidades, palabras clave, CV optimizado y próximos pasos.
5. La interfaz muestra el resultado y permite copiar el CV. No se persiste información personal.

La entrega incluye además un **modo demostración local**: permite recorrer todo el flujo de interfaz y reglas de análisis sin API key. Es importante aclarar en la exposición que el modo productivo es el que usa el endpoint de IA.

## 3. Procesamiento de datos

La entrada se normaliza (espacios y líneas vacías), se verifica que no esté vacía y se conserva el texto original. Para Word, PowerPoint y Excel se extrae el texto del documento; CSV y TXT se leen directamente. En una siguiente iteración se incorporaría PDF y una extracción más precisa de las secciones `perfil`, `experiencia`, `educación` y `habilidades`. También se ocultarían datos sensibles innecesarios antes de llamar al modelo.

La respuesta se exige en JSON. Esto reduce ambigüedad y permite que la interfaz renderice campos previsibles. Para producción se agregaría validación estricta contra un esquema JSON y reintentos ante una salida inválida.

## 4. Integración de IA y prompt engineering

El prompt indica rol, tarea, idioma, formato de salida y una restricción central: **no inventar experiencia, fechas, métricas, estudios ni habilidades**. La instrucción pide el objeto JSON:

```json
{"perfil":"...","puntaje":80,"fortalezas":["..."],"oportunidades":["..."],"palabrasClave":["..."],"cvOptimizado":"...","recomendaciones":["..."]}
```

La mejora iterativa prevista es sumar el puesto objetivo y su descripción. Así se pedirían palabras clave presentes en la vacante, pero solo cuando sean compatibles con el CV. El modelo no decide qué información es verdadera: propone redacción; el usuario es quien la verifica.

## 5. Automatización propuesta (Make/Zapier)

Un workflow viable sería:

1. **Disparador:** formulario completado o resultado validado por el usuario.
2. **Webhook:** recibe nombre, email opcional, puesto objetivo y datos mínimos del análisis.
3. **Google Sheets/Airtable:** registra métricas anónimas (fecha, puntaje inicial, tipo de recomendación), nunca el CV completo sin consentimiento.
4. **Email:** envía un enlace al resultado o recordatorio de revisión, solo si la persona acepta recibirlo.
5. **Alertas:** si el servicio de IA falla, se notifica al administrador por Slack/email.

## 6. Interfaz

La web propone una pantalla única para reducir fricción: campo de texto a la izquierda y diagnóstico a la derecha. Se priorizan jerarquía visual, lenguaje claro, indicador de privacidad y diseño adaptable a móvil. La interfaz está implementada con HTML, CSS y JavaScript, sin dependencias, para que pueda ejecutarse con facilidad.

## 7. Validación y control de calidad

| Prueba | Resultado esperado | Criterio de aceptación |
|---|---|---|
| CV vacío | No se procesa | El sistema solicita ingresar texto |
| CV breve | Devuelve recomendaciones prudentes | No inventa datos |
| CV completo | Genera secciones y palabras clave | JSON válido y legible |
| Pedido de métrica inexistente | No la agrega | Se ofrece como oportunidad, no como hecho |
| Error de API | Muestra mensaje entendible | La pantalla no se rompe |

Para evaluar el resultado se revisarán diez CVs de prueba con una rúbrica: fidelidad al original, claridad, relevancia para un puesto, acciones concretas y ausencia de alucinaciones. El principal riesgo es que una IA formule afirmaciones que parecen plausibles. La mitigación es el prompt restrictivo, la presentación como borrador y la revisión final humana.

## 8. Conclusión y próximos pasos

Se construyó un flujo completo que une captura de datos, procesamiento, IA, interfaz y propuesta de automatización. Las próximas mejoras son carga de PDF/DOCX, comparación contra una vacante, autenticación, historial cifrado con consentimiento y exportación a PDF. El valor del producto no es reemplazar a la persona: es acelerar una primera versión más clara y accionable de su CV.

## Cómo ejecutar la demo

1. Instalar Node.js 18 o superior.
2. Abrir una terminal en esta carpeta y ejecutar `npm start`.
3. Visitar `http://localhost:3000`.
4. Usar **Cargar ejemplo** y luego **Analizar mi CV** para el modo local.
5. Para IA real, definir `OPENAI_API_KEY` como variable de entorno (recomendado) o activar **Usar OpenAI** e ingresar una clave temporal.
