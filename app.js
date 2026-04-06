// ==========================================
// CONFIGURACIÓN
// ==========================================
// Reemplaza esta URL por el enlace CSV público de tu Google Sheet.
// Instrucciones: En Google Sheets -> Archivo -> Compartir -> Publicar en la web -> Formato CSV
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSbGM_m0So7OYc4JJKHpF8dAKAIPrO8hwuYAMFz2uoKO0lMrVZBLHsCEfHNMgaYEjf6z4_dL0LrhDCA/pub?gid=0&single=true&output=csv';

// Nombres esperados de las columnas (ajústalos si usas otros en tu tabla)
const COLUMS = {
    nombre: 'NOMBRE',
    descripcion: 'DESCRIPCIÓN',
    precio: 'PRECIO',
    imagen: 'IMAGEN',
    categoria: 'CATEGORIA',
    disponibilidad: 'DISPONIBILIDAD',
    etiqueta1: 'ETIQUETA1',
    precio1: 'PRECIO1',
    etiqueta2: 'ETIQUETA2',
    precio2: 'PRECIO2'
};

// Datos ficticios para mostrar mientras no hay URL válida
const MOCK_DATA = [];

let allMenuItems = [];

document.addEventListener('DOMContentLoaded', () => {
    // Establecer año actual
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Iniciar carga de datos
    initializeApp();
});

async function initializeApp() {
    try {
        if (GOOGLE_SHEET_URL === 'REEMPLAZA_ESTO_POR_TU_URL_CSV') {
            // Usar mock data si no hay una URL configurada
            console.log('Usando datos de prueba. Por favor, reemplaza la constante GOOGLE_SHEET_URL.');
            allMenuItems = MOCK_DATA;
            // Simulamos tiempo de carga de red para que se luzca el loader
            await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
            // Cargar y parsear CSV
            const response = await fetch(GOOGLE_SHEET_URL);
            if (!response.ok) throw new Error('Error al cargar los datos');
            const csvText = await response.text();
            allMenuItems = parseCSVToObj(csvText);
        }

        renderCategoryFilters(allMenuItems);
        renderMenuItems(allMenuItems);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('menu-grid').innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Lo sentimos, no pudimos cargar el menú.</p>';
    } finally {
        // Garantizamos que el loader dura un poquito (para que parezca que procesa) 
        // y porque el usuario especificó querer un loader visualmente atractivo.
        setTimeout(hideLoader, 500); 
    }
}

function hideLoader() {
    const loader = document.getElementById('loader-wrapper');
    const mainContent = document.getElementById('main-content');
    
    loader.classList.add('fade-out');
    mainContent.classList.remove('hidden');
    
    // Remover del DOM despues de animacion
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
}

function renderCategoryFilters(items) {
    const filtersContainer = document.getElementById('category-filters');
    if (!filtersContainer) return;
    
    // Obtener categorías únicas
    const categories = ['Todos'];
    items.forEach(item => {
        const cat = item[COLUMS.categoria];
        if (cat && cat.trim() !== '' && !categories.includes(cat.trim())) {
            categories.push(cat.trim());
        }
    });
    
    // Si no hay categorías extra además de "Todos", lo ocultamos
    if (categories.length <= 1) {
        filtersContainer.style.display = 'none';
        return;
    }
    
    filtersContainer.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = `filter-btn ${category === 'Todos' ? 'active' : ''}`;
        btn.textContent = category;
        btn.onclick = () => filterByCategory(category, btn);
        filtersContainer.appendChild(btn);
    });
}

function filterByCategory(category, buttonElement) {
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');
    
    // Filtrar items
    if (category === 'Todos') {
        renderMenuItems(allMenuItems);
    } else {
        const filtered = allMenuItems.filter(item => {
            const cat = item[COLUMS.categoria];
            return cat && cat.trim() === category;
        });
        renderMenuItems(filtered);
    }
}

