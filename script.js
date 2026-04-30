// Product Data moved to data.js

// App State
let cart = [];
let wishlist = new Set();

// DOM Elements
const productGrid = document.getElementById('productGrid');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCountElements = document.querySelectorAll('.cart-count');
const cartCountHeader = document.getElementById('cartCountHeader');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const searchInput = document.getElementById('productSearch');
const menuToggle = document.getElementById('menuToggle');

// --- Functions ---

function viewProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// Render Products
function renderProducts(productsToRender) {
    if (!productGrid) return;
    productGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found.</div>';
        return;
    }

    productsToRender.forEach(product => {
        const isWishlisted = wishlist.has(product.id);
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image" onclick="viewProduct(${product.id})" style="cursor: pointer;">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${product.id}, this)">
                    <i data-lucide="heart" ${isWishlisted ? 'fill="currentColor"' : ''}></i>
                </button>
            </div>
            <div class="product-info">
                <p style="color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">${product.category}</p>
                <h3>${product.name}</h3>
                <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                    <i data-lucide="star" style="width: 14px; color: #fbbf24; fill: #fbbf24;"></i>
                    <span style="font-size: 0.9rem; font-weight: 500;">${product.rating}</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i data-lucide="shopping-cart" style="width: 18px;"></i>
                    Add to Cart
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });

    // Refresh Lucide icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Search Filtering with Debounce and Dropdown
let searchTimeout;
const searchSuggestions = document.getElementById('searchSuggestions');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const term = e.target.value.toLowerCase().trim();

        if (term.length === 0) {
            searchSuggestions.style.display = 'none';
            return;
        }

        searchTimeout = setTimeout(() => {
            // Use corporate deals + products
            let allProducts = [...products];
            if (typeof corporateDealsData !== 'undefined') {
                Object.values(corporateDealsData).forEach(arr => {
                    arr.forEach(item => {
                        if (!allProducts.find(p => p.id === item.id)) {
                            allProducts.push({ ...item, category: item.category || 'Corporate Deal' });
                        }
                    });
                });
            }

            const filtered = allProducts.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.category && p.category.toLowerCase().includes(term))
            );

            renderSuggestions(filtered);
        }, 300); // 300ms debounce
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (searchSuggestions && !searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
}

