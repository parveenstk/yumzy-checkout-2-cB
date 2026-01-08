import axios from 'axios';

const api = axios.create({
    baseURL: 'https://your-konnective-api-url.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.response.use(
    (res) => res.data,
    (error) => {
        const { status, data } = error.response || {};
        const message = data?.message || 'Unexpected error';
        return Promise.reject({ status, message });
    }
);

export default api;
