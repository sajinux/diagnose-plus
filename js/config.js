// Configuration for Diagnose Plus Web Application
const CONFIG = {
    // Backend API Base URL
    API_BASE_URL: 'https://diagnose-plus-api.onrender.com',

    // Google Maps API Key - Replace with your actual key
    // Get your key from: https://console.cloud.google.com/
    GOOGLE_MAPS_API_KEY: 'AIzaSyBT2ceqceG-db5LSDMy5Snhb3QLoec9e3s',

    // Default map center (Sri Lanka - Colombo)
    DEFAULT_MAP_CENTER: {
        lat: 6.9271,
        lng: 79.8612
    },

    // Default map zoom level
    DEFAULT_MAP_ZOOM: 8,

    // API endpoints
    API_ENDPOINTS: {
        auth: '/api/auth',
        partners: '/api/partners',
        contact: '/api/contact',
        partnerApplication: '/api/auth/register',
        blog: '/api/blog'
    },

    // Contact information
    CONTACT: {
        email: 'info@diagnoseplus.lk',
        phone: '+94 XX XXX XXXX',
        whatsapp: '+94 XX XXX XXXX'
    },

    // Social media links
    SOCIAL_MEDIA: {
        facebook: '#',
        instagram: '#',
        linkedin: '#',
        youtube: '#'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
