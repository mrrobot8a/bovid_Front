import e from "express";
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


  // static decryptUsingAES256(data: string) {

  //   const secretKey = 'SSjx6Tgf2Gnq9eR/6PbKFk8xurRazLjZufyzbSy5xQk=';
  //   const iv = 'X/rjq0lB/RYLwBzkqbAuSA==';

  //   // Convierte el IV de base64 a un array de bytes
  //   const ivBytes = CryptoJS.enc.Base64.parse(iv);
  //   // Decifra el valor utilizando la misma clave y IV
  //   const decryptedValueBytes = CryptoJS.AES.decrypt('ttDgXkhK4vAs5pj2zP5Oyg==', secretKey, { iv: ivBytes,mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});

  //   console.log('decryptedValueBytes:', decryptedValueBytes.toString(CryptoJS.enc.Utf8));
  //   return decryptedValueBytes.toString(CryptoJS.enc.Utf8);
  // }

  // static decryptUsingAES256( data: string) {
  //    let  _key = CryptoJS.enc.Utf8.parse(this.KEY);
  //    const  _iv = CryptoJS.enc.Utf8.parse(this.IV);


  //   console.log('data:', data);
  //   console.log('_key:', _key);
  //   console.log('_iv:', _iv);
  //   try{

  //     const decrypted = CryptoJS.AES.decrypt(
  //       data, this.KEY, {
  //       keySize: 16,
  //       iv: ,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     }).toString(CryptoJS.enc.Utf8);

  //     console.log('decrypted:', decrypted);

  //     return decrypted;

  //   }catch(e){
  //     console.log('Error en la desencriptación:', e);
  //     return 'vacion';
  //   }




  // }

}
