# Reglas y lineamientos de desarrollo — TopCoach LoL

Este documento es el contrato técnico y funcional del proyecto. Si una implementación contradice este archivo, debe corregirse o registrarse una decisión de arquitectura que explique el cambio.

## 1. Prioridades inmutables del MVP

1. El MVP analiza solamente TOP en Ranked Solo/Duo (`queueId=420`).
2. Cada evaluación contiene exactamente 10 partidas válidas.
3. Una partida no puede reutilizarse en una reevaluación del mismo ciclo.
4. No se crea una reevaluación hasta reunir 10 partidas nuevas válidas.
5. Las métricas se calculan en backend; el LLM no es la fuente de verdad.
6. Toda recomendación cita métrica, valor observado, referencia/umbral y meta.
7. Solo se muestran afirmaciones respaldadas por campos disponibles.
8. Los paquetes de reglas son versionados, validados y auditables.
9. El sistema funciona sin ML y sin Prompt Caching.
10. No se promete subida de ELO ni se infiere MMR.

## 2. Alcance por nivel

### MVP SP2 — obligatorio

Autenticación, Riot ID/PUUID, ingesta, Timeline cuando corresponda, 10 partidas TOP válidas, métricas, reglas, informe Bedrock controlado, historial, reevaluación, pruebas y demo.

### Tesis — experimental

Comparación reglas vs. LLM vs. híbrido; evaluación con rúbrica y usuarios; modelo estadístico/ML solo con dataset suficiente; medición longitudinal.

### Privado/roadmap

Multirol, multijuego, setup/hábitos, cohortes, VOD, observabilidad avanzada y escalamiento.

## 3. Decisión Supabase

Se utilizará Supabase Auth y Supabase PostgreSQL. El frontend autentica con la anon key pública; FastAPI valida el JWT de Supabase. Una service-role key, si llegara a necesitarse, vive únicamente en backend. La lógica sensible y el acceso ORM permanecen en FastAPI.

- Backend persistente: conexión directa si existe IPv6; session pooler si el entorno es IPv4.
- Serverless: transaction pooler, deshabilitando prepared statements si el driver lo requiere.
- Alembic, `pg_dump` y tareas administrativas: conexión directa.
- TLS/SSL obligatorio fuera de desarrollo local.

No se implementará un segundo sistema propio de contraseñas/JWT.

## 4. Partida válida

Una partida es válida cuando:

- `queueId == 420`.
- El PUUID evaluado aparece como participante.
- La posición reportada es TOP según la política documentada.
- No es remake y cumple la duración mínima configurada.
- El detalle está completo.
- Existe Timeline si una regla seleccionada lo requiere.
- El `match_id` no fue usado por el ciclo.

Política inicial de posición:

1. Usar `teamPosition == TOP`.
2. Si falta, aceptar `individualPosition == TOP`.
3. Si los campos se contradicen o ambos faltan, marcar `position_uncertain` y excluir del MVP.

La sincronización pagina hasta un límite configurable —inicialmente 50 IDs— y se detiene al reunir 10 válidas. Si no alcanza, informa `X/10`; no rellena con otras colas o roles.

## 5. Reglas del dominio

- Autoría en YAML; carga segura con `yaml.safe_load`.
- Validación Pydantic antes de ejecutar.
- Versión semántica del pack y del esquema.
- Cada regla incluye ID, métrica, estrategia, agregación, muestra, condiciones, evidencia, limitaciones, recomendación y justificación.
- Cada evaluación guarda `rule_pack_version` y hash del contenido.
- Cambiar un umbral exige nueva versión y pruebas.
- Las reglas iniciales se denominan “heurísticas experimentales propuestas por el autor”.
- Solo se llamarán “validadas” después de documentar revisión o prueba piloto.
- Parche, campeón/arquetipo y rango deben poder incorporarse sin cambiar el motor.

## 6. Métricas y lenguaje permitido

El sistema distingue datos directos, métricas derivadas e inferencias.

