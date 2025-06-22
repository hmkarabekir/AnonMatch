import React, { useState } from 'react';

export default function PasskeyLogin({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);

  // Check if WebAuthn is supported
  const isWebAuthnSupported = () => {
    return window.PublicKeyCredential && 
           typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
  };

  const handleRegister = async () => {
    if (!isWebAuthnSupported()) {
      setError('WebAuthn is not supported in your browser. Please use a modern browser or try wallet login.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Generate a random challenge (in production, this would come from the server)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: {
            name: 'Web3 Anonymous Matching',
            id: window.location.hostname
          },
          user: {
            id: new Uint8Array(16),
            name: 'anonymous_user',
            displayName: 'Anonymous User'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 } // ES256
          ],
          authenticatorSelection: {
            userVerification: 'preferred',
            requireResidentKey: false
          },
          timeout: 60000,
          attestation: 'none'
        }
      });

      setStatus('Passkey registered successfully! You can now use it to log in.');
      
      // In production, you would send the credential to your server
      console.log('Credential created:', credential);
      
    } catch (error) {
      console.error('Passkey registration error:', error);
      if (error.name === 'NotAllowedError') {
        setError('Registration cancelled by user.');
      } else if (error.name === 'NotSupportedError') {
        setError('Your device does not support passkeys. Please use wallet login instead.');
      } else {
        setError('Passkey registration failed. Please try again or use wallet login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!isWebAuthnSupported()) {
      setError('WebAuthn is not supported in your browser. Please use wallet login.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      // Generate a random challenge (in production, this would come from the server)
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          timeout: 60000,
          userVerification: 'preferred'
        }
      });

      setStatus('Passkey login successful!');
      
      // In production, you would verify the assertion with your server
      console.log('Assertion received:', assertion);
      
      if (onLogin) {
        onLogin(assertion);
      }
      
    } catch (error) {
      console.error('Passkey login error:', error);
      if (error.name === 'NotAllowedError') {
        setError('Login cancelled by user.');
      } else if (error.name === 'InvalidStateError') {
        setError('No passkey found. Please register a passkey first.');
      } else {
        setError('Passkey login failed. Please try again or use wallet login.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isWebAuthnSupported()) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">WebAuthn Passkey</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            <strong>Not Supported:</strong> Your browser doesn't support WebAuthn passkeys. 
            Please use wallet login instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">WebAuthn Passkey</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-3">
          Passkeys provide secure, passwordless authentication using your device's biometric sensors 
          or PIN. No passwords required!
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            <strong>Security Benefits:</strong>
          </p>
          <ul className="text-sm text-green-700 mt-1 ml-4 list-disc">
            <li>No passwords to remember or type</li>
            <li>Protected by your device's security</li>
            <li>Resistant to phishing attacks</li>
            <li>Works across all your devices</li>
          </ul>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Register Passkey'}
        </button>
        
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : 'Login with Passkey'}
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">{status}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>Passkeys work with Touch ID, Face ID, Windows Hello, or your device PIN.</p>
      </div>
    </div>
  );
} 