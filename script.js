const defaultColor1 = '#8a2be2';
const defaultColor2 = '#ba55d3'; 

const root = document.documentElement;
const searchInput = document.getElementById('search-input');
const screenCategories = document.getElementById('screen-categories');
const screenBooks = document.getElementById('screen-books');
const backBtn = document.getElementById('back-btn');
const categoryTitle = document.getElementById('category-title');
const allBooks = document.querySelectorAll('.book-card');
const catBubbles = document.querySelectorAll('.cat-bubble');
const screenBorder = document.getElementById('screen-border');

// Elementos Mobile e Home
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const homeSections = document.querySelectorAll('.home-only');

// Estado da Aplicação
let activeCategoryContext = null; 

// Toggle do Menu Hamburger
menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    sidebar.classList.toggle('active');
});

// Oculta tudo que é da Tela Inicial
function toggleHomeElements(show) {
    homeSections.forEach(sec => sec.style.display = show ? 'block' : 'none');
    if(show) {
        document.body.classList.remove('category-mode');
    } else {
        document.body.classList.add('category-mode');
    }
}

// FUNÇÃO DE TEMAS (SEM ANIMAÇÃO PESADA, APENAS O GLOW ESTÁTICO)
function setGlobalTheme(color1, color2, particleShape, isCategoryView) {
    root.style.setProperty('--primary-glow', color1);
    root.style.setProperty('--secondary-glow', color2);
    
    if(isCategoryView) screenBorder.classList.add('active');
    else screenBorder.classList.remove('active');

    currentParticleConfig.colors = [color1, color2];
    currentParticleConfig.shape = particleShape;
    initParticles(); 
}

function showBooksScreen(titleText) {
    screenCategories.style.display = 'none';
    screenBooks.style.display = 'block';
    categoryTitle.textContent = titleText;
    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
}

// Clique em uma Bolha (Entrar na Categoria Isolada)
catBubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        const cat = bubble.getAttribute('data-target');
        const title = bubble.getAttribute('data-catname');
        const c1 = bubble.getAttribute('data-c1');
        const c2 = bubble.getAttribute('data-c2');
        const shape = bubble.getAttribute('data-particle');
        
        activeCategoryContext = cat;
        
        // Muda a cor e esconde as coisas da home
        setGlobalTheme(c1, c2, shape, true);
        toggleHomeElements(false);

        // Mostra só os livros da categoria
        allBooks.forEach(book => {
            if(book.getAttribute('data-category') === cat) book.style.display = 'flex';
            else book.style.display = 'none';
        });
        
        searchInput.value = '';
        searchInput.placeholder = `Pesquisar em ${title} (tags ou títulos)...`;
        
        backBtn.style.display = 'inline-block';
        showBooksScreen(title);
    });
});

// Botão Voltar (Restaurar a Home)
backBtn.addEventListener('click', () => {
    activeCategoryContext = null;
    
    screenBooks.style.display = 'none';
    screenCategories.style.display = 'block';
    
    searchInput.value = '';
    searchInput.placeholder = "Pesquisar títulos, autores ou tags (Ex: romance, espaço)...";
    
    toggleHomeElements(true);
    setGlobalTheme(defaultColor1, defaultColor2, 'circle', false);
});

