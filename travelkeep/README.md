# TravelKeep

A beautiful web application for keeping your travel memories organized. Built with React, Firebase, and Tailwind CSS.

## Features

- 🔐 **Google Authentication** - Secure login with Gmail
- 📍 **Place Management** - Add and organize your travel destinations
- 📸 **Photo Upload** - Upload and store photos for each place
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS
- ☁️ **Cloud Storage** - Photos stored securely in Firebase Storage
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Frontend**: React.js, React Router, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google)
- **Storage**: Firebase Storage
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd travelkeep
npm install
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and select Google as a sign-in method
4. Create a Firestore database
5. Enable Storage
6. Get your Firebase configuration

### 3. Update Firebase Config

Open `src/firebase.js` and replace the placeholder config with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 4. Firebase Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /places/{placeId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /places/{placeId}/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. Run the Application

#### Development Mode (Frontend only)
```bash
npm start
```

#### Development Mode (Frontend + Backend)
```bash
npm run dev
```

#### Production Build
```bash
npm run build
npm run server
```

## Project Structure

```
travelkeep/
├── public/
├── src/
│   ├── components/
│   │   ├── Login.js          # Google authentication
│   │   ├── Home.js           # Main dashboard
│   │   ├── PlaceDetail.js    # Place details and photo upload
│   │   └── Navbar.js         # Navigation bar
│   ├── App.js               # Main app component with routing
│   ├── firebase.js          # Firebase configuration
│   └── index.css            # Tailwind CSS imports
├── server.js                # Express.js backend
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Usage

1. **Sign In**: Click "Continue with Google" to authenticate
2. **Add Places**: Click "Add New Place" to create a new travel destination
3. **View Places**: Click on any place card to view details
4. **Upload Photos**: In the place detail view, click "Choose Photos" to upload images
5. **Navigate**: Use the navbar to move between pages

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/upload` - File upload (if needed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues, please create an issue in the repository.

---

Happy Traveling! ✈️📸
