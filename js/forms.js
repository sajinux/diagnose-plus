// Form Validation and Handling
let currentStep = 1;
const totalSteps = 3;

document.addEventListener('DOMContentLoaded', function () {
    initForm();
});

// ===================================
// Initialize Form
// ===================================
function initForm() {
    const form = document.getElementById('partner-application-form');
    if (!form) return;

    // Navigation buttons
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const submitBtn = document.getElementById('btn-submit');

    if (prevBtn) prevBtn.addEventListener('click', () => changeStep(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => changeStep(1));
    if (submitBtn) submitBtn.addEventListener('click', submitForm);

    // File upload
    const fileUpload = document.querySelector('.file-upload');
    if (fileUpload) {
        fileUpload.addEventListener('click', function () {
            this.querySelector('input[type="file"]').click();
        });

        const fileInput = fileUpload.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', handleFileUpload);
        }
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Show first step
    showStep(currentStep);
}

// ===================================
// Step Navigation
// ===================================
function changeStep(direction) {
    // Validate current step before moving forward
    if (direction > 0 && !validateStep(currentStep)) {
        return;
    }

    currentStep += direction;
    showStep(currentStep);
}

function showStep(step) {
    // Hide all sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show current section
    const currentSection = document.getElementById(`step-${step}`);
    if (currentSection) {
        currentSection.classList.add('active');
    }

    // Update step indicators
    document.querySelectorAll('.form-step').forEach((stepEl, index) => {
        stepEl.classList.remove('active', 'completed');
        if (index + 1 < step) {
            stepEl.classList.add('completed');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
        }
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const submitBtn = document.getElementById('btn-submit');

    if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = step === totalSteps ? 'none' : 'flex';
    if (submitBtn) submitBtn.style.display = step === totalSteps ? 'flex' : 'none';
}

// ===================================
// Validation
// ===================================
function validateStep(step) {
    const section = document.getElementById(`step-${step}`);
    if (!section) return true;

    const inputs = section.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');

    // Remove previous error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    // Check if required
    if (required && !value) {
        showError(field, 'This field is required');
        return false;
    }

    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showError(field, 'Please enter a valid email address');
            return false;
        }
    }

    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[0-9+\s-()]+$/;
        if (!phoneRegex.test(value)) {
            showError(field, 'Please enter a valid phone number');
            return false;
        }
    }

    // URL validation
    if (type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            showError(field, 'Please enter a valid URL');
            return false;
        }
    }

    return true;
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

// ===================================
// File Upload
// ===================================
function handleFileUpload(event) {
    const files = event.target.files;
    const fileUpload = event.target.closest('.file-upload');

    if (files.length > 0) {
        const fileName = files[0].name;
        const fileText = fileUpload.querySelector('.file-upload-text');
        if (fileText) {
            fileText.textContent = `Selected: ${fileName}`;
            fileText.style.color = 'var(--color-success)';
        }
    }
}

// ===================================
// Form Submission
// ===================================
async function submitForm(event) {
    event.preventDefault();

    // Validate final step
    if (!validateStep(currentStep)) {
        return;
    }

    // Get form data
    const form = document.getElementById('partner-application-form');
    const formData = new FormData(form);

    // Convert FormData to JSON object
    const data = {
        email: formData.get('email'),
        password: 'TempPass123!', // Temporary password - should be sent via email in production
        full_name: formData.get('owner-name'),
        business_name: formData.get('business-name'),
        phone: formData.get('phone'),
        district: formData.get('district'),
        city: formData.get('city'),
        address: formData.get('address')
    };

    // Show loading state
    const submitBtn = document.getElementById('btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>⏳</span> Submitting...';
    submitBtn.disabled = true;

    try {
        // Call backend API
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            // Hide form
            document.querySelectorAll('.form-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelector('.form-steps').style.display = 'none';
            document.querySelector('.form-navigation').style.display = 'none';

            // Show success message
            const successMessage = document.getElementById('success-message');
            if (successMessage) {
                successMessage.classList.add('active');
            }

            // Show notification
            showNotification('Application submitted successfully! We will contact you soon.', 'success');
        } else {
            // Show error
            const errorMessage = result.message || 'Registration failed. Please try again.';
            showNotification(errorMessage, 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('An error occurred. Please check if the backend server is running.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ===================================
// Contact Form (Simple)
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Validate
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) return;

        // Get form data
        const formData = new FormData(this);

        // Show loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Initialize contact form if present
document.addEventListener('DOMContentLoaded', initContactForm);
