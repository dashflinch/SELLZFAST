const toggleBtn = document.getElementById("theme-toggle");
const moonSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-moon"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008" /></svg>`;
const sunSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sun"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" /></svg>`;


/* LOAD SAVED THEME */

let currentTheme =
    localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.documentElement
        .setAttribute("data-theme", "dark");
    toggleBtn.innerHTML = sunSVG;
}
else {
    toggleBtn.innerHTML = moonSVG;
}


/* TOGGLE THEME */
toggleBtn.addEventListener("click", () => {
    let theme =
        document.documentElement
            .getAttribute("data-theme");
    if (theme === "dark") {
        document.documentElement
            .removeAttribute("data-theme");
        localStorage.setItem("theme", "light");
        toggleBtn.innerHTML = moonSVG;
    }

    else {
        document.documentElement
            .setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
        toggleBtn.innerHTML = sunSVG;
    }

});

//------------------------------------------------------------------------

const langItems = document.querySelectorAll(".lang-dropdown p");
const currentLang = document.getElementById("current-lang");

// Load saved language
let savedLang = localStorage.getItem("language") || "EN";
currentLang.textContent = savedLang;

// Change language
langItems.forEach(item => {
    item.addEventListener("click", () => {
        let lang = item.getAttribute("data-lang");

        localStorage.setItem("language", lang);
        currentLang.textContent = lang;
    });
});

/* ================= SUB NAVBAR FILTER ================= */

const subNavItems = document.querySelectorAll(".center-menu span");
subNavItems.forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();

        /* REMOVE ACTIVE */
        subNavItems.forEach(nav =>
            nav.classList.remove("active-subnav")
        );

        /* ADD ACTIVE */
        item.classList.add("active-subnav");

        /* GET CATEGORY */
        const category = item.dataset.category;

        /* SHOW ALL */
        if (category === "all") {
            loadProducts(0);
            attachProductEvents();
            attachPopupEvents();
            return;
        }

        /* CLEAR GRID */
        productGrid.innerHTML = "";
        let allProducts = [];
        products.forEach(page => {
            allProducts = [
                ...allProducts,
                ...page
            ];
        });

        /* FILTER */

        const filteredProducts =
            allProducts.filter(product =>
                product.category === category
            );

        filteredProducts.forEach(product => {
            const card = document.createElement("div");
            card.className = `product-card ${product.type}`;
            card.innerHTML = `
                <img src="${product.image}">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
            `;
            productGrid.appendChild(card);
        });
        attachProductEvents();
        attachPopupEvents();
    });
});

//!-- ================= HERO ================= -->

document.addEventListener("DOMContentLoaded", () => {

    const slides = document.querySelector(".slides");
    const dots = document.querySelectorAll(".dot");
    const nextBtn = document.querySelector(".right");
    const prevBtn = document.querySelector(".left");

    if (!slides || dots.length === 0) return; // safety

    const totalSlides = dots.length;
    let index = 0;

    /* UPDATE */
    function updateCarousel() {
        slides.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));
        dots[index].classList.add("active");
    }

    /* NEXT */
    function nextSlide() {
        index = (index + 1) % totalSlides;
        updateCarousel();
    }

    /* PREV */
    function prevSlide() {
        index = (index - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    /* AUTO */
    let autoSlide = setInterval(nextSlide, 3000);

    function resetAuto() {
        clearInterval(autoSlide);
        autoSlide = setInterval(nextSlide, 3000);
    }

    /* ARROWS */
    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            nextSlide();
            resetAuto();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            prevSlide();
            resetAuto();
        });
    }

    /* DOTS */
    dots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            index = i;
            updateCarousel();
            resetAuto();
        });
    });
});

/* ================= PRODUCT CARD INTERACTION ================= */

const selectedProduct = document.getElementById("selected-product");
const selectedStatus = document.getElementById("selected-status");

function attachProductEvents() {
    const productCards = document.querySelectorAll(".product-card");
    if (
        productCards.length > 0 &&
        selectedProduct &&
        selectedStatus
    ) {
        productCards.forEach(card => {
            card.addEventListener("click", () => {
                /* REMOVE PREVIOUS ACTIVE */
                productCards.forEach(c =>
                    c.classList.remove("active-product")
                );
                /* ADD ACTIVE CARD */
                card.classList.add("active-product");
                /* PRODUCT NAME */
                const productName =
                    card.querySelector("h4").innerText;
                /* STATUS */
                let productStatus = "Buy Now";
                if (
                    card.classList.contains("bidding")
                ) {
                    productStatus = "Live Bidding";
                }
                /* UPDATE RIGHT PANEL */
                selectedProduct.innerText = productName;
                selectedStatus.innerText = productStatus;
                /* SMALL ANIMATION */
                selectedStatus.style.transform = "scale(1.1)";
                setTimeout(() => {
                    selectedStatus.style.transform = "scale(1)";
                }, 200);
            });
        });
    }
}


