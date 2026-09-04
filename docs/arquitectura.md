# Arquitectura

```text
Riot ID -> ACCOUNT-V1 -> PUUID -> MATCH-V5 IDs/detalle/timeline
                                      |
                                      v
                             caché + normalización
                                      |
                                      v
Supabase Auth -> FastAPI -> Supabase PostgreSQL <- worker/Redis
                            |
                            +-> Analytics Engine
                            +-> Rule Engine + TOP pack.yml
                            +-> Recommendation Orchestrator
                                      |
                                      v
                                  Bedrock
                                      |
                                      v
                           JSON Schema + Pydantic
                                      |
                                      v
                               React Dashboard
```

## Límites

- `clients/`: infraestructura externa, sin decisiones del dominio.
- `analytics/`: cálculos puros y reproducibles.
- `role_policies/`: conocimiento versionado, no código de red.
- `services/`: casos de uso y transacciones.
- `llm/`: proveedor, prompt, esquema y fallback.
- `workers/`: ejecución asíncrona; la API no espera llamadas masivas.
- `adapters/`: LoL primero; otros juegos no se implementan en el MVP.

## Autenticación

Se adopta Supabase Auth. FastAPI verifica issuer, audience, firma y expiración. El frontend no accede directamente a tablas sensibles; RLS complementa, no reemplaza, la autorización del backend.

## Base de datos

SQLAlchemy/psycopg mantiene portabilidad PostgreSQL. El pool de conexión se elige según el despliegue. Migraciones y backups usan conexión directa.

## Bedrock

La aplicación usa una abstracción de proveedor. Structured Outputs se usa si el modelo/API lo soporta y siempre se valida otra vez. Prompt Caching es una optimización opcional; se activa solo después de medir cache hits, costo y latencia.