- Directo: kills, deaths, assists, gold, vision, wards, duración, campeón, resultado.
- Derivado: CS/min, oro/min, KDA, promedio, desviación y coeficiente de variación.
- Timeline: muertes pre-15 y eventos temporales de objetivos.
- No observable directamente: calidad de wave management, trades, recall, posicionamiento o causa táctica.

Usar “sugiere”, “es compatible con” o “conviene revisar” para inferencias. No afirmar causalidad.

El score 0–100 queda experimental hasta definir normalización, outliers, datos faltantes y calibración. El MVP prioriza estados por dimensión: bueno, atención y crítico.

## 7. Bedrock

Entrada permitida: métricas calculadas, resultados de reglas, historial autorizado, definiciones y recomendaciones permitidas.

Salida obligatoria:

- JSON Schema compatible con el modelo/API elegidos.
- Dos o tres prioridades.
- Valores copiados de la entrada, nunca recalculados.
- Explicación, limitación y meta medible.
- Validación Pydantic y contraste de cada valor contra la fuente.

Debe existir una interfaz `ExplanationProvider` y un fallback explícito por plantillas para pruebas/demo. El fallback nunca se etiqueta como respuesta de Bedrock.

Prompt Caching es opcional, apagado por defecto y sujeto a soporte del modelo, mínimos de tokens, TTL y cache hits medidos. Nunca habilita multirol ni bloquea una evaluación.

## 8. ML e investigación

No entrenar un modelo individual con 10 partidas. ML queda fuera del criterio de éxito del MVP. Solo se incorpora con dataset suficiente, etiqueta operacional, partición train/validation/test y prevención de fuga de información. Para el MVP se usan estadística descriptiva, reglas e historial propio.

La variante “LLM solo” puede existir como brazo experimental offline; no será el decisor de producción.

## 9. Jobs e idempotencia

`POST /matches/sync` y `POST /evaluations` responden `202` con `job_id`. `GET /jobs/{id}` expone `queued|running|completed|failed`.

La creación del bloque ocurre en transacción. Restricciones mínimas:

- `UNIQUE(evaluation_id, match_id)`.
- Un `match_id` no se reutiliza dentro del mismo ciclo/rol/cola.
- Una clave de idempotencia evita jobs duplicados.

Los workers respetan `Retry-After`, backoff con jitter y límites application/method/service de Riot.

## 10. Trazabilidad

Cada evaluación registra: PUUID interno, match IDs, parche, versión analítica, versión/hash del Rule Pack, modelo Bedrock, versión de prompt, hash de entrada, parámetros de inferencia, tokens, cache read/write, costo estimado, latencia y salida validada.

No registrar secretos ni prompts con datos personales innecesarios.

## 11. Calidad

- Desarrollo funcional con pruebas primero.
- Pruebas unitarias para fórmulas y reglas; integración para Riot/DB/Bedrock; contrato para JSON Schema.
- CI debe ejecutar backend y build frontend.
- Ninguna métrica se considera terminada sin fixture conocido y resultado verificable.
- Ninguna integración se considera terminada con datos simulados presentados como reales.
- Documentar decisiones y limitaciones.

## 12. Seguridad y cumplimiento

- Nunca claves en Git o frontend.
- IAM role en despliegue AWS; credenciales estáticas solo para desarrollo local seguro.
- HTTPS, mínima retención, consentimiento y eliminación de cuenta/datos.
- Aviso legal de Riot visible.
- Análisis exclusivamente post-partida; no otorgar ventajas durante una partida.
- Development key expira; personal key no sirve para producto público; solicitar production key para publicación.

## 13. Estructura objetivo

```text
topcoach-lol/
├── backend/
│   ├── app/{api,clients,core,db,models,schemas,services,analytics,role_policies,llm,workers,adapters,helpers,ml}/
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/src/
├── docs/
├── scripts/
├── demo-data/
├── .github/workflows/
├── docker-compose.yml
├── .env.example
└── README.md
```

## 14. Definition of Done del MVP

Un usuario autenticado vincula Riot ID, reúne 10 partidas TOP válidas, obtiene KPIs y 2–3 prioridades trazables, consulta historial y solo puede reevaluarse con 10 partidas nuevas. El flujo cuenta con pruebas, logs, documentación, manejo de errores y demo reproducible.
