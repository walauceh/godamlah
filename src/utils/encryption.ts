import CryptoJS from "crypto-js";

export const encryptCID = (cid: string, secretKey: string): string => {
  // Extract the actual CID string
  const cleanCID = typeof cid === 'object' ? cid['/'] : cid;

  console.log('CID to encrypt:', cid);
  console.log('CID length:', cid.length);
  console.log('CID type:', typeof cid);

  // Validate inputs
  if (!cleanCID) {
    throw new Error('Invalid CID: Empty or undefined');
  }

  try {
    // Ensure the key is encoded in UTF-8
    const utf8Key = CryptoJS.enc.Utf8.parse(secretKey);
    
    return CryptoJS.AES.encrypt(cleanCID, utf8Key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export const decryptCID = (encryptedCID: string, secretKey: string): string => {
  // Validate inputs
  if (!encryptedCID || !secretKey) {
    throw new Error("Encrypted CID and secret key must not be empty");
  }

  try {
    const utf8Key = CryptoJS.enc.Utf8.parse(secretKey);
    
    const bytes = CryptoJS.AES.decrypt(encryptedCID, utf8Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error("Decryption failed");
    }
    
    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};