# Ruta de implementación del MVP de TopCoach LoL

> **Para Hermes:** usar desarrollo dirigido por pruebas (TDD) y completar un grupo antes de iniciar el siguiente.

**Objetivo:** completar un MVP en el que un usuario autenticado vincule su Riot ID, procese 10 partidas TOP válidas, reciba métricas y 2–3 recomendaciones trazables, consulte historial y solo pueda reevaluarse con 10 partidas nuevas.

**Arquitectura:** implementar primero una tubería vertical backend y verificable: persistencia -> identidad -> Riot -> partidas -> métricas -> reglas -> evaluación. Integrar Bedrock y el frontend después de que el análisis determinístico funcione con fixtures. Supabase Auth será la única autenticación y Supabase PostgreSQL la persistencia administrada.

**Stack:** Python 3.12, FastAPI, Pydantic, SQLAlchemy 2, psycopg 3, Alembic, Supabase Auth/PostgreSQL, Redis + worker, Riot ACCOUNT-V1/MATCH-V5/Timeline, AWS Bedrock, React/Vite/TypeScript, pytest, Docker Compose y GitHub Actions.

---

## Principio de orden

No empezar por Bedrock ni por pantallas completas. La parte que determina si TopCoach es viable es esta:

```text
Riot ID -> PUUID -> partidas -> filtro TOP -> 10 válidas -> KPIs -> reglas -> evaluación guardada
```

Bedrock solamente debe explicar una evaluación que ya pueda generarse sin IA. El frontend debe consumir contratos de API estables, no definirlos mientras cambian.

## Estado de partida

Ya existe:

- Scaffold FastAPI y endpoint `/health`.
- Frontend React/Vite compilable.
- Configuración base, Dockerfiles, Compose y CI.
- Rule Pack TOP YAML, modelos Pydantic y esquema JSON.
- Tres pruebas backend.
- Documentación de alcance, arquitectura, métricas, API y seguridad.

Todavía falta la lógica de negocio real. El repositorio no tiene commits; antes de desarrollar debe congelarse el scaffold como baseline.

---

# Grupo 0 — Congelar y sanear la base

## Tarea 0.1: crear el primer commit

**Objetivo:** disponer de un punto de retorno antes de agregar persistencia.

**Revisar:**

- `.gitignore`
- `.env.example`
- `README.md`
- `backend/requirements.txt`
- `frontend/package-lock.json`

**Verificar:**

```bash
cd "/home/joserivera/Clases/Seminario Profesional 2/Proyecto/topcoach-lol"
git status --short
cd backend
.venv/bin/python -m pytest -q
cd ../frontend
npm run build
npm audit --audit-level=high
```

**Commit sugerido:**

```bash
git add .
git commit -m "chore: initialize TopCoach LoL MVP scaffold"
```

**Criterio de salida:** baseline versionado, pruebas verdes y build exitoso.

---

# Grupo 1 — Persistencia PostgreSQL y migraciones

Este es el siguiente paso óptimo.

## Tarea 1.1: crear el modelo relacional mínimo

**Crear:**

- `backend/app/models/user_profile.py`
- `backend/app/models/riot_account.py`
- `backend/app/models/match_cache.py`
- `backend/app/models/player_match_metric.py`
- `backend/app/models/evaluation.py`
- `backend/app/models/evaluation_match.py`
- `backend/app/models/rule_pack_version.py`
- `backend/app/models/rule_result.py`
- `backend/app/models/recommendation.py`
- `backend/app/models/job.py`
- `backend/app/models/model_run.py`

**Modificar:**

- `backend/app/models/__init__.py`
- `backend/app/db/base.py`

**Pruebas primero:**

- `backend/tests/models/test_metadata.py`
- `backend/tests/models/test_evaluation_constraints.py`

**Reglas esenciales:**

- IDs UUID.
- Fechas UTC.
- `RiotAccount.puuid` único por plataforma/región según la política elegida.
- `EvaluationMatch(evaluation_id, match_id)` único.
- Estado de `Evaluation`: pending/processing/completed/failed.
- Estado de `Job`: queued/running/completed/failed.
- Versiones y hashes almacenados en Evaluation/RuleResult/ModelRun.

