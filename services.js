const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwhTFddRzMrZLJMP3F_yr83bW1w5BXoLiGhrWBGFypxVj0wiFzKgC6fg2URz4QaHL8W0A/exec';

// Services Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize service booking functionality
    initServiceBooking();
    
    // Add animation to service cards on scroll
    animateServiceCards();
    
    // Add click event to all book buttons
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceTitle = this.closest('.service-card')
                .querySelector('h2').textContent;
            const servicePrice = this.closest('.service-card')
                .querySelector('.price-amount').textContent;
            
            bookServiceQuick(serviceTitle, servicePrice);
        });
    });
});

// Initialize service booking
function initServiceBooking() {
    console.log('Service booking initialized');
    
    // You can add more initialization code here
    // For example: Load service data from API, etc.
}

// Book service function
function bookService(route, price, message='') {
    // Format price to IDR
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
    
    // Create WhatsApp message
    // const message = `Halo Dirgantara Travelindo, saya ingin booking travel ${route}%0A%0A` +
    //                `Rute: ${route}%0A` +
    //                `Harga: ${formattedPrice}%0A` +
    //                `%0A` +
    //                `Mohon info jadwal tersedia dan cara bookingnya.`;
    
    // WhatsApp number (replace with your number)
    const whatsappNumber = '62881011010140';
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Track booking event (for analytics)
    trackBookingEvent(route, price);
}

