// @ts-nocheck
import CryptoJS from "crypto-js";
import LZString from "lz-string";

export const sendEncrypted = async() => {
    let key
    let passwd
    let result
    const salt = CryptoJS.lib.WordArray.random(16)
    const iv = CryptoJS.lib.WordArray.random(16);

    if (!window.configArguments.passwd) {
        passwd = CryptoJS.lib.WordArray.random(32).toString()
        key = CryptoJS.PBKDF2(
            passwd,
            salt,
            {
                keySize: 256 / 32,
                iterations: 300000,
                hasher: CryptoJS.algo.SHA256,
            }
        );

    } else {
        passwd = null
        key = CryptoJS.PBKDF2(
            window.configArguments.passwd,
            salt,
            {
                keySize: 256 / 32,
                iterations: 300000,
                hasher: CryptoJS.algo.SHA256,
            }
        );
    }

    if (window._richEditor._editorArea.innerHTML) {
        result = CryptoJS.AES.encrypt(window._richEditor._editorArea.innerHTML, key, { iv }).toString()
    } else {
        return;
    }


    let data = (await(await fetch("http://localhost:3000/post", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            result,
            expired: window.configArguments.function_expiredAfter().toUTCString(),
            burnAfterRead: window.configArguments.burnAfterRead
        })
    })).json())

    data.salt = salt.toString()
    data.iv = iv.toString();
    data.passwd = passwd
    return LZString.compressToBase64(JSON.stringify(data))
}

export const decrypto = (result, payload, passwd) => {
    const b = JSON.parse(LZString.decompressFromBase64(payload))
    if (! passwd) {
        passwd = b.passwd
    }
    const salt = CryptoJS.enc.Hex.parse(b.salt)
    const iv = CryptoJS.enc.Hex.parse(b.iv)
    const key = CryptoJS.PBKDF2(
        passwd,
        salt,
        {
            keySize: 256 / 32,
            iterations: 300000,
            hasher: CryptoJS.algo.SHA256,
        }
    );
    const decrypted = CryptoJS.AES.decrypt(result, key, { iv }).toString(CryptoJS.enc.Utf8)
    return decrypted
}

export const fetchResult = async (payload) => {
    const b = JSON.parse(LZString.decompressFromBase64(payload))
    return (await (await fetch("http://localhost:3000/get", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: b.insertedId
        })
    })).json()).result
}