## Tarea 1.2: configurar sesiones de base de datos

**Crear:**

- `backend/app/db/session.py`
- `backend/app/db/dependencies.py`

**Modificar:**

- `backend/app/core/config.py`

**Pruebas:**

- `backend/tests/db/test_session_config.py`

La configuración debe aceptar `DATABASE_URL`, activar `pool_pre_ping` y no imprimir credenciales.

## Tarea 1.3: habilitar Alembic

**Crear:**

- `backend/alembic.ini`
- `backend/migrations/env.py`
- `backend/migrations/script.py.mako`
- `backend/migrations/versions/0001_initial_schema.py`

**Verificar:**

```bash
cd backend
.venv/bin/python -m alembic upgrade head
.venv/bin/python -m alembic current
```

Usar conexión directa de Supabase para migraciones, no transaction pooler.

## Tarea 1.4: crear repositorios mínimos

**Crear:**

- `backend/app/db/repositories/riot_accounts.py`
- `backend/app/db/repositories/matches.py`
- `backend/app/db/repositories/evaluations.py`
- `backend/app/db/repositories/jobs.py`

**Pruebas:**

- `backend/tests/repositories/test_riot_accounts.py`
- `backend/tests/repositories/test_evaluations.py`

**Criterio de salida del grupo:** esquema creado por Alembic, conexión Supabase verificada y operaciones CRUD mínimas probadas.

**Commit sugerido:** `feat: add PostgreSQL persistence and initial migrations`

---

# Grupo 2 — Supabase Auth y autorización en FastAPI

## Tarea 2.1: configurar el proyecto Supabase

Acciones manuales:

1. Crear proyecto de desarrollo.
2. Copiar URL, anon key, issuer y cadena de conexión a `.env`.
3. No copiar service-role al frontend.
4. Configurar URLs de redirección local.

## Tarea 2.2: verificar JWT en backend

**Crear:**

- `backend/app/core/security.py`
- `backend/app/api/dependencies/auth.py`
- `backend/app/schemas/auth.py`

**Pruebas:**

- `backend/tests/security/test_supabase_jwt.py`
- `backend/tests/api/test_protected_route.py`

Probar token válido, expirado, issuer incorrecto, audience incorrecta y ausencia de token. Evitar llamadas de red por petición: cachear JWKS con expiración.

## Tarea 2.3: perfil local del usuario

**Crear:**

- `backend/app/services/user_profiles.py`
- `backend/app/api/routes/me.py`

**Endpoint:** `GET /me`

**Criterio de salida:** un token Supabase válido identifica al usuario y solo permite acceder a recursos propios.

**Commit sugerido:** `feat: integrate Supabase authentication`

---

# Grupo 3 — Cliente Riot: Riot ID -> PUUID

## Tarea 3.1: definir regiones y errores

**Crear:**

- `backend/app/clients/riot/constants.py`
- `backend/app/clients/riot/errors.py`
- `backend/app/clients/riot/routing.py`

Distinguir platform routing (`la1`, `na1`, etc.) de regional routing (`americas`, `europe`, `asia`, `sea`).

## Tarea 3.2: implementar cliente HTTP base

**Crear:**

- `backend/app/clients/riot/client.py`

**Pruebas:**

- `backend/tests/clients/riot/test_client_errors.py`
- `backend/tests/clients/riot/test_rate_limit.py`

Comportamiento requerido:

- Timeout explícito.
- Manejo de 401/403/404/429/5xx.
- Respetar `Retry-After`.
- Backoff con jitter solo para errores reintentables.
- Nunca registrar la API key.

## Tarea 3.3: ACCOUNT-V1

**Crear:**

- `backend/app/clients/riot/account.py`
- `backend/app/schemas/riot.py`

**Endpoint interno:** Riot ID + tagline -> PUUID.

**Fixtures:**

- `backend/tests/fixtures/riot/account_success.json`
- `backend/tests/fixtures/riot/account_not_found.json`

## Tarea 3.4: vincular cuenta

**Crear:**

