// Build SBOX from hex string → Uint8Array
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

const SBOX = hexToBytes(
  '654c6a424b63436b55755a7a53735b7b358c3a818933803b9525982a9023992b' +
  'e5cce8c1c9e0c0e9d5f5d8f8d0f0d9f9a51ca8121ba013a905b50ab803b00bb9' +
  '32883c858d34843d91229c2c94249d2d624a6c454d64446d52725c7c54745d7d' +
  'a11aac151da414ad02b10cbc04b40dbde1c8ecc5cde4c4edd1f1dcfcd4f4ddfd' +
  '368e38828b30833996269a2893209b29664e6841496040695676587850705979' +
  'a61eaa1119a310ab06b608ba00b309bbe6ceeac2cbe3c3ebd6f6dafad3f3dbfb' +
  '318a3e868f37873f92219e2e97279f2f61486e464f67476f51715e7e57775f7f' +
  'a218ae161fa717af01b20ebe07b70fbfe2caeec6cfe7c7efd2f2defed7f7dfff'
);

// Build inverse SBOX automatically
const INV_SBOX = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  INV_SBOX[SBOX[i]] = i;
}

// Text encoder/decoder
const encoder = new TextEncoder();   // UTF-8 encoder
const decoder = new TextDecoder();   // UTF-8 decoder

// Convert Uint8Array <-> hex string
function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}
function hexToUint8Array(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return arr;
}

const shift = 7;

// Encrypt: text → SBOX → Caesar → hex
function encrypt(text) {
  const bytes = encoder.encode(text);              // ASCII/UTF-8 → Uint8Array
  const substituted = bytes.map(b => SBOX[b]);     // Apply SBOX
  const shifted = substituted.map(b => (b + shift) & 0xFF); // Caesar shift
  return bytesToHex(shifted);                      // Return hex string
}

// Decrypt: hex → reverse Caesar → inverse SBOX → text
function decrypt(hex) {
  const bytes = hexToUint8Array(hex);
  const unshifted = bytes.map(b => (b - shift + 256) & 0xFF);
  const restored = unshifted.map(b => INV_SBOX[b]);
  return decoder.decode(restored);                 // Back to string
}