function renderMenuItems(items) {
    const grid = document.getElementById('menu-grid');
    grid.innerHTML = ''; // Limpiar skeletons
    
    if (items.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No hay productos disponibles por el momento.</p>';
        return;
    }

    const formatPrice = (p) => {
        if (!p) return '';
        const cleaned = p.trim();
        if (cleaned.toLowerCase() === 'consultar' || cleaned.includes('$')) return cleaned;
        return '$' + cleaned;
    };

    const getFallbackImage = (cat, nom) => {
        const text = (String(cat) + ' ' + String(nom)).toLowerCase();
        if (text.includes('burger') || text.includes('hamburguesa')) return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop';
        if (text.includes('pizza')) return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop';
        if (text.includes('taco')) return 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600&h=400&fit=crop';
        if (text.includes('trago') || text.includes('mojito') || text.includes('sour') || text.includes('gin') || text.includes('vodka') || text.includes('spritz')) return 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&h=400&fit=crop';
        if (text.includes('cerveza') || text.includes('schop')) return 'https://images.unsplash.com/photo-1566816288339-bc78b30f3c5f?w=600&h=400&fit=crop';
        if (text.includes('sandwich') || text.includes('sándwich') || text.includes('completo') || text.includes('chacarero')) return 'https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=600&h=400&fit=crop';
        if (text.includes('ensalada') || text.includes('verde')) return 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop';
        if (text.includes('dulce') || text.includes('postre') || text.includes('helado') || text.includes('cafe') || text.includes('café') || text.includes('calentito') || text.includes('waffle')) return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop';
        if (text.includes('tabla')) return 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&h=400&fit=crop';
        if (text.includes('camaron') || text.includes('camarón') || text.includes('ostiones') || text.includes('marisco')) return 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop';
        if (text.includes('carne') || text.includes('lomo') || text.includes('filete') || text.includes('entraña') || text.includes('cerdo')) return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop';
        return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop';
    };

    items.forEach((item, index) => {
        // Ignorar filas en blanco
        if (!item[COLUMS.nombre]) return;
        
        const disponible = (item[COLUMS.disponibilidad] || '').toLowerCase();
        const isUnavailable = disponible === 'no' || disponible === 'falso' || disponible === 'false' || disponible === 'agotado';
        
        const card = document.createElement('article');
        card.className = `menu-card ${isUnavailable ? 'unavailable' : ''}`;
        card.style.animationDelay = `${index * 0.1}s`; // Efecto cascada
        
        // Imagen inteligente por defecto si no hay URL
        const fallbackImg = getFallbackImage(item[COLUMS.categoria], item[COLUMS.nombre]);
        const imgUrl = item[COLUMS.imagen] || fallbackImg;
        
        // Precio Lógica (Dual pricing)
        let priceHtml = '';
        const precio1 = item[COLUMS.precio1] ? item[COLUMS.precio1].trim() : '';
        const precio2 = item[COLUMS.precio2] ? item[COLUMS.precio2].trim() : '';
        const precioPrincipal = item[COLUMS.precio] ? item[COLUMS.precio].trim() : '';
        
        if (precio1 || precio2) {
            priceHtml = '<div class="dual-price-container">';
            if (precio1) {
                const etiq1 = item[COLUMS.etiqueta1] ? item[COLUMS.etiqueta1].trim() : '';
                priceHtml += `<div class="price-item"><span class="price-label">${etiq1}</span><span class="price-value">${formatPrice(precio1)}</span></div>`;
            }
            if (precio2) {
                const etiq2 = item[COLUMS.etiqueta2] ? item[COLUMS.etiqueta2].trim() : '';
                priceHtml += `<div class="price-item"><span class="price-label">${etiq2}</span><span class="price-value">${formatPrice(precio2)}</span></div>`;
            }
            priceHtml += '</div>';
        } else if (precioPrincipal) {
            priceHtml = `<span class="card-price">${formatPrice(precioPrincipal)}</span>`;
        }
        
        // Descripción
        const descText = item[COLUMS.descripcion] ? item[COLUMS.descripcion].trim() : '';
        const descHtml = descText ? `<p class="card-desc">${descText}</p>` : '';
        
        card.innerHTML = `
            <div class="card-image-wrapper">
                ${isUnavailable ? '<div class="unavailable-overlay">Agotado</div>' : ''}
                <img src="${imgUrl}" alt="${item[COLUMS.nombre]}" class="card-image" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop'">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h2 class="card-title">${item[COLUMS.nombre]}</h2>
                    ${priceHtml}
                </div>
                ${descHtml}
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// ==========================================
// UTILIDAD: Parser sencillo de CSV 
// ==========================================
function parseCSVToObj(csvText) {
    // Dividir en filas manejando retornos de carro
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    
    // Obtener las cabeceras (la primera línea)
    const headers = splitCSVLine(lines[0]);
    const results = [];
    
    // Empezamos desde la segunda fila (1)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const values = splitCSVLine(line);
        const obj = {};
        
        headers.forEach((header, index) => {
            const h = header.trim();
            // Asigna el valor o string vacío si no existe
            obj[h] = values[index] ? values[index].trim() : '';
        });
        
        results.push(obj);
    }
    
    return results;
}

// Manejo inteligente de división de CSV respetando las comillas ("")
function splitCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && line[i+1] === '"') {
            // Escapar comilla doble
            current += '"';
            i++;
        } else if (char === '"') {
            // Entrar o salir de comillas
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            // Separador de columna válido
            result.push(current);
            current = '';
        } else {
            // Cualquier otro caracter
            current += char;
        }
    }
    result.push(current);
    
    return result;
}
