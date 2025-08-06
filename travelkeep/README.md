# TravelKeep

A beautiful travel memory management application built with React, Firebase, and Tailwind CSS.

## Features

- **Beautiful UI**: Modern, clean design with blue and maroon color scheme
- **Google Authentication**: Secure login with Google accounts
- **Travel Places**: Add and organize your travel destinations
- **Photo Management**: Upload and store photos for each place
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Design System

### Color Palette
- **Primary Blue**: `#3b82f6` to `#1e3a8a` (gradient)
- **Maroon Accent**: `#ec4899` to `#831843` (gradient)
- **Neutral Grays**: Clean whites and grays for content

### Typography
- **Display Font**: Poppins for headings and titles
- **Body Font**: Inter for body text and UI elements

### Components
- **Cards**: Glass morphism effect with backdrop blur
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean, accessible form elements
- **Loading States**: Dual-color spinning animations

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase configuration in `src/firebase.js`
4. Start the development server: `npm start`

## Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **Styling**: Custom CSS with Tailwind utilities
- **Icons**: Heroicons (SVG)

## Project Structure

```
src/
├── components/
│   ├── Home.js          # Main dashboard
│   ├── Login.js         # Authentication page
│   ├── Navbar.js        # Navigation component
│   └── PlaceDetail.js   # Individual place view
├── App.js              # Main app component
├── App.css             # Global styles and animations
└── firebase.js         # Firebase configuration
```

## Design Principles

- **Clean & Minimal**: Focus on content without visual clutter
- **Accessible**: High contrast ratios and keyboard navigation
- **Responsive**: Mobile-first design approach
- **Consistent**: Unified design language throughout
- **Modern**: Contemporary UI patterns and animations

## Customization

The design system is easily customizable through the `tailwind.config.js` file. You can modify:
- Color palette in the `colors` section
- Typography in the `fontFamily` section
- Animations in the `animation` and `keyframes` sections
- Shadows and effects in the `boxShadow` section
