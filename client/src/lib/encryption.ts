const KEY_PHRASE = import.meta.env.VITE_FRONTEND_ENCRYPTION_KEY ?? 'default-frontend-key-change-me';
const IV = new Uint8Array(16).fill(0);
const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function getCryptoKey(): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.digest('SHA-256', encoder.encode(KEY_PHRASE));
  return window.crypto.subtle.importKey('raw', keyMaterial, 'AES-CBC', false, ['encrypt', 'decrypt']);
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? []);
  return bytes.buffer;
}

export async function encryptField(value: string): Promise<string> {
  const key = await getCryptoKey();
  const encrypted = await window.crypto.subtle.encrypt({
    name: 'AES-CBC',
    iv: IV,
  }, key, encoder.encode(value));

  return bufferToHex(encrypted);
}

export async function decryptField(value: string): Promise<string> {
  try {
    const key = await getCryptoKey();
    const decrypted = await window.crypto.subtle.decrypt({
      name: 'AES-CBC',
      iv: IV,
    }, key, hexToBuffer(value));

    return decoder.decode(decrypted);
  } catch {
    return value;
  }
}

export async function encryptStudentPayload(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string' && value.length > 0) {
      result[key] = await encryptField(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export async function decryptStudentPayload(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string' && value.length > 0) {
      result[key] = await decryptField(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
