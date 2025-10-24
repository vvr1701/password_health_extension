const PASSWORD_CHECKER_INITIALIZED = 'data-pwd-ext-init';
const STRENGTH_INDICATOR_CLASS = 'pwd-ext-strength-indicator';

function checkPasswordStrength(password) {
  if (!password) {
    return { strength: '', color: 'transparent' };
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

function safelyCreateIndicator(inputField) {
  try {
    if (!inputField || !inputField.parentNode) {
      return null;
    }

    const existingIndicator = inputField.parentNode.querySelector(`.${STRENGTH_INDICATOR_CLASS}`);
    if (existingIndicator) {
      return existingIndicator;
    }
    
    const indicator = document.createElement('div');
    indicator.className = STRENGTH_INDICATOR_CLASS;
    indicator.style.cssText = `
      margin-top: 5px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      transition: all 0.3s ease;
      font-family: Arial, sans-serif;
      pointer-events: none;
    `;
    
    if (inputField.nextSibling) {
      inputField.parentNode.insertBefore(indicator, inputField.nextSibling);
    } else {
      inputField.parentNode.appendChild(indicator);
    }
    
    return indicator;
  } catch (error) {
    console.error('[Password Extension] Error creating indicator:', error);
    return null;
  }
}

function safelyUpdateIndicator(inputField) {
  try {
    const indicator = safelyCreateIndicator(inputField);
    if (!indicator) return;
    
    const { strength, color } = checkPasswordStrength(inputField.value);
    
    indicator.textContent = strength ? `Password Strength: ${strength}` : '';
    indicator.style.backgroundColor = color;
    indicator.style.color = strength ? '#ffffff' : 'transparent';
  } catch (error) {
    console.error('[Password Extension] Error updating indicator:', error);
  }
}

function initPasswordField(field) {
  try {
    if (!field || field.getAttribute(PASSWORD_CHECKER_INITIALIZED) === 'true') {
      return;
    }
    
    field.setAttribute(PASSWORD_CHECKER_INITIALIZED, 'true');
    
    safelyCreateIndicator(field);
    
    field.addEventListener('input', function() {
      safelyUpdateIndicator(field);
    }, { passive: true });
    
    if (field.value) {
      safelyUpdateIndicator(field);
    }
  } catch (error) {
    console.error('[Password Extension] Error initializing field:', error);
  }
}

function initPasswordHealthCheck() {
  try {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(initPasswordField);
  } catch (error) {
    console.error('[Password Extension] Error in health check:', error);
  }
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
    'input[type="text"]'
  ];
  
  for (const selector of selectors) {
    try {
      const field = document.querySelector(selector);
      if (field && field.offsetParent !== null) {
        return field;
      }
    } catch (e) {
      continue;
    }
  }
  
  return null;
}

function findPasswordField() {
  try {
    const passwordFields = document.querySelectorAll('input[type="password"]');
    for (const field of passwordFields) {
      if (field.offsetParent !== null) {
        return field;
      }
    }
    return passwordFields[0] || null;
  } catch (error) {
    return null;
  }
}

function highlightField(field) {
  try {
    if (!field) return;
    
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
  } catch (error) {
    console.error('[Password Extension] Error highlighting field:', error);
  }
}

function showSuccessBanner() {
  try {
    const existingBanner = document.querySelector('.pwd-ext-success-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    const banner = document.createElement('div');
    banner.className = 'pwd-ext-success-banner';
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
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      font-family: Arial, sans-serif;
      pointer-events: none;
    `;
    
    document.body.appendChild(banner);
    
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.remove();
      }
    }, 2000);
  } catch (error) {
    console.error('[Password Extension] Error showing banner:', error);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'autofill') {
      const protocol = window.location.protocol;
      
      console.log(`[Password Extension] Protocol check: ${protocol}`);
      
      if (protocol !== 'https:' && protocol !== 'file:' && !window.location.hostname.includes('localhost')) {
        console.warn('[Password Extension] Blocked: Not HTTPS');
        alert('Security Warning: This page is not using HTTPS. Credentials should only be entered on secure pages.');
        return;
      }
      
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
        safelyUpdateIndicator(passwordField);
        highlightField(passwordField);
      }
      
      if (usernameField || passwordField) {
        showSuccessBanner();
      }
    }
  } catch (error) {
    console.error('[Password Extension] Message handler error:', error);
  }
});

try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPasswordHealthCheck);
  } else {
    initPasswordHealthCheck();
  }

  let debounceTimer;
  const observer = new MutationObserver(() => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      initPasswordHealthCheck();
    }, 250);
  });

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
} catch (error) {
  console.error('[Password Extension] Initialization error:', error);
}
