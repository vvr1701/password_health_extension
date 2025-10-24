let generatedPassword = '';

function getSecureRandomInt(max) {
  if (max <= 0) {
    throw new Error('max must be greater than 0');
  }
  
  const randomBuffer = new Uint32Array(1);
  const maxRange = 0x100000000;
  const maxValidValue = Math.floor(maxRange / max) * max;
  
  let randomValue;
  do {
    window.crypto.getRandomValues(randomBuffer);
    randomValue = randomBuffer[0];
  } while (randomValue >= maxValidValue);
  
  return randomValue % max;
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSecurePassword() {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  const length = 16;
  
  let password = '';
  
  password += uppercase[getSecureRandomInt(uppercase.length)];
  password += lowercase[getSecureRandomInt(lowercase.length)];
  password += numbers[getSecureRandomInt(numbers.length)];
  password += symbols[getSecureRandomInt(symbols.length)];
  
  for (let i = password.length; i < length; i++) {
    password += allChars[getSecureRandomInt(allChars.length)];
  }
  
  password = shuffleArray(password.split('')).join('');
  
  return password;
}

document.getElementById('generateBtn').addEventListener('click', () => {
  generatedPassword = generateSecurePassword();
  document.getElementById('passwordDisplay').textContent = generatedPassword;
});

document.getElementById('autofillBtn').addEventListener('click', async () => {
  if (!generatedPassword) {
    generatedPassword = generateSecurePassword();
    document.getElementById('passwordDisplay').textContent = generatedPassword;
  }
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'autofill',
    username: 'demoUser',
    password: generatedPassword
  });
});
