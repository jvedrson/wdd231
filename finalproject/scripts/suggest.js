import { safeJsonParse } from './utils.js';

// Form validation and submission
const form = document.getElementById('tool-form');

// Validate when user leaves a field
document.querySelectorAll('.form-control').forEach(field => {
    field.addEventListener('blur', function () {
        validateField(this);
    });

    field.addEventListener('input', function () {
        this.classList.remove('field-invalid');
    });
});

// Validate individual field
function validateField(field) {
    const value = field.value.trim();

    // Check if required field is empty
    if (field.hasAttribute('required') && value === '') {
        field.classList.add('field-invalid');
        field.classList.remove('field-valid');
        return false;
    }

    // Validate URL field
    if (field.type === 'url' && value !== '') {
        try {
            new URL(value);
            field.classList.add('field-valid');
            field.classList.remove('field-invalid');
            return true;
        } catch {
            field.classList.add('field-invalid');
            field.classList.remove('field-valid');
            return false;
        }
    }

    // Field is valid
    if (value !== '') {
        field.classList.add('field-valid');
        field.classList.remove('field-invalid');
    }
    return true;
}

// Validate entire form
function validateForm() {
    let isValid = true;

    // Check required fields
    const name = document.getElementById('name');
    const language = document.getElementById('language');
    const category = document.getElementById('category');
    const url = document.getElementById('url');
    const description = document.getElementById('description');

    // Validate name
    if (name.value.trim() === '') {
        name.classList.add('field-invalid');
        isValid = false;
    }

    // Validate language
    if (language.value === '') {
        language.classList.add('field-invalid');
        isValid = false;
    }

    // Validate category
    if (category.value === '') {
        category.classList.add('field-invalid');
        isValid = false;
    }

    // Validate URL
    if (url.value.trim() === '') {
        url.classList.add('field-invalid');
        isValid = false;
    } else {
        try {
            new URL(url.value.trim());
        } catch {
            url.classList.add('field-invalid');
            isValid = false;
        }
    }

    // Validate description
    if (description.value.trim() === '') {
        description.classList.add('field-invalid');
        isValid = false;
    }

    return isValid;
}

// Show validation modal
function showValidationModal() {
    const modal = document.getElementById('validation-modal');
    modal.showModal();
}

// Close modal
const modal = document.getElementById('validation-modal');
const modalOkBtn = document.getElementById('modal-ok-btn');

modalOkBtn.addEventListener('click', () => {
    modal.close();
});

// Close modal when clicking outside
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});

// Handle form submission
form.addEventListener('submit', function (event) {
    event.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
        showValidationModal();
        return;
    }

    // Get form data
    const toolData = {
        name: document.getElementById('name').value.trim(),
        language: document.getElementById('language').value,
        category: document.getElementById('category').value,
        url: document.getElementById('url').value.trim(),
        description: document.getElementById('description').value.trim(),
        difficulty: document.getElementById('difficulty').value,
        license: document.getElementById('license').value,
        additionalInfo: document.getElementById('additional-info').value.trim(),
        submittedAt: new Date().toISOString()
    };

    // Save to localStorage
    const submissions = safeJsonParse(localStorage.getItem('tool-suggestions'));
    submissions.push(toolData);
    localStorage.setItem('tool-suggestions', JSON.stringify(submissions));

    // Redirect to success page
    window.location.href = 'form-action.html';
});
