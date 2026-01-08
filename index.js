// Index Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animate stats on scroll
    animateStats();
    
    // Add scroll animation to service cards
    animateOnScroll('.service-card', 'fade-up');
    
    // Add scroll animation to reason cards
    animateOnScroll('.reason-card', 'fade-up');
    
    // Add scroll animation to testimonials
    animateOnScroll('.testimonial', 'fade-in');
    
    // Smooth scroll for anchor links
    initSmoothScroll();
    
    // Initialize service booking from index
    initIndexBooking();
    
    // Add active state to navigation based on scroll
    initScrollSpy();
});

// Animate stats numbers
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = parseInt(stat.textContent);
                const suffix = stat.textContent.includes('+') ? '+' : '';
                const duration = 2000;
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);
                let frame = 0;
                
                const counter = setInterval(() => {
                    frame++;
                    const progress = frame / totalFrames;
                    const currentValue = Math.round(finalValue * progress);
                    
                    stat.textContent = currentValue + suffix;
                    
                    if (frame === totalFrames) {
                        clearInterval(counter);
                        stat.textContent = finalValue + suffix;
                    }
                }, frameDuration);
                
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Generic animation on scroll
function animateOnScroll(selector, animationClass) {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-' + animationClass);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => {
        element.classList.add('pre-animate');
        observer.observe(element);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, href);
            }
        });
    });
}

// Initialize booking from index page
function initIndexBooking() {
    // Check URL for route parameter and pre-fill booking form
    const urlParams = new URLSearchParams(window.location.search);
    const route = urlParams.get('route');
    
    if (route) {
        // Save route for booking page
        localStorage.setItem('preferredRoute', route);
        
        // Show notification
        showRouteNotification(route);
    }
    
    // Add click tracking to booking buttons
    document.querySelectorAll('.service-book-btn, .cta-button[href*="booking"]').forEach(button => {
        button.addEventListener('click', function(e) {
            const routeName = this.closest('.service-card')?.querySelector('h3')?.textContent || 'General';
            trackBookingClick(routeName);
        });
    });
}

// Show route notification
function showRouteNotification(route) {
    const notification = document.createElement('div');
    notification.className = 'route-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-info-circle"></i>
            <p>Rute <strong>${formatRouteName(route)}</strong> telah dipilih. 
            <a href="booking.html">Lanjutkan booking?</a></p>
            <button class="close-notification">&times;</button>
        </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .route-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #3498db;
            color: white;
            border-radius: 10px;
            padding: 1rem;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.5s ease;
            max-width: 350px;
        }
        
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        
        .notification-content i {
            font-size: 1.2rem;
            margin-top: 0.2rem;
            flex-shrink: 0;
        }
        
        .notification-content p {
            margin: 0;
            flex: 1;
            line-height: 1.4;
        }
        
        .notification-content a {
            color: #FFD700;
            text-decoration: underline;
            font-weight: 600;
        }
        
        .close-notification {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(notification);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        closeNotification(notification, styles);
    }, 10000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        closeNotification(notification, styles);
    });
}

function closeNotification(notification, styles) {
    notification.style.animation = 'slideInRight 0.5s ease reverse';
    setTimeout(() => {
        notification.remove();
        styles.remove();
    }, 500);
}

function formatRouteName(routeParam) {
    const routeMap = {
        'palembang-jakarta': 'Palembang - Jakarta',
        'palembang-jambi': 'Palembang - Jambi',
        'palembang-lampung': 'Palembang - Lampung',
        'palembang-bandung': 'Palembang - Bandung'
    };
    
    return routeMap[routeParam] || routeParam.replace('-', ' - ');
}

// Track booking clicks for analytics
function trackBookingClick(routeName) {
    const eventData = {
        event: 'booking_clicked',
        route: routeName,
        page: 'index',
        timestamp: new Date().toISOString()
    };
    
    console.log('Booking click tracked:', eventData);
    
    // Save to localStorage for analytics
    const analyticsData = JSON.parse(localStorage.getItem('bookingAnalytics') || '[]');
    analyticsData.push(eventData);
    localStorage.setItem('bookingAnalytics', JSON.stringify(analyticsData.slice(-100))); // Keep last 100 events
}

// Scroll spy for navigation
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => observer.observe(section));
}

// Add animation styles
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pre-animate {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-fade-up {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-fade-in {
            opacity: 1;
        }
        
        .service-card, .reason-card, .testimonial {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.visible, .reason-card.visible, .testimonial.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .service-card:nth-child(1) { transition-delay: 0.1s; }
        .service-card:nth-child(2) { transition-delay: 0.2s; }
        .service-card:nth-child(3) { transition-delay: 0.3s; }
        .service-card:nth-child(4) { transition-delay: 0.4s; }
        
        .reason-card:nth-child(1) { transition-delay: 0.1s; }
        .reason-card:nth-child(2) { transition-delay: 0.2s; }
        .reason-card:nth-child(3) { transition-delay: 0.3s; }
        .reason-card:nth-child(4) { transition-delay: 0.4s; }
        .reason-card:nth-child(5) { transition-delay: 0.5s; }
        .reason-card:nth-child(6) { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addAnimationStyles();

// Check for preferred route on page load
window.addEventListener('load', function() {
    const preferredRoute = localStorage.getItem('preferredRoute');
    if (preferredRoute && window.location.pathname.includes('booking.html')) {
        // This will be handled by booking.js
        console.log('Preferred route detected:', preferredRoute);
    }
});

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        });
    }
}

// Initialize parallax if hero has background image
if (document.querySelector('.hero')) {
    initParallax();
}