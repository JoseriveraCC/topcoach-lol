# Modelo de datos y API

## Entidades mínimas

- `UserProfile`: referencia a Supabase Auth.
- `RiotAccount`: Riot ID, región y PUUID cifrado/protegido según necesidad.
- `MatchCache`: match ID, queue, parche, duración, estado y payload/ubicación.
- `PlayerMatchMetric`: métricas normalizadas por participante.
- `Evaluation`: ciclo, bloque, score experimental, versiones y estado.
- `EvaluationMatch`: relación ordenada y única.
- `RulePackVersion`: versión, hash, estado y procedencia.
- `RuleResult`: regla, valor, severidad, evidencia y limitación.
- `Recommendation`: prioridad, fuente, meta y trazabilidad.
- `Job`: estado asíncrono, idempotency key y error estable.
- `ModelRun`: proveedor/modelo/prompt, hashes, tokens, caché, costo, latencia y salida.
- `Experiment`: solo tesis, no requerido por MVP.

## Integridad

- `UNIQUE(evaluation_id, match_id)`.
- No reutilizar match dentro de un ciclo, rol y cola.
- Exactamente 10 relaciones al completar una evaluación; validación transaccional.
- Versiones y hashes no se actualizan después de publicar una evaluación.
- Una recomendación no puede citar una métrica ausente.

## API objetivo

```text
GET    /health
POST   /riot/accounts
GET    /riot/accounts/{id}
POST   /matches/sync                 -> 202 + job_id
GET    /matches
GET    /matches/{match_id}
POST   /evaluations                  -> 202 + job_id
GET    /evaluations
GET    /evaluations/{id}
GET    /evaluations/{id}/recommendations
GET    /jobs/{job_id}
GET    /analytics/progress
GET    /analytics/summary
```

Supabase Auth proporciona registro/login; no se duplican endpoints propios de contraseña. FastAPI expone endpoints protegidos después de validar el token.

## Idempotencia

Las solicitudes de sync/evaluación aceptan `Idempotency-Key`. Una repetición devuelve el mismo job. La reserva de los 10 match IDs ocurre dentro de la misma transacción que crea la evaluación.

## Estado de job

`queued`, `running`, `completed`, `failed`. Los errores públicos usan códigos estables; los detalles sensibles quedan en logs.
