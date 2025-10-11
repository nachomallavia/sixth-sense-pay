export function getLocale() {
    if (localStorage.getItem('locale')){
        return localStorage.getItem('locale')
    }
   
    if (Astro.preferredLocale){
        return Astro.preferredLocale
    } else if (Astro.currentLocale){
        return Astro.currentLocale
    } else {
        return Astro.defaultLocale
    }
}

