import fs from 'fs';
import path from 'path';

const images = [
    {
        src: 'C:/Users/johns/.gemini/antigravity/brain/99610e29-f8b4-45a8-992e-96e031552289/product_air_filter_1777800176160.png',
        dest: 'public/images/industrial_air_filters.png'
    },
    {
        src: 'C:/Users/johns/.gemini/antigravity/brain/99610e29-f8b4-45a8-992e-96e031552289/product_hydraulic_pump_1777800198723.png',
        dest: 'public/images/industrial_hydraulic_pumps.png'
    }
];

images.forEach(img => {
    if (fs.existsSync(img.src)) {
        fs.copyFileSync(img.src, img.dest);
        console.log(`Successfully copied ${path.basename(img.src)} to ${img.dest}`);
    } else {
        console.log(`Source image not found: ${img.src}`);
    }
});
