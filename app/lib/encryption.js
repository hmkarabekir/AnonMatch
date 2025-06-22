// End-to-End Encryption Utilities
// Uses Web Crypto API for secure message encryption

// Generate a new key pair for a user
export async function generateKeyPair() {
  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, // extractable
      ["encrypt", "decrypt"]
    );
    
    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  } catch (error) {
    console.error('Error generating key pair:', error);
    throw new Error('Anahtar çifti oluşturulamadı');
  }
}

// Export public key to string format for sharing
export async function exportPublicKey(publicKey) {
  try {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  } catch (error) {
    console.error('Error exporting public key:', error);
    throw new Error('Public key export edilemedi');
  }
}

// Import public key from string format
export async function importPublicKey(publicKeyString) {
  try {
    const binaryString = atob(publicKeyString);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return await window.crypto.subtle.importKey(
      "spki",
      bytes,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  } catch (error) {
    console.error('Error importing public key:', error);
    throw new Error('Public key import edilemedi');
  }
}

// Encrypt a message with recipient's public key
export async function encryptMessage(message, recipientPublicKey) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      recipientPublicKey,
      data
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  } catch (error) {
    console.error('Error encrypting message:', error);
    throw new Error('Mesaj şifrelenemedi');
  }
}

// Decrypt a message with user's private key
export async function decryptMessage(encryptedMessage, privateKey) {
  try {
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP"
      },
      privateKey,
      bytes
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Error decrypting message:', error);
    throw new Error('Mesaj çözülemedi');
  }
}

// Generate a symmetric key for session encryption
export async function generateSessionKey() {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error('Error generating session key:', error);
    throw new Error('Session key oluşturulamadı');
  }
}

// Encrypt message with symmetric key (faster for session)
export async function encryptWithSessionKey(message, sessionKey) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      sessionKey,
      data
    );
    
    const encryptedArray = new Uint8Array(encrypted);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv);
    combined.set(encryptedArray, iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Error encrypting with session key:', error);
    throw new Error('Session şifreleme başarısız');
  }
}

// Decrypt message with symmetric key
export async function decryptWithSessionKey(encryptedMessage, sessionKey) {
  try {
    const binaryString = atob(encryptedMessage);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const iv = bytes.slice(0, 12);
    const encryptedData = bytes.slice(12);
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      sessionKey,
      encryptedData
    );
    
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Error decrypting with session key:', error);
    throw new Error('Session çözme başarısız');
  }
}

// Export session key for sharing
export async function exportSessionKey(sessionKey) {
  try {
    const exported = await window.crypto.subtle.exportKey("raw", sessionKey);
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  } catch (error) {
    console.error('Error exporting session key:', error);
    throw new Error('Session key export edilemedi');
  }
}

// Import session key
export async function importSessionKey(sessionKeyString) {
  try {
    const binaryString = atob(sessionKeyString);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    return await window.crypto.subtle.importKey(
      "raw",
      bytes,
      {
        name: "AES-GCM",
        length: 256
      },
      true,
      ["encrypt", "decrypt"]
    );
  } catch (error) {
    console.error('Error importing session key:', error);
    throw new Error('Session key import edilemedi');
  }
}

// Generate a unique chat ID
export function generateChatId() {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Store encryption keys in localStorage (in production, use secure storage)
export function storeKeys(chatId, keys) {
  try {
    const keyData = {
      chatId,
      timestamp: Date.now(),
      keys
    };
    localStorage.setItem(`encryption_keys_${chatId}`, JSON.stringify(keyData));
  } catch (error) {
    console.error('Error storing keys:', error);
  }
}

// Retrieve encryption keys from localStorage
export function getStoredKeys(chatId) {
  try {
    const keyData = localStorage.getItem(`encryption_keys_${chatId}`);
    return keyData ? JSON.parse(keyData) : null;
  } catch (error) {
    console.error('Error retrieving keys:', error);
    return null;
  }
}

// Clear stored keys
export function clearStoredKeys(chatId) {
  try {
    localStorage.removeItem(`encryption_keys_${chatId}`);
  } catch (error) {
    console.error('Error clearing keys:', error);
  }
} 