- `backend/app/services/riot_accounts.py`
- `backend/app/api/routes/riot_accounts.py`

**Endpoints:**

- `POST /riot/accounts`
- `GET /riot/accounts/{id}`

**Criterio de salida:** usuario autenticado vincula una cuenta y otro usuario no puede consultarla.

**Commit sugerido:** `feat: link Riot accounts by Riot ID`

---

# Grupo 4 — Ingesta de Match-V5 y caché

## Tarea 4.1: obtener IDs paginados

**Crear:**

- `backend/app/clients/riot/matches.py`

Solicitar Ranked Solo/Duo cuando el endpoint lo permita y paginar hasta un máximo configurable inicial de 50 IDs.

**Fixtures/pruebas:**

- `backend/tests/clients/riot/test_match_ids.py`
- páginas vacías, duplicadas y parciales.

## Tarea 4.2: detalle y Timeline

**Crear:**

- `backend/app/clients/riot/match_detail.py`
- `backend/app/clients/riot/timeline.py`

**Fixtures:** un detalle y un timeline reales anonimizados, además de remake e incompleto.

## Tarea 4.3: caché por match ID

**Crear:**

- `backend/app/services/match_cache.py`

Guardar payload original o ubicación, fecha de consulta, parche, cola y estado de completitud. Una segunda sincronización no debe volver a pedir el mismo detalle válido.

## Tarea 4.4: endpoint de sincronización

**Crear/modificar:**

- `backend/app/api/routes/matches.py`
- `backend/app/services/match_sync.py`
- `backend/app/main.py`

**Contrato:** `POST /matches/sync -> 202 + job_id`.

Inicialmente se puede ejecutar el servicio de forma síncrona detrás del contrato de job para validar el flujo; moverlo al worker en el Grupo 9 sin cambiar la API.

**Criterio de salida:** una cuenta produce partidas cacheadas de forma idempotente y los 429 se manejan correctamente.

**Commit sugerido:** `feat: ingest and cache Riot match data`

---

# Grupo 5 — Validación de partidas TOP

## Tarea 5.1: política de posición

**Crear:**

- `backend/app/analytics/match_validation.py`
- `backend/app/schemas/matches.py`

**Pruebas:**

- `backend/tests/analytics/test_match_validation.py`

Casos obligatorios:

- `teamPosition=TOP` válido.
- Fallback `individualPosition=TOP`.
- Campos contradictorios -> `position_uncertain`.
- queue distinta de 420.
- remake/duración insuficiente.
- participante ausente.
- Timeline requerido pero ausente.

## Tarea 5.2: seleccionar bloque

**Crear:**

- `backend/app/services/match_selection.py`

**Pruebas:**

- `backend/tests/services/test_match_selection.py`

Ordenar cronológicamente, excluir usados, tomar exactamente 10 y retornar `X/10` cuando no alcance.

**Criterio de salida:** fixture mixto produce exactamente el conjunto esperado de match IDs TOP.

**Commit sugerido:** `feat: validate and select Top Lane match blocks`

---

# Grupo 6 — Motor de métricas

Implementar una métrica por ciclo TDD; no todas de una vez.

## Tarea 6.1: tipos y resultado común

**Crear:**

- `backend/app/analytics/types.py`
- `backend/app/analytics/result.py`

Cada métrica debe devolver valor, unidad, fuente, versión y limitaciones.

## Tareas 6.2–6.8: métricas individuales

**Crear:**

- `backend/app/analytics/cs.py`
- `backend/app/analytics/combat.py`
- `backend/app/analytics/economy.py`
- `backend/app/analytics/vision.py`
- `backend/app/analytics/timeline.py`
- `backend/app/analytics/objectives.py`
- `backend/app/analytics/consistency.py`

**Pruebas correspondientes:** `backend/tests/analytics/test_*.py`

Orden recomendado:

1. CS/min.
2. KDA con cero muertes.
3. Oro/min.
4. Muertes promedio.
5. Muertes pre-15 desde Timeline.
6. Visión descriptiva.
7. Consistencia y manejo de media cercana a cero.
8. Objetivos solo después de definir participación espacial/temporal.

