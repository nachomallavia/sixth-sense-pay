// @ts-check
import { defineConfig } from 'astro/config';
import  vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import dotenv from "dotenv";

import db from "@astrojs/db";

import react from "@astrojs/react";

// Carga las variables de .env.local
dotenv.config();

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    output: "server",

    adapter: vercel(),
    integrations: [db(), react()],
    i18n: {
        locales: ["en", "es"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
            redirectToDefaultLocale: false
        }
    },
});