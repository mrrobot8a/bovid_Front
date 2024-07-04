import { environment } from "../../../../../../../environments/enviroments";
import * as CryptoJS from "crypto-js";

export class EncryptionService {

  private static readonly ALGORITMO = environment.algoritmo;

  private static readonly KEY = (environment.key);

  tokenFromUI: string = environment.key;
  iv: string = environment.iv;
  encrypted: any = "";
  decrypted?: string;
  request?: string;
  responce?: string;

  static readonly IV = (environment.iv);
  constructor() {
    this.encryptUsingAES256();
  }

  encryptUsingAES256() {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.iv);
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(this.request), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    this.encrypted = encrypted.toString();
  }


  static decryptData(encryptedData: string): string {

    const secretKey = environment.key;
    const iv = environment.iv;
    const key = CryptoJS.enc.Base64.parse(secretKey);
    const ivBytes = CryptoJS.enc.Base64.parse(iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
