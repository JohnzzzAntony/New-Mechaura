import { defineConfig } from 'vite'

export default defineConfig({
    // Set base to relative for maximum compatibility (Hostinger & GitHub Pages)
    base: './',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                about: 'about.html',
                services: 'services.html',
                products: 'products.html',
                sectors: 'sectors.html',
                contact: 'contact.html',
                productDetail: 'product-detail.html'
            }
        }
    },
})
