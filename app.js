// Telegram Mini App - Token Earner Application
class TokenEarnerApp {
    constructor() {
        this.tokenCount = 0;
        this.isTimerActive = false;
        this.timerInterval = null;
        this.currentTimer = 0;
        this.targetUrl = 'https://link.gigapub.tech/l/wcz5o9fvu';
        this.earnAmount = 100;
        this.timerDuration = 10; // 10 seconds
        
        this.init();
    }

    async init() {
        // Initialize Telegram Web App
        this.initTelegramWebApp();
        
        // Load saved data
        this.loadSavedData();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Apply theme
        this.applyTheme();
        
        // Update UI
        this.updateUI();
        
        // Mark app as ready
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
        }
    }

    initTelegramWebApp() {
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.warn('Telegram Web App SDK not available');
            return;
        }

        // Configure Web App
        const webApp = window.Telegram.WebApp;
        
        // Enable closing confirmation
        webApp.enableClosingConfirmation();
        
        // Set up event listeners
        webApp.onEvent('themeChanged', () => {
            this.applyTheme();
        });

        webApp.onEvent('viewportChanged', () => {
            this.updateViewportHeight();
        });

        // Configure main button for claim action
        webApp.MainButton.setParams({
            text: 'CLAIM REWARDS',
            color: '#34C759',
            text_color: '#FFFFFF',
            is_visible: false,
            is_active: false
        });

        webApp.MainButton.onClick(() => {
            this.claimRewards();
        });

        // Configure back button
        webApp.BackButton.onClick(() => {
            webApp.close();
        });
    }

    loadSavedData() {
        try {
            const savedData = localStorage.getItem('tokenEarnerData');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.tokenCount = data.tokenCount || 0;
                this.earningsHistory = data.earningsHistory || [];
                this.sessionCount = data.sessionCount || 0;
                this.dailyEarnings = data.dailyEarnings || 0;
                this.dailyTarget = 1000;
            } else {
                this.earningsHistory = [];
                this.sessionCount = 0;
                this.dailyEarnings = 0;
                this.dailyTarget = 1000;
            }
        } catch (error) {
            console.error('Error loading saved data:', error);
            this.tokenCount = 0;
            this.earningsHistory = [];
            this.sessionCount = 0;
            this.dailyEarnings = 0;
            this.dailyTarget = 1000;
        }
    }

    saveData() {
        try {
            const data = {
                tokenCount: this.tokenCount,
                earningsHistory: this.earningsHistory,
                sessionCount: this.sessionCount,
                dailyEarnings: this.dailyEarnings,
                dailyTarget: this.dailyTarget,
                lastResetDate: this.getTodayDate()
            };
            localStorage.setItem('tokenEarnerData', JSON.stringify(data));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    setupEventListeners() {
        const earnButton = document.getElementById('earnButton');
        if (earnButton) {
            earnButton.addEventListener('click', () => this.handleEarnClick());
        }

        // Handle visibility changes (app minimized/maximized)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.isTimerActive) {
                this.pauseTimer();
            } else if (!document.hidden && this.isTimerActive) {
                this.resumeTimer();
            }
        });
    }

    applyTheme() {
        if (!window.Telegram || !window.Telegram.WebApp) return;

        const webApp = window.Telegram.WebApp;
        const themeParams = webApp.themeParams || {};
        
        // Apply CSS custom properties based on Telegram theme
        const root = document.documentElement;
        root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color || '#ffffff');
        root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color || '#f1f1f1');
        root.style.setProperty('--tg-theme-text-color', themeParams.text_color || '#000000');
        root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color || '#8e8e93');
        root.style.setProperty('--tg-theme-button-color', themeParams.button_color || '#2481cc');
        root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color || '#ffffff');
        
        // Update body class for theme-specific styles
        document.body.className = webApp.colorScheme === 'dark' ? 'dark-theme' : 'light-theme';
    }

    updateViewportHeight() {
        if (!window.Telegram || !window.Telegram.WebApp) return;
        
        const webApp = window.Telegram.WebApp;
        const vh = webApp.viewportHeight || window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    updateUI() {
        this.updateTokenDisplay();
        this.updateUsername();
        this.updateHistoryList();
        this.updateButtonState();
        this.updateStats();
        this.updateProgress();
        this.checkDailyReset();
    }

    updateTokenDisplay() {
        const tokenCountElement = document.getElementById('tokenCount');
        if (tokenCountElement) {
            this.animateNumber(tokenCountElement, this.tokenCount);
        }
    }

    updateUsername() {
        const usernameElement = document.getElementById('username');
        if (!usernameElement || !window.Telegram || !window.Telegram.WebApp) return;

        const webApp = window.Telegram.WebApp;
        const user = webApp.initDataUnsafe?.user;
        
        if (user) {
            const displayName = user.first_name || user.username || 'User';
            usernameElement.textContent = `Hi, ${displayName}!`;
        }
    }

    updateHistoryList() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        if (this.earningsHistory.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🎯</div>
                    <p>Start earning by visiting your first link!</p>
                </div>
            `;
            return;
        }

        const historyHTML = this.earningsHistory
            .slice(-10) // Show last 10 earnings
            .reverse()
            .map(earning => `
                <div class="history-item">
                    <div class="history-info">
                        <h3>🔗 Link Visit</h3>
                        <p>${this.formatTimestamp(earning.timestamp)}</p>
                    </div>
                    <div class="history-amount">+${earning.amount} 💰</div>
                </div>
            `).join('');

        historyList.innerHTML = historyHTML;
    }

    updateButtonState() {
        const earnButton = document.getElementById('earnButton');
        const buttonText = earnButton?.querySelector('.button-text');
        const timerDisplay = document.getElementById('timerDisplay');
        
        if (!earnButton || !buttonText) return;

        if (this.isTimerActive) {
            earnButton.className = 'earn-button timer-state';
            earnButton.disabled = true;
            buttonText.textContent = 'Please wait...';
            if (timerDisplay) timerDisplay.style.display = 'block';
        } else if (this.currentTimer > 0) {
            earnButton.className = 'earn-button claim-state';
            earnButton.disabled = false;
            buttonText.textContent = 'CLAIM REWARDS';
            if (timerDisplay) timerDisplay.style.display = 'none';
        } else {
            earnButton.className = 'earn-button';
            earnButton.disabled = false;
            buttonText.textContent = 'Visit Link & Earn';
            if (timerDisplay) timerDisplay.style.display = 'none';
        }
    }

    async handleEarnClick() {
        if (this.isTimerActive) {
            this.showToast('Please wait for the current task to complete', 'error');
            return;
        }

        // Provide haptic feedback
        this.provideHapticFeedback('light');

        try {
            // Show loading state
            this.showLoading(true);

            // Open the link
            await this.openLink();

            // Start timer
            this.startTimer();

            // Hide loading state
            this.showLoading(false);

        } catch (error) {
            console.error('Error handling earn click:', error);
            this.showToast('Failed to open link. Please try again.', 'error');
            this.showLoading(false);
        }
    }

    async openLink() {
        return new Promise((resolve, reject) => {
            if (window.Telegram && window.Telegram.WebApp) {
                // Use Telegram's openLink method
                window.Telegram.WebApp.openLink(this.targetUrl, {
                    try_instant_view: true
                });
                
                // Resolve immediately - we don't need to wait for user to actually visit
                setTimeout(resolve, 1000);
            } else {
                // Fallback for non-Telegram environments
                const newWindow = window.open(this.targetUrl, '_blank');
                if (newWindow) {
                    setTimeout(resolve, 1000);
                } else {
                    reject(new Error('Failed to open link'));
                }
            }
        });
    }

    startTimer() {
        this.isTimerActive = true;
        this.currentTimer = this.timerDuration;
        this.updateButtonState();
        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.currentTimer--;
            this.updateTimerDisplay();

            if (this.currentTimer <= 0) {
                this.completeTimer();
            }
        }, 1000);
    }

    completeTimer() {
        clearInterval(this.timerInterval);
        this.isTimerActive = false;
        this.currentTimer = 0;
        this.updateButtonState();
        this.updateTimerDisplay();

        // Show claim button and configure Telegram main button
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.MainButton.show();
            window.Telegram.WebApp.MainButton.enable();
        }

        // Provide success haptic feedback
        this.provideHapticFeedback('success');

        this.showToast('Rewards ready to claim!', 'success');
    }

    pauseTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    resumeTimer() {
        if (this.isTimerActive && this.currentTimer > 0) {
            this.startTimer();
        }
    }

    updateTimerDisplay() {
        const countdownElement = document.getElementById('countdown');
        const timerDisplay = document.getElementById('timerDisplay');
        const progressFill = document.querySelector('.progress-fill');

        if (countdownElement) {
            countdownElement.textContent = this.currentTimer;
            
            // Add warning class when timer is low
            const timerCount = timerDisplay?.querySelector('.timer-count');
            if (timerCount) {
                if (this.currentTimer <= 3) {
                    timerCount.classList.add('warning');
                } else {
                    timerCount.classList.remove('warning');
                }
            }
        }

        // Update progress bar
        if (progressFill) {
            const progress = ((this.timerDuration - this.currentTimer) / this.timerDuration) * 100;
            progressFill.style.transform = `translateX(-${100 - progress}%)`;
        }

        // Show/hide timer display
        if (timerDisplay) {
            timerDisplay.style.display = this.isTimerActive ? 'block' : 'none';
        }
    }

    async claimRewards() {
        try {
            this.showLoading(true);

            // Provide haptic feedback
            this.provideHapticFeedback('heavy');

            // Add tokens
            this.tokenCount += this.earnAmount;
            this.dailyEarnings += this.earnAmount;
            this.sessionCount += 1;

            // Add to history
            this.earningsHistory.push({
                amount: this.earnAmount,
                timestamp: Date.now()
            });

            // Save data
            this.saveData();

            // Update UI
            this.updateTokenDisplay();
            this.updateHistoryList();
            this.updateButtonState();
            this.updateStats();
            this.updateProgress();

            // Hide Telegram main button
            if (window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.MainButton.hide();
            }

            // Show success toast
            this.showToast(`${this.earnAmount} Tokens Added! 🎉`, 'success');

            // Animate balance
            this.animateBalance();

            this.showLoading(false);

        } catch (error) {
            console.error('Error claiming rewards:', error);
            this.showToast('Failed to claim rewards. Please try again.', 'error');
            this.showLoading(false);
        }
    }

    animateBalance() {
        const balanceCard = document.querySelector('.balance-card');
        if (balanceCard) {
            balanceCard.style.animation = 'none';
            balanceCard.offsetHeight; // Trigger reflow
            balanceCard.style.animation = 'balancePulse 0.6s ease-out';
        }
    }

    animateNumber(element, targetNumber) {
        const startNumber = parseInt(element.textContent) || 0;
        const duration = 1000; // 1 second
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const currentNumber = Math.round(startNumber + (targetNumber - startNumber) * easeOutCubic);
            
            element.textContent = currentNumber.toLocaleString();
            element.style.animation = 'countUp 0.3s ease-out';

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById(`${type}Toast`);
        const messageElement = toast?.querySelector('.toast-message');
        
        if (toast && messageElement) {
            messageElement.textContent = message;
            toast.style.display = 'block';

            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    }

    showLoading(show) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.innerHTML = `
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <div class="loading-text">Opening link...</div>
                    </div>
                `;
                loadingOverlay.style.display = 'flex';
            } else {
                loadingOverlay.style.display = 'none';
            }
        }
    }

    provideHapticFeedback(type) {
        if (!window.Telegram || !window.Telegram.WebApp || !window.Telegram.WebApp.HapticFeedback) return;

        const haptic = window.Telegram.WebApp.HapticFeedback;
        
        switch (type) {
            case 'light':
                haptic.impactOccurred('light');
                break;
            case 'medium':
                haptic.impactOccurred('medium');
                break;
            case 'heavy':
                haptic.impactOccurred('heavy');
                break;
            case 'success':
                haptic.notificationOccurred('success');
                break;
            case 'error':
                haptic.notificationOccurred('error');
                break;
            case 'warning':
                haptic.notificationOccurred('warning');
                break;
            case 'selection':
                haptic.selectionChanged();
                break;
        }
    }

    formatTimestamp(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return new Date(timestamp).toLocaleDateString();
    }

    getTodayDate() {
        return new Date().toDateString();
    }

    checkDailyReset() {
        const today = this.getTodayDate();
        const lastResetDate = localStorage.getItem('lastResetDate');
        
        if (lastResetDate !== today) {
            this.dailyEarnings = 0;
            this.sessionCount = 0;
            this.saveData();
            this.updateProgress();
        }
    }

    updateStats() {
        const sessionCountElement = document.getElementById('sessionCount');
        if (sessionCountElement) {
            sessionCountElement.textContent = this.sessionCount;
        }
    }

    updateProgress() {
        const dailyProgressElement = document.getElementById('dailyProgress');
        const dailyEarnedElement = document.getElementById('dailyEarned');
        const dailyRemainingElement = document.getElementById('dailyRemaining');
        
        if (dailyProgressElement) {
            const progressPercentage = Math.min((this.dailyEarnings / this.dailyTarget) * 100, 100);
            dailyProgressElement.style.width = `${progressPercentage}%`;
        }
        
        if (dailyEarnedElement) {
            dailyEarnedElement.textContent = `${this.dailyEarnings} earned today`;
        }
        
        if (dailyRemainingElement) {
            const remaining = Math.max(this.dailyTarget - this.dailyEarnings, 0);
            dailyRemainingElement.textContent = `${remaining} to goal`;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.tokenEarnerApp = new TokenEarnerApp();
});

// Handle app lifecycle events
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.onEvent('mainButtonClicked', () => {
        if (window.tokenEarnerApp) {
            window.tokenEarnerApp.claimRewards();
        }
    });

    window.Telegram.WebApp.onEvent('backButtonClicked', () => {
        window.Telegram.WebApp.close();
    });
}

// Prevent default touch behaviors
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

document.addEventListener('touchend', (e) => {
    if (e.touches.length > 0) {
        e.preventDefault();
    }
}, { passive: false });

// Handle iOS Safari viewport issues
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        if (window.tokenEarnerApp) {
            window.tokenEarnerApp.updateViewportHeight();
        }
    }, 100);
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.tokenEarnerApp) {
        window.tokenEarnerApp.updateViewportHeight();
    }
});