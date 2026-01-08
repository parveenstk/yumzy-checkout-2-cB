
import { encryptData } from '~~/server/utils/encryption';
import request from '~~/server/utils/request';

export default defineEventHandler(async (event) => {

    const method: string = event.method || 'POST'; // HTTP Method
    const routeName = event.context.params?.route; // dynamic [route].ts
    const headers = event.headers;
    const body = method === 'POST' ? await readBody(event) : {};
    const encrypt = headers.has('x-encrypt');

    try {
        const data = await request(method.toLowerCase() as any, routeName!, body.payload || {});
        // console.log("data from server", data) // for debugging

        return encrypt ? { encrypted: true, data: encryptData(data) } : { encrypted: false, data };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
});
