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
        
        // Hashing simple para asignar siempre la misma imagen estática a la misma fila y que no parpadee
        const nameHash = Array.from(text).reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
        const getImg = (arr) => {
            const id = arr[Math.abs(nameHash) % arr.length];
            return `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop`;
        };

        if (text.includes('burger') || text.includes('hamburguesa')) {
            return getImg(['1568901346375-23c9450c58cd', '1586816001966-79b736744398', '1550547660-d9450f859349', '1551782450-a2132b4ba21d', '1608767221051-224aee50bba2']);
        }
        if (text.includes('pizza')) {
            return getImg(['1513104890138-7c749659a591', '1604382354936-07c5d9983bd3', '1565299624946-b28f40a0ae38', '1574071318508-1cdbab80d008']);
        }
        if (text.includes('taco')) {
            return getImg(['1551504734-5ee1c4a1479b', '1564834724105-9d8b7280f9e1', '1584345638104-1b7eb77c772c']);
        }
        if (text.includes('trago') || text.includes('mojito') || text.includes('sour') || text.includes('gin') || text.includes('vodka') || text.includes('spritz') || text.includes('margarita')) {
            return getImg(['1536935338788-846bb9981813', '1514362545857-3bc16c4c7d1b', '1556679343-c7306c1976bc', '1497534547346-6084614ffcf1']);
        }
        if (text.includes('cerveza') || text.includes('schop')) {
            return getImg(['1566816288339-bc78b30f3c5f', '1535958636474-b021ee887b13', '1572116469696-ed7aeeafabe6']);
        }
        if (text.includes('cafe') || text.includes('café') || text.includes('calentito') || text.includes('capuchino')) {
            return getImg(['1497935586351-b66a4ea90fc6', '1509042239860-f550ce710b93', '1495474472205-162847d1b443']);
        }
        if (text.includes('dulce') || text.includes('postre') || text.includes('helado') || text.includes('waffle')) {
            return getImg(['1551024601-bec78aea704b', '1563729784474-d77dbb933a9e', '1587314168485-64bc9ba370e5', '1550617931-e17a7b70dcc0']);
        }
        if (text.includes('sandwich') || text.includes('sándwich') || text.includes('completo') || text.includes('chacarero')) {
            return getImg(['1619881589316-56c7f9e6b587', '1528735602780-2552fd46c7af', '1481070555726-e2fe834ce505']);
        }
        if (text.includes('ensalada') || text.includes('verde') || text.includes('lechuga')) {
            return getImg(['1512621776951-a57141f2eefd', '1540189549336-e6e99c3679fe', '1505253716362-afbea18ae27f']);
        }
        if (text.includes('tabla') || text.includes('pichanga') || text.includes('chorrillana')) {
            return getImg(['1541529086526-db283c563270', '1625938146747-d5d2ccadfb72']);
        }
        if (text.includes('camaron') || text.includes('camarón') || text.includes('ostiones') || text.includes('marisco')) {
            return getImg(['1565557623262-b51c2513a641']);
        }
        if (text.includes('carne') || text.includes('lomo') || text.includes('filete') || text.includes('entraña') || text.includes('cerdo')) {
            return getImg(['1555939594-58d7cb561ad1', '1544025162-d76694265947', '1529692236671-f1f62065a1c1', '1600891964092-4316c288032e', '1594041680534-f8758d4a9805', '1588168333981-d419842a22be']);
        }
        if (text.includes('jugo') || text.includes('bebida') || text.includes('agua')) {
            return getImg(['1513558161293-cda765e31d9b', '1556679343-c7306c1976bc']);
        }
        
        // Imagen generica super premium de restaurante de carnes si no machea nada
        return getImg(['1414235077428-971158a17be8', '1544025162-d76694265947', '1555939594-58d7cb561ad1']);
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

// ==========================================
// PARALLAX EFECTO LUXURY DARK
// ==========================================
// Animación de textura y gradiente en Desktop
window.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Tilt sutil (max +- 15)
    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;
    
    document.documentElement.style.setProperty('--tilt-x', `${percentX * 15}deg`);
    document.documentElement.style.setProperty('--tilt-y', `${percentY * 15}deg`);
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
});

// Acelerómetro en dispositivos móviles
function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    
    let gamma = e.gamma; 
    let beta = e.beta;
    
    // Limitamos la lectura de ángulo
    if (gamma > 45) gamma = 45;
    if (gamma < -45) gamma = -45;
    
    // Asumimos un ángulo de lectura base de 45 grados de inclinación en las manos
    let normalizedBeta = beta - 45;
    if (normalizedBeta > 45) normalizedBeta = 45;
    if (normalizedBeta < -45) normalizedBeta = -45;
    
    // Dividimos para suavizar el efecto Parallax
    document.documentElement.style.setProperty('--tilt-x', `${gamma / 2.5}deg`);
    document.documentElement.style.setProperty('--tilt-y', `${normalizedBeta / 2.5}deg`);
}

let deviceOrientationEventGranted = false;

// Pedimos permiso de acelerómetro en el primer click por seguridad (iOS 13+)
document.body.addEventListener('click', async () => {
    if (deviceOrientationEventGranted) return;
    
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
            const permissionState = await DeviceOrientationEvent.requestPermission();
            if (permissionState === 'granted') {
                window.addEventListener('deviceorientation', handleOrientation);
                deviceOrientationEventGranted = true;
            }
        } catch (err) {
            console.log('Permisos acelerometro:', err);
        }
    } else {
        // Dispositivos sin restricción explicita
        window.addEventListener('deviceorientation', handleOrientation);
        deviceOrientationEventGranted = true;
    }
}, { once: true });
