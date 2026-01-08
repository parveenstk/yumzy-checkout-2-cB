export function encryptData(data: any): string {
    const json = JSON.stringify(data);
    return Buffer.from(json).toString('base64');
}

export function decryptData(base64: string): any {
    const json = Buffer.from(base64, 'base64').toString();
    return JSON.parse(json);
}
