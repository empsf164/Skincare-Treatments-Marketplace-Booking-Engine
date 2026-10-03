# LUMÉA — Skincare Treatments Marketplace & Booking Engine

> **“Discover Better Skin. Book With Confidence.”**

LUMÉA is a production-quality, responsive web application and marketplace platform for discovering verified skincare professionals, comparing clinical treatments, configuring customized protocols with an instant quote engine, checking real-time availability, and completing secure deposit bookings.

---

## 🌟 Key Features

1. **Editorial Skincare Marketplace Design**: Refined warm ivory, porcelain, muted sage, and clay color palette tailored for clinical aesthetic brands.
2. **Instant Quote Engine**: Live interactive calculator that updates pricing based on treatment durations, skin goals, clinical booster add-ons, and provider tiers with complete breakdown (Base price, Add-ons, Facility fee, Total, Deposit required, and Remaining clinic balance).
3. **Dual-View Real-Time Calendar**:
   - **Desktop**: Full interactive month calendar with status indicators (Available, Limited slots, Unavailable, Selected).
   - **Mobile**: Responsive horizontal date carousel and touch-optimized real-time slot grid.
4. **End-to-End 6-Step Booking Workflow**:
   - Step 1: Treatment & Provider Configuration
   - Step 2 & 3: Calendar Date & Real-Time Slot Selection
   - Step 4: Clinical Upgrades & Booster Add-ons
   - Step 5: Client Information & Medical History Intake
   - Step 6: Review Summary & Deposit Breakdown
5. **Secure Deposit Payment Interface**:
   - Frontend-ready payment UI with Card, UPI, and Digital Wallet simulations.
   - Live state handling for Processing, Success, and Failure/Retry testing.
6. **Appointment Confirmation & Calendar Sync**:
   - Visual step timeline, booking reference, and one-click `.ICS` calendar invite generator.
7. **Client Booking Management (`my-bookings.html`)**:
   - Focused management of **Upcoming**, **Past**, and **Cancelled** treatments.
   - Built-in **Reschedule Modal** with live slot selection and **Cancel Booking** with deposit credit confirmation.
8. **Provider Onboarding & Availability Management**:
   - **Provider Setup (`provider-setup.html`)**: Guided step-by-step onboarding for clinic details, treatment menu, pricing, and deposit rules.
   - **Manage Availability (`manage-availability.html`)**: Weekly operating hours, lunch breaks, blocked vacation dates, and buffer times without any SaaS dashboard clutter.
9. **Global Categorized Search Overlay**:
   - Instant search across Treatments, Providers, and Skincare Journal articles with recent search history and `Ctrl+K` / `/` keyboard shortcuts.
10. **Theme Switcher**: Complete Dark and Light mode support with system preference auto-sync and persistent `localStorage` cache.

---

## 📁 Project File Structure

```
Skincare-Treatments-Marketplace-Booking-Engine/
├── index.html                   # Home page with hero search, signature treatments, and calendar preview
├── treatments.html              # Treatment marketplace with multi-filters and dynamic cards
├── treatment-details.html       # Treatment details & live interactive Instant Quote Engine
├── providers.html               # Verified provider discovery marketplace
├── provider-profile.html        # Provider profile with sticky real-time booking panel
├── booking.html                 # 6-Step Treatment Booking Engine
├── payment.html                 # Secure deposit checkout simulation
├── booking-confirmation.html    # Appointment confirmation card & .ICS download
├── my-bookings.html             # Client appointment management (Upcoming, Past, Cancelled)
├── resources.html               # Skincare Journal library
├── resource-details.html        # Editorial guide reader
├── about.html                   # Brand story & provider verification philosophy
├── contact.html                 # Concierge support & FAQ accordion
├── login.html                   # Authentication with Client vs Provider mode
├── signup.html                  # Registration with dynamic provider fields
├── forgot-password.html         # Password reset simulation
├── provider-setup.html          # Guided provider onboarding setup
├── manage-availability.html     # Provider schedule & blocked dates manager
├── 404.html                     # Error page
├── coming-soon.html             # Expansion placeholder
├── README.md                    # Documentation
└── assets/
    ├── css/
    │   ├── style.css            # Design system, CSS custom properties, and base typography
    │   ├── components.css       # Navbar, cards, quote engine, calendar, slots, and modals
    │   └── responsive.css       # Mobile drawer, breakpoints (320px to 2560px+), and print rules
    └── js/
        ├── main.js              # Navbar scroll, drawer, GSAP micro-animations, and entrypoint
        ├── theme.js             # Dark / Light theme switcher and persistence
        ├── notifications.js     # Toast notification system
        ├── favorites.js         # Bookmark & save collection engine
        ├── treatments.js        # Treatments dataset and querying functions
        ├── providers.js         # Providers directory and availability dataset
        ├── quotes.js            # Instant quote pricing and deposit calculator
        ├── calendar.js          # Interactive calendar and time-slot component
        ├── booking.js           # Multi-step booking engine controller
        ├── payments.js          # Deposit payment simulation & storage
        ├── bookings.js          # My Bookings state manager, rescheduling, and ICS generator
        ├── provider-management.js # Provider onboarding and weekly schedule manager
        ├── search.js            # Global categorized search overlay
        ├── filters.js           # Marketplace filters, sorting, and dynamic grid rendering
        └── auth.js              # Authentication state sync and demo sessions
```

---

## 🚀 How to Run Locally

You can preview the platform by opening `index.html` in any modern web browser or serving it via a local static web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```

Navigate to `http://localhost:8000` in your browser.

---

## 🛠️ Backend-Ready API Integration Guide

This frontend architecture is organized into distinct JavaScript modules ready to connect to production REST or GraphQL endpoints:

| Feature | Frontend File | Target Backend Endpoint |
|---|---|---|
| Authentication | `assets/js/auth.js` | `POST /api/auth/login`, `POST /api/auth/register` |
| Treatments Catalog | `assets/js/treatments.js` | `GET /api/treatments`, `GET /api/treatments/:id` |
| Providers Directory | `assets/js/providers.js` | `GET /api/providers`, `GET /api/providers/:id` |
| Real-Time Slots | `assets/js/calendar.js` | `GET /api/providers/:id/availability?date=YYYY-MM-DD` |
| Quote Calculation | `assets/js/quotes.js` | `POST /api/quotes/calculate` |
| Booking Creation | `assets/js/booking.js` | `POST /api/bookings` |
| Payment Gateway | `assets/js/payments.js` | `POST /api/payments/deposit-intent` (Stripe / Razorpay / UPI) |
| Client Bookings | `assets/js/bookings.js` | `GET /api/user/bookings`, `POST /api/bookings/:id/reschedule` |
| Availability Manager | `assets/js/provider-management.js` | `PUT /api/provider/schedule`, `POST /api/provider/block-date` |

---

## 📄 License
© 2026 LUMÉA Marketplace Inc. Built with HTML5, CSS3, Bootstrap 5, and Vanilla JavaScript.
