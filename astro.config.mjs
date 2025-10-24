// @ts-check
import { defineConfig } from 'astro/config';
import  vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import dotenv from "dotenv";

// Carga las variables de .env.local
dotenv.config();

console.log("REDIS_URL:", process.env.TEST_VAR);

// https://astro.build/config
export default defineConfig({
	vite: {
        plugins: [tailwindcss()],
    },
    output: "server",

    adapter: vercel(),
    session: {
        driver: "redis",
        options: {
          url: process.env.REDIS_URL,
          maxRetriesPerRequest: 1
        }
      },
    // session: {
    //     driver: process.env.REDIS_URL ? "redis" : "memory",
    //     options: process.env.REDIS_URL ? {
    //       url: process.env.REDIS_URL,
    //       maxRetriesPerRequest: 1
    //     } : {}
    //   },
    integrations: [],
    i18n: {
        locales: ["en", "es"],
        defaultLocale: "en",
        routing: {
            prefixDefaultLocale: false,
            redirectToDefaultLocale: false
        }
    },
});
