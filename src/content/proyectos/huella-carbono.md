---
title: "Transición energética y descarbonización global"
problem: "¿Qué países reducen emisiones por una transición energética real y cuáles solo por el colapso de su economía, y cómo cambia el ranking de descarbonización según se mida en términos absolutos o porcentuales?"
description: "Pipeline analítico end-to-end sobre emisiones de CO2 y transición energética en más de 190 países (1990-2022). Los datos de Our World in Data se transforman con dbt Core en capas sobre Snowflake hasta una tabla de hechos unpivotada, que alimenta dos dashboards en Tableau diseñados para separar la descarbonización real de la reducción por colapso económico y para contextualizar las emisiones dentro del crecimiento económico de cada país."
stack: ["Snowflake", "dbt Core", "SQL", "Tableau", "GitHub"]
competencias: ["Modelado analítico por capas en dbt", "Diseño de un modelo unpivotado para filtrado dinámico en BI", "Análisis de desacoplamiento entre crecimiento económico y emisiones", "Storytelling analítico orientado a preguntas de negocio", "Diseño de dashboards interactivos con Dashboard Actions"]
order: 1
github: "https://github.com/gloriadrm/dbt-carbon-footprint"
memoria: "/proyectos/huella-carbono/memoria.pdf"
queDescarte:
  - "Resolver el join entre emisiones y energía dentro de la propia capa staging: se descartó para mantener stg_co2 y stg_energy independientes y reutilizables por separado — el cruce vive solo en intermediate, del que derivan todos los marts."
  - "Repetir la lógica de nombres, unidades y categorías de cada métrica en cada mart que las necesita: se centralizó en el seed metric_catalog.csv, que se une a fct_country_year_metrics para enriquecer cada fila una única vez."
aprendizajes:
  - "Un porcentaje de reducción sin conocer el valor absoluto de partida puede ser engañoso: el contexto es tan parte del análisis como el propio dato."
  - "La ausencia de datos también es información, los países sin mix energético reportado en OWID son, en general, los que no han emprendido ninguna transición activa."
  - "Dashboard Actions en Tableau exige nombres y tipos de campo idénticos entre hojas; usar una función de agregación en vez del campo directo puede romper el resaltado cruzado entre visualizaciones."
  - "Los filtros a nivel de fuente de datos son más fiables que los de hoja para eliminar valores nulos de los selectores."
  - "Estructurar cada visualización alrededor de una única pregunta mejora la legibilidad del dashboard más que añadir más gráficos."
mejorasFuturas:
  - "Incorporar el PIB vía la API del Banco Mundial para extender el análisis de desacoplamiento más allá de 2022."
  - "Documentar los países con datos parciales (Corea del Norte, Yemen, Siria) como información analítica explícita, en vez de tratarlos como huecos sin más."
  - "Incorporar datos mensuales de la IEA para captar variaciones estacionales que la granularidad anual no recoge."
siVolvieraEmpezar:
  - "Diseñaría el modelo pensando primero en las preguntas de negocio a responder, no en los datos disponibles."
  - "Incorporaría datos de política climática desde el principio, para poder hablar de causalidad y no solo de correlación."
---

## Dataset

Datos públicos de **Our World in Data (OWID)**, con metodología equivalente a la del IPCC y la IEA: series de emisiones de CO₂ (`owid-co2-data`, ~50.000 registros) y de mix energético (`owid-energy-data`, ~22.000 registros) para más de 190 países. El análisis se acota a 1990 por las discontinuidades que introduce la disolución de la URSS en los datos de Europa del Este, y a 2022 por la disponibilidad de datos de PIB.

## Arquitectura

![Arquitectura del pipeline: fuentes en RAW_OWID, staging, intermediate y marts en dbt](../../assets/proyectos/huella-carbono/arquitectura-dbt.png)

*Snowflake actúa como warehouse; dbt Core organiza la transformación en tres capas hasta la tabla de hechos que consume Tableau.*

`stg_co2` y `stg_energy` limpian y tipan cada fuente por separado. `int_country_year_energy` las cruza por país y año, y es la única base de la que derivan los tres marts: la tabla de hechos unpivotada (`fct_country_year_metrics`) y dos reports especializados en descarbonización y en la relación PIB–CO₂.

## Decisiones de diseño

**Carga directa a Snowflake, sin scripts intermedios.** Los CSV de OWID se importan tal cual a `RAW_OWID`; toda la limpieza, el tipado y el modelado ocurren después, versionados y testeados en dbt. Simplifica la ingesta y hace el pipeline reproducible desde una fuente pública, sin infraestructura adicional que mantener.

**Formato largo en la tabla de hechos.** `fct_country_year_metrics` unpivota 16 métricas a formato (country, year, metric, value) en vez de mantenerlas en columnas. Permite filtrar cualquier métrica en Tableau con un único parámetro dinámico, sin campos calculados por visualización — al coste de queries SQL menos directas fuera del dashboard.

**Un parámetro para alternar entre reducción porcentual y absoluta**, en vez de fijar una sola métrica de descarbonización.

## Dashboards

El proyecto culmina en dos dashboards interactivos desarrollados en Tableau, cada uno orientado a una pregunta analítica distinta.

### Dashboard 1 · Visión global

Permite analizar la evolución de las emisiones y del mix energético por país y década.

![Visión Global: mapa interactivo de emisiones por país y década](/portfolio/proyectos/huella-carbono/dashboard-vision-global-mapa.webp)

![Visión Global: evolución del mix energético y desglose renovable](/portfolio/proyectos/huella-carbono/dashboard-vision-global-mix.webp)

*Filtrar un país en el mapa actualiza el resto de gráficos mediante Dashboard Actions.*

**Qué permite responder**

- ¿Qué países concentran las mayores emisiones, en total y per cápita?
- ¿Qué ritmo de adopción de renovables presenta cada país?

### Dashboard 2 · Descarbonización

Analiza la reducción de emisiones desde dos perspectivas complementarias.

![Descarbonización: top países y desacoplamiento PIB vs. CO₂, alternando entre reducción porcentual y absoluta](/portfolio/proyectos/huella-carbono/dashboard-descarbonizacion.webp)

*Alternar el parámetro cambia el ranking por completo: Moldavia, Ucrania y Estonia lideran en porcentual por el colapso económico postsoviético; Rusia, Ucrania y Alemania lideran en absoluto por el volumen de CO₂ retirado.*

**Qué permite responder**

- ¿Qué países reducen más emisiones en términos absolutos y cuáles en términos porcentuales?
- ¿Existe desacoplamiento entre crecimiento económico y reducción de emisiones?
