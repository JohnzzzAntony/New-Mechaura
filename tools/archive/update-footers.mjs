import fs from 'node:fs';

const pages = [
  'about.html', 'services.html', 'products.html', 'sectors.html',
  'blog.html', 'contact.html', 'product-detail.html',
  'delivery-policy.html', 'terms-conditions.html', 'privacy-policy.html', '404.html'
];

const oldFooterCols = `<div class="footer-columns">
                <div class="footer-col">
                  <span class="footer-col-title">Information</span>`;

const newFooterCols = `<div class="footer-columns">
                <div class="footer-col">
                  <button type="button" class="footer-col-title" aria-expanded="false">
                    <span>Information</span>
                    <i class="fa-solid fa-chevron-down footer-col-arrow"></i>
                  </button>`;

for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  let content = fs.readFileSync(page, 'utf8');

  // Replace span titles with button toggles
  content = content.replace(
    /<span class="footer-col-title">Information<\/span>/g,
    `<button type="button" class="footer-col-title" aria-expanded="false">\n                    <span>Information</span>\n                    <i class="fa-solid fa-chevron-down footer-col-arrow"></i>\n                  </button>`
  );

  content = content.replace(
    /<span class="footer-col-title">Legal<\/span>/g,
    `<button type="button" class="footer-col-title" aria-expanded="false">\n                    <span>Legal</span>\n                    <i class="fa-solid fa-chevron-down footer-col-arrow"></i>\n                  </button>`
  );

  content = content.replace(
    /<span class="footer-col-title">Locations Delivered<\/span>/g,
    `<button type="button" class="footer-col-title" aria-expanded="false">\n                    <span>Locations Delivered</span>\n                    <i class="fa-solid fa-chevron-down footer-col-arrow"></i>\n                  </button>`
  );

  fs.writeFileSync(page, content, 'utf8');
  console.log('Updated footer in', page);
}
