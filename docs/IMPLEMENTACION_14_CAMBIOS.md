# Implementación de los 14 cambios

| # | Cambio | Implementación |
|---:|---|---|
| 1 | Separar MVP, tesis y roadmap | `README.md`, `docs/alcance-y-roadmap.md` |
| 2 | ML como extensión experimental | `REGLAS_Y_LINEAMIENTOS_DEL_PROYECTO.md`, `docs/metodologia-investigacion.md`, `backend/app/ml/README.md` |
| 3 | Prompt Caching opcional | `.env.example` apagado por defecto; arquitectura y metodología documentadas |
| 4 | Elegir autenticación | Supabase Auth como única autenticación; `docs/arquitectura.md` y `docs/seguridad-y-cumplimiento.md` |
| 5 | Mapear métricas a Detail/Timeline | `docs/metricas-y-fuentes-riot.md` y evidencia por regla en `pack.yml` |
| 6 | Formalizar Rule Packs | Modelos Pydantic, YAML TOP, recomendaciones y `schema.json` generado |
| 7 | Declarar reglas como heurísticas | Metadatos de procedencia y estado `experimental` en el pack |
| 8 | Definir partida válida | Lineamientos y matriz de fuentes: queue 420, TOP, duración, no remake, completitud y no reutilización |
| 9 | Consolidar estructura/nombre | Proyecto real `topcoach-lol/`; documento anterior renombrado `ESTRUCTURA_BASE_PROYECTO.md` |
| 10 | Jobs e idempotencia | `app/schemas/jobs.py`, `app/schemas/evaluations.py`, `docs/modelo-datos-y-api.md` |
| 11 | Trazabilidad de reglas/modelo/prompt | Campos y restricciones definidos en `docs/modelo-datos-y-api.md` y lineamientos |
| 12 | Dividir README | README corto y documentación temática en `docs/` |
| 13 | Elevar riesgo de Riot API key | `docs/seguridad-y-cumplimiento.md` y plan de semana 1 |
| 14 | Actualizar propuesta sin tocar DOCX | `docs/propuesta-academica-prototipo.md`; el DOCX original permanece sin modificar |

## Verificación realizada

- Rule Pack TOP cargado y validado: 8 reglas.
- JSON Schema generado desde Pydantic.
- Backend: pruebas automatizadas y compilación Python.
- Endpoint `/health`: ejecución real y respuesta HTTP 200.
- Frontend: build de producción Vite/TypeScript.
- Dependencias frontend: auditoría sin vulnerabilidades reportadas.
- Markdown: enlaces locales y bloques de código validados.
- YAML/JSON: parseo correcto.
- Docker Compose: sintaxis YAML validada; no se pudo ejecutar `docker compose config` porque Docker no está instalado en este WSL.
