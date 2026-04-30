const products = [
    { id: 1, name: " Galaxy buds", price: 249.99, category: "Electronics", image: "assets/buds.jng", rating: 4.8 },
    { id: 2, name: "Galaxy Watch 6", price: 189.00, category: "Accessories", image: "assets/watch6.png", rating: 4.9 },
    { id: 3, name: "OLED 4K", price: 120.00, category: "Apparel", image: "assets/oled.webp", rating: 4.7 },
    { id: 4, name: "S26 Ultra", price: 55.00, category: "Accessories", image: "assets/s26ultra.png", rating: 4.5 },
    { id: 5, name: "s25Ultra", price: 1299.99, category: "Electronics", image: "assets/s25.png", rating: 4.6 },
    { id: 6, name: "Odyssey OLED G9", price: 85.00, category: "Apparel", image: "assets/odyssey.jfif", rating: 4.8 }
];

const corporateDealsData = {
    "Offers for you": [
        { id: 101, name: "Galaxy S25 Ultra Corporate Edition", price: 1199.99, image: "assets/s25.png", description: "Special corporate pricing on our flagship device.", type: "card-large" },
        { id: 102, name: "Neo QLED 4K TV", price: 1499.00, image: "assets/qled.png", description: "Immersive viewing for your home office.", type: "card-square" },
        { id: 103, name: "Galaxy Watch 6", price: 299.99, image: "assets/watch6.webp", description: "Keep track of your health seamlessly.", type: "card-square" },
        { id: 104, name: "Galaxy Book3 Pro", price: 1299.00, image: "assets/book6.png", description: "Ultra-thin, ultra-powerful laptop for on the go.", type: "card-wide" },
        { id: 105, name: "Galaxy Buds2 Pro", price: 199.99, image: "assets/buds.jpg", description: "Crystal clear audio for meetings.", type: "card-square" },
        { id: 106, name: "Galaxy Ring", price: 399.00, image: "assets/ring.png", description: "AI powered health tracker.", type: "card-square" }
    ],
    "Mobile": [
        { id: 201, name: "Galaxy S26 Ultra", price: 1299.99, image: "assets/Galaxy-S26-Ultra-koncept.jpg", description: "The ultimate AI phone.", type: "card-large" },
        { id: 202, name: "Galaxy S25 Ultra", price: 1099.99, image: "assets/s25.png", description: "Previous gen flagship.", type: "card-square" },
        { id: 203, name: "Galaxy Z Fold5", price: 1799.00, image: "assets/fold.webp", description: "Multitasking powerhouse.", type: "card-wide" },
        { id: 204, name: "Galaxy Z Flip5", price: 999.00, image: "assets/Galaxy-Z-Flip.webp", description: "Compact and stylish.", type: "card-square" },
        { id: 205, name: "Galaxy A54 5G", price: 449.00, image: "assets/a57.webp", description: "Awesome camera.", type: "card-square" },
        { id: 206, name: "Galaxy A34 5G", price: 349.00, image: "assets/a34.jpg", description: "Awesome screen.", type: "card-square" }
    ],
    "TV": [
        { id: 301, name: "98\" Neo QLED 8K", price: 9999.00, image: "assets/qled.png", description: "Cinematic experience.", type: "card-large" },
        { id: 302, name: "65\" OLED 4K", price: 2499.00, image: "assets/oled.webp", description: "Deep blacks, vibrant colors.", type: "card-wide" },
        { id: 303, name: "55\" The Frame", price: 1499.00, image: "assets/frame.webp", description: "TV when it's on, Art when it's off.", type: "card-square" },
        { id: 304, name: "Q-Series Soundbar", price: 799.00, image: "assets/soundbar.jpeg", description: "Immersive 3D sound.", type: "card-square" },
        { id: 305, name: "75\" Crystal UHD", price: 999.00, image: "assets/crystal.webp", description: "Crystal clear colors.", type: "card-square" },
        { id: 306, name: "The Freestyle", price: 799.00, image: "assets/freestyle.webp", description: "Portable projector.", type: "card-square" }
    ],
    "Home Appliances": [
        { id: 401, name: "Bespoke Refrigerator", price: 2999.00, image: "assets/bespoke.webp", description: "Customizable colors.", type: "card-large" },
        { id: 402, name: "AI Ecobubble Washer", price: 899.00, image: "assets/ecobubble.webp", description: "Smart washing.", type: "card-square" },
        { id: 403, name: "Jet Bot AI+ Robot Vacuum", price: 1299.00, image: "assets/vaccum.webp", description: "Object recognition.", type: "card-square" },
        { id: 404, name: "Bespoke Microwave", price: 349.00, image: "assets/oven.webp", description: "Stylish cooking.", type: "card-wide" },
        { id: 405, name: "Air Purifier", price: 499.00, image: "assets/airpurifier.webp", description: "Clean air for home.", type: "card-square" },
        { id: 406, name: "Induction Cooktop", price: 1599.00, image: "assets/cooktop.webp", description: "Precise cooking.", type: "card-square" }
    ],
    "Galaxy Ecosystem": [
        { id: 501, name: "Galaxy Watch 6 Classic", price: 399.00, image: "assets/watch6.webp", description: "Rotating bezel.", type: "card-large" },
        { id: 502, name: "Galaxy Buds2 Pro", price: 199.99, image: "assets/buds.jpg", description: "24-bit Hi-Fi audio.", type: "card-square" },
        { id: 503, name: "Galaxy Ring", price: 399.00, image: "assets/ring.png", description: "Sleep tracking.", type: "card-square" },
        { id: 504, name: "SmartTag2", price: 29.99, image: "assets/smarttag.jpg", description: "Keep track of belongings.", type: "card-square" },
        { id: 505, name: "Wireless Charger Duo", price: 59.99, image: "assets/charger.webp", description: "Charge two devices.", type: "card-square" },
        { id: 506, name: "Galaxy Tab S9 Ultra", price: 1199.00, image: "assets/book6.png", description: "Ultimate tablet.", type: "card-wide" }
    ],
    "Laptops & Monitors": [
        { id: 601, name: "Odyssey OLED G9", price: 1799.00, image: "assets/odyssey.jfif", description: "49\" immersive gaming.", type: "card-large" },
        { id: 602, name: "Galaxy Book4 Pro 360", price: 1899.00, image: "assets/book4.avif", description: "2-in-1 creativity.", type: "card-wide" },
        { id: 603, name: "Smart Monitor M8", price: 699.00, image: "assets/monitor.webp", description: "Work and play.", type: "card-square" },
        { id: 604, name: "ViewFinity S9", price: 1599.00, image: "assets/viewfinity.webp", description: "5K resolution.", type: "card-square" },
        { id: 605, name: "Galaxy Book3 Ultra", price: 2199.00, image: "assets/book6.png", description: "Ultimate performance.", type: "card-square" },
        { id: 606, name: "Portable SSD T9", price: 149.99, image: "assets/ssd.jpg", description: "Blazing fast storage.", type: "card-square" }
    ]
};

// Also expose a function to find any product by ID across all data
function getProductById(id) {
    id = parseInt(id);
    // Check main products array
    let found = products.find(p => p.id === id);
    if (found) return found;

    // Check corporate deals
    for (const category in corporateDealsData) {
        found = corporateDealsData[category].find(p => p.id === id);
        if (found) return { ...found, category };
    }

    return null;
}
