// @ts-check
import { defineConfig } from 'astro/config';
import  vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    output: "server",

    adapter: vercel(),
    
    integrations: [react()],
    i18n: {
        locales: ["es", "en", "fr"],
        defaultLocale: "en",
    },
});
