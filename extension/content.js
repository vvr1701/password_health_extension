function checkPasswordStrength(password) {
  if (!password) {
    return { strength: 'Weak', color: '#ef4444' };
  }
  
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  const characterTypes = [hasUppercase, hasLowercase, hasNumber, hasSymbol].filter(Boolean).length;
  
  if (length < 8 || characterTypes <= 1) {
    return { strength: 'Weak', color: '#ef4444' };
  } else if (length >= 8 && length <= 11 && characterTypes >= 2) {
    return { strength: 'Moderate', color: '#f59e0b' };
  } else if (length >= 12 && characterTypes >= 4) {
    return { strength: 'Strong', color: '#10b981' };
  } else if (length >= 12 && characterTypes >= 3) {
    return { strength: 'Moderate', color: '#f59e0b' };
  } else {
    return { strength: 'Moderate', color: '#f59e0b' };
  }
}

function createStrengthIndicator(inputField) {
  const existingIndicator = inputField.nextElementSibling?.classList.contains('password-strength-indicator');
  if (existingIndicator) {
    return inputField.nextElementSibling;
  }
  
  const indicator = document.createElement('div');
  indicator.className = 'password-strength-indicator';
  indicator.style.cssText = `
    margin-top: 5px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    transition: all 0.3s ease;
    font-family: Arial, sans-serif;
  `;
  
  inputField.parentNode.insertBefore(indicator, inputField.nextSibling);
  return indicator;
}

function updateStrengthIndicator(inputField) {
  const indicator = createStrengthIndicator(inputField);
  const { strength, color } = checkPasswordStrength(inputField.value);
  
  indicator.textContent = inputField.value ? `Password Strength: ${strength}` : '';
  indicator.style.backgroundColor = inputField.value ? color : 'transparent';
  indicator.style.color = '#ffffff';
}

function initPasswordHealthCheck() {
  const passwordFields = document.querySelectorAll('input[type="password"]');
  
  passwordFields.forEach(field => {
    if (field.dataset.passwordCheckerInitialized) {
      return;
    }
    
    field.dataset.passwordCheckerInitialized = 'true';
    
    createStrengthIndicator(field);
    
    field.addEventListener('input', () => {
      updateStrengthIndicator(field);
    });
    
    if (field.value) {
      updateStrengthIndicator(field);
    }
  });
}

function findUsernameField() {
  const selectors = [
    'input[autocomplete="username"]',
    'input[autocomplete="email"]',
    'input[name="email"]',
    'input[name="user"]',
    'input[name="username"]',
    'input[id="username"]',
    'input[id="email"]',
    'input[type="email"]',
    'input[type="text"][name*="user"]',
    'input[type="text"][id*="user"]',
    'input[type="text"]'
  ];
  
  for (const selector of selectors) {
    const field = document.querySelector(selector);
    if (field && field.offsetParent !== null) {
      return field;
    }
  }
  
  return null;
}

function findPasswordField() {
  const passwordFields = document.querySelectorAll('input[type="password"]');
  for (const field of passwordFields) {
    if (field.offsetParent !== null) {
      return field;
    }
  }
  return passwordFields[0] || null;
}

function highlightField(field) {
  const originalBackground = field.style.backgroundColor;
  const originalTransition = field.style.transition;
  
  field.style.transition = 'background-color 0.3s ease';
  field.style.backgroundColor = '#fef08a';
  
  setTimeout(() => {
    field.style.backgroundColor = '#bef264';
  }, 200);
  
  setTimeout(() => {
    field.style.backgroundColor = originalBackground;
    setTimeout(() => {
      field.style.transition = originalTransition;
    }, 500);
  }, 700);
}

function showSuccessBanner() {
  const banner = document.createElement('div');
  banner.textContent = '✓ Credentials Injected!';
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    z-index: 999999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease;
    font-family: Arial, sans-serif;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(banner);
  
  setTimeout(() => {
    banner.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  }, 2000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autofill') {
    const protocol = window.location.protocol;
    
    console.log(`[Security Check] Page protocol: ${protocol}`);
    
    if (protocol !== 'https:' && protocol !== 'file:' && !window.location.hostname.includes('localhost')) {
      console.warn('[Security Warning] Autofill blocked: Page is not using HTTPS. Credentials should only be injected into secure connections.');
      alert('Security Warning: This page is not using HTTPS. For security reasons, credentials should only be entered on secure (HTTPS) pages.');
      return;
    }
    
    console.log('[Security Check] Passed - proceeding with autofill');
    
    const usernameField = findUsernameField();
    const passwordField = findPasswordField();
    
    if (usernameField) {
      usernameField.value = request.username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      usernameField.dispatchEvent(new Event('change', { bubbles: true }));
      highlightField(usernameField);
    }
    
    if (passwordField) {
      passwordField.value = request.password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
      updateStrengthIndicator(passwordField);
      highlightField(passwordField);
    }
    
    if (usernameField || passwordField) {
      showSuccessBanner();
    }
  }
});

initPasswordHealthCheck();

let observerTimeout;
const observer = new MutationObserver(() => {
  clearTimeout(observerTimeout);
  observerTimeout = setTimeout(() => {
    initPasswordHealthCheck();
  }, 100);
});

if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}
