// ============================================================
// TOKEN ENCRYPTION UTILITIES
// AES-256-GCM encryption for Square OAuth tokens
// ============================================================
// SECURITY REQUIREMENTS:
// - Tokens encrypted at rest with SQUARE_ENCRYPTION_KEY
// - IV + AuthTag stored with ciphertext (required for GCM)
// - Key versioning for rotation support
// - NEVER use NEXT_PUBLIC_* for Square secrets
// ============================================================

import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;
const VERSION_LENGTH = 1; // 1 byte for key version (0-255)

// Current encryption key version (increment when rotating keys)
const CURRENT_KEY_VERSION = 1;

/**
 * Encryption key registry - supports key rotation
 * Add old keys here when rotating to allow decryption of old tokens
 */
interface KeyConfig {
  key: string | undefined;
  deprecated?: boolean;
}

function getKeyRegistry(): Record<number, KeyConfig> {
  return {
    // Version 1: Current key
    1: { key: process.env.SQUARE_ENCRYPTION_KEY },
    // When rotating, add version 2 and mark version 1 as deprecated:
    // 2: { key: process.env.SQUARE_ENCRYPTION_KEY_V2 },
    // 1: { key: process.env.SQUARE_ENCRYPTION_KEY, deprecated: true },
  };
}

/**
 * Get encryption key for a specific version
 */
function getEncryptionKey(version: number = CURRENT_KEY_VERSION): Buffer {
  const registry = getKeyRegistry();
  const config = registry[version];
  
  if (!config || !config.key) {
    throw new Error(`SQUARE_ENCRYPTION_KEY (version ${version}) is not set`);
  }
  
  const key = config.key;
  
  // Must be a 32-byte (64 hex chars) key
  if (key.length !== 64 || !/^[0-9a-fA-F]+$/.test(key)) {
    throw new Error(
      'SQUARE_ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes). ' +
      'Generate with: openssl rand -hex 32'
    );
  }
  
  return Buffer.from(key, 'hex');
}

/**
 * Encrypted token format (all base64 encoded):
 * [version:1][iv:16][authTag:16][ciphertext:N]
 * 
 * Version byte allows key rotation - old tokens can still be decrypted
 * with their original key version.
 */
export interface EncryptedToken {
  ciphertext: string; // Base64: version + iv + authTag + encrypted data
  keyVersion: number;
}

/**
 * Encrypt a token string using AES-256-GCM
 * Returns base64 encoded string: Version + IV + AuthTag + Ciphertext
 */
export function encryptToken(plaintext: string): string {
  if (!plaintext) {
    throw new Error('Cannot encrypt empty token');
  }
  
  const key = getEncryptionKey(CURRENT_KEY_VERSION);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  const authTag = cipher.getAuthTag();
  
  // Combine: Version (1) + IV (16) + AuthTag (16) + Encrypted data
  const versionByte = Buffer.alloc(VERSION_LENGTH);
  versionByte.writeUInt8(CURRENT_KEY_VERSION, 0);
  
  const combined = Buffer.concat([versionByte, iv, authTag, encrypted]);
  
  return combined.toString('base64');
}

/**
 * Decrypt a token string encrypted with encryptToken
 * Automatically handles key versioning for rotation support
 */
export function decryptToken(encryptedBase64: string): string {
  if (!encryptedBase64) {
    throw new Error('Cannot decrypt empty token');
  }
  
  const combined = Buffer.from(encryptedBase64, 'base64');
  
  // Extract version (first byte)
  const version = combined.readUInt8(0);
  
  // Get the key for this version
  const key = getEncryptionKey(version);
  
  // Extract components
  const iv = combined.subarray(VERSION_LENGTH, VERSION_LENGTH + IV_LENGTH);
  const authTag = combined.subarray(
    VERSION_LENGTH + IV_LENGTH, 
    VERSION_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH
  );
  const encrypted = combined.subarray(VERSION_LENGTH + IV_LENGTH + AUTH_TAG_LENGTH);
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

/**
 * Check if a token was encrypted with a deprecated key version
 * Used to identify tokens that should be re-encrypted
 */
export function needsReEncryption(encryptedBase64: string): boolean {
  if (!encryptedBase64) return false;
  
  try {
    const combined = Buffer.from(encryptedBase64, 'base64');
    const version = combined.readUInt8(0);
    
    const registry = getKeyRegistry();
    const config = registry[version];
    
    return config?.deprecated === true || version < CURRENT_KEY_VERSION;
  } catch {
    return false;
  }
}

/**
 * Re-encrypt a token with the current key version
 * Use during key rotation to update old tokens
 */
export function reEncryptToken(encryptedBase64: string): string {
  const plaintext = decryptToken(encryptedBase64);
  return encryptToken(plaintext);
}

/**
 * Get the key version used to encrypt a token
 */
export function getTokenKeyVersion(encryptedBase64: string): number {
  if (!encryptedBase64) return 0;
  
  try {
    const combined = Buffer.from(encryptedBase64, 'base64');
    return combined.readUInt8(0);
  } catch {
    return 0;
  }
}

/**
 * Generate a random encryption key (for initial setup)
 * Returns a 64-character hex string (32 bytes)
 */
export function generateEncryptionKey(): string {
  return crypto.randomBytes(KEY_LENGTH).toString('hex');
}

/**
 * Verify that the encryption key is properly configured
 */
export function verifyEncryptionSetup(): boolean {
  try {
    const testData = 'test-token-verification-' + Date.now();
    const encrypted = encryptToken(testData);
    const decrypted = decryptToken(encrypted);
    
    if (decrypted !== testData) {
      return false;
    }
    
    // Verify version is correct
    const version = getTokenKeyVersion(encrypted);
    if (version !== CURRENT_KEY_VERSION) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Encryption setup verification failed:', error);
    return false;
  }
}

/**
 * Get current key version (for logging/debugging)
 */
export function getCurrentKeyVersion(): number {
  return CURRENT_KEY_VERSION;
}
