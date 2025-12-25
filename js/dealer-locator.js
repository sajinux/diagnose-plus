// Dealer Locator JavaScript with Google Maps Integration
let map;
let markers = [];
let infoWindow;
let partnersData = [];
let filteredPartners = [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadPartnersData();
    initFilters();
});

// ===================================
// Load Partners Data
// ===================================
async function loadPartnersData() {
    try {
        // Fetch with cache-busting to ensure latest data
        const response = await fetch(`data/partners.json?t=${new Date().getTime()}`);
        const data = await response.json();
        partnersData = data.partners;
        filteredPartners = [...partnersData];

        // Populate district filter
        populateDistrictFilter(data.districts);

        // Initialize map
        initMap();

        // Display partners
        displayPartners(filteredPartners);
    } catch (error) {
        console.error('Error loading partners data:', error);
        showError('Failed to load partners data. Please refresh the page.');
    }
}

// ===================================
// Google Maps Initialization
// ===================================
function initMap() {
    // Check if Google Maps API is loaded
    if (typeof google === 'undefined') {
        document.getElementById('map').innerHTML = `
            <div class="map-loading">
                <div class="empty-state">
                    <div class="empty-state-icon">🗺️</div>
                    <h3>Google Maps API Key Required</h3>
                    <p>Please add your Google Maps API key in js/config.js</p>
                    <p style="margin-top: 1rem; font-size: var(--font-size-sm);">
                        Get your key from: <a href="https://console.cloud.google.com/" target="_blank" style="color: var(--color-primary);">Google Cloud Console</a>
                    </p>
                </div>
            </div>
        `;
        return;
    }

    // Create map
    map = new google.maps.Map(document.getElementById('map'), {
        center: CONFIG.DEFAULT_MAP_CENTER,
        zoom: CONFIG.DEFAULT_MAP_ZOOM,
        styles: getMapStyles(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
    });

    // Create info window
    infoWindow = new google.maps.InfoWindow();

    // Add markers for all partners
    addMarkers(filteredPartners);
}

// ===================================
// Add Markers to Map
// ===================================
function addMarkers(partners) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    if (!map) return;

    // Create bounds to fit all markers
    const bounds = new google.maps.LatLngBounds();

    partners.forEach(partner => {
        const marker = new google.maps.Marker({
            position: partner.coordinates,
            map: map,
            title: partner.name,
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#2196F3',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });

        // Add click listener
        marker.addListener('click', () => {
            showPartnerInfo(partner, marker);
            highlightPartnerCard(partner.id);
        });

        markers.push(marker);
        bounds.extend(partner.coordinates);
    });

    // Fit map to show all markers
    if (partners.length > 0) {
        map.fitBounds(bounds);
    }
}

// ===================================
// Show Partner Info Window
// ===================================
function showPartnerInfo(partner, marker) {
    const content = `
        <div class="map-info-window">
            <h3>${partner.name}</h3>
            <p><strong>📍</strong> ${partner.address}</p>
            <p><strong>📱</strong> ${partner.phone}</p>
            <p><strong>⭐</strong> Rating: ${partner.rating}/5</p>
            <p><strong>🕐</strong> ${partner.hours}</p>
        </div>
    `;

    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}

// ===================================
// Display Partners List
// ===================================
function displayPartners(partners) {
    const partnersList = document.getElementById('partners-list');
    const resultsCount = document.getElementById('results-count');

    // Update count
    resultsCount.textContent = `${partners.length} Partner${partners.length !== 1 ? 's' : ''} Found`;

    // Clear list
    partnersList.innerHTML = '';

    if (partners.length === 0) {
        partnersList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No Partners Found</h3>
                <p>Try adjusting your filters to see more results.</p>
            </div>
        `;
        return;
    }

    // Create partner cards
    partners.forEach(partner => {
        const card = createPartnerCard(partner);
        partnersList.appendChild(card);
    });
}

// ===================================
// Create Partner Card
// ===================================
function createPartnerCard(partner) {
    const card = document.createElement('div');
    card.className = 'partner-card';
    card.id = `partner-${partner.id}`;

    // Create services tags
    const servicesTags = partner.services.map(service =>
        `<span class="service-tag">${service}</span>`
    ).join('');

    card.innerHTML = `
        <div class="partner-header">
            <div>
                <h3 class="partner-name">${partner.name}</h3>
                <div class="partner-rating">
                    <span>⭐</span>
                    <span>${partner.rating}/5</span>
                </div>
            </div>
            <span class="partner-badge">Certified</span>
        </div>
        
        <div class="partner-info">
            <div class="partner-info-item">
                <span>📍</span>
                <span>${partner.address}</span>
            </div>
            <div class="partner-info-item">
                <span>📱</span>
                <span>${partner.phone}</span>
            </div>
            <div class="partner-info-item">
                <span>🕐</span>
                <span>${partner.hours}</span>
            </div>
        </div>
        
        <div class="partner-services">
            ${servicesTags}
        </div>
        
        <div class="partner-actions">
            <button class="partner-btn partner-btn-primary" onclick="callPartner('${partner.phone}')">
                📞 Call Now
            </button>
            <button class="partner-btn partner-btn-secondary" onclick="getDirections(${partner.coordinates.lat}, ${partner.coordinates.lng})">
                🗺️ Directions
            </button>
        </div>
    `;

    // Add click listener to show on map
    card.addEventListener('click', () => {
        const marker = markers.find((m, index) => filteredPartners[index].id === partner.id);
        if (marker && map) {
            map.setCenter(partner.coordinates);
            map.setZoom(15);
            showPartnerInfo(partner, marker);
        }
        highlightPartnerCard(partner.id);
        scrollToMap();
    });

    return card;
}

// ===================================
// Filters
// ===================================
function populateDistrictFilter(districts) {
    const select = document.getElementById('district-filter');

    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        select.appendChild(option);
    });
}

function initFilters() {
    const districtFilter = document.getElementById('district-filter');
    const serviceCheckboxes = document.querySelectorAll('.service-filter');
    const clearButton = document.getElementById('clear-filters');

    // District filter
    districtFilter.addEventListener('change', applyFilters);

    // Service filters
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Clear filters
    clearButton.addEventListener('click', clearFilters);
}

function applyFilters() {
    const district = document.getElementById('district-filter').value;
    const selectedServices = Array.from(document.querySelectorAll('.service-filter:checked'))
        .map(cb => cb.value);

    filteredPartners = partnersData.filter(partner => {
        // Filter by district
        if (district && partner.district !== district) {
            return false;
        }

        // Filter by services
        if (selectedServices.length > 0) {
            const hasService = selectedServices.some(service =>
                partner.services.includes(service)
            );
            if (!hasService) return false;
        }

        return true;
    });

    // Update display
    displayPartners(filteredPartners);
    addMarkers(filteredPartners);
}

function clearFilters() {
    document.getElementById('district-filter').value = '';
    document.querySelectorAll('.service-filter').forEach(cb => cb.checked = false);
    filteredPartners = [...partnersData];
    displayPartners(filteredPartners);
    addMarkers(filteredPartners);
}

// ===================================
// Helper Functions
// ===================================
function highlightPartnerCard(partnerId) {
    // Remove active class from all cards
    document.querySelectorAll('.partner-card').forEach(card => {
        card.classList.remove('active');
    });

    // Add active class to selected card
    const card = document.getElementById(`partner-${partnerId}`);
    if (card) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function callPartner(phone) {
    window.location.href = `tel:${phone}`;
}

function getDirections(lat, lng) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

/**
 * Scroll smoothly to the map container
 */
function scrollToMap() {
    const mapElement = document.querySelector('.map-container');
    if (mapElement) {
        mapElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showError(message) {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <div class="map-loading">
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
}

// ===================================
// Custom Map Styles
// ===================================
function getMapStyles() {
    return [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }]
        }
    ];
}
