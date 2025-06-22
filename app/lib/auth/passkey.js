// WebAuthn Passkey Authentication for AnonMatch Platform

// WebAuthn Configuration
const WEBAUTHN_CONFIG = {
  rpName: 'AnonMatch',
  rpId: window.location.hostname,
  userVerification: 'preferred',
  authenticatorSelection: {
    authenticatorAttachment: 'platform',
    userVerification: 'preferred',
    requireResidentKey: false
  },
  attestation: 'direct'
};

// WebAuthn Service Class
export class PasskeyService {
  constructor() {
    this.isSupported = this.checkSupport();
  }

  // Check if WebAuthn is supported
  checkSupport() {
    return window.PublicKeyCredential && 
           window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
           window.PublicKeyCredential.isConditionalMediationAvailable;
  }

  // Check if user has platform authenticator
  async isUserVerifyingPlatformAuthenticatorAvailable() {
    try {
      return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error('Error checking platform authenticator:', error);
      return false;
    }
  }

  // Check if conditional mediation is available
  async isConditionalMediationAvailable() {
    try {
      return await window.PublicKeyCredential.isConditionalMediationAvailable();
    } catch (error) {
      console.error('Error checking conditional mediation:', error);
      return false;
    }
  }

  // Generate challenge for registration
  generateChallenge() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return array;
  }

  // Convert array buffer to base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Convert base64 to array buffer
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Register new passkey
  async register(userId, userName, displayName) {
    try {
      if (!this.isSupported) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      const hasPlatformAuthenticator = await this.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!hasPlatformAuthenticator) {
        throw new Error('Platform authenticator not available');
      }

      // Generate challenge
      const challenge = this.generateChallenge();

      // Create user object
      const user = {
        id: this.base64ToArrayBuffer(userId),
        name: userName,
        displayName: displayName
      };

      // Create public key credential options
      const publicKeyOptions = {
        challenge: challenge,
        rp: {
          name: WEBAUTHN_CONFIG.rpName,
          id: WEBAUTHN_CONFIG.rpId
        },
        user: user,
        pubKeyCredParams: [
          {
            type: 'public-key',
            alg: -7 // ES256
          },
          {
            type: 'public-key',
            alg: -257 // RS256
          }
        ],
        timeout: 60000,
        attestation: WEBAUTHN_CONFIG.attestation,
        authenticatorSelection: WEBAUTHN_CONFIG.authenticatorSelection
      };

      // Create credentials
      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      });

      // Extract credential data
      const response = credential.response;
      const clientDataJSON = response.clientDataJSON;
      const attestationObject = response.attestationObject;

      // Return credential data
      return {
        success: true,
        credentialId: this.arrayBufferToBase64(credential.rawId),
        clientDataJSON: this.arrayBufferToBase64(clientDataJSON),
        attestationObject: this.arrayBufferToBase64(attestationObject),
        type: credential.type
      };

    } catch (error) {
      console.error('Error registering passkey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Authenticate with passkey
  async authenticate(userId = null) {
    try {
      if (!this.isSupported) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      const hasPlatformAuthenticator = await this.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!hasPlatformAuthenticator) {
        throw new Error('Platform authenticator not available');
      }

      // Generate challenge
      const challenge = this.generateChallenge();

      // Create assertion options
      const assertionOptions = {
        challenge: challenge,
        rpId: WEBAUTHN_CONFIG.rpId,
        userVerification: WEBAUTHN_CONFIG.userVerification,
        timeout: 60000
      };

      // Add allowCredentials if userId is provided
      if (userId) {
        assertionOptions.allowCredentials = [{
          type: 'public-key',
          id: this.base64ToArrayBuffer(userId),
          transports: ['internal']
        }];
      }

      // Get credentials
      const assertion = await navigator.credentials.get({
        publicKey: assertionOptions
      });

      // Extract assertion data
      const response = assertion.response;
      const clientDataJSON = response.clientDataJSON;
      const authenticatorData = response.authenticatorData;
      const signature = response.signature;
      const userHandle = response.userHandle;

      // Return assertion data
      return {
        success: true,
        credentialId: this.arrayBufferToBase64(assertion.rawId),
        clientDataJSON: this.arrayBufferToBase64(clientDataJSON),
        authenticatorData: this.arrayBufferToBase64(authenticatorData),
        signature: this.arrayBufferToBase64(signature),
        userHandle: userHandle ? this.arrayBufferToBase64(userHandle) : null,
        type: assertion.type
      };

    } catch (error) {
      console.error('Error authenticating with passkey:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Conditional authentication (auto-fill)
  async authenticateConditional() {
    try {
      if (!this.isSupported) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      const hasConditionalMediation = await this.isConditionalMediationAvailable();
      if (!hasConditionalMediation) {
        throw new Error('Conditional mediation not available');
      }

      // Generate challenge
      const challenge = this.generateChallenge();

      // Create assertion options for conditional mediation
      const assertionOptions = {
        challenge: challenge,
        rpId: WEBAUTHN_CONFIG.rpId,
        userVerification: WEBAUTHN_CONFIG.userVerification,
        timeout: 60000
      };

      // Get credentials with conditional mediation
      const assertion = await navigator.credentials.get({
        publicKey: assertionOptions,
        mediation: 'conditional'
      });

      if (!assertion) {
        return {
          success: false,
          error: 'No credential selected'
        };
      }

      // Extract assertion data
      const response = assertion.response;
      const clientDataJSON = response.clientDataJSON;
      const authenticatorData = response.authenticatorData;
      const signature = response.signature;
      const userHandle = response.userHandle;

      // Return assertion data
      return {
        success: true,
        credentialId: this.arrayBufferToBase64(assertion.rawId),
        clientDataJSON: this.arrayBufferToBase64(clientDataJSON),
        authenticatorData: this.arrayBufferToBase64(authenticatorData),
        signature: this.arrayBufferToBase64(signature),
        userHandle: userHandle ? this.arrayBufferToBase64(userHandle) : null,
        type: assertion.type
      };

    } catch (error) {
      console.error('Error with conditional authentication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify passkey registration on server
  async verifyRegistration(credentialData, expectedChallenge) {
    try {
      // This would typically be done on the server side
      // For now, we'll simulate verification
      console.log('Verifying registration:', credentialData);
      
      // In a real implementation, you would:
      // 1. Verify the challenge matches
      // 2. Verify the attestation
      // 3. Store the credential ID
      
      return {
        success: true,
        verified: true,
        credentialId: credentialData.credentialId
      };

    } catch (error) {
      console.error('Error verifying registration:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify passkey authentication on server
  async verifyAuthentication(assertionData, expectedChallenge, storedCredentialId) {
    try {
      // This would typically be done on the server side
      // For now, we'll simulate verification
      console.log('Verifying authentication:', assertionData);
      
      // In a real implementation, you would:
      // 1. Verify the challenge matches
      // 2. Verify the signature
      // 3. Verify the credential ID matches
      
      return {
        success: true,
        verified: true,
        userId: assertionData.userHandle
      };

    } catch (error) {
      console.error('Error verifying authentication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const passkeyService = new PasskeyService();

// Utility functions for passkey management
export const passkeyUtils = {
  // Check if passkey is available
  isAvailable: () => {
    return passkeyService.isSupported;
  },

  // Get passkey status
  getStatus: async () => {
    const hasPlatformAuthenticator = await passkeyService.isUserVerifyingPlatformAuthenticatorAvailable();
    const hasConditionalMediation = await passkeyService.isConditionalMediationAvailable();
    
    return {
      supported: passkeyService.isSupported,
      platformAuthenticator: hasPlatformAuthenticator,
      conditionalMediation: hasConditionalMediation,
      available: passkeyService.isSupported && hasPlatformAuthenticator
    };
  },

  // Format credential ID for display
  formatCredentialId: (credentialId) => {
    if (!credentialId) return '';
    return credentialId.length > 20 ? `${credentialId.slice(0, 10)}...${credentialId.slice(-10)}` : credentialId;
  },

  // Generate user ID from wallet address
  generateUserId: (walletAddress) => {
    // Create a deterministic user ID from wallet address
    const encoder = new TextEncoder();
    const data = encoder.encode(walletAddress);
    return btoa(String.fromCharCode(...new Uint8Array(data)));
  }
}; 