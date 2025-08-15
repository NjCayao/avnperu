// form-validator.js - Validación de formularios

document.addEventListener('DOMContentLoaded', function() {
    // Configuración de mensajes de error
    const errorMessages = {
        required: 'Este campo es requerido',
        email: 'Por favor ingresa un email válido',
        phone: 'Por favor ingresa un número de teléfono válido',
        minLength: 'Mínimo {min} caracteres',
        maxLength: 'Máximo {max} caracteres',
        pattern: 'Formato inválido'
    };

    // Validadores
    const validators = {
        required: (value) => value.trim() !== '',
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^[0-9\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, '').length >= 9,
        minLength: (value, min) => value.length >= min,
        maxLength: (value, max) => value.length <= max,
        pattern: (value, pattern) => new RegExp(pattern).test(value)
    };

    // Función principal de validación
    function validateField(field) {
        const value = field.value;
        const validations = field.dataset.validate ? field.dataset.validate.split(' ') : [];
        let isValid = true;
        let errorMessage = '';

        // Validación requerida
        if (field.hasAttribute('required') && !validators.required(value)) {
            isValid = false;
            errorMessage = errorMessages.required;
        }

        // Otras validaciones
        validations.forEach(validation => {
            if (isValid) {
                switch (validation) {
                    case 'email':
                        if (!validators.email(value)) {
                            isValid = false;
                            errorMessage = errorMessages.email;
                        }
                        break;
                    case 'phone':
                        if (!validators.phone(value)) {
                            isValid = false;
                            errorMessage = errorMessages.phone;
                        }
                        break;
                }
            }
        });

        // Validación de longitud
        if (isValid && field.hasAttribute('minlength')) {
            const min = parseInt(field.getAttribute('minlength'));
            if (!validators.minLength(value, min)) {
                isValid = false;
                errorMessage = errorMessages.minLength.replace('{min}', min);
            }
        }

        if (isValid && field.hasAttribute('maxlength')) {
            const max = parseInt(field.getAttribute('maxlength'));
            if (!validators.maxLength(value, max)) {
                isValid = false;
                errorMessage = errorMessages.maxLength.replace('{max}', max);
            }
        }

        // Validación de patrón
        if (isValid && field.hasAttribute('pattern')) {
            const pattern = field.getAttribute('pattern');
            if (!validators.pattern(value, pattern)) {
                isValid = false;
                errorMessage = errorMessages.pattern;
            }
        }

        return { isValid, errorMessage };
    }

    // Mostrar error
    function showError(field, message) {
        const errorElement = field.parentElement.querySelector('.error-message') || createErrorElement(field);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.classList.add('error');
        field.classList.remove('success');
    }

    // Ocultar error
    function hideError(field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        field.classList.remove('error');
        field.classList.add('success');
    }

    // Crear elemento de error
    function createErrorElement(field) {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.style.display = 'none';
        field.parentElement.appendChild(errorElement);
        return errorElement;
    }

    // Validar formulario completo
    function validateForm(form) {
        const fields = form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        fields.forEach(field => {
            const { isValid, errorMessage } = validateField(field);
            if (!isValid) {
                showError(field, errorMessage);
                isFormValid = false;
            } else {
                hideError(field);
            }
        });

        return isFormValid;
    }

    // Aplicar validación a todos los formularios
    document.querySelectorAll('form').forEach(form => {
        // Validación en tiempo real
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', function() {
                const { isValid, errorMessage } = validateField(this);
                if (!isValid) {
                    showError(this, errorMessage);
                } else {
                    hideError(this);
                }
            });

            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    const { isValid, errorMessage } = validateField(this);
                    if (isValid) {
                        hideError(this);
                    }
                }
            });
        });

        // Validación al enviar
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Formulario válido - procesar envío
                const formData = new FormData(this);
                const data = Object.fromEntries(formData.entries());
                
                // Mostrar loading
                const submitButton = this.querySelector('[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // Simular envío (reemplazar con llamada real a API)
                setTimeout(() => {
                    console.log('Datos del formulario:', data);
                    
                    // Mostrar mensaje de éxito
                    showSuccessMessage(this);
                    
                    // Resetear formulario
                    this.reset();
                    this.querySelectorAll('.success').forEach(field => {
                        field.classList.remove('success');
                    });
                    
                    // Restaurar botón
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 1500);
            }
        });
    });

    // Mostrar mensaje de éxito
    function showSuccessMessage(form) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="background: #10B981; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
                ¡Gracias! Hemos recibido tu información y te contactaremos pronto.
            </div>
        `;
        
        form.appendChild(successMessage);
        
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // Formateo especial para campos de teléfono
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            if (value.length > 0) {
                if (value.length <= 3) {
                    formattedValue = value;
                } else if (value.length <= 6) {
                    formattedValue = `${value.slice(0, 3)} ${value.slice(3)}`;
                } else if (value.length <= 9) {
                    formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
                } else {
                    formattedValue = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 9)}`;
                }
            }
            
            e.target.value = formattedValue;
        });
    });

    // Autocompletado de dirección (simulado)
    const addressInputs = document.querySelectorAll('input[name="address"], input[placeholder*="dirección"]');
    addressInputs.forEach(input => {
        let timeout = null;
        
        input.addEventListener('input', function(e) {
            clearTimeout(timeout);
            const value = e.target.value;
            
            if (value.length > 3) {
                timeout = setTimeout(() => {
                    // Aquí iría la llamada a una API de geocoding
                    console.log('Buscando direcciones para:', value);
                }, 500);
            }
        });
    });
});