# Fogón Nahuelbuta - Bitácora de Desarrollo

Este archivo sirve como **memoria a largo plazo** para asegurar que cualquier modificación futura respete la configuración establecida hoy de forma automática.

## 1. Conexión de Datos (Base de Datos)
- **Tecnología:** Google Sheets CSV Exporting.
- **Enlace Real Integrado:** `https://docs.google.com/spreadsheets/d/e/2PACX-1vSbGM_m0So7OYc4JJKHpF8dAKAIPrO8hwuYAMFz2uoKO0lMrVZBLHsCEfHNMgaYEjf6z4_dL0LrhDCA/pub?gid=0&single=true&output=csv`
- El formateo de la moneda (`$`) se genera dinámicamente, por lo que es válido si en la planilla vienen los precios crudos (ej. "14.990").
- Las cabeceras del CSV de Google Sheets fueron validadas y deben respetarse sus tildes y espacios.

## 2. GitHub y Despliegue Automático
- **Usuario Github:** `creativobiobio`
- **Repositorio:** `https://github.com/creativobiobio/P-gina-Web-Creativo.git`
- **IMPORTANTE:** La rama conectada al despliegue en Github Pages fue identificada forzosamente como **`main3`**. Para futuras actualizaciones (Git Pushes), se debe dirigir siempre el empuje forzado a esa rama de despliegue mediante: `git push origin main:main3 -f`. 

## 3. Identidad de Diseño (Premium)
- **Paleta de Colores Exclusiva:** Fondo Negro Mate profundo (`#0f0f11`) y Acentos en Cobre/Dorado (`#c89666`).
- **Tipografías:** Se ha instaurado `Cormorant` como la principal para evocar alta cocina arquitectónica, y `Montserrat` para claridad de filtro.
- Animaciones fluidas, lentas y sofisticadas (`cubic-bezier`).
- Texto de carga validado: *"Carnes 100% naturales, sin preservantes ni aditivos."*

## 4. Sistema Inteligente de Imágenes (Smart Fallbacks)
- Si el restaurante deja la columna de imagen en blanco dentro del Excel, el código no usa una foto vacía ni un genérico repetitivo. 
- Implementamos una función inteligente en `app.js` (`getFallbackImage`) que lee la categoría y el nombre del plato, y mediante un **algoritmo de hash constante**, inserta una foto de la categoría correcta extraída de una extensa base de datos.
- Soportea: Pizzas, Hamburguesas, Tacos, Bebidas, Tragos, Cervezas, Carnes, Mariscos, Postres, Tablas de PICAR y Cafés. Todo variará visualmente pero siendo constante en cada recarga para no crear fallos visuales. 
