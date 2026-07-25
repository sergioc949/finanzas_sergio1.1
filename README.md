# 💰 Gastos

Aplicación web minimalista para llevar el registro de tus gastos **diarios, semanales y mensuales**. Funciona 100% en el navegador, **sin base de datos ni servidor**.

## 🔗 Usar la app

👉 **[Abrir Gastos](https://sergioc949.github.io/finanzas_sergio1.1/)**

O descarga el archivo `index.html` y ábrelo con doble clic en tu navegador.

## ✨ Características

- **Registro rápido** de gastos con importe, categoría, descripción y fecha.
- **8 categorías** con colores: Comida, Transporte, Hogar, Ocio, Salud, Compras, Servicios y Otros.
- **Tres vistas**: Día · Semana · Mes, con navegación entre periodos.
- **Métricas automáticas**: total del periodo, media, nº de gastos y comparativa con el periodo anterior.
- **Gráfico de barras** y **desglose por categoría**.
- **Lista de movimientos** con opción de eliminar cada gasto.
- **Exportar / Importar** tus datos en formato JSON (tu copia de seguridad).
- **Multi-moneda**: EUR, USD, MXN, COP, GBP.
- **Diseño responsive**: funciona en móvil y escritorio.

## 📝 Cómo se usa

1. En el panel izquierdo, escribe el **importe** y elige la **categoría**.
2. (Opcional) Añade una **descripción** y ajusta la **fecha**.
3. Pulsa **Añadir gasto**.
4. En el panel derecho, cambia entre **Día / Semana / Mes** y navega con las flechas ‹ › para revisar cualquier periodo.

## 💾 Sobre tus datos

- Los gastos se guardan en el **`localStorage` de tu navegador**. No se envían a ningún servidor: nadie más puede verlos.
- Como viven en cada navegador, **son independientes por dispositivo**. Para pasar tus datos de un dispositivo a otro:
  1. En el primero, pulsa **Exportar** (descarga un archivo `.json`).
  2. En el segundo, pulsa **Importar** y selecciona ese archivo.
- Si borras los datos de navegación / caché del navegador, podrías perder los gastos. Haz **Exportar** de vez en cuando como copia de seguridad.

## 🛠️ Tecnología

- **HTML + CSS + JavaScript** puro (vanilla), en un único archivo `index.html`.
- **Sin dependencias** ni build: cero librerías, cero instalación.
- Persistencia con **`localStorage`**.
- Gráficos dibujados a mano con HTML/CSS.
- Publicado con **GitHub Pages**.

## 🔄 Actualizar la app

Si editas `index.html`, sube los cambios y GitHub Pages se reconstruye solo en ~1 minuto:

```bash
git add index.html
git commit -m "Actualizar app"
git push
```
