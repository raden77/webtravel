// Booking Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker
    const datePicker = flatpickr("#departureDate", {
        locale: "id",
        dateFormat: "d/m/Y",
        minDate: "today",
        disable: [
            function(date) {
                // Disable weekends (optional)
                return (date.getDay() === 0 || date.getDay() === 6);
            }
        ],
        onChange: updateSummary
    });

    // Price mapping for packages
    const packagePrices = {
        'bali-5d4n': 3500000,
        'lombok-4d3n': 2800000,
        'jepang-7d6n': 15000000,
        'singapore-4d3n': 4200000,
        'thailand-5d4n': 3800000
    };

    // Package display names
    const packageNames = {
        'bali-5d4n': '🏝️ Paket Bali (5 Hari 4 Malam)',
        'lombok-4d3n': '🏖️ Paket Lombok (4 Hari 3 Malam)',
        'jepang-7d6n': '🗻 Paket Jepang (7 Hari 6 Malam)',
        'singapore-4d3n': '🏙️ Paket Singapore (4 Hari 3 Malam)',
        'thailand-5d4n': '🐘 Paket Thailand (5 Hari 4 Malam)'
    };

    // Duration display names
    const durationNames = {
        '3d2n': '3 Hari 2 Malam',
        '4d3n': '4 Hari 3 Malam',
        '5d4n': '5 Hari 4 Malam',
        '7d6n': '7 Hari 6 Malam'
    };

    // Room type display names
    const roomTypeNames = {
        'standard': 'Standard (2 orang)',
        'deluxe': 'Deluxe',
        'suite': 'Suite',
        'family': 'Family Room (4 orang)'
    };

    // Get DOM elements
    const packageSelect = document.getElementById('package');
    const departureDate = document.getElementById('departureDate');
    const durationSelect = document.getElementById('duration');
    const peopleCount = document.getElementById('peopleCount');
    const roomTypeSelect = document.getElementById('roomType');
    
    // Summary elements
    const summaryPackage = document.getElementById('summaryPackage');
    const summaryDate = document.getElementById('summaryDate');
    const summaryDuration = document.getElementById('summaryDuration');
    const summaryPeople = document.getElementById('summaryPeople');
    const summaryRoom = document.getElementById('summaryRoom');
    const summaryTotal = document.getElementById('summaryTotal');

    // Add event listeners for real-time updates
    packageSelect.addEventListener('change', updateSummary);
    departureDate.addEventListener('change', updateSummary);
    durationSelect.addEventListener('change', updateSummary);
    peopleCount.addEventListener('input', updateSummary);
    roomTypeSelect.addEventListener('change', updateSummary);

    // Initialize summary
    updateSummary();

    // Form submission
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            sendBookingToWhatsApp();
        }
    });

    // WhatsApp number formatting
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Format: 0812-3456-7890
            if (value.length > 4) {
                value = value.substring(0, 4) + '-' + value.substring(4);
            }
            if (value.length > 9) {
                value = value.substring(0, 9) + '-' + value.substring(9, 13);
            }
            
            e.target.value = value;
        });
    }
});

// Update order summary
function updateSummary() {
    const packageSelect = document.getElementById('package');
    const departureDate = document.getElementById('departureDate');
    const durationSelect = document.getElementById('duration');
    const peopleCount = document.getElementById('peopleCount');
    const roomTypeSelect = document.getElementById('roomType');
    
    // Get values
    const selectedPackage = packageSelect.value;
    const dateValue = departureDate.value;
    const durationValue = durationSelect.value;
    const peopleValue = parseInt(peopleCount.value) || 1;
    const roomValue = roomTypeSelect.value;
    
    // Calculate total
    let total = 0;
    if (selectedPackage && packagePrices[selectedPackage]) {
        total = packagePrices[selectedPackage] * peopleValue;
    }
    
    // Update summary display
    document.getElementById('summaryPackage').textContent = 
        selectedPackage ? packageNames[selectedPackage] : '-';
    
    document.getElementById('summaryDate').textContent = 
        dateValue || '-';
    
    document.getElementById('summaryDuration').textContent = 
        durationNames[durationValue] || '-';
    
    document.getElementById('summaryPeople').textContent = peopleValue;
    
    document.getElementById('summaryRoom').textContent = 
        roomTypeNames[roomValue] || '-';
    
    document.getElementById('summaryTotal').textContent = 
        total ? formatCurrency(total) : 'Rp 0';
}

// Format currency to IDR
function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// People counter functions
function incrementPeople() {
    const peopleInput = document.getElementById('peopleCount');
    let currentValue = parseInt(peopleInput.value);
    if (currentValue < 20) {
        peopleInput.value = currentValue + 1;
        
        // Trigger input event for summary update
        const event = new Event('input');
        peopleInput.dispatchEvent(event);
    }
}

function decrementPeople() {
    const peopleInput = document.getElementById('peopleCount');
    let currentValue = parseInt(peopleInput.value);
    if (currentValue > 1) {
        peopleInput.value = currentValue - 1;
        
        // Trigger input event for summary update
        const event = new Event('input');
        peopleInput.dispatchEvent(event);
    }
}

