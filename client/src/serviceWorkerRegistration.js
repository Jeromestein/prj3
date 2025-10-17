export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    const swUrl = '/sw.js';

    const register = () => {
      navigator.serviceWorker
        .register(swUrl)
        .then(() => {
          console.info('[pwa] service worker registered');
        })
        .catch((error) => {
          console.error('[pwa] service worker registration failed:', error);
        });
    };

    if (import.meta.env.PROD) {
      register();
    } else {
      // Delay in development to ensure Vite dev server is ready
      window.addEventListener('load', register);
    }
  }
};
