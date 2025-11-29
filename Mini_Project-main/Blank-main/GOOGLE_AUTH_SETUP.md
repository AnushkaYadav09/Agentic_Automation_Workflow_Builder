# Google Authentication Setup Instructions

## Steps to Enable Google Login:

### 1. Get Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `http://localhost:3000` (if using different port)
7. Add authorized redirect URIs:
   - `http://localhost:5173`
8. Click **Create** and copy your **Client ID**

### 2. Update the Client ID in Your App

Open `src/App.tsx` and replace the placeholder Client ID:

```typescript
// Replace this line:
const GOOGLE_CLIENT_ID = '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com';

// With your actual Client ID:
const GOOGLE_CLIENT_ID = 'YOUR_ACTUAL_CLIENT_ID_HERE';
```

### 3. Test the Application

1. Run the development server: `npm run dev`
2. Open http://localhost:5173
3. Select a role (Employee, Manager, or Admin)
4. Click "Continue with Google" button
5. Sign in with your Google account

## Features:

- **Traditional Login**: Email, password, and name fields for sign-up
- **Google OAuth**: One-click sign-in with Google account
- **Role Selection**: Choose between Employee, Manager, or Admin
- **Name Fields**: First and last name required for sign-up (traditional method)
- **Auto-populated**: Google login automatically fills in name and email

## Security Note:

For production deployment:
- Use environment variables for the Client ID
- Add your production domain to authorized origins
- Implement proper backend authentication
- Validate tokens on the server side