// Quick booking function
function bookServiceQuick(route, price) {
    // Show booking modal or redirect to booking page
    const modal = createBookingModal(route, price);
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Create booking modal
function createBookingModal(route, price) {
    const modal = document.createElement('div');
    modal.className = 'booking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Booking ${route}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Anda akan diarahkan ke WhatsApp untuk melanjutkan booking.</p>
                <div class="service-info">
                    <div class="info-row">
                        <span>Rute:</span>
                        <span>${route}</span>
                    </div>
                    <div class="info-row">
                        <span>Harga:</span>
                        <span class="price">${price}</span>
                    </div>
                </div>
                <button class="modal-confirm-btn">
                    <i class="fab fa-whatsapp"></i> Lanjutkan ke WhatsApp
                </button>
                <button class="modal-cancel-btn">Batal</button>
            </div>
        </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .booking-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
        }
        
        .booking-modal.show {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            transform: translateY(-20px);
            transition: transform 0.3s;
        }
        
        .booking-modal.show .modal-content {
            transform: translateY(0);
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            margin: 0;
            color: #2c3e50;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .service-info {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            margin: 1.5rem 0;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .info-row:last-child {
            margin-bottom: 0;
        }
        
        .info-row .price {
            color: #e74c3c;
            font-weight: 700;
            font-size: 1.2rem;
        }
        
        .modal-confirm-btn {
            background: #25D366;
            color: white;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            width: 100%;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        
        .modal-cancel-btn {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #ddd;
            padding: 1rem;
            border-radius: 8px;
            width: 100%;
            font-weight: 600;
            cursor: pointer;
        }
    `;
    
    document.head.appendChild(styles);
    
    // Add event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
        closeModal(modal, styles);
    });
    
    modal.querySelector('.modal-cancel-btn').addEventListener('click', () => {
        closeModal(modal, styles);
    });
    
    modal.querySelector('.modal-confirm-btn').addEventListener('click', () => {
        // Extract route name without emoji
        const routeName = route.replace(/[^\w\s-]/g, '').trim();
        const priceNumber = parseInt(price.replace(/\D/g, ''));
        
        // Close modal and open WhatsApp
        closeModal(modal, styles);
        bookService(routeName, priceNumber);
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal, styles);
        }
    });
    
    return modal;
}

// Close modal function
function closeModal(modal, styles) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
        styles.remove();
    }, 300);
}

// Animate service cards on scroll
function animateServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Track booking event (for analytics)
function trackBookingEvent(route, price) {
    // This function would send data to your analytics platform
    // For example: Google Analytics, Facebook Pixel, etc.
    
    const eventData = {
        event: 'service_booking_initiated',
        route: route,
        price: price,
        timestamp: new Date().toISOString()
    };
    
    console.log('Booking event tracked:', eventData);
    
    // Example: Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_initiated', {
            'event_category': 'services',
            'event_label': route,
            'value': price
        });
    }
    
    // Save to localStorage for later analysis
    const bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
    bookings.push(eventData);
    localStorage.setItem('bookingHistory', JSON.stringify(bookings.slice(-50))); // Keep last 50
}

// Filter services by route (optional feature)
function filterServices(searchTerm) {
    const serviceCards = document.querySelectorAll('.service-card');
    const searchLower = searchTerm.toLowerCase();
    
    serviceCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        const features = card.querySelector('.service-features').textContent.toLowerCase();
        
        if (title.includes(searchLower) || features.includes(searchLower)) {
            card.style.display = 'flex';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Add search functionality (optional)
function addSearchFunctionality() {
    const searchInput = document.createElement('div');
    searchInput.className = 'services-search';
    searchInput.innerHTML = `
        <div class="search-container">
            <i class="fas fa-search"></i>
            <input type="text" id="servicesSearch" placeholder="Cari rute travel...">
            <button id="clearSearch" style="display: none;">×</button>
        </div>
    `;
    
    const servicesSection = document.querySelector('.services-grid-section');
    servicesSection.insertBefore(searchInput, servicesSection.querySelector('.services-grid'));
    
    // Add search styles
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .services-search {
            max-width: 500px;
            margin: 0 auto 2rem;
        }
        
        .search-container {
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .search-container i {
            position: absolute;
            left: 1rem;
            color: #666;
        }
        
        #servicesSearch {
            width: 100%;
            padding: 0.8rem 1rem 0.8rem 3rem;
            border: 2px solid #ddd;
            border-radius: 30px;
            font-size: 1rem;
            transition: all 0.3s;
        }
        
        #servicesSearch:focus {
            border-color: #3498db;
            outline: none;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }
        
        #clearSearch {
            position: absolute;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #666;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    
    document.head.appendChild(searchStyles);
    
    // Add event listeners
    const searchField = document.getElementById('servicesSearch');
    const clearButton = document.getElementById('clearSearch');
    
    searchField.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        filterServices(searchTerm);
        
        if (searchTerm.length > 0) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
    });
    
    clearButton.addEventListener('click', function() {
        searchField.value = '';
        filterServices('');
        clearButton.style.display = 'none';
        searchField.focus();
    });
}

async function loadServices() {

        try {
          const params = new URLSearchParams({
            action: 'getServices',
          });

          const url = `${APPS_SCRIPT_URL}?${params.toString()}`;
          const response = await fetch(url);
          const result = await response.json();

          const { data, total } = result;
          
          if (data.length === 0) {
            // noData.classList.remove('d-none');
            confirm('Data tidak ditemukan untuk filter yang dipilih.');
          } else {
           

            const serviceBlock = document.getElementById('serviceBlock');
            serviceBlock.innerHTML = '';
            data.forEach(row => {

                let formattedPrice = new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0
                }).format(row.harga);
               
                serviceBlock.innerHTML += `
                    <div class="service-card">
                        <div class="service-header">
                            <h2>${row.rute}</h2>
                            <div class="service-features">
                                <span class="feature-tag">
                                    <i class="fas fa-bolt"></i> Cepat
                                </span>
                                <span class="feature-tag">
                                    <i class="fas fa-couch"></i> Nyaman
                                </span>
                                <span class="feature-tag">
                                    <i class="fas fa-broom"></i> Bersih
                                </span>
                            </div>
                        </div>
                    
                        <div class="service-schedule">
                            <h3><i class="fas fa-clock"></i> Jadwal Jemput</h3>
                            <div class="schedule-list">
                                <div class="schedule-item">
                                    <div class="schedule-time">Jam ${row.waktu1}</div>
                                    <div class="schedule-label">${row.jadwal1}</div>
                                </div>
                                <div class="schedule-item">
                                    <div class="schedule-time">Jam ${row.waktu2}</div>
                                    <div class="schedule-label">${row.jadwal2}</div>
                                </div>
                            </div>
                        </div>
                    
                        <div class="service-footer">
                            <div class="service-price">
                                <div class="price-label">Mulai dari</div>
                                <div class="price-amount">${formattedPrice}</div>
                            </div>
                            <button class="book-btn" onclick="bookService('${row.rute}', ${row.harga}, '${row.pesan}')">
                                Booking Sekarang
                            </button>
                        </div>
                        
                        <div class="service-rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-text">4.5/5 (128 review)</span>
                        </div>
                    </div>
                
                `;
                // serviceBlock.appendChild(serviceCard);
            });
            
          }

        //   renderPagination();

        } catch (err) {
          console.error('Error:', err);
          
        } finally {
            console.log('Load services completed');
        }
}

   

// Initialize search if needed
// addSearchFunctionality();