## Tarea 6.9: agregado de bloque

**Crear:**

- `backend/app/analytics/block_analyzer.py`

**Criterio de salida:** un fixture de 10 partidas genera el mismo JSON determinístico en ejecuciones repetidas.

**Commit sugerido:** `feat: calculate deterministic Top Lane metrics`

---

# Grupo 7 — Motor de reglas TOP

El loader ya existe; falta ejecutar condiciones y producir hallazgos.

## Tarea 7.1: evaluar operadores

**Crear:**

- `backend/app/role_policies/evaluator.py`

**Pruebas:**

- `backend/tests/role_policies/test_operators.py`

Cubrir límites exactos: 6.5/8.0 CS/min, 1/2/3 muertes pre-15 y 4/6 muertes promedio.

## Tarea 7.2: estrategias threshold/relative/descriptive

**Crear:**

- `backend/app/role_policies/engine.py`
- `backend/app/schemas/findings.py`

**Pruebas:**

- `backend/tests/role_policies/test_engine.py`

No evaluar `relative` sin bloque anterior. Marcarla como `insufficient_reference`, no inventar un baseline.

## Tarea 7.3: priorización determinística

**Crear:**

- `backend/app/services/finding_prioritizer.py`

Seleccionar 2–3 prioridades usando severidad, recurrencia y evidencia. Definir desempate estable.

**Criterio de salida:** métricas conocidas producen hallazgos reproducibles, trazables a rule ID y recommendation ID.

**Commit sugerido:** `feat: evaluate versioned Top Lane rules`

---

# Grupo 8 — Crear y consultar evaluaciones

## Tarea 8.1: caso de uso transaccional

**Crear:**

- `backend/app/services/evaluations.py`

Dentro de una transacción:

1. Bloquear/reservar partidas elegibles.
2. Verificar exactamente 10.
3. Crear Evaluation.
4. Crear EvaluationMatch.
5. Guardar métricas, RuleResults y recomendaciones.
6. Guardar versión/hash del Rule Pack.

## Tarea 8.2: API de evaluaciones

**Crear:**

- `backend/app/api/routes/evaluations.py`

**Endpoints:**

- `POST /evaluations -> 202 + job_id`
- `GET /evaluations`
- `GET /evaluations/{id}`
- `GET /evaluations/{id}/recommendations`

## Tarea 8.3: idempotencia

**Crear:**

- `backend/app/services/idempotency.py`

Misma `Idempotency-Key` + mismo usuario + payload produce el mismo job; payload distinto produce conflicto.

**Criterio de salida:** se crea y consulta una evaluación completa sin Bedrock.

**Commit sugerido:** `feat: create traceable match evaluations`

---

# Grupo 9 — Redis y worker

## Tarea 9.1: escoger una sola tecnología

Para el MVP usar RQ si se desea menor complejidad, o Celery si se necesita scheduling/reintentos avanzados. No mantener ambas opciones en código.

## Tarea 9.2: cola y estado

**Crear:**

- `backend/app/workers/queue.py`
- `backend/app/workers/tasks.py`
- `backend/app/services/jobs.py`
- `backend/app/api/routes/jobs.py`

**Endpoint:** `GET /jobs/{job_id}`.

## Tarea 9.3: mover sync/evaluation al worker

El contrato HTTP no cambia. Probar transición queued -> running -> completed/failed y reintentos solo para errores transitorios.

**Modificar:**

- `docker-compose.yml` para incluir servicio worker.
- `.github/workflows/ci.yml` para pruebas correspondientes.

**Criterio de salida:** el endpoint responde rápido con 202 y el job finaliza de manera observable.

**Commit sugerido:** `feat: process match evaluations asynchronously`

---

# Grupo 10 — Recomendaciones sin IA y AWS Bedrock

## Tarea 10.1: fallback determinístico primero

**Crear:**

- `backend/app/llm/template_provider.py`
- `backend/app/llm/schemas.py`

Usar `recommendations.yml` para crear reporte sin IA. Esto garantiza demo aun sin Bedrock.

## Tarea 10.2: payload permitido

**Crear:**

