import CryptoJS from "crypto-js";

// Encrypt a CID using AES
export const encryptCID = (cid: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(cid, secretKey).toString();
};

// Decrypt a CID using AES
export const decryptCID = (encryptedCID: string, secretKey: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedCID, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};
