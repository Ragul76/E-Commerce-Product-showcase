// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav ul');

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize Swiper for testimonials
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.testimonials-swiper')) {
        const swiper = new Swiper('.testimonials-swiper', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 2,
                    spaceBetween: 30
                }
            }
        });
    }
});

// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartDisplay();
    }

    addItem(product) {
        const existingItem = this.items.find(item => 
            item.name === product.name && item.size === product.size
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }

        this.saveToStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeItem(productName, size) {
        this.items = this.items.filter(item => 
            !(item.name === productName && item.size === size)
        );
        this.saveToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(productName, size, quantity) {
        const item = this.items.find(item => 
            item.name === productName && item.size === size
        );
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(productName, size);
            } else {
                this.saveToStorage();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveToStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCountElement = document.querySelector('.cart-count');
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'inline' : 'none';
        }

        this.updateCartModal();
    }

    updateCartModal() {
        const cartItemsEl = document.getElementById('cart-items');
        const cartTotalEl = document.getElementById('cart-total');

        if (!cartItemsEl || !cartTotalEl) return;

        if (this.items.length === 0) {
            cartItemsEl.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Your cart is empty</p>';
        } else {
            cartItemsEl.innerHTML = this.items.map(item => `
                <div class="cart-item" style="
                    display: flex;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid #e9ecef;
                    gap: 15px;
                ">
                    <img src="${item.image}" alt="${item.name}" style="
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 8px;
                    ">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px 0; font-size: 1rem;">${item.name}</h4>
                        <p style="margin: 0 0 5px 0; color: #ff6b6b; font-weight: 600;">$${item.price}</p>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">Size: ${item.size}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button onclick="cart.updateQuantity('${item.name}', '${item.size}', ${item.quantity - 1})" style="
                            width: 30px;
                            height: 30px;
                            border: 1px solid #e9ecef;
                            background: white;
                            border-radius: 50%;
                            cursor: pointer;
                        ">-</button>
                        <span style="min-width: 20px; text-align: center;">${item.quantity}</span>
                        <button onclick="cart.updateQuantity('${item.name}', '${item.size}', ${item.quantity + 1})" style="
                            width: 30px;
                            height: 30px;
                            border: 1px solid #e9ecef;
                            background: white;
                            border-radius: 50%;
                            cursor: pointer;
                        ">+</button>
                        <button onclick="cart.removeItem('${item.name}', '${item.size}')" style="
                            background: #ff6b6b;
                            color: white;
                            border: none;
                            padding: 5px 10px;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 0.9rem;
                        ">Remove</button>
                    </div>
                </div>
            `).join('');
        }

        cartTotalEl.textContent = this.getTotal().toFixed(2);
    }

    showNotification(message) {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4ecdc4, #44bdad);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
            z-index: 3000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            font-weight: 500;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Add to cart functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('add-to-cart')) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = parseFloat(productCard.querySelector('.price').textContent.replace('$', ''));
        const productImage = productCard.querySelector('img').src;
        const size = document.getElementById('size-select')?.value || 'M';

        cart.addItem({
            name: productName,
            price: productPrice,
            image: productImage,
            size: size
        });

        // Visual feedback
        const originalText = e.target.textContent;
        e.target.textContent = 'Added! ✓';
        e.target.style.background = 'linear-gradient(135deg, #45b7af, #4ecdc4)';
        
        setTimeout(() => {
            e.target.textContent = originalText;
            e.target.style.background = 'linear-gradient(135deg, #4ecdc4, #44bdad)';
        }, 1500);
    }

    if (e.target.classList.contains('add-to-cart-modal')) {
        const productName = document.getElementById('product-title').textContent;
        const productPrice = parseFloat(document.getElementById('product-price').textContent.replace('$', ''));
        const productImage = document.getElementById('product-image').src;
        const size = document.getElementById('size-select').value;

        cart.addItem({
            name: productName,
            price: productPrice,
            image: productImage,
            size: size
        });

        // Close modal after adding
        closeModal('product-modal');
    }
});

// Product quick view functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('quick-view')) {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        
        document.getElementById('product-title').textContent = productCard.querySelector('h3').textContent;
        document.getElementById('product-price').textContent = productCard.querySelector('.price').textContent;
        document.getElementById('product-image').src = productCard.querySelector('img').src;
        document.getElementById('product-description').textContent = 
            `Premium quality ${productCard.querySelector('h3').textContent.toLowerCase()}. 
             Made with the finest materials for ultimate comfort and style. 
             Available in multiple sizes and colors.`;

        openModal('product-modal');
    }
});

// Cart modal functionality
document.getElementById('cart-link')?.addEventListener('click', function(e) {
    e.preventDefault();
    openModal('cart-modal');
});

// Newsletter form validation
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        if (validateEmail(email)) {
            // Simulate form submission
            this.querySelector('button').innerHTML = '<i class="fas fa-check"></i> Subscribed!';
            this.querySelector('button').style.background = '#45b7af';
            this.reset();
            
            setTimeout(() => {
                this.querySelector('button').innerHTML = '<i class="fas fa-paper-plane"></i> Subscribe';
                this.querySelector('button').style.background = 'rgba(255, 255, 255, 0.2)';
            }, 2000);
        } else {
            showError(this.querySelector('input'), 'Please enter a valid email address');
        }
    });
}

// Contact form
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate form submission
        alert('Thank you for your message! We\'ll get back to you soon.');
        this.reset();
    });
}

// Modal functionality
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modals when clicking close button or outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-modal')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Product filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.transform = 'scale(1)';
                    card.style.opacity = '1';
                } else {
                    card.style.transform = 'scale(0.9)';
                    card.style.opacity = '0.5';
                }
            });
        });
    });
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    input.style.borderColor = '#ff6b6b';
    // You could add a tooltip or error message here
    setTimeout(() => {
        input.style.borderColor = '#e9ecef';
    }, 3000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.product-card, .category-item, .testimonial-card, .about, .contact').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// Add preloader to HTML head if needed
if (!document.querySelector('.preloader')) {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.3s ease;
    `;
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #ff6b6b;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    spinner.style.animation = 'spin 1s linear infinite';
    preloader.appendChild(spinner);
    document.body.appendChild(preloader);
}

// Add CSS for spinner animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Back to top button
const backToTop = document.createElement('button');
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
`;
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.style.opacity = '0';
        backToTop.style.visibility = 'hidden';
    }
});