// Global JavaScript for Diagnose Plus
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
});

// ===================================
// Navigation
// ===================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function () {
            navbarMenu.classList.toggle('active');
            this.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navbarMenu.classList.remove('active');
                navbarToggle.classList.remove('active');
            });
        });
    }
}

// ===================================
// Scroll Animations
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.card, .service-item, .stat-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===================================
// Utility Functions
// ===================================

// Format phone number for display
function formatPhoneNumber(phone) {
    return phone.replace(/(\+94)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'var(--color-success)' : 'var(--color-error)'};
        color: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        z-index: var(--z-tooltip);
        animation: slideInRight 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add slide animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
// ===================================
// WhatsApp Floating Button
// ===================================
function initWhatsApp() {
    const phoneNumber = '+940768254949'; // Sri Lankan WhatsApp number
    
    const messages = {
        booking: 'Hello! I would like to book a vehicle diagnostics appointment at your partner garage.',
        parts: 'Hi! I am interested in ordering genuine spare parts for my vehicle.',
        training: 'Hello! I would like to inquire about your technical training programs.',
        general: 'Hi! I have a question about Diagnose Plus services.'
    };

    // Create WhatsApp button
    const whatsappButton = document.createElement('button');
    whatsappButton.className = 'whatsapp-button';
    whatsappButton.innerHTML = '💬';
    whatsappButton.title = 'Contact via WhatsApp';
    
    // Create menu
    const whatsappMenu = document.createElement('div');
    whatsappMenu.className = 'whatsapp-menu';
    whatsappMenu.innerHTML = `
        <div class="whatsapp-menu-header">Select Service</div>
        <button class="whatsapp-menu-item" data-message="booking">📅 Book Appointment</button>
        <button class="whatsapp-menu-item" data-message="parts">⚙️ Order Spare Parts</button>
        <button class="whatsapp-menu-item" data-message="training">🎓 Technical Training</button>
        <button class="whatsapp-menu-item" data-message="general">💬 General Inquiry</button>
    `;
    
    document.body.appendChild(whatsappButton);
    document.body.appendChild(whatsappMenu);
    
    // Toggle menu
    whatsappButton.addEventListener('click', function(e) {
        e.preventDefault();
        whatsappMenu.classList.toggle('active');
    });
    
    // Handle menu item clicks
    document.querySelectorAll('.whatsapp-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const messageType = this.getAttribute('data-message');
            const message = messages[messageType] || messages.general;
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
            whatsappMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.whatsapp-button') && !e.target.closest('.whatsapp-menu')) {
            whatsappMenu.classList.remove('active');
        }
    });
}

// Initialize WhatsApp button when DOM is ready
initWhatsApp();