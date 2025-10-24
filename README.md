# 🔐 Password Health & Autofill Chrome Extension

A Chrome Extension (Manifest V3) that provides real-time password strength checking and secure password generation with intelligent autofill capabilities.

## ✨ Features

### 1. **Real-Time Password Health Check**
- Automatically detects all password fields on any webpage
- Displays live strength indicators as you type
- Color-coded feedback:
  - 🔴 **Weak**: Less than 8 characters or only one character type
  - 🟠 **Moderate**: 8-11 characters with 2+ character types
  - 🟢 **Strong**: 12+ characters with all four types (uppercase, lowercase, numbers, symbols)

### 2. **Secure Password Generator**
- Generates 16-character passwords
- Guarantees inclusion of all character types:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special symbols (!@#$%^&* etc.)
- Cryptographically randomized

### 3. **Intelligent Autofill with Security Features**
- **Smart Username Detection**: Prioritizes fields with proper autocomplete attributes
- **HTTPS Verification**: Checks protocol before autofilling (security best practice)
- **Visual Feedback**: Highlights fields with animation when credentials are injected
- **Success Banner**: Displays confirmation message after autofill

## 📦 Installation Instructions

### Step 1: Load the Unpacked Extension

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the folder containing these extension files:
   - `manifest.json`
   - `popup.html`
   - `popup.js`
   - `content.js`
6. The extension icon should now appear in your Chrome toolbar

### Step 2: Test the Extension

1. Visit the test page by running the server (see below)
2. Try typing different passwords to see the strength checker in action
3. Click the extension icon to open the popup
4. Click "Generate Secure Password" to create a strong password
5. Click "Autofill Demo" to automatically fill the form

## 🧪 Testing with the Demo Page

This project includes a test page (`index.html`) to demonstrate all features:

1. Start the local server (if using Replit, it starts automatically)
2. Open the test page in your browser
3. The page includes:
   - A login form with username and password fields
   - Instructions for testing each feature
   - Security notes about HTTPS verification

## 🔍 File Structure

```
chrome-extension/
├── manifest.json      # Extension configuration (Manifest V3)
├── popup.html         # Extension popup UI
├── popup.js           # Password generation and autofill logic
├── content.js         # Password strength checker and field detection
├── index.html         # Test page for demonstration
└── README.md          # This file
```

## 🛡️ Security Features

### HTTPS Protocol Verification
The extension checks `window.location.protocol` before autofilling:
- ✅ Allows: `https://`, `file://`, `localhost`
- ❌ Blocks: `http://` (with warning message)
- Console logs security checks for transparency

### Smart Field Detection
Uses industry-standard autocomplete attributes:
- `autocomplete="username"`
- `autocomplete="email"`
- Common name/id patterns: `name="email"`, `id="username"`, etc.

### Visual Confirmation
- Yellow-to-green field highlighting animation (700ms)
- "Credentials Injected!" success banner (2s duration)
- Slide-in/slide-out animations for polish

## 🎨 Password Strength Algorithm

```javascript
Weak (Red):
- Length < 8 characters, OR
- Only 1 character type

Moderate (Orange):
- 8-11 characters with 2+ types, OR
- 12+ characters with 2-3 types

Strong (Green):
- 12+ characters with all 4 types:
  ✓ Uppercase
  ✓ Lowercase
  ✓ Numbers
  ✓ Symbols
```

## 📝 Usage Notes

1. **No Icon File**: The extension references `icon.png` in the manifest, but it's not required for functionality. You can add a 128x128 PNG icon if desired.

2. **Permissions**: The extension requires:
   - `activeTab`: To interact with the current tab
   - `scripting`: To inject the autofill functionality

3. **Content Script**: Runs on all URLs (`<all_urls>`) to detect password fields universally

## 🚀 Demo Flow

1. **Password Health Check** (automatic):
   - Type "abc" → See "Weak" indicator (red)
   - Type "MyPass123" → See "Moderate" indicator (orange)
   - Type "MyP@ssw0rd!2024" → See "Strong" indicator (green)

2. **Autofill Demo** (manual):
   - Click extension icon
   - Click "Generate Secure Password"
   - Click "Autofill Demo"
   - Watch fields highlight and fill automatically
   - See success banner appear

## 🔧 Troubleshooting

**Extension not loading?**
- Make sure all four files are in the same directory
- Check that Developer mode is enabled
- Look for errors in `chrome://extensions/`

**Password strength not showing?**
- Check browser console for errors (F12)
- Ensure the page has `<input type="password">` fields
- Try refreshing the page after loading the extension

**Autofill not working?**
- Make sure you've generated a password first
- Check that the page has visible form fields
- View console logs for security warnings (HTTP vs HTTPS)

## 📄 License

This is a demo project for educational purposes.
