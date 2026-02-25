// Constantes para cores default
const defaultColor1 = '#4a148c';
const defaultColor2 = '#7b1fa2';

// Selecionar elementos
const root = document.documentElement;
const searchInput = document.getElementById('search-input');
const screenCategories = document.getElementById('screen-categories');
const screenBooks = document.getElementById('screen-books');
const backBtn = document.getElementById('back-btn');
const categoryTitle = document.getElementById('category-title');
const allBooks = document.querySelectorAll('.book-card');
const catBubbles = document.querySelectorAll('.cat-bubble');
const screenBorder = document.getElementById('screen-border');
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const homeSections = document.querySelectorAll('.home-only');

// Estado
let activeCategoryContext = null;

// Função para contar e atualizar livros por categoria
function updateBookCounters() {
    catBubbles.forEach(bubble => {
        const categoryTarget = bubble.dataset.target;
        const bookCount = Array.from(allBooks).filter(book => book.dataset.category === categoryTarget).length;
        const counter = bubble.querySelector('.book-counter');
        if (counter) {
            counter.textContent = bookCount;
        }
    });
}

// Toggle Menu Mobile
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    sidebar.classList.toggle('active');
});

// Toggle home elements
function toggleHomeElements(show) {
    homeSections.forEach(section => {
        section.style.display = show ? 'block' : 'none';
    });
    document.body.classList.toggle('category-mode', !show);
}

// Set theme global
function setGlobalTheme(c1, c2, particleShape, isCategoryView) {
    root.style.setProperty('--primary-glow', c1);
    root.style.setProperty('--secondary-glow', c2);
    if (isCategoryView) {
        screenBorder.classList.add('active');
    } else {
        screenBorder.classList.remove('active');
    }
    currentParticleConfig.colors = [c1, c2];
    currentParticleConfig.shape = particleShape;
    initParticles();
}

// Show books screen
function showBooksScreen(titleText) {
    screenCategories.style.display = 'none';
    screenBooks.style.display = 'block';
    categoryTitle.textContent = titleText;
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

// Clique nas categorias
catBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        const cat = bubble.dataset.target;
        const title = bubble.dataset.catname;
        const c1 = bubble.dataset.c1;
        const c2 = bubble.dataset.c2;
        const shape = bubble.dataset.particle;
        activeCategoryContext = cat;
        setGlobalTheme(c1, c2, shape, true);
        toggleHomeElements(false);
        allBooks.forEach(book => {
            book.style.display = book.dataset.category === cat ? 'flex' : 'none';
        });
        searchInput.value = '';
        searchInput.placeholder = `Pesquisar em ${title}...`;
        backBtn.style.display = 'inline-block';
        showBooksScreen(title);
    });
});

// Botão voltar
backBtn.addEventListener('click', () => {
    activeCategoryContext = null;
    screenBooks.style.display = 'none';
    screenCategories.style.display = 'block';
    searchInput.value = '';
    searchInput.placeholder = 'Pesquise livros...';
    toggleHomeElements(true);
    setGlobalTheme(defaultColor1, defaultColor2, 'circle', false);
});

// Busca
searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    if (term.length > 0) {
        if (!activeCategoryContext) {
            toggleHomeElements(false);
            screenCategories.style.display = 'none';
            screenBooks.style.display = 'block';
            backBtn.style.display = 'inline-block';
            categoryTitle.textContent = 'Resultados da Pesquisa';
        }
        let foundAny = false;
        allBooks.forEach(book => {
            const matches = (book.dataset.title.toLowerCase().includes(term) || 
                             book.dataset.tags.toLowerCase().includes(term)) &&
                            (!activeCategoryContext || book.dataset.category === activeCategoryContext);
            book.style.display = matches ? 'flex' : 'none';
            if (matches) foundAny = true;
        });
        if (!foundAny) categoryTitle.textContent = 'Nenhum livro encontrado :(';
    } else {
        if (activeCategoryContext) {
            allBooks.forEach(book => {
                book.style.display = book.dataset.category === activeCategoryContext ? 'flex' : 'none';
            });
            categoryTitle.textContent = document.querySelector(`.cat-bubble[data-target="${activeCategoryContext}"]`)?.dataset.catname || 'Categoria';
        } else {
            screenBooks.style.display = 'none';
            screenCategories.style.display = 'block';
            toggleHomeElements(true);
        }
    }
});

// Hover 3D
const hoverItems = document.querySelectorAll('.book-card, .cat-bubble, .plan-card, .benefit-card');
hoverItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        item.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = '';
    });
});

// Modal + Compra
const modal = document.getElementById('book-modal');
const closeModalBtn = document.getElementById('close-modal');
const buyBtn = document.getElementById('buy-btn');
const mTitle = document.getElementById('modal-title');
const mDesc = document.getElementById('modal-desc');
const mOldPrice = document.getElementById('modal-old-price');
const mNewPrice = document.getElementById('modal-new-price');
const mDiscount = document.getElementById('modal-discount');
const mCover = document.getElementById('modal-cover');
const mf1 = document.getElementById('f1');
const mf2 = document.getElementById('f2');
const mf3 = document.getElementById('f3');
const mf4 = document.getElementById('f4');

allBooks.forEach(book => {
    book.addEventListener('click', () => {
        mTitle.textContent = book.dataset.title;
        mDesc.textContent = book.dataset.desc;
        mOldPrice.textContent = book.dataset.oldprice;
        mNewPrice.textContent = book.dataset.newprice;
        mDiscount.textContent = book.dataset.discount;
        mCover.src = book.dataset.cover;
        mf1.textContent = book.dataset.f1 || '';
        mf2.textContent = book.dataset.f2 || '';
        mf3.textContent = book.dataset.f3 || '';
        mf4.textContent = book.dataset.f4 || '';

        // Define o link de compra específico desse livro
        const link = book.dataset.buyLink || '#';
        buyBtn.href = link;
        buyBtn.style.display = link !== '#' ? 'block' : 'none';

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Partículas (mantido igual)
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles;
let currentParticleConfig = { colors: [defaultColor1, defaultColor2], shape: 'circle' };

function initParticles() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    particles = [];
    const count = Math.min(Math.floor(width / 40), 30);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5,
            size: Math.random() * 12 + 10,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5 - 0.3,
            color: currentParticleConfig.colors[Math.floor(Math.random() * currentParticleConfig.colors.length)],
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.x = (p.x + width) % width;
        if (p.y < 0 || p.y > height) p.y = (p.y + height) % height;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        if (currentParticleConfig.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.font = `${p.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(currentParticleConfig.shape, p.x, p.y);
        }
    });
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', initParticles);

// Inicializar
setGlobalTheme(defaultColor1, defaultColor2, 'circle', false);
initParticles();
drawParticles();
updateBookCounters();