function renderSuggestions(results) {
    if (!searchSuggestions) return;
    searchSuggestions.innerHTML = '';

    if (results.length === 0) {
        searchSuggestions.innerHTML = '<div class="search-no-results">No products found</div>';
    } else {
        results.forEach(product => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="search-suggestion-img">
                <div class="search-suggestion-info">
                    <div class="search-suggestion-name">${product.name}</div>
                    <div class="search-suggestion-category">${product.category || 'Product'}</div>
                </div>
                <div class="search-suggestion-price">$${product.price.toFixed(2)}</div>
            `;
            item.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });
            searchSuggestions.appendChild(item);
        });
    }
    searchSuggestions.style.display = 'block';
}

// Cart Logic
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateUI();
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateUI();
        }
    }
}

function updateUI() {
    // Update Cart Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => el.textContent = totalItems);
    cartCountHeader.textContent = totalItems;

    // Update Cart Sidebar Items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart" style="text-align: center; margin-top: 40px; color: var(--text-muted);">
                <i data-lucide="shopping-cart" style="width: 48px; height: 48px; margin-bottom: 10px; margin-inline: auto; display: block;"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info" style="flex: 1;">
                    <h4>${item.name}</h4>
                    <p style="color: var(--accent); font-weight: 600;">$${item.price.toFixed(2)}</p>
                    <div style="display: flex; align-items: center; gap: 10px; margin-top: 8px;">
                        <button onclick="updateQuantity(${item.id}, -1)" style="border: 1px solid var(--border); width: 24px; height: 24px; border-radius: 4px;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" style="border: 1px solid var(--border); width: 24px; height: 24px; border-radius: 4px;">+</button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" style="color: var(--error);">
                    <i data-lucide="trash-2" style="width: 18px;"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = `$${total.toFixed(2)}`;

    if (window.lucide) lucide.createIcons();
}

// Wishlist Logic
function toggleWishlist(productId, btn) {
    if (wishlist.has(productId)) {
        wishlist.delete(productId);
        btn.classList.remove('active');
        btn.innerHTML = '<i data-lucide="heart"></i>';
    } else {
        wishlist.add(productId);
        btn.classList.add('active');
        btn.innerHTML = '<i data-lucide="heart" fill="currentColor"></i>';
    }
    if (window.lucide) lucide.createIcons();
}

// UI Interactions
openCartBtn.onclick = () => {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
};

const closeCart = () => {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
};

closeCartBtn.onclick = closeCart;
overlay.onclick = closeCart;

// Quick View Logic
const quickViewModal = document.getElementById('quickViewModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const closeModalBtn = document.getElementById('closeModal');

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
        <div class="modal-image">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 12px;">
        </div>
        <div class="modal-info">
            <p style="color: var(--text-muted); font-size: 0.9rem;">${product.category}</p>
            <h2 style="font-size: 2rem; margin-bottom: 15px;">${product.name}</h2>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
                <div style="display: flex; color: #fbbf24;">
                    ${Array(5).fill(0).map((_, i) => `<i data-lucide="star" ${i < Math.floor(product.rating) ? 'fill="currentColor"' : ''} style="width: 18px;"></i>`).join('')}
                </div>
                <span style="font-weight: 600;">${product.rating} / 5.0</span>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 25px;">Experience the pinnacle of design and performance with the ${product.name}. Crafted for those who appreciate the finer things in life.</p>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent); margin-bottom: 25px;">$${product.price.toFixed(2)}</div>
            <button class="btn btn-primary" onclick="addToCart(${product.id}); closeQuickView();" style="width: 100%;">Add to Cart</button>
        </div>
    `;

    quickViewModal.classList.add('active');
    modalOverlay.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

function closeQuickView() {
    quickViewModal.classList.remove('active');
    modalOverlay.classList.remove('active');
}

closeModalBtn.onclick = closeQuickView;
modalOverlay.onclick = closeQuickView;



// Mobile Menu Toggle
const mobileMenuDrawer = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const closeMenuBtn = document.getElementById('closeMobileMenu');

if (menuToggle && mobileMenuDrawer) {
    menuToggle.addEventListener('click', () => {
        mobileMenuDrawer.classList.add('active');
        if (mobileMenuOverlay) mobileMenuOverlay.classList.add('active');
    });
}

function closeMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('active');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('active');
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMobileMenu);
}

if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Mobile Search Toggle
const mobileSearchBtn = document.getElementById('mobileSearchBtn');
const navCenter = document.querySelector('.nav-center');

if (mobileSearchBtn && navCenter) {
    mobileSearchBtn.addEventListener('click', () => {
        navCenter.classList.toggle('mobile-active');
        if (navCenter.classList.contains('mobile-active')) {
            const input = navCenter.querySelector('input');
            if (input) input.focus();
        }
    });
};

// Carousel Logic
const heroCarousel = document.getElementById('heroCarousel');
const carouselProgress = document.getElementById('carouselProgress');
let currentSlide = 0;
const totalSlides = 3; // We have 3 slides hardcoded in HTML

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    heroCarousel.style.transform = `translateX(-${currentSlide * 100}%)`;
    carouselProgress.style.transform = `translateX(${currentSlide * 100}%)`;
}

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

// Simple Notification
function showNotification(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Animation styles for notification
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Init
window.onload = () => {
    renderProducts(products);

    // Check saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        const darkIcon = themeToggleBtn.querySelector('.dark-icon');
        const lightIcon = themeToggleBtn.querySelector('.light-icon');
        if (darkIcon) darkIcon.style.display = 'none';
        if (lightIcon) lightIcon.style.display = 'block';
    }

    if (window.lucide) {
        lucide.createIcons();
    }
};

// Corporate Deals Logic
// data is in data.js

const categoryNav = document.getElementById('categoryNav');
const corporateProductsGrid = document.getElementById('corporateProductsGrid');

