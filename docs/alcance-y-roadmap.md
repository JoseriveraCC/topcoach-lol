# Alcance y roadmap

## MVP de SP2

Resultado obligatorio al finalizar el semestre: flujo completo de un usuario, una cuenta Riot, una cola, un rol y bloques de 10 partidas. Incluye reglas TOP v1, informe controlado, historial y reevaluación.

## Tesis

Después del MVP: protocolo de comparación entre reglas, LLM e híbrido; muestra piloto; rúbrica de utilidad, consistencia y explicabilidad; ML únicamente con datos suficientes. Setup y horario se reportan como asociaciones, no causalidad.

## Privado y evolución

Arquitectura multirol, Rule Packs por campeón/arquetipo, cohortes, multijuego, VOD, observabilidad y escalamiento. Ninguno es condición para aprobar el MVP.

## Plan de 16 semanas

1. Alcance, riesgos y acceso a Riot.
2. Arquitectura, ERD, API y wireframes.
3–4. Scaffold, Supabase Auth/PostgreSQL, Docker y CI.
5–6. Riot ID, Match-V5, caché, 429 y fixtures.
7–8. Filtro TOP, Timeline y KPIs.
9. Rule Pack TOP v1 y pruebas.
10. Dashboard e historial.
11. Evaluación y prioridades.
12. Reevaluación e idempotencia.
13. Bedrock estructurado y validador; caching solo si conviene.
14. Pruebas, seguridad y logs.
15. Despliegue y demo de 20 partidas.
16. Informe y defensa.

## Recorte de contingencia

Si existe retraso: conservar reglas + plantillas explicativas y posponer Bedrock; conservar polling de jobs y posponer infraestructura avanzada de workers; nunca recortar trazabilidad, validez de partidas o pruebas de métricas.