/* CATEGORY ACTIVE EFFECT */

const categories =
    document.querySelectorAll(".category-group li");
if (categories.length > 0) {
    categories.forEach(category => {
        category.addEventListener("click", () => {
            /* REMOVE OLD ACTIVE */
            categories.forEach(cat =>
                cat.classList.remove("active-category")
            );
            /* ADD NEW ACTIVE */
            category.classList.add("active-category");
        });
    });

}


/* ================= SUBCATEGORY FILTER ================= */

const categoryItems =
    document.querySelectorAll(
        ".category-group li"
    );
categoryItems.forEach(item => {
    item.addEventListener("click", () => {
        const category =
            item.dataset.category;
        productGrid.innerHTML = "";
        let allProducts = [];
        products.forEach(page => {
            allProducts = [
                ...allProducts,
                ...page
            ];
        });
        const filteredProducts =
            allProducts.filter(product =>
                product.category === category
            );
        if (filteredProducts.length === 0) {
            productGrid.innerHTML =
                `<h2>No products found</h2>`;
            return;
        }

        filteredProducts.forEach(product => {
            const card =
                document.createElement("div");
            card.className = `product-card ${product.type}`;
            card.innerHTML = `
                <img src="${product.image}">
                <h4>${product.name}</h4>
                <p>${product.price}</p>
            `;
            productGrid.appendChild(card);
        });
        attachProductEvents();
        attachPopupEvents();
    });
});


/* LIVE RANDOM BIDDING COUNT*/

const liveBox =
    document.querySelector(".live-box p");
if (liveBox) {
    setInterval(() => {
        let randomBids =
            Math.floor(Math.random() * 30) + 5;
        liveBox.innerText =
            `${randomBids} Auctions Running`;
    }, 3000);
}




/* AUTH MODAL */

document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("login-modal");
    const signupModal = document.getElementById("signup-modal");
    const openLogin = document.getElementById("open-login");
    const openSignup = document.getElementById("open-signup");
    const openLoginBack = document.getElementById("open-login-back");
    const closeLogin = document.querySelector(".close-modal");
    const closeSignup = document.querySelector(".close-signup");


    /* OPEN LOGIN */
    openLogin.addEventListener("click", () => {
        loginModal.classList.add("active");
    });


    /* OPEN SIGNUP */
    openSignup.addEventListener("click", () => {
        loginModal.classList.remove("active");
        signupModal.classList.add("active");
    });


    /* BACK TO LOGIN */
    openLoginBack.addEventListener("click", () => {
        signupModal.classList.remove("active");
        loginModal.classList.add("active");
    });


    /* CLOSE LOGIN */
    closeLogin.addEventListener("click", () => {
        loginModal.classList.remove("active");
    });


    /* CLOSE SIGNUP */
    closeSignup.addEventListener("click", () => {
        signupModal.classList.remove("active");
    });


    /* CLICK OUTSIDE */
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.classList.remove("active");
        }
        if (e.target === signupModal) {
            signupModal.classList.remove("active");
        }
    });
});


/* ================= MOBILE MENU ================= */

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const mobileMenuWrapper = document.querySelector(".mobile-menu-wrapper");
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenuWrapper.classList.toggle("active");
    });
}
/* ================= MOBILE MENU ================= */

// const mobileMenuBtn =
//     document.querySelector(".mobile-menu-btn");

// const mobileMenuWrapper =
//     document.querySelector(".mobile-menu-wrapper");

// if (mobileMenuBtn && mobileMenuWrapper) {

//     mobileMenuBtn.addEventListener("click", () => {

//         mobileMenuWrapper.classList.toggle("active");

//     });

// }

/* ============== CHATBOT ============== */

const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotBox = document.getElementById("chatbot-box");
const closeChatbot = document.getElementById("close-chatbot");
const sendChat = document.getElementById("send-chat");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotBody = document.getElementById("chatbot-body");
/* OPEN */

chatbotToggle.addEventListener("click", () => {
    chatbotBox.classList.toggle("active");
});

/* CLOSE */

closeChatbot.addEventListener("click", () => {
    chatbotBox.classList.remove("active");
});

/* SEND MESSAGE */