function renderCorporateDeals(categoryName) {
    if (!corporateProductsGrid) return;
    const items = corporateDealsData[categoryName] || corporateDealsData['Offers for you'];

    // Add fade out
    corporateProductsGrid.classList.add('fade-out');

    setTimeout(() => {
        let html = '';
        if (items.length >= 6) {
            // center
            html += `
                <div class="cat-item-center" onclick="viewProduct(${items[0].id})">
                    <img src="${items[0].image}" alt="${items[0].name}">
                    <h3 class="cat-item-title" style="font-size: 1.5rem;">${items[0].name}</h3>
                    <p class="cat-item-desc" style="font-size: 1rem;">${items[0].description}</p>
                    <div class="cat-item-price" style="font-size: 1.5rem;">$${items[0].price.toFixed(2)}</div>
                    <button class="buy-now-btn" onclick="event.stopPropagation(); addToCart(${items[0].id})">
                        Buy now
                    </button>
                </div>
            `;

            // sides
            const areas = ['left1', 'left2', 'right1', 'right2'];
            for (let i = 1; i <= 4; i++) {
                html += `
                    <div class="cat-item-side" style="grid-area: ${areas[i - 1]};" onclick="viewProduct(${items[i].id})">
                        <img src="${items[i].image}" alt="${items[i].name}">
                        <h3 class="cat-item-title">${items[i].name}</h3>
                        <p class="cat-item-desc">${items[i].description}</p>
                        <div class="cat-item-price">$${items[i].price.toFixed(2)}</div>
                        <button class="buy-now-btn" onclick="event.stopPropagation(); addToCart(${items[i].id})">
                            Buy now
                        </button>
                    </div>
                `;
            }

            // bottom
            html += `
                <div class="cat-item-bottom" onclick="viewProduct(${items[5].id})" style="background: linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(16,185,129,0.05) 100%);">
                    <div class="banner-content">
                        <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 10px;">${items[5].name}</h2>
                        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 20px;">${items[5].description}</p>
                        <button class="buy-now-btn" onclick="event.stopPropagation(); addToCart(${items[5].id})">Buy now - $${items[5].price.toFixed(2)}</button>
                    </div>
                    <div class="banner-img">
                        <img src="${items[5].image}" alt="${items[5].name}">
                    </div>
                </div>
            `;
        }

        corporateProductsGrid.innerHTML = html;
        corporateProductsGrid.className = 'category-layout';

        // Push items to main products array if not already there to support cart functionality
        items.forEach(item => {
            if (!products.find(p => p.id === item.id)) {
                products.push({ ...item, category: categoryName, rating: 4.5 });
            }
        });

        // Re-init lucide icons for dynamically added content
        if (window.lucide) {
            lucide.createIcons();
        }

        // Remove fade out
        corporateProductsGrid.classList.remove('fade-out');
    }, 300);
}

if (categoryNav) {
    const btns = categoryNav.querySelectorAll('.cat-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            btns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderCorporateDeals(e.target.dataset.category);
        });
    });

    // Initial render
    renderCorporateDeals('Offers for you');
}

// Scroll Animation Observer
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            scrollObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });
});
// Fallback if already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });
}

