# Metodología de investigación

## Pregunta

¿Un enfoque híbrido de métricas, reglas determinísticas y explicación mediante LLM produce recomendaciones más útiles, consistentes y trazables que reglas solas o un LLM solo?

## Brazos

- A: reglas + plantilla determinística.
- B: LLM con datos estructurados, solo para evaluación experimental offline.
- C: reglas + LLM explicador + validación backend.
- D: ML + reglas + LLM, únicamente si existe dataset suficiente.

El brazo B no será el decisor de producción.

## Variables de evaluación

- Utilidad percibida: rúbrica/Likert definida antes del piloto.
- Consistencia: repeticiones con los mismos match IDs y parámetros.
- Explicabilidad/trazabilidad: proporción de afirmaciones vinculadas a evidencia.
- Fundamentación: afirmaciones no soportadas por entrada.
- Rendimiento: latencia y errores.
- Costo: tokens y estimación por llamada.
- Progreso longitudinal: diferencia entre bloques, sin afirmar causalidad.

## ML

Diez partidas no son un dataset de entrenamiento. Antes de ML se define unidad de análisis, etiqueta, tamaño mínimo, procedencia, partición train/validation/test, baseline, métricas y prevención de data leakage. Si no se alcanza suficiencia, la conclusión válida es usar estadística descriptiva y reglas.

## Reglas

Las reglas TOP v1 son heurísticas experimentales. La validación debe registrar participantes/revisores, procedimiento, cambios y versión final. Los pesos del score 0–100 no se presentan como calibrados hasta demostrar normalización y prueba piloto.

## Reproducibilidad

Guardar IDs, parche, versión analítica, Rule Pack/hash, prompt, modelo, parámetros y salida validada. Temperatura y aleatoriedad se fijan al medir consistencia.

## Prompt Caching

Es un subexperimento técnico: medir cache write/read tokens, hits, costo y latencia con/sin caché. No asumir beneficio; contextos cortos o evaluaciones separadas por horas pueden producir beneficio nulo.
