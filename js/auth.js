// Authentication Utilities for Diagnose Plus
// Handles login, logout, token management, and API requests

const AUTH_CONFIG = {
    TOKEN_KEY: 'diagnose_plus_token',
    REFRESH_TOKEN_KEY: 'diagnose_plus_refresh_token',
    USER_KEY: 'diagnose_plus_user'
};

// ===================================
// Token Management
// ===================================

/**
 * Store authentication tokens
 */
function storeTokens(accessToken, refreshToken) {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, accessToken);
    if (refreshToken) {
        localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    }
}

/**
 * Get access token
 */
function getAccessToken() {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
}

/**
 * Get refresh token
 */
function getRefreshToken() {
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
}

/**
 * Clear all authentication data
 */
function clearAuth() {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
}

/**
 * Store user data
 */
function storeUser(user) {
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
}

/**
 * Get stored user data
 */
function getUser() {
    const userStr = localStorage.getItem(AUTH_CONFIG.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return !!getAccessToken();
}

// ===================================
// API Request Helper
// ===================================

/**
 * Make authenticated API request
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE_URL}${endpoint}`;
    const token = getAccessToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        const data = await response.json();

        // Handle token expiration
        if (response.status === 401 && token) {
            // Try to refresh token
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                // Retry the request with new token
                return apiRequest(endpoint, options);
            } else {
                // Refresh failed, redirect to login
                handleAuthError();
                throw new Error('Session expired. Please login again.');
            }
        }

        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Request Error:', error);
        throw error;
    }
}

/**
 * Refresh access token
 */
async function refreshAccessToken() {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (data.success && data.data.accessToken) {
            storeTokens(data.data.accessToken);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
}

/**
 * Handle authentication errors
 */
function handleAuthError() {
    clearAuth();
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// ===================================
// Authentication Functions
// ===================================

/**
 * Login user
 */
async function login(email, password) {
    try {
        const data = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.success) {
            storeTokens(data.data.accessToken, data.data.refreshToken);
            storeUser(data.data.user);
            return { success: true, user: data.data.user };
        }

        return { success: false, message: data.message };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Register new partner
 */
async function register(formData) {
    try {
        const data = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        return data;
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Logout user
 */
async function logout() {
    try {
        if (isAuthenticated()) {
            await apiRequest('/api/auth/logout', {
                method: 'POST'
            });
        }
    } catch (error) {
        console.error('Logout error:', error);
    } finally {
        clearAuth();
        window.location.href = 'login.html';
    }
}

/**
 * Get current user info
 */
async function getCurrentUser() {
    try {
        const data = await apiRequest('/api/auth/me');
        if (data.success) {
            storeUser(data.data);
            return data.data;
        }
        return null;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

// ===================================
// Route Protection
// ===================================

/**
 * Protect route - redirect to login if not authenticated
 */
function protectRoute() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

/**
 * Redirect if authenticated (for login/register pages)
 */
function redirectIfAuthenticated(redirectTo = 'partner-dashboard.html') {
    if (isAuthenticated()) {
        window.location.href = redirectTo;
        return true;
    }
    return false;
}

// ===================================
// Login Form Handler
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Redirect if already logged in
        redirectIfAuthenticated();

        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('login-btn');
            const messageDiv = document.getElementById('auth-message');

            // Disable button and show loading
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<span>⏳</span> Logging in...';
            messageDiv.style.display = 'none';

            try {
                const result = await login(email, password);

                if (result.success) {
                    // Show success message
                    showAuthMessage('Login successful! Redirecting...', 'success');

                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'partner-dashboard.html';
                    }, 1000);
                } else {
                    // Show error message
                    showAuthMessage(result.message || 'Login failed. Please try again.', 'error');
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<span>🔐</span> Login';
                }
            } catch (error) {
                showAuthMessage('An error occurred. Please try again.', 'error');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<span>🔐</span> Login';
            }
        });
    }
});

/**
 * Show authentication message
 */
function showAuthMessage(message, type = 'error') {
    const messageDiv = document.getElementById('auth-message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `auth-message ${type}`;
        messageDiv.style.display = 'block';

        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    }
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.Auth = {
        login,
        register,
        logout,
        getCurrentUser,
        isAuthenticated,
        getUser,
        protectRoute,
        redirectIfAuthenticated,
        apiRequest,
        showAuthMessage
    };
}
