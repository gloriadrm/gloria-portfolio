---
title: "Transición energética y su huella de carbono"
status: "progress"
statusLabel: "En progreso"
problem: "¿Cómo ha evolucionado el mix energético mundial y su huella de carbono por país y década, y qué relación hay entre generación renovable y emisiones?"
description: "Pipeline analítico completo con arquitectura ELT. Los datos se modelan con dbt en capas (staging, intermediate, marts), se validan con tests automáticos y se documentan para garantizar su calidad. Un dashboard interactivo en Power BI permite analizar la evolución del mix energético y las emisiones de CO2 por país y periodo temporal."
stack: ["dbt Fusion 2.0", "Snowflake", "Power BI", "SQL", "Git", "GitHub"]
competencias: ["Modelado dimensional", "ELT", "Testing", "Data quality", "Documentación", "Power BI"]
order: 1
decisionDiff:
  elegido:
    titulo: "ELT"
    detalle: "Cargar primero en Snowflake y transformar después con dbt: cada paso queda versionado, testeado y documentado."
  descartado:
    titulo: "ETL"
    detalle: "Transformar antes de cargar. Más rígido: cualquier cambio de lógica exige tocar un script externo que no queda versionado ni testeado igual."
queDescarte:
  - "Imputar a cero los nulos de emisiones de gas o carbón en microestados: representan ausencia real de esa actividad, no datos faltantes, así que se dejan como null."
  - "Usar ACCOUNTADMIN como rol para crear la infraestructura de Snowflake: genera inconsistencias de privilegios frente al rol con el que se conecta dbt (SYSADMIN)."
  - "Normalizar manualmente los nombres de país: en su lugar, un LOWER() resuelve el choque entre las mayúsculas de Snowflake y las minúsculas del seed de forma consistente."
aprendizajes:
  - "Cuándo usar modelos incrementales en dbt y cómo afectan al rendimiento de un pipeline analítico frente a una reconstrucción completa (full refresh)."
  - "La infraestructura de Snowflake debe crearse con el mismo rol con el que se conecta dbt — usar un rol distinto provoca errores de privilegios difíciles de rastrear."
  - "No todos los nulos significan datos faltantes: los nulos de PIB en 2023–2024 responden a un rezago de consolidación de la fuente (OWID), mientras que los nulos en emisiones de gas o carbón en microestados reflejan ausencia real de esa actividad — cada caso exige un tratamiento distinto, nunca imputar a cero por defecto."
  - "dbt Fusion 2.0 introduce diferencias de sintaxis frente al dbt clásico (por ejemplo, arguments: en tests parametrizados) que conviene conocer antes de migrar un proyecto."
mejorasFuturas:
  - "Tests adicionales con dbt_expectations para reglas de negocio más específicas."
  - "Alertas automáticas si el pipeline detecta un salto anómalo en las emisiones de un país (posible error de fuente)."
  - "Modelos incrementales en las capas de mayor volumen para reducir el tiempo de build."
  - "Publicar el dashboard en un workspace de Power BI con enlace público de solo lectura."
siVolvieraEmpezar:
  - "Definiría desde el día 1 una convención explícita para el tratamiento de nulos (cuándo son ausencia real y cuándo dato faltante), en vez de decidirlo caso a caso sobre la marcha."
  - "Empezaría con modelos incrementales en las capas de mayor volumen desde el principio, no como mejora futura: el full refresh se nota en cuanto el dataset crece."
  - "Documentaría el rol de Snowflake usado en cada paso desde el primer commit — el error de privilegios por usar ACCOUNTADMIN me habría costado menos tiempo de detectar."
---

## Dataset

Datos públicos de **Our World in Data (OWID)**: series históricas de emisiones de CO₂ por país y las correspondientes al mix energético (generación por fuente: fósil, nuclear, renovable). Cobertura de más de 200 países y territorios, con series desde principios del siglo XX hasta la actualidad.

## Arquitectura

Snowflake actúa como warehouse; dbt Fusion 2.0 gestiona las transformaciones y los tests entre capas:

```
staging (stg_co2, stg_energy)
  → intermediate (int_country_year_energy)
    → marts (dim_country, dim_year, fct_country_year_metrics — 12 tests de calidad)
      → Power BI (dashboard por país / década)
```

El modelo final en `fct_country_year_metrics` unpivota 16 métricas a formato largo para facilitar el análisis en Power BI.

## Decisiones de diseño

- **Arquitectura ELT** en lugar de ETL: cargar primero en Snowflake y transformar después con dbt, para que cada transformación quede versionada, testeada y documentada en vez de vivir en un script externo.
- **Estructura en capas** (staging → intermediate → marts) siguiendo las convenciones de dbt, separando la limpieza de datos del modelado de negocio.
- **Formato largo** (unpivot de 16 métricas) en la tabla de hechos final, para que Power BI pueda filtrar dinámicamente por métrica sin necesitar una columna por indicador.
- **Power BI** frente a Tableau para esta primera iteración, por ser la herramienta más demandada en el mercado español.

<!-- Añade capturas del dashboard o del DAG de dbt en public/proyectos/huella-carbono/ y referéncialas aquí: -->
<!-- ![Dashboard de Power BI](/proyectos/huella-carbono/dashboard.png) -->
