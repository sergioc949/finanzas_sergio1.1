# Gastos

Registro minimalista de gastos **diarios, semanales y mensuales**. No hay base de datos ni servidor: todo se guarda en el `localStorage` del navegador y puedes exportar/importar una copia en JSON.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4
- Recharts (gráficos)
- date-fns (agrupación por día/semana/mes, locale `es`)

## Uso

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en dist/
npm run preview  # sirve el build
npm run lint
```

El resultado de `npm run build` es estático: se puede publicar tal cual en Vercel, Netlify o GitHub Pages.

## Funcionalidad

- Alta rápida de gastos (importe, categoría, descripción, fecha)
- Vistas por día, semana y mes con navegación al periodo anterior/siguiente
- Resumen del periodo: total, media diaria, número de gastos y variación frente al periodo anterior
- Gráfico de tendencia y reparto por categoría
- Listado de movimientos agrupado por día con borrado
- Moneda configurable (EUR, USD, MXN, COP, ARS, CLP, PEN)
- Exportar / importar copia de seguridad en JSON

## Datos

Claves usadas en `localStorage`:

- `gastos:expenses` — lista de gastos
- `gastos:currency` — moneda seleccionada

Al importar un archivo se **reemplaza** la lista actual de gastos, así que exporta antes si quieres conservarla.
