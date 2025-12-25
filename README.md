# Diagnose Plus - Vehicle Diagnostics Network

> ශ්‍රී ලංකාවේ ප්‍රමුඛතම වාහන දෝෂ විනිශ්චය තාක්ෂණ සේවා සපයන්නා

A modern web platform connecting vehicle owners with certified partner garages across Sri Lanka.

## 🚀 Features

- **🗺️ Dealer Locator**: Interactive map to find partner garages by district
- **🔧 Services Showcase**: Remote diagnostics, spare parts, and technical training
- **📝 Partner Application**: Multi-step form for garages to join the network
- **📱 Fully Responsive**: Works perfectly on mobile, tablet, and desktop
- **🌐 Bilingual**: Content in both Sinhala and English
- **⚡ Modern Design**: Beautiful gradients, animations, and professional aesthetics

## 📁 Project Structure

```
diagnose-plus/
├── index.html              # Home page
├── dealer-locator.html     # Partner finder with Google Maps
├── services.html           # Services showcase
├── become-partner.html     # Partner application form
├── blog.html              # Knowledge base
├── css/                   # Stylesheets
│   ├── main.css           # Design system & global styles
│   ├── home.css           # Home page styles
│   ├── dealer.css         # Dealer locator styles
│   ├── services.css       # Services page styles
│   └── forms.css          # Form styles
├── js/                    # JavaScript
│   ├── config.js          # Configuration
│   ├── main.js            # Global JavaScript
│   ├── dealer-locator.js  # Google Maps integration
│   └── forms.js           # Form validation
├── assets/images/         # Images
└── data/partners.json     # Partner data
```

## 🛠️ Setup Instructions

### 1. Local Development

```bash
# Navigate to project directory
cd diagnose-plus

# Start a local server
python3 -m http.server 8000

# Open in browser
# Visit: http://localhost:8000
```

### 2. Google Maps API Key

To enable the dealer locator map:

1. Get an API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API** and **Places API**
3. Update the API key in `dealer-locator.html` (line 175):

```html
<script async defer
    src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&callback=initMap">
</script>
```

4. Also update `js/config.js`:

```javascript
GOOGLE_MAPS_API_KEY: 'YOUR_API_KEY_HERE'
```

### 3. Update Contact Information

Edit `js/config.js` to add your contact details:

```javascript
CONTACT: {
    email: 'info@diagnoseplus.lk',
    phone: '+94 XX XXX XXXX',
    whatsapp: '+94 XX XXX XXXX'
}
```

## 🌐 Deployment

### Option 1: Shared Hosting
1. Upload all files via FTP to your hosting provider
2. Maintain the directory structure
3. Point your domain to the upload directory

### Option 2: GitHub Pages (Free)
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/diagnose-plus.git
git push -u origin main

# Enable GitHub Pages in repository settings
```

### Option 3: Netlify/Vercel (Free)
1. Create account on [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
2. Connect your GitHub repository
3. Deploy with one click

## 📊 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🔮 Future Features (Phase 2)

- **Partner Portal**: Login system for partners to manage their profile
- **Admin Dashboard**: Manage partners, subscriptions, and leads
- **Payment Gateway**: Online payments for subscriptions
- **E-commerce**: Online store for spare parts
- **WhatsApp Integration**: Chatbot for customer support
- **Analytics Dashboard**: Track user behavior and conversions

## 💰 Cost Estimates

### Annual Costs
- **Domain (.lk)**: LKR 2,000-3,000/year
- **Hosting (Shared)**: LKR 10,000-30,000/year
- **SSL Certificate**: Free (Let's Encrypt)
- **Google Maps API**: Free tier (includes $200/month credits)

**Total**: LKR 15,000-35,000/year

## 📝 License

© 2024 Diagnose Plus. All rights reserved.

## 🤝 Support

For questions or support:
- 📧 Email: info@diagnoseplus.lk
- 📱 Phone: +94 XX XXX XXXX
- 💬 WhatsApp: +94 XX XXX XXXX

---

Built with ❤️ for the Sri Lankan automotive industry
