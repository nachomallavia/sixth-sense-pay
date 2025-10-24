import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
    const { url, params } = context;
    const { locale } = params;
    
    // Only validate routes with [locale] parameter
    if (locale) {
        const validLocales = ["en", "es"];
        
        if (!validLocales.includes(locale)) {
            // Redirect invalid locales to 404
            return context.redirect('/404');
        }
    }
    
    return next();
});