function sendMessage() {
    let message = chatbotInput.value.trim();
    if (message === "") return;

    /* USER MESSAGE */

    const userDiv =
        document.createElement("div");
    userDiv.className = "user-message";
    userDiv.textContent = message;
    chatbotBody.appendChild(userDiv);

    /* BOT REPLY */

    setTimeout(() => {
        const botDiv = document.createElement("div");
        botDiv.className = "bot-message";
        botDiv.textContent = "🤖 SellzFast AI received: " + message;
        chatbotBody.appendChild(botDiv);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }, 600);
    chatbotInput.value = "";
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

sendChat.addEventListener("click", sendMessage);

chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

/* ================= SELL MODAL ================= */

// const sellBtn = document.querySelector(".sell-btn");
// const sellModal = document.getElementById("sell-modal");
// const closeSell = document.querySelector(".close-sell");

// const cancelSell = document.querySelector(".cancel-btn");

// /* OPEN */

// sellBtn.addEventListener("click", () => { sellModal.classList.add("active"); });

// /* CLOSE */
// closeSell.addEventListener("click", () => { sellModal.classList.remove("active"); });
// cancelSell.addEventListener("click", () => {
//     sellModal.classList.remove("active");
// });

// /* OUTSIDE CLICK */
// window.addEventListener("click", (e) => {
//     if (e.target === sellModal) {
//         sellModal.classList.remove("active");
//     }
// });


/* ================= MOBILE DROPDOWN ACTIONS ================= */

const mobileSell = document.getElementById("mobile-sell");
const mobileLanguage = document.getElementById("mobile-language");
const mobileWishlist = document.getElementById("mobile-wishlist");
const mobileBidding = document.getElementById("mobile-bidding");
const mobileCart = document.getElementById("mobile-cart");

/* SELL */

if (mobileSell) {
    mobileSell.addEventListener("click", () => {
        sellModal.classList.add("active");
        mobileMenuWrapper.classList.remove("active");
    });
}

/* LANGUAGE */

if (mobileLanguage) {
    mobileLanguage.addEventListener("click", () => {
        const languageBox =
            document.querySelector(".lang-dropdown");
        languageBox.style.display =
            languageBox.style.display === "block"
                ? "none"
                : "block";
    });

}


/* WISHLIST */

if (mobileWishlist) {
    mobileWishlist.addEventListener("click", () => {
        alert("❤️ Wishlist opened");
    });
}

/* LIVE BIDDING */

if (mobileBidding) {
    mobileBidding.addEventListener("click", () => {
        alert("🔥 Live bidding section");
    });
}

/* CART */

if (mobileCart) {
    mobileCart.addEventListener("click", () => {
        alert("🛒 Cart opened");
    });
}


/* ================= PRODUCTS ================= */

const products = [
    [
        {
            name: "iPhone 15 Pro",
            price: "₹89,999",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200",
            type: "bidding",
            category: "mobiles"
        },

        {
            name: "Luxury Car",
            price: "₹12,00,000",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200",
            type: "normal",
            category: "cars"
        },

        {
            name: "Modern Sofa",
            price: "₹22,999",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200",
            type: "bidding",
            category: "furniture"
        },

        {
            name: "Smart Watch",
            price: "₹7,999",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200",
            type: "normal",
            category: "watches"
        },

        {
            name: "Gaming Laptop",
            price: "₹95,000",
            image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z2FtaW5nJTIwbGFwdG9wfGVufDB8fDB8fHww",
            type: "normal",
            category: "laptops"
        },

        {
            name: "DSLR Camera",
            price: "₹55,000",
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200",
            type: "bidding",
            category: "cameras"
        },

        {
            name: "Nike Shoes",
            price: "₹4,499",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
            type: "bidding",
            category: "shoes"
        },

        {
            name: "MacBook Pro",
            price: "₹1,15,000",
            image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1200",
            type: "normal",
            category: "laptops"
        },

        {
            name: "Gaming Chair",
            price: "₹11,999",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
            type: "normal",
            category: "furniture"
        },

        {
            name: "Headphones",
            price: "₹5,999",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1200",
            type: "bidding",
            category: "headphones"
        },

        {
            name: "LED TV",
            price: "₹44,999",
            image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200",
            type: "normal",
            category: "monitors"
        },

        {
            name: "Sneakers",
            price: "₹3,499",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200",
            type: "bidding",
            category: "shoes"
        },

        {
            name: "Office Desk",
            price: "₹8,999",
            image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1200",
            type: "normal",
            category: "furniture"
        },

        {
            name: "Bluetooth Speaker",
            price: "₹2,999",
            image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?q=80&w=1200",
            type: "bidding",
            category: "gaming"
        },

        {
            name: "Designer Bag",
            price: "₹6,999",
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
            type: "normal",
            category: "Women"
        },

        {
            name: "Sports Bike",
            price: "₹2,50,000",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200",
            type: "bidding",
            category: "bikes"
        }
    ],

    /* PAGE 2 */

    [

        {
            name: "PlayStation 5",
            price: "₹49,999",
            image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200",
            type: "normal",
            category: "gaming"
        },

        {
            name: "AirPods Pro",
            price: "₹18,999",
            image: "https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YWlyJTIwcG9kc3xlbnwwfHwwfHx8MA%3D%3D",
            type: "bidding",
            category: "headphones"
        },

        {
            name: "Mountain Bike",
            price: "₹32,000",
            image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200",
            type: "normal",
            category: "bikes"
        },

        {
            name: "Leather Sofa",
            price: "₹45,000",
            image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",
            type: "bidding",
            category: "furniture"
        }
    ]
];


/* GRID */
const productGrid = document.querySelector(".product-grid");

/* LOAD PRODUCTS */
function loadProducts(page) {
    productGrid.innerHTML = "";
    products[page].forEach(product => {
        const card = document.createElement("div");
        card.className =
            `product-card ${product.type}`;
        card.innerHTML = `
            <img src="${product.image}">
            <h4>${product.name}</h4>
            <p>${product.price}</p>`;
        productGrid.appendChild(card);
    });
}

/* LOAD FIRST PAGE */

loadProducts(0);
attachProductEvents();
attachPopupEvents();

/* ================= PAGINATION ================= */
const pageButtons = document.querySelectorAll(".page-btn");
pageButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        /* ACTIVE BUTTON */
        pageButtons.forEach(btn =>
            btn.classList.remove("active")
        );
        button.classList.add("active");
        /* PAGE EXISTS */
        if (products[index]) {
            loadProducts(index);
            attachProductEvents();
            attachPopupEvents();
        }
        else {
            alert("No products on this page yet");
        }
    });
});

