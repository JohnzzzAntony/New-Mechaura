import fs from 'node:fs';

const pages = [
  'about.html', 'services.html', 'products.html', 'sectors.html',
  'blog.html', 'contact.html', 'product-detail.html',
  'delivery-policy.html', 'terms-conditions.html', 'privacy-policy.html', '404.html'
];

const oldGtmRegex = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?<!-- End Google Tag Manager -->/;

const newGtm = `  <!-- Analytics: deferred until after first paint -->
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    function _loadGTM() {
      var ga = document.createElement('script');
      ga.async = true;
      ga.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18410739502';
      document.head.appendChild(ga);
      gtag('js', new Date());
      gtag('config', 'AW-18410739502');
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
        var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
        j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
        f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-PSF2HX47');
    }
    if (document.readyState === 'complete') { _loadGTM(); }
    else { window.addEventListener('load', _loadGTM); }
  </script>`;

const oldScriptsRegex = /<script defer src="https:\/\/unpkg\.com\/@studio-freight\/lenis[\s\S]*?<script type="module" src="\/main\.js"><\/script>/;

const newScripts = `  <!-- GSAP / Lenis / SplitType: desktop only — mobile gets native CSS -->
  <script>
    (function () {
      if (window.innerWidth <= 768) return;
      var scripts = [
        'https://unpkg.com/@studio-freight/lenis@1.0.39/dist/lenis.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        'https://unpkg.com/split-type'
      ];
      scripts.forEach(function (src) {
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        document.body.appendChild(s);
      });
    })();
  </script>
  <script type="module" src="/main.js"></script>`;

for (const page of pages) {
  if (!fs.existsSync(page)) continue;
  let content = fs.readFileSync(page, 'utf8');
  if (oldGtmRegex.test(content)) {
    content = content.replace(oldGtmRegex, newGtm);
  }
  if (oldScriptsRegex.test(content)) {
    content = content.replace(oldScriptsRegex, newScripts);
  }
  fs.writeFileSync(page, content, 'utf8');
  console.log('Optimized', page);
}
