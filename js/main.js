// =====================
// Main JavaScript for AVN PERÚ
// =====================

document.addEventListener('DOMContentLoaded', function() {
    
    // =====================
    // Navigation
    // =====================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // =====================
    // Smooth Scrolling
    // =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =====================
    // Speed Widget Animation
    // =====================
    const speedNumber = document.querySelector('.speed-number');
    let hasAnimated = false;

    function animateSpeed() {
        if (hasAnimated) return;
        
        let currentSpeed = 0;
        const targetSpeed = 200;
        const increment = 4;
        const duration = 50;

        const counter = setInterval(() => {
            currentSpeed += increment;
            if (currentSpeed >= targetSpeed) {
                currentSpeed = targetSpeed;
                clearInterval(counter);
                hasAnimated = true;
            }
            speedNumber.textContent = currentSpeed;
        }, duration);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('speed-widget')) {
                    animateSpeed();
                }
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements
    const speedWidget = document.querySelector('.speed-widget');
    if (speedWidget) {
        observer.observe(speedWidget);
    }

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        observer.observe(card);
    });

    // Observe plan cards
    document.querySelectorAll('.plan-card').forEach(card => {
        observer.observe(card);
    });

    // =====================
    // FAQ Accordion
    // =====================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                faq.querySelector('.faq-question').classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                question.classList.add('active');
            }
        });
    });

    // =====================
    // Form Handling
    // =====================
    const coverageForm = document.getElementById('coverageForm');
    const ctaForm = document.getElementById('ctaForm');

    if (coverageForm) {
        coverageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const address = document.getElementById('address').value;
            
            // Simulate coverage check
            setTimeout(() => {
                alert(`¡Excelente! Tenemos cobertura en tu zona.\nDirección: ${address}\n\nUn asesor te contactará pronto.`);
                coverageForm.reset();
            }, 500);
        });
    }

    if (ctaForm) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = ctaForm.querySelector('.form-input').value;
            
            // Simulate form submission
            setTimeout(() => {
                alert(`¡Gracias por tu interés!\nVerificaremos la disponibilidad en: ${input}`);
                ctaForm.reset();
            }, 500);
        });
    }

    // =====================
    // Trust Bar Counter Animation
    // =====================
    const trustNumbers = document.querySelectorAll('.trust-number');
    let trustAnimated = false;

    function animateTrustNumbers() {
        if (trustAnimated) return;
        
        trustNumbers.forEach(number => {
            const target = parseInt(number.textContent.replace(/[^0-9]/g, ''));
            const suffix = number.textContent.replace(/[0-9]/g, '');
            let current = 0;
            const increment = target / 50;
            const duration = 30;

            const counter = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                number.textContent = Math.floor(current) + suffix;
            }, duration);
        });
        
        trustAnimated = true;
    }

    // Observe trust bar
    const trustBar = document.querySelector('.trust-bar');
    if (trustBar) {
        const trustObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateTrustNumbers();
                }
            });
        }, { threshold: 0.5 });
        
        trustObserver.observe(trustBar);
    }

    // =====================
    // Parallax Effect
    // =====================
    const bgGradient = document.querySelector('.bg-gradient');
    
    if (bgGradient) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            bgGradient.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // =====================
    // Lazy Loading for Images (if any)
    // =====================
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if (lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // =====================
    // Plan Card Hover Effect
    // =====================
    const planCards = document.querySelectorAll('.plan-card');
    
    planCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            planCards.forEach(c => c.style.transform = 'scale(0.95)');
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            planCards.forEach(c => c.style.transform = 'scale(1)');
        });
    });

    // =====================
    // Utility Functions
    // =====================
    
    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =====================
    // Performance Optimization
    // =====================
    
    // Optimize scroll events
    const optimizedScroll = throttle(() => {
        // Add your scroll-based animations here
    }, 100);

    window.addEventListener('scroll', optimizedScroll);

    // =====================
    // Initialize on Load
    // =====================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

});

// =====================
// Service Worker Registration (opcional)
// =====================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registration successful');
        }).catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}