// Feature Detail Modal Interaction
function showFeatureDetails(title, description) {
    const modalBody = document.getElementById('modalBody');
    const quickViewModal = document.getElementById('quickViewModal');
    const modalOverlay = document.getElementById('modalOverlay');

    modalBody.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px;">
            <div style="margin-bottom: 24px; color: var(--accent); display: flex; justify-content: center;">
                <i data-lucide="info" style="width: 56px; height: 56px;"></i>
            </div>
            <h2 style="font-size: 2.2rem; font-weight: 700; margin-bottom: 16px;">${title}</h2>
            <p style="color: var(--text-muted); font-size: 1.15rem; max-width: 500px; margin: 0 auto; line-height: 1.6;">${description}</p>
            <button class="btn btn-primary" onclick="closeQuickView()" style="margin-top: 32px; padding: 12px 32px;">Got it</button>
        </div>
    `;

    quickViewModal.classList.add('active');
    modalOverlay.classList.add('active');
    if (window.lucide) lucide.createIcons();
}

// Location Selector Logic
const locationSelector = document.getElementById('locationSelector');
if (locationSelector) {
    locationSelector.addEventListener('click', (e) => {
        locationSelector.classList.toggle('active');
        e.stopPropagation();
    });
}
document.addEventListener('click', () => {
    if (locationSelector) locationSelector.classList.remove('active');
});

window.changeLocation = function (city) {
    const currentCity = document.getElementById('currentCity');
    if (currentCity) currentCity.innerText = city;
    if (locationSelector) locationSelector.classList.remove('active');
};

// --- Hero Carousel Logic ---
const heroSlideData = [
    {
        title: "GALAXY S26 Ultra",
        desc: "Experience the ultimate fusion of AI-powered performance and cutting-edge design with the all-new Samsung Galaxy S26 Ultra."
    },
    {
        title: "Odyssey G9 Monitor",
        desc: "Experience the ultimate fusion of productivity and immersion with the Odyssey G9 Smart Monitor with QHD clarity."
    },
    {
        title: "Neo Qled Tv",
        desc: "Experience the future of entertainment with the Neo QLED 8K. Featuring breathtaking 8K clarity and Quantum Dot technology."
    }
];

let currentHeroSlide = 0;
const totalHeroSlides = heroSlideData.length;
const heroTrack = document.getElementById('heroCarousel');
const heroScrollThumb = document.getElementById('heroScrollThumb');
const heroScrollbar = document.getElementById('heroScrollbar');
const heroTitle = document.getElementById('heroTitle');
const heroDesc = document.getElementById('heroDesc');

function updateHeroCarousel() {
    if (heroTrack) {
        heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
    }

    if (heroScrollThumb) {
        heroScrollThumb.style.transform = `translateX(${currentHeroSlide * 100}%)`;
    }

    if (heroTitle && heroDesc) {
        heroTitle.innerText = heroSlideData[currentHeroSlide].title;
        heroDesc.innerText = heroSlideData[currentHeroSlide].desc;
    }
}

function nextHeroSlide() {
    currentHeroSlide = (currentHeroSlide + 1) % totalHeroSlides;
    updateHeroCarousel();
}

function prevHeroSlide() {
    currentHeroSlide = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
    updateHeroCarousel();
}

// Initial active state
updateHeroCarousel();

// Auto play every 5 seconds
let heroInterval = setInterval(nextHeroSlide, 5000);

function resetHeroInterval() {
    clearInterval(heroInterval);
    heroInterval = setInterval(nextHeroSlide, 5000);
}

// Arrow Navigation
const prevHeroBtn = document.getElementById('prevHeroBtn');
const nextHeroBtn = document.getElementById('nextHeroBtn');

if (prevHeroBtn) {
    prevHeroBtn.addEventListener('click', () => {
        prevHeroSlide();
        resetHeroInterval();
    });
}

if (nextHeroBtn) {
    nextHeroBtn.addEventListener('click', () => {
        nextHeroSlide();
        resetHeroInterval();
    });
}

// Scrollbar Click Navigation
if (heroScrollbar) {
    heroScrollbar.addEventListener('click', (e) => {
        const rect = heroScrollbar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const segmentWidth = rect.width / totalHeroSlides;

        currentHeroSlide = Math.floor(clickX / segmentWidth);
        updateHeroCarousel();
        resetHeroInterval();
    });
}

// Basic Dragging for Scrollbar Thumb
if (heroScrollThumb && heroScrollbar) {
    let isDragging = false;
    let startX = 0;

    heroScrollThumb.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        clearInterval(heroInterval);
        e.preventDefault(); // Prevent text selection
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const rect = heroScrollbar.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const segmentWidth = rect.width / totalHeroSlides;

        // Calculate closest slide based on drag position
        let newSlide = Math.floor(currentX / segmentWidth);
        newSlide = Math.max(0, Math.min(newSlide, totalHeroSlides - 1));

        if (newSlide !== currentHeroSlide) {
            currentHeroSlide = newSlide;
            updateHeroCarousel();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            resetHeroInterval();
        }
    });
}

// Pause on hover
if (heroTrack) {
    heroTrack.addEventListener('mouseenter', () => clearInterval(heroInterval));
    heroTrack.addEventListener('mouseleave', () => resetHeroInterval());

    // Basic Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    heroTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(heroInterval);
    }, { passive: true });

    heroTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextHeroSlide();
        if (touchEndX > touchStartX + 50) prevHeroSlide();
        resetHeroInterval();
    }
}

// Custom Deals Scrollbar Logic
const dealsContainer = document.getElementById('dealsContainer');
const dealsScrollThumb = document.getElementById('dealsScrollThumb');

if (dealsContainer && dealsScrollThumb) {
    dealsContainer.addEventListener('scroll', () => {
        const maxScrollLeft = dealsContainer.scrollWidth - dealsContainer.clientWidth;
        if (maxScrollLeft > 0) {
            const scrollRatio = dealsContainer.scrollLeft / maxScrollLeft;
            // Thumb width is 30% of track, so it can travel 70% of the track
            // which translates to (70 / 30) = 233.33% of its own width.
            const maxThumbTravel = (100 - 30) / 30 * 100;
            dealsScrollThumb.style.transform = `translateX(${scrollRatio * maxThumbTravel}%)`;
        }
    });
}
