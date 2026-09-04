# Seguridad y cumplimiento

## Riot

- Registrar el producto y mantener su descripción actualizada.
- Development key: expira periódicamente y solo sirve para desarrollo.
- Personal key: apta para proyecto escolar/uso privado, no para consumo público.
- Production key: necesaria antes de publicar para usuarios abiertos.
- Respetar 429, `Retry-After` y límites de aplicación/método/servicio.
- HTTPS y clave solo en backend.
- Mostrar el boilerplate legal de Riot.
- No calcular MMR/ELO alternativo ni ofrecer ventaja en partida.

## Supabase

- Supabase Auth es la única autenticación del MVP.
- Anon key puede estar en frontend junto con RLS correcta.
- Service role nunca llega al navegador.
- FastAPI valida JWT y aplica autorización por propietario.
- Usar SSL, migraciones y política de backup/retención.

## AWS

- Desarrollo local: credenciales fuera de Git.
- Despliegue: IAM role y permisos mínimos para el modelo requerido.
- Registrar modelo y región, no secretos ni datos innecesarios.
- Timeout, cuotas, costos y fallback explícitos.

## Privacidad

Minimización, consentimiento, finalidad, retención y eliminación deben existir desde el MVP si se crean cuentas reales. Los datos demo deben estar anonimizados y etiquetados. No usar datos ajenos como si fueran del usuario.

## IA

Validar esquema y grounding. No afirmar causalidad, no inventar métricas, no prometer ELO y no ocultar si se usó fallback.
