# Fogón Nahuelbuta - Bitácora de Desarrollo

Este archivo sirve como **memoria a largo plazo** para asegurar que cualquier modificación futura respete la configuración establecida hoy.

## 1. Conexión de Datos (Base de Datos)
- **Tecnología:** Google Sheets CSV Exporting.
- **Enlace Real Integrado:** `https://docs.google.com/spreadsheets/d/e/2PACX-1vSbGM_m0So7OYc4JJKHpF8dAKAIPrO8hwuYAMFz2uoKO0lMrVZBLHsCEfHNMgaYEjf6z4_dL0LrhDCA/pub?gid=0&single=true&output=csv`
- El formateo de la moneda (`$`) se genera automáticamente por el código, no es necesario escribir el símbolo en el Excel.
- Las cabeceras del CSV deben mantener su escritura en mayúsculas y acentos (ej. `PRECIO`, `DESCRIPCIÓN`).

## 2. GitHub y Despliegue
- **Cuenta:** `creativobiobio`
- **Repositorio:** `https://github.com/creativobiobio/P-gina-Web-Creativo.git`
- **IMPORTANTE:** La rama de despliegue principal conectada a GitHub Pages es **`main3`**. Para futuras actualizaciones, cualquier push debe ir explícitamente dirigido a origin `main3` (ej. `git push origin main:main3 -f`).

## 3. Identidad de Diseño (Premium)
- **Paleta de Colores:** Fondo Negro Mate (`#0f0f11`) y Acentos en Cobre/Dorado (`#c89666`).
- **Tipografías:** `Cormorant` (para majestuosidad en títulos) y `Montserrat` (para claridad en lecturas).
- **Esencia de la Marca:** Las animaciones deben mantenerse elegantes, usando curvas `cubic-bezier` de inicio lento. Nada de diseños estridentes ni colores genéricos.
- **Slogan Frontal:** "Carnes 100% naturales, sin preservantes ni aditivos."