// BARRA DE PESQUISA COM CONTEXTO (Procura nomes e tags!)
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (term.length > 0) {
        // Se está digitando na HOME, oculta as informações da home para mostrar pesquisa
        if (!activeCategoryContext) {
            toggleHomeElements(false);
            screenCategories.style.display = 'none';
            screenBooks.style.display = 'block';
            backBtn.style.display = 'inline-block';
            categoryTitle.textContent = "Resultados da Pesquisa";
        }

        let foundAny = false;
        
        allBooks.forEach(book => {
            const title = book.getAttribute('data-title').toLowerCase();
            const tags = book.getAttribute('data-tags').toLowerCase();
            const isMatch = title.includes(term) || tags.includes(term);

            if (activeCategoryContext) {
                // Se ESTÁ dentro de uma categoria, limita a pesquisa àquela categoria
                if (book.getAttribute('data-category') === activeCategoryContext && isMatch) {
                    book.style.display = 'flex';
                    foundAny = true;
                } else {
                    book.style.display = 'none';
                }
            } else {
                // Se estiver na HOME, pesquisa em todos os livros
                if (isMatch) {
                    book.style.display = 'flex';
                    foundAny = true;
                } else {
                    book.style.display = 'none';
                }
            }
        });
        
        if(!foundAny) categoryTitle.textContent = "Nenhum livro encontrado :(";

    } else {
        // Se apagar o texto da pesquisa
        if (activeCategoryContext) {
            // Volta a listar todos da categoria
            categoryTitle.textContent = document.querySelector(`[data-target="${activeCategoryContext}"]`).getAttribute('data-catname');
            allBooks.forEach(book => {
                book.style.display = book.getAttribute('data-category') === activeCategoryContext ? 'flex' : 'none';
            });
        } else {
            // Restaura a Home inteira
            screenBooks.style.display = 'none';
            screenCategories.style.display = 'block';
            toggleHomeElements(true);
        }
    }
});

// 3D HOVER
const hoverItems = document.querySelectorAll('.book-card, .cat-bubble, .plan-card, .benefit-card');
hoverItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top; 
        const rotateX = ((y - (rect.height / 2)) / (rect.height / 2)) * -5;
        const rotateY = ((x - (rect.width / 2)) / (rect.width / 2)) * 5;
        item.style.transform = `perspective(1000px) translateY(-5px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    item.addEventListener('mouseleave', () => {
        item.style.transform = ``; 
        item.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    item.addEventListener('mouseenter', () => {
        item.style.transition = 'transform 0.1s ease-out';
    });
});

// MODAL LOGIC
const modal = document.getElementById('book-modal');
const closeModalBtn = document.getElementById('close-modal');
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

allBooks.forEach(card => {
    card.addEventListener('click', () => {
        mTitle.textContent = card.getAttribute('data-title');
        mDesc.textContent = card.getAttribute('data-desc');
        mOldPrice.textContent = card.getAttribute('data-oldprice');
        mNewPrice.textContent = card.getAttribute('data-newprice');
        mDiscount.textContent = card.getAttribute('data-discount');
        mCover.src = card.getAttribute('data-cover');
        
        mf1.textContent = card.getAttribute('data-f1') || "Formato PDF/EPUB";
        mf2.textContent = card.getAttribute('data-f2') || "Leitura Offline";
        mf3.textContent = card.getAttribute('data-f3') || "Acesso Vitalício";
        mf4.textContent = card.getAttribute('data-f4') || "Alta Qualidade";

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; 
    });
});

function closeModal() { modal.classList.remove('active'); document.body.style.overflow = 'auto'; }
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

// MOTOR DE PARTÍCULAS
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width, height, particles;
let currentParticleConfig = { colors: [defaultColor1, defaultColor2], shape: 'circle' };

setGlobalTheme(defaultColor1, defaultColor2, 'circle', false);

function initParticles() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const particleCount = Math.min(Math.floor(width / 40), 30); 
    
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width, y: Math.random() * height,
            radius: Math.random() * 1.5 + 0.5, size: Math.random() * 12 + 10,
            vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 - 0.3, 
            color: currentParticleConfig.colors[Math.floor(Math.random() * currentParticleConfig.colors.length)],
            opacity: Math.random() * 0.4 + 0.1
        });
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = width + 20; if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20; if (p.y > height + 20) p.y = -20;
        ctx.globalAlpha = p.opacity; ctx.shadowBlur = 10; ctx.shadowColor = p.color; ctx.fillStyle = p.color;

        if (currentParticleConfig.shape === 'circle') {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.font = `${p.size}px Arial`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(currentParticleConfig.shape, p.x, p.y);
        }
    });
    requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', initParticles);
initParticles();
drawParticles();