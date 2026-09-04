# Métricas y fuentes de Riot

## Fuentes

| Métrica | Fuente | Cálculo/nota | Confianza |
|---|---|---|---|
| CS/min | Match detail | `(totalMinionsKilled + neutralMinionsKilled) / minutos` | Alta |
| KDA | Match detail | `(kills + assists) / max(1, deaths)` | Alta |
| Muertes | Match detail | Campo directo | Alta |
| Oro/min | Match detail | `goldEarned / minutos` | Alta |
| Vision score/wards | Match detail | Campos directos | Alta para cantidad, no calidad |
| Muertes pre-15 | Timeline | Eventos `CHAMPION_KILL` con víctima y timestamp | Alta si timeline completo |
| Objetivos | Timeline | Eventos de monstruos/edificios; participación requiere definición | Media |
| Consistencia | Derivada | Desviación/CV de métricas del bloque | Alta si fórmula definida |
| Wave management | No directa | Solo proxy; requiere VOD para diagnóstico fuerte | Baja |
| Calidad de trade/recall | No directa | No afirmar desde Match-V5 | Baja |

## Normalización

Usar duración en segundos y evitar partidas inválidas/remakes. No mezclar parches sin registrarlos. El denominador de KDA y métricas de variabilidad debe estar definido para cero.

## Posición TOP

Primero `teamPosition`; fallback a `individualPosition`; contradicción o ausencia implica exclusión y motivo auditable. La política tendrá pruebas con fixtures reales anonimizados.

## Selección del bloque

Paginar hasta 50 IDs configurables, filtrar queue 420, descargar detalles con caché, validar TOP, duración y completitud, excluir usados y ordenar cronológicamente. Si hay menos de 10, devolver progreso; jamás mezclar Flex, normales u otros roles.

## Lenguaje de resultados

Distinguir observación de interpretación. Ejemplo válido: “El promedio de 6.4 CS/min está bajo el umbral experimental; conviene revisar pérdidas alrededor de recalls”. Ejemplo inválido: “No sabes manejar oleadas”.
