# Prototipo de propuesta académica — TopCoach LoL

> Documento Markdown de trabajo. No sustituye ni modifica `Plan_Ejecucion_Tesis_TopCoach_LoL_SP2.docx`. Servirá para revisar los cambios antes de producir una futura versión oficial.

## Título

TopCoach LoL: plataforma de analítica y entrenamiento post-partida para jugadores de Top Lane mediante métricas reproducibles, reglas versionadas e IA generativa con trazabilidad.

## Resumen ejecutivo

TopCoach LoL transformará datos de partidas de League of Legends en un ciclo de diagnóstico, metas de práctica y reevaluación. El MVP analizará exactamente 10 partidas válidas de Top Lane en Ranked Solo/Duo, calculará métricas determinísticas, aplicará heurísticas TOP versionadas y utilizará AWS Bedrock para redactar explicaciones estructuradas. Una reevaluación solo será posible con 10 partidas nuevas no utilizadas.

La fuente de verdad será el backend. El LLM no alterará métricas ni decidirá fuera de los hallazgos permitidos. PostgreSQL será administrado por Supabase y la autenticación utilizará Supabase Auth.

## Problema

Las plataformas existentes muestran historial y estadísticas, pero el jugador puede no convertirlas en acciones medibles ni comprobar si mejoró. TopCoach busca cerrar esa brecha sin prometer subida de ELO ni reemplazar la revisión profesional.

## Objetivo general

Diseñar, implementar y evaluar una WebApp que convierta datos post-partida de Top Lane en prioridades trazables, metas de práctica e historial longitudinal por bloques independientes de 10 partidas.

## Objetivos específicos del MVP

1. Obtener PUUID por Riot ID y descargar Match-V5/Timeline con caché y rate limiting.
2. Filtrar queue 420, TOP, no remakes, datos completos y partidas no usadas.
3. Calcular KPIs con fórmulas reproducibles.
4. Cargar y validar un Rule Pack TOP v1 en YAML.
5. Producir 2–3 prioridades con evidencia, limitación y meta.
6. Integrar Bedrock con JSON Schema y validación Pydantic.
7. Persistir evaluaciones, reglas, match IDs y trazabilidad de inferencia.
8. Implementar historial y reevaluación con 10 partidas nuevas.
9. Probar, desplegar y demostrar el flujo con 20 partidas reales anonimizadas.

## Fuera del MVP

ML obligatorio, soporte funcional para otros roles, multijuego, VOD, cohortes, setup/hábitos y Prompt Caching como dependencia.

## Pregunta de investigación para tesis

¿El enfoque híbrido de métricas, reglas determinísticas y explicación mediante LLM genera recomendaciones más útiles, consistentes y trazables que reglas solas o un LLM solo?

## Hipótesis

- Las reglas serán más reproducibles, pero menos flexibles.
- El LLM mejorará claridad, pero puede introducir afirmaciones no fundamentadas.
- El enfoque híbrido ofrecerá mejor equilibrio si el backend valida toda salida.
- ML solo aportará evidencia válida si se dispone de un dataset suficiente y un protocolo sin fuga de datos.

## Arquitectura

React/Vite; FastAPI; Supabase Auth y PostgreSQL; SQLAlchemy/psycopg; Redis y workers; Riot ACCOUNT-V1/MATCH-V5/Timeline; motor analítico; Rule Packs; AWS Bedrock; Pydantic/JSON Schema; Docker y GitHub Actions.

## Reglas y conocimiento

Las reglas se denominarán heurísticas experimentales propuestas por el autor. Incluirán procedencia, versión, parche, rol, evidencia y limitaciones. Podrán promocionarse a validadas únicamente después de revisión documentada o pruebas piloto.

## IA generativa

Bedrock recibe métricas ya calculadas y resultados de reglas. Structured Outputs y Pydantic controlan el contrato. Prompt Caching será una optimización opcional evaluada por cache hits, costo y latencia; el producto funcionará sin ella.

## Metodología

El MVP mide funcionalidad y trazabilidad. La tesis podrá comparar reglas, LLM e híbrido con rúbrica predefinida, repeticiones y usuarios piloto. Un modelo ML no se entrenará con un único bloque de 10 partidas.

## Riesgos

- Llave de Riot: iniciar temprano, usar datos demo y solicitar nivel apropiado antes de publicar.
- 429/cambios API: caché, backoff, adaptador aislado.
- Métricas no observables: matriz de fuentes y lenguaje no causal.
- Scope creep: Definition of Done cerrada.
- Bedrock: modelo compatible, cuotas, fallback y control de costo.
- Privacidad: minimización, consentimiento, retención y eliminación.

## Criterio de éxito

Un usuario autenticado vincula Riot ID, reúne 10 partidas TOP válidas, recibe KPIs y 2–3 prioridades verificables, consulta historial y solo crea una reevaluación después de 10 partidas nuevas. Todo hallazgo es trazable a datos, regla y versión.

## Estado de este prototipo

Pendiente de validación con la plantilla oficial del curso, fechas reales, modalidad individual/equipo y requisitos del catedrático. Una vez aprobado, se podrá trasladar al DOCX sin sobrescribir el original.
