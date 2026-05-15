import crypto from "crypto";

const BACKEND_KEY =
  process.env.BACKEND_ENCRYPTION_KEY ||
  "default-backend-key-change-me";

/**
 * Convert secret key into 32-byte buffer
 * required for AES-256
 */
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(BACKEND_KEY)
  .digest();

const IV_LENGTH = 16;

/**
 * =========================================
 * LEVEL 2 BACKEND ENCRYPTION
 * =========================================
 *
 * Frontend sends already encrypted data
 * Backend encrypts again before MongoDB
 */

/**
 * Encrypt Data
 */
export function backendEncrypt(level1EncryptedData: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    SECRET_KEY,
    iv
  );

  let encrypted = cipher.update(
    level1EncryptedData,
    "utf8",
    "hex"
  );

  encrypted += cipher.final("hex");

  return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypt Backend Layer
 */
export function backendDecrypt(
  level2EncryptedData: string
): string {
  try {
    const parts = level2EncryptedData.split(":");

    const iv = Buffer.from(parts[0], "hex");

    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      SECRET_KEY,
      iv
    );

    let decrypted = decipher.update(
      encryptedText,
      "hex",
      "utf8"
    );

    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error);
    return level2EncryptedData;
  }
}

/**
 * =========================================
 * SINGLE FIELD ENCRYPTION
 * =========================================
 */

/**
 * Encrypt Individual Field
 */
export function encryptField(value: string): string {
  return backendEncrypt(value);
}

/**
 * Decrypt Individual Field
 */
export function decryptField(
  encryptedValue: string
): string {
  return backendDecrypt(encryptedValue);
}

/**
 * =========================================
 * FULL OBJECT ENCRYPTION
 * =========================================
 */

/**
 * Encrypt Full Student Payload
 */
export function encryptStudentPayload(
  payload: Record<string, any>
): Record<string, any> {
  const encrypted: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (
      typeof value === "string" &&
      value.length > 0
    ) {
      encrypted[key] = backendEncrypt(value);
    } else {
      encrypted[key] = value;
    }
  }

  return encrypted;
}

/**
 * Decrypt Full Student Payload
 */
export function decryptStudentPayload(
  payload: Record<string, any>
): Record<string, any> {
  const decrypted: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (
      typeof value === "string" &&
      value.length > 0
    ) {
      decrypted[key] = backendDecrypt(value);
    } else {
      decrypted[key] = value;
    }
  }

  return decrypted;
}