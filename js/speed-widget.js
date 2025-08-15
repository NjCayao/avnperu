// speed-widget.js - Widget de test de velocidad

class SpeedTestWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.isRunning = false;
        this.results = {
            download: 0,
            upload: 0,
            ping: 0
        };
        
        if (this.container) {
            this.init();
        }
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        this.container.innerHTML = `
            <div class="speed-test-widget">
                <div class="speed-test-header">
                    <h3>Test de Velocidad</h3>
                    <p>Comprueba la velocidad real de tu conexión</p>
                </div>
                
                <div class="speed-test-display">
                    <div class="speed-meter">
                        <canvas id="speedCanvas" width="300" height="300"></canvas>
                        <div class="speed-value">
                            <span id="speedNumber">0</span>
                            <span class="speed-unit">Mbps</span>
                        </div>
                    </div>
                </div>
                
                <div class="speed-test-results">
                    <div class="result-item">
                        <span class="result-label">Descarga</span>
                        <span class="result-value"><span id="downloadSpeed">-</span> Mbps</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Subida</span>
                        <span class="result-value"><span id="uploadSpeed">-</span> Mbps</span>
                    </div>
                    <div class="result-item">
                        <span class="result-label">Ping</span>
                        <span class="result-value"><span id="pingValue">-</span> ms</span>
                    </div>
                </div>
                
                <button id="startTestBtn" class="speed-test-btn">
                    <span class="btn-text">Iniciar Test</span>
                    <span class="btn-loading" style="display: none;">
                        <span class="spinner"></span> Testeando...
                    </span>
                </button>
                
                <div class="speed-test-info">
                    <small>Este test simula la velocidad. Para resultados precisos, cierra otras aplicaciones que usen internet.</small>
                </div>
            </div>
        `;

        this.setupCanvas();
    }

    setupCanvas() {
        this.canvas = document.getElementById('speedCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.radius = 120;
        
        this.drawSpeedometer(0);
    }

    drawSpeedometer(speed) {
        const ctx = this.ctx;
        const centerX = this.centerX;
        const centerY = this.centerY;
        const radius = this.radius;

        // Limpiar canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar arco de fondo
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 20;
        ctx.stroke();

        // Dibujar arco de velocidad
        const speedAngle = (speed / 1000) * (Math.PI * 1.5) + (Math.PI * 0.75);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, Math.PI * 0.75, speedAngle);
        
        // Gradiente de color según velocidad
        const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        if (speed < 100) {
            gradient.addColorStop(0, '#EF4444');
            gradient.addColorStop(1, '#F59E0B');
        } else if (speed < 500) {
            gradient.addColorStop(0, '#F59E0B');
            gradient.addColorStop(1, '#10B981');
        } else {
            gradient.addColorStop(0, '#10B981');
            gradient.addColorStop(1, '#0066FF');
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 20;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Dibujar marcas
        ctx.fillStyle = '#6B7280';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        
        const marks = [0, 100, 250, 500, 750, 1000];
        marks.forEach(mark => {
            const angle = (mark / 1000) * (Math.PI * 1.5) + (Math.PI * 0.75);
            const markX = centerX + Math.cos(angle) * (radius - 35);
            const markY = centerY + Math.sin(angle) * (radius - 35);
            
            ctx.fillText(mark, markX, markY);
        });
    }

    attachEventListeners() {
        const startBtn = document.getElementById('startTestBtn');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startTest());
        }
    }

    async startTest() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        const startBtn = document.getElementById('startTestBtn');
        const btnText = startBtn.querySelector('.btn-text');
        const btnLoading = startBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        startBtn.disabled = true;

        // Reset resultados
        this.updateResults({ download: 0, upload: 0, ping: 0 });
        
        try {
            // Test de ping
            await this.testPing();
            
            // Test de descarga
            await this.testDownload();
            
            // Test de subida
            await this.testUpload();
            
            // Mostrar resultados finales
            this.showFinalResults();
            
        } catch (error) {
            console.error('Error en el test:', error);
            alert('Error al realizar el test. Por favor intenta nuevamente.');
        } finally {
            this.isRunning = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            startBtn.disabled = false;
        }
    }

    async testPing() {
        // Simular test de ping
        const pings = [];
        for (let i = 0; i < 5; i++) {
            const start = Date.now();
            await this.simulateDelay(20 + Math.random() * 30);
            const end = Date.now();
            pings.push(end - start);
        }
        
        this.results.ping = Math.round(pings.reduce((a, b) => a + b) / pings.length);
        document.getElementById('pingValue').textContent = this.results.ping;
    }

    async testDownload() {
        // Simular test de descarga
        const targetSpeed = 100 + Math.random() * 900; // Entre 100 y 1000 Mbps
        const duration = 5000; // 5 segundos
        const steps = 50;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const currentSpeed = targetSpeed * this.easeOutCubic(progress);
            
            this.drawSpeedometer(currentSpeed);
            document.getElementById('speedNumber').textContent = Math.round(currentSpeed);
            
            if (i === steps) {
                this.results.download = Math.round(currentSpeed);
                document.getElementById('downloadSpeed').textContent = this.results.download;
            }
            
            await this.simulateDelay(stepDuration);
        }
    }

    async testUpload() {
        // Simular test de subida (generalmente menor que descarga)
        const targetSpeed = this.results.download * (0.5 + Math.random() * 0.3);
        const duration = 3000; // 3 segundos
        const steps = 30;
        const stepDuration = duration / steps;
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const currentSpeed = targetSpeed * this.easeOutCubic(progress);
            
            this.drawSpeedometer(currentSpeed);
            document.getElementById('speedNumber').textContent = Math.round(currentSpeed);
            
            if (i === steps) {
                this.results.upload = Math.round(currentSpeed);
                document.getElementById('uploadSpeed').textContent = this.results.upload;
            }
            
            await this.simulateDelay(stepDuration);
        }
    }

    showFinalResults() {
        // Animar velocímetro de vuelta al resultado de descarga
        this.animateToSpeed(this.results.download, 1000);
        
        // Mostrar recomendación basada en resultados
        let recommendation = '';
        if (this.results.download >= 500) {
            recommendation = '¡Excelente velocidad! Ideal para streaming 4K y gaming.';
        } else if (this.results.download >= 100) {
            recommendation = 'Buena velocidad para uso familiar y trabajo remoto.';
        } else {
            recommendation = 'Velocidad básica. Considera actualizar tu plan para mejor experiencia.';
        }
        
        // Mostrar notificación con resultados
        this.showNotification(recommendation);
    }

    async animateToSpeed(targetSpeed, duration) {
        const steps = 30;
        const stepDuration = duration / steps;
        const startSpeed = parseFloat(document.getElementById('speedNumber').textContent);
        
        for (let i = 0; i <= steps; i++) {
            const progress = i / steps;
            const currentSpeed = startSpeed + (targetSpeed - startSpeed) * this.easeOutCubic(progress);
            
            this.drawSpeedometer(currentSpeed);
            document.getElementById('speedNumber').textContent = Math.round(currentSpeed);
            
            await this.simulateDelay(stepDuration);
        }
    }

    updateResults(results) {
        document.getElementById('downloadSpeed').textContent = results.download || '-';
        document.getElementById('uploadSpeed').textContent = results.upload || '-';
        document.getElementById('pingValue').textContent = results.ping || '-';
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'speed-test-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <strong>Resultados del Test</strong>
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Inicializar widget cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Buscar contenedor del widget
    const widgetContainer = document.getElementById('speedTestWidget');
    if (widgetContainer) {
        new SpeedTestWidget('speedTestWidget');
    }
    
    // También manejar el botón de la sección hero si existe
    window.startSpeedTest = function() {
        // Crear modal con el widget
        const modal = document.createElement('div');
        modal.className = 'speed-test-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeSpeedTestModal()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="closeSpeedTestModal()">×</button>
                <div id="modalSpeedTest"></div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Inicializar widget en el modal
        new SpeedTestWidget('modalSpeedTest');
        
        // Mostrar modal con animación
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    };
    
    window.closeSpeedTestModal = function() {
        const modal = document.querySelector('.speed-test-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };
});