// Form validation
function validateForm() {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => {
        el.classList.remove('error');
    });
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
    
    // Validate required fields
    const requiredFields = [
        'fullName',
        'email',
        'whatsapp',
        'package',
        'departureDate'
    ];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            showError(field, 'Field ini wajib diisi');
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        showError(emailField, 'Format email tidak valid');
        isValid = false;
    }
    
    // WhatsApp validation
    const whatsappField = document.getElementById('whatsapp');
    const whatsappRegex = /^[0-9+\-\s]{10,15}$/;
    if (whatsappField.value && !whatsappRegex.test(whatsappField.value)) {
        showError(whatsappField, 'Format nomor WhatsApp tidak valid');
        isValid = false;
    }
    
    // Terms agreement validation
    const termsCheckbox = document.getElementById('agreeTerms');
    if (!termsCheckbox.checked) {
        showError(termsCheckbox.parentElement, 'Anda harus menyetujui syarat dan ketentuan');
        isValid = false;
    }
    
    return isValid;
}

// Show error message
function showError(element, message) {
    element.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    element.parentElement.appendChild(errorDiv);
}

// Send booking to WhatsApp
function sendBookingToWhatsApp() {
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value.replace(/\D/g, ''),
        package: document.getElementById('package').options[document.getElementById('package').selectedIndex].text,
        departureDate: document.getElementById('departureDate').value,
        duration: document.getElementById('duration').options[document.getElementById('duration').selectedIndex].text,
        peopleCount: document.getElementById('peopleCount').value,
        roomType: document.getElementById('roomType').options[document.getElementById('roomType').selectedIndex].text,
        specialNotes: document.getElementById('specialNotes').value
    };
    
    // Create WhatsApp message
    let message = `*FORM BOOKING PAKET WISATA TRAVELKU*%0A%0A`;
    
    // Customer Info
    message += `👤 *DATA PEMESAN*%0A`;
    message += `Nama: ${formData.fullName}%0A`;
    message += `Email: ${formData.email}%0A`;
    message += `WhatsApp: ${formData.whatsapp}%0A%0A`;
    
    // Trip Details
    message += `🎒 *DETAIL PERJALANAN*%0A`;
    message += `Paket: ${formData.package}%0A`;
    message += `Tanggal: ${formData.departureDate}%0A`;
    message += `Durasi: ${formData.duration}%0A`;
    message += `Jumlah Orang: ${formData.peopleCount}%0A`;
    message += `Tipe Kamar: ${formData.roomType}%0A%0A`;
    
    // Special Notes
    if (formData.specialNotes) {
        message += `📝 *CATATAN KHUSUS*%0A${formData.specialNotes}%0A%0A`;
    }
    
    // Summary
    message += `💰 *RINGKASAN*%0A`;
    message += `Total Perkiraan: ${document.getElementById('summaryTotal').textContent}%0A%0A`;
    
    message += `_Silakan konfirmasi ketersediaan dan informasi pembayaran_`;
    
    // WhatsApp number (replace with your number)
    const whatsappNumber = '6281234567890';
    
    // Open WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    
    // Show success message
    showSuccessMessage();
    
    // Save to localStorage (optional)
    saveBookingDraft(formData);
}

// Show success message
function showSuccessMessage() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4>Booking Berhasil Dikirim!</h4>
                <p>Anda akan diarahkan ke WhatsApp untuk konfirmasi lebih lanjut.</p>
            </div>
            <button class="close-success">&times;</button>
        </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
            border-radius: 8px;
            padding: 1rem;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        .success-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        .success-content i {
            font-size: 1.5rem;
            color: #28a745;
        }
        .close-success {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #155724;
            cursor: pointer;
            margin-left: auto;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(successDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
        styles.remove();
    }, 5000);
    
    // Close button
    successDiv.querySelector('.close-success').addEventListener('click', () => {
        successDiv.remove();
        styles.remove();
    });
}

// Save booking draft to localStorage
function saveBookingDraft(formData) {
    formData.timestamp = new Date().toISOString();
    localStorage.setItem('bookingDraft', JSON.stringify(formData));
}

// Load booking draft from localStorage
function loadBookingDraft() {
    const draft = localStorage.getItem('bookingDraft');
    if (draft) {
        const formData = JSON.parse(draft);
        
        // Populate form fields
        document.getElementById('fullName').value = formData.fullName || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('whatsapp').value = formData.whatsapp || '';
        // ... populate other fields
        
        updateSummary();
    }
}

// Reset form
function resetForm() {
    if (confirm('Apakah Anda yakin ingin mengosongkan semua data form?')) {
        document.getElementById('bookingForm').reset();
        updateSummary();
        
        // Clear any error messages
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        document.querySelectorAll('.error-message').forEach(el => {
            el.remove();
        });
    }
}

// Load draft on page load
window.addEventListener('load', loadBookingDraft);