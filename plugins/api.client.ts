import axios from 'axios';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(() => {
    const api = axios.create({
        baseURL: '/api/konnective',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return {
        provide: {
            apiClient: api,
        },
    };
});
