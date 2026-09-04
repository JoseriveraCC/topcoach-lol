# TopCoach LoL

WebApp de entrenamiento post-partida para League of Legends. El MVP analiza bloques de 10 partidas válidas de Top Lane en Ranked Solo/Duo, calcula métricas reproducibles, aplica reglas versionadas y utiliza AWS Bedrock únicamente para explicar hallazgos fundamentados.

> OP.GG muestra datos; TopCoach LoL transforma datos en prioridades, metas de práctica y reevaluaciones comparables.

## Estado

Scaffold inicial operativo: API FastAPI con `/health`, frontend React/Vite, Rule Pack TOP validado, Redis, Dockerfiles, CI y documentación base. La integración real con Riot, Supabase Auth/PostgreSQL y Bedrock es el siguiente incremento.

## Alcance obligatorio del MVP

- Cuenta mediante Supabase Auth.
- Vinculación de Riot ID y obtención de PUUID.
- Match-V5 y Timeline con caché, backoff y manejo de 429.
- `queueId=420`, rol TOP, exclusión de remakes/incompletas y partidas ya usadas.
- Bloque de exactamente 10 partidas válidas.
- KPIs determinísticos y Rule Pack TOP v1.
- Dos o tres prioridades con métrica, valor, referencia y meta.
- AWS Bedrock como explicador; salida estructurada y validada por Pydantic.
- Historial y reevaluación únicamente con 10 partidas nuevas.
- Pruebas, documentación y demo reproducible.

ML, multirol, multijuego, análisis de setup y Prompt Caching no bloquean el MVP; están documentados como experimentos o roadmap.

## Arquitectura resumida

```text
React/Vite -> FastAPI -> Supabase PostgreSQL
                 |
                 +-> Riot API -> caché/Redis -> workers
                 +-> métricas -> Rule Pack TOP -> Bedrock -> validador
```

## Inicio local

Backend:

```bash
cd backend
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m pytest -q
.venv/bin/python -m uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Con Docker, cuando Docker esté instalado:

```bash
cp .env.example .env
docker compose up --build
```

- API: http://localhost:8000
- OpenAPI: http://localhost:8000/docs
- Frontend Docker: http://localhost:8080

## Documentación

- [`../ESTRUCTURA_BASE_PROYECTO.md`](../ESTRUCTURA_BASE_PROYECTO.md): documento extenso que antes ocupaba el `README.md` original.
- [`REGLAS_Y_LINEAMIENTOS_DEL_PROYECTO.md`](REGLAS_Y_LINEAMIENTOS_DEL_PROYECTO.md): contrato principal de desarrollo.
- [`docs/alcance-y-roadmap.md`](docs/alcance-y-roadmap.md): separación MVP/tesis/privado.
- [`docs/arquitectura.md`](docs/arquitectura.md): componentes y decisiones.
- [`docs/metricas-y-fuentes-riot.md`](docs/metricas-y-fuentes-riot.md): métricas posibles y limitaciones.
- [`docs/modelo-datos-y-api.md`](docs/modelo-datos-y-api.md): persistencia, jobs e idempotencia.
- [`docs/metodologia-investigacion.md`](docs/metodologia-investigacion.md): reglas, LLM, híbrido y ML.
- [`docs/seguridad-y-cumplimiento.md`](docs/seguridad-y-cumplimiento.md): Supabase, AWS y Riot.
- [`docs/propuesta-academica-prototipo.md`](docs/propuesta-academica-prototipo.md): prototipo para futura actualización del DOCX.
- [`docs/IMPLEMENTACION_14_CAMBIOS.md`](docs/IMPLEMENTACION_14_CAMBIOS.md): trazabilidad de los cambios aplicados y su verificación.

## Reglas del rol

El primer paquete ejecutable se encuentra en `backend/app/role_policies/top/pack.yml`. Es experimental y debe validarse antes de describirse como conocimiento experto.

```bash
backend/.venv/bin/python scripts/validate_rule_pack.py
```

## Aviso de Riot

TopCoach LoL no está respaldado por Riot Games y no refleja las opiniones de Riot Games ni de ninguna persona involucrada oficialmente en la producción o administración de sus propiedades. Riot Games y todas sus propiedades asociadas son marcas comerciales o marcas registradas de Riot Games, Inc.

## Licencia

Pendiente de decisión. El repositorio se mantiene académico y privado hasta definir las condiciones de distribución.
# topcoach-lol
