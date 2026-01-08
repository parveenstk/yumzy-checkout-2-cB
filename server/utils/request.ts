import routes from './routes';
import api from './apiHandler';
import { useRuntimeConfig } from '#imports';

function objectToQueryParams(obj: Record<string, any>) {
    const params = new URLSearchParams();
    for (const key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            params.append(key, String(obj[key]));
        }
    }
    return params.toString();
}

function getKonnectiveAuth() {
    const config = useRuntimeConfig();
    return {
        loginId: config.konnective.loginId,
        password: config.konnective.password,
        // campaignId: config.public.campaignId,
    };
}

export default async function request(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    routeName: string,
    payload: Record<string, any> = {}
) {
    const url = routes[routeName];
    if (!url) throw new Error(`Route "${routeName}" not found`);

    const authParams = getKonnectiveAuth();
    const data = { ...authParams, ...payload };

    const finalUrl =
        ['post', 'delete'].includes(method) && Object.keys(data).length
            ? `${url}?${objectToQueryParams(data)}`
            : url;

    const response = await api({
        method,
        url: finalUrl,
        data: ['post', 'put', 'patch'].includes(method) ? data : undefined,
    });

    return response;
}
