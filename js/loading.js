// Loading screen functionality
function initLoadingScreen() {
    // Crear partículas verticales mejoradas
    const particlesContainer = document.getElementById('particles');
    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
        particlesContainer.appendChild(particle);
        
        setTimeout(() => particle.remove(), 4000);
    }
    
    // Crear partículas cada 100ms para efecto más denso
    const particleInterval = setInterval(createParticle, 100);
    
    // Contador de velocidad con aceleración
    const speedCounter = document.getElementById('speedCounter');
    let speed = 0;
    let speedIncrement = 1;
    const speedInterval = setInterval(() => {
        speedIncrement = speedIncrement * 1.1; // Aceleración
        speed += Math.floor(speedIncrement);
        if (speed >= 1000) {
            speed = 1000;
            clearInterval(speedInterval);
        }
        speedCounter.textContent = speed;
    }, 50);
    
    // Contador de porcentaje sincronizado
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingText = document.getElementById('loadingText');
    let percentage = 0;
    
    // Textos dinámicos
    const loadingMessages = [
        "Conectando fibra óptica...",
        "Estableciendo conexión...",
        "Optimizando velocidad...",
        "Verificando estabilidad...",
        "¡Conexión establecida!"
    ];
    
    let messageIndex = 0;
    const percentInterval = setInterval(() => {
        percentage += Math.floor(Math.random() * 15) + 5;
        if (percentage >= 100) {
            percentage = 100;
            clearInterval(percentInterval);
        }
        loadingPercentage.textContent = percentage + '%';
        
        // Cambiar mensaje cada 20%
        const newMessageIndex = Math.floor(percentage / 20);
        if (newMessageIndex !== messageIndex && newMessageIndex < loadingMessages.length) {
            messageIndex = newMessageIndex;
            loadingText.style.opacity = '0';
            setTimeout(() => {
                loadingText.textContent = loadingMessages[messageIndex];
                loadingText.style.opacity = '0.8';
            }, 300);
        }
    }, 200);
    
    // Ocultar loading después de completar
    setTimeout(() => {
        clearInterval(particleInterval);
        clearInterval(speedInterval);
        clearInterval(percentInterval);
        document.getElementById('loadingScreen').classList.add('fade-out');
    }, 3500);
}

// Iniciar cuando el DOM esté listo
window.addEventListener('load', initLoadingScreen);