/* ================= PRODUCT POPUP ================= */
const productModal = document.getElementById("product-modal");
const popupImage = document.getElementById("popup-image");
const popupTitle = document.getElementById("popup-title");
const popupPrice = document.getElementById("popup-price");
const popupDescription = document.getElementById("popup-description");
const closeProductModal =
    document.querySelector(
        ".close-product-modal"
    );


function attachPopupEvents() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach(card => {
        card.addEventListener("click", () => {
            const image = card.querySelector("img").src;
            const title = card.querySelector("h4").innerText;
            const price = card.querySelector("p").innerText;
            popupImage.src = image;
            popupTitle.innerText = title;
            popupPrice.innerText = price;
            popupDescription.innerText =
                `${title} available now on SellzFast with secure checkout, premium quality and exciting live bidding options.`;
            productModal.classList.add("active");
        });
    });
}


/* CLOSE */
closeProductModal.addEventListener("click", () => {
    productModal.classList.remove("active");

});

//-------------------------------------------------------------------------------------------
/* LOCATION */

const locationElement =
    document.getElementById("user-location");

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await response.json();

                const city =
                    data.address.city ||
                    data.address.town ||
                    data.address.village;

                const pincode = data.address.postcode;

                locationElement.innerText =
                    `${city} ${pincode}`;
            }

            catch (err) {
                locationElement.innerText =
                    "Location unavailable";
            }
        },

        () => {
            locationElement.innerText =
                "Permission denied";
        }
    );
}

else {
    locationElement.innerText =
        "Geolocation not supported";
}

/*================ PROFILE AFTER LOGIN ================*/

const loginBtn =document.getElementById("open-login");
const profileBox =document.getElementById( "profile-box");
const loginModal = document.getElementById("login-modal");
const signInBtn = document.querySelector("#login-modal .auth-submit");

/* CHECK IF USER ALREADY LOGGED IN */
if (
    localStorage.getItem(
        "isLoggedIn"
    ) === "true"
) {
    loginBtn.style.display ="none";
    profileBox.style.display ="flex";
}


/* LOGIN BUTTON */
if (loginBtn) {
    loginBtn.addEventListener(
        "click",
        () => {
            loginModal.classList.add(
                "active"
            );
        }
    );
}




/* SIGN IN */
if (signInBtn) {
    signInBtn.addEventListener(
        "click",
        () => {
            localStorage.setItem(
                "isLoggedIn",
                "true"
            );
            loginBtn.style.display ="none";
            profileBox.style.display = "flex";
            loginModal.classList.remove(
                "active"
            );
        });
}


/* PROFILE CLICK */
if (profileBox) {
    profileBox.addEventListener(
        "click",
        () => {
            alert( "👤 Profile Page Coming Soon" );
        }
    );
}


/* LOGOUT (open console and call logout()) */
function logout() {
    localStorage.removeItem( "isLoggedIn");
    profileBox.style.display = "none";
    loginBtn.style.display ="block";
}