- `backend/app/llm/payload_builder.py`

Enviar solo métricas, hallazgos, reglas relevantes, limitaciones e historial autorizado. Nunca raw match completo si no es necesario.

## Tarea 10.3: Bedrock provider

**Crear:**

- `backend/app/llm/bedrock_provider.py`
- `backend/app/llm/prompts/top_v1.py`

**Pruebas:**

- `backend/tests/llm/test_payload_builder.py`
- `backend/tests/llm/test_structured_output.py`
- `backend/tests/llm/test_grounding_validator.py`

Verificar JSON Schema, timeout, errores, modelo/región y que todos los valores citados existan en la entrada.

## Tarea 10.4: registrar ModelRun

Guardar modelo, prompt version, input hash, tokens, latencia, costo y salida validada. Prompt Caching permanece apagado hasta tener mediciones.

**Criterio de salida:** Bedrock mejora la redacción sin poder alterar el diagnóstico determinístico.

**Commit sugerido:** `feat: generate grounded reports with AWS Bedrock`

---

# Grupo 11 — Frontend funcional

Implementar por flujos, no por componentes aislados.

## Tarea 11.1: cliente y autenticación

**Crear:**

- `frontend/src/lib/supabase.ts`
- `frontend/src/services/api.ts`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/pages/LoginPage.tsx`

## Tarea 11.2: vincular Riot ID

**Crear:**

- `frontend/src/pages/AccountPage.tsx`
- `frontend/src/components/RiotAccountForm.tsx`

## Tarea 11.3: sincronización y progreso

**Crear:**

- `frontend/src/pages/EvaluationPage.tsx`
- `frontend/src/hooks/useJobPolling.ts`
- `frontend/src/components/MatchProgress.tsx`

Mostrar estados, errores y `X/10 partidas válidas`; no dejar spinner infinito.

## Tarea 11.4: reporte e historial

**Crear:**

- `frontend/src/pages/ReportPage.tsx`
- `frontend/src/pages/HistoryPage.tsx`
- `frontend/src/components/PriorityCard.tsx`
- `frontend/src/components/MetricEvidence.tsx`

Mostrar valor, referencia, severidad, explicación, limitación y meta.

## Tarea 11.5: pruebas

Agregar Vitest + Testing Library para formularios, errores, polling y reporte. Mantener `npm run build` verde.

**Criterio de salida:** flujo completo navegable desde login hasta informe guardado.

**Commit sugerido:** `feat: add end-to-end MVP user flow`

---

# Grupo 12 — Reevaluación y progreso longitudinal

## Tarea 12.1: disponibilidad

**Crear:**

- `backend/app/services/reevaluation.py`
- `backend/app/api/routes/analytics.py`

Calcular nuevas válidas excluyendo todos los match IDs ya usados para el ciclo/rol/cola.

## Tarea 12.2: comparación

**Crear:**

- `backend/app/analytics/progress.py`
- `backend/app/schemas/progress.py`

Comparar dimensiones sin afirmar causalidad. Manejar métricas faltantes y cambios de parche.

## Tarea 12.3: UI de progreso

**Crear:**

- `frontend/src/pages/ProgressPage.tsx`
- `frontend/src/components/EvaluationComparison.tsx`

**Criterio de salida:** con 9 nuevas partidas se bloquea; con 10 se crea un bloque sin reutilizar ninguna anterior.

**Commit sugerido:** `feat: enforce reevaluation and compare progress`

---

# Grupo 13 — Demo, seguridad, despliegue y cierre

## Tarea 13.1: dataset demo

Preparar 20 partidas reales anonimizadas y separadas cronológicamente en dos bloques. Documentar cuenta/fuente, consentimiento, parche y procedimiento de captura sin versionar secretos.

## Tarea 13.2: pruebas de aceptación

**Crear:**

- `backend/tests/acceptance/test_initial_evaluation.py`
- `backend/tests/acceptance/test_reevaluation.py`
- pruebas E2E frontend si el tiempo lo permite.

## Tarea 13.3: hardening

- CORS explícito.
- Headers de seguridad.
- Logs estructurados con request/job ID.
- Redacción de secretos.
- Límites de tamaño y timeout.
- Borrado de cuenta/datos.
- Aviso legal de Riot visible.

## Tarea 13.4: despliegue

- Solicitar/confirmar tipo de key Riot apropiado.
- Configurar Supabase de producción.
- Usar rol IAM para Bedrock.
- Ejecutar migraciones.
- Verificar health checks, frontend, worker, Redis y rollback.

## Tarea 13.5: evidencias académicas

Capturas, logs, OpenAPI, ERD, casos de prueba, tabla de métricas, costo/latencia, limitaciones y demo reproducible.

**Criterio de salida:** Definition of Done completa y demo repetible sin jugar partidas durante la exposición.

**Commit sugerido:** `chore: prepare secure reproducible MVP demo`

---

# Orden resumido de ejecución

```text
0. Baseline Git
1. PostgreSQL + Alembic + repositorios          <- siguiente paso óptimo
2. Supabase Auth
3. Riot ID -> PUUID
4. Match-V5 + Timeline + caché
5. Validación TOP + selección de 10
6. KPIs determinísticos
7. Motor de reglas + 2–3 prioridades
8. Evaluación persistida + historial
9. Redis/worker + jobs
10. Fallback por plantillas + Bedrock
11. Frontend completo
12. Reevaluación + progreso
13. Demo + seguridad + despliegue
```

# Gates: no avanzar si falla el anterior

1. **Gate persistencia:** migración y CRUD reales.
2. **Gate Riot:** fixture y llamada controlada Riot ID -> PUUID.
3. **Gate ingesta:** caché idempotente y 429 probado.
4. **Gate validez:** 10 IDs esperados desde dataset mixto.
5. **Gate analítica:** JSON de métricas reproducible.
6. **Gate reglas:** límites y trazabilidad probados.
7. **Gate evaluación:** informe sin IA guardado y consultable.
8. **Gate IA:** salida estructurada y grounding validados.
9. **Gate UX:** flujo completo sin intervención manual en DB.
10. **Gate reevaluación:** cero reutilización de partidas.
11. **Gate entrega:** demo de 20 partidas y documentación.

# Qué no implementar todavía

- ML, Random Forest, XGBoost o cohortes.
- Jungle/Mid/ADC/Support.
- Segundo juego.
- Prompt Caching.
- Score 0–100 presentado como calibrado.
- VOD, overlay o análisis en tiempo real.
- Experimentos de setup/horario.

Estos puntos consumen tiempo y no demuestran antes la viabilidad del núcleo.

# Comandos de verificación recurrentes

```bash
cd "/home/joserivera/Clases/Seminario Profesional 2/Proyecto/topcoach-lol/backend"
.venv/bin/python -m pytest -q
.venv/bin/python -m compileall -q app tests

cd ../frontend
npm run build
npm audit --audit-level=high

cd ..
backend/.venv/bin/python scripts/validate_rule_pack.py
git status --short
```

# Riesgos y mitigación

- **Supabase bloquea el avance:** desarrollar modelos/repositorios con una base de prueba y dejar prueba de integración opt-in con `TEST_DATABASE_URL`.
- **Riot key expira/no se aprueba:** fixtures reales anonimizados y modo demo; iniciar trámite en el Grupo 0.
- **Rate limits:** caché antes de descargar Timeline y respeto de `Retry-After`.
- **Métricas ambiguas:** no implementar diagnóstico fuerte sin fuente observable.
- **Bedrock falla/cuota:** fallback determinístico obligatorio.
- **Inflación de alcance:** ninguna funcionalidad fuera del Definition of Done entra antes del Grupo 13.

# Primer bloque de trabajo recomendado

Comenzar exclusivamente con el Grupo 1. El primer entregable concreto debe ser:

```text
Supabase PostgreSQL conectado
+ modelos SQLAlchemy
+ migración Alembic 0001
+ repositorios mínimos
+ pruebas verdes
```

No implementar autenticación, Riot ni frontend en paralelo hasta cerrar ese gate, salvo crear/configurar las cuentas externas necesarias para evitar bloqueos posteriores.
