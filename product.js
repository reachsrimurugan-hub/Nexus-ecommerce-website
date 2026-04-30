document.addEventListener('DOMContentLoaded', () => {
    // Tab switching logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and target content
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            // Optional: Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Extract product ID from URL to dynamically update details
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId && typeof getProductById === 'function') {
        const product = getProductById(productId);
        if (product) {
            // Update title
            document.getElementById('productTitle').textContent = product.name;
            
            // Update image
            const dynamicContainer = document.getElementById('dynamicProductImageContainer');
            const mobileContainer = document.getElementById('mobileProductImageContainer');
            
            if (dynamicContainer && mobileContainer) {
                const isGalleryCategory = ['TV', 'Home Appliances', 'Laptops & Monitors'].includes(product.category);
                const imagesToUse = product.images || [product.image];
                
                if (isGalleryCategory) {
                    dynamicContainer.innerHTML = displayProductGallery(imagesToUse);
                } else {
                    dynamicContainer.innerHTML = displaySingleProductImage(product.image);
                }
                
                // For Mobile
                mobileContainer.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
            }
            
            // Update price
            const priceEl = document.getElementById('productPrice');
            if (priceEl) {
                priceEl.innerHTML = `₹${product.price.toLocaleString('en-IN')}`;
            }
            
            // Update MRP
            const mrpEl = document.querySelector('.mrp s');
            if (mrpEl) {
                mrpEl.textContent = `₹${(product.price * 1.1).toLocaleString('en-IN', {maximumFractionDigits:0})}`;
            }
            
            // Update Savings
            const savingsEl = document.querySelector('.savings');
            if (savingsEl) {
                savingsEl.textContent = `Save ₹${(product.price * 0.1).toLocaleString('en-IN', {maximumFractionDigits:0})} (10%)`;
            }
            
            // Update Tab content if necessary (optional)
            // Just updating the document title
            document.title = `${product.name} - Nexus`;
        }
    }
});

// --- Dynamic Product UI Functions ---

function displaySingleProductImage(imageSrc) {
    return `<div class="product-image-container">
                <img src="${imageSrc}" alt="Product Image">
            </div>`;
}

function displayProductGallery(images) {
    const imgArray = Array.isArray(images) ? images : [images, images];
    let html = '<div class="product-gallery">';
    imgArray.forEach(img => {
        html += `<img src="${img}" alt="Gallery Image">`;
    });
    html += '</div>';
    return html;
}
