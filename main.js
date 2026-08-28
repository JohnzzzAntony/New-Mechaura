// Register Service Worker for rapid caching & offline support
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
            console.log('[Mechaura] Service Worker active:', reg.scope);
        }).catch((err) => {
            console.warn('[Mechaura] Service Worker registration failed:', err);
        });
    });
}

// Global cache management utility (run in console: clearMechauraCache())
window.clearMechauraCache = async function () {
    if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let reg of regs) await reg.unregister();
    }
    if ('caches' in window) {
        const keys = await caches.keys();
        for (let key of keys) await caches.delete(key);
    }
    console.log('[Mechaura] Cache successfully cleared.');
    window.location.reload(true);
};

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {

    const isMobile = window.innerWidth <= 768;
    const hasVisited = sessionStorage.getItem('mechaura_visited');
    const loader = document.querySelector('.loader');

    // Dismiss loader immediately on mobile or returning visits
    if (isMobile || hasVisited || !loader) {
        if (loader) loader.style.display = 'none';
        document.body.classList.remove('loading');
    } else {
        sessionStorage.setItem('mechaura_visited', 'true');
        // Fast entrance for first desktop visit
        setTimeout(() => {
            if (loader) {
                loader.style.opacity = '0';
                loader.style.visibility = 'hidden';
            }
            document.body.classList.remove('loading');
        }, 350);
    }

    // If GSAP is unavailable the hero copy is already visible via CSS
    if (typeof gsap === 'undefined') {
        document.body.classList.remove('loading');
        return;
    }

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. Lenis Smooth Scroll Setup (Desktop Only for max mobile performance)
    // ==========================================
    if (!isMobile && typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.1,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0, 0);
    }

    // ==========================================
    // 2. Custom Cursor (Desktop Only)
    // ==========================================
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (window.innerWidth > 1024 && cursor) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        gsap.to({}, 0.016, {
            repeat: -1,
            onRepeat: function () {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;

                gsap.set(follower, {
                    css: { left: posX, top: posY }
                });
                gsap.set(cursor, {
                    css: { left: mouseX, top: mouseY }
                });
            }
        });

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover effects on links/buttons
        const interactiveElements = document.querySelectorAll('a, button, .service-row, .prod-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }

    // ==========================================
    // 4. Navbar Background on Scroll
    // ==========================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================
    // 5. Mobile Menu Logic
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    const mobOverlay = document.querySelector('.mob-overlay');
    const mobClose = document.querySelector('.mob-close');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobOverlay.classList.add('active');
        });
    }
    if (mobClose) {
        mobClose.addEventListener('click', () => {
            mobOverlay.classList.remove('active');
        });
    }
    mobLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobOverlay.classList.remove('active');
        });
    });

    // ==========================================
    // 6. Text Split & Reveal Animations
    // ==========================================
    // We use SplitType to split headings into lines
    const splitTexts = document.querySelectorAll('.reveal-text');

    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'lines, words' });

        gsap.from(split.words, {
            scrollTrigger: {
                trigger: text,
                start: 'top 85%',
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
        });
    });

    // Wrap single lines for overflow hidden reveal
    splitTexts.forEach(el => {
        el.querySelectorAll('.line').forEach(line => {
            const wrapper = document.createElement('div');
            wrapper.style.overflow = 'hidden';
            line.parentNode.insertBefore(wrapper, line);
            wrapper.appendChild(line);
        });
    });

    // General fade reveals
    gsap.utils.toArray('.reveal-fade').forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                start: 'top 85%',
            },
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Staggered lists/cards
    gsap.utils.toArray('.services, .products, .industries, .why-section, .process-section, .insights-section').forEach(section => {
        const items = section.querySelectorAll('.stagger-fade');
        if (items.length > 0) {
            gsap.from(items, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });
        }
    });

    // ==========================================
    // 7. Parallax Image Reveal
    // ==========================================
    gsap.utils.toArray('.parallax-img-container').forEach(container => {
        const img = container.querySelector('img');

        // Parallax effect
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // ==========================================
    // 8. Products Swiper Setup
    // ==========================================
    // Swiper only ships on pages that use the carousel — guard so the rest of
    // this script still runs everywhere else.
    if (typeof Swiper !== 'undefined' && document.querySelector('.products-swiper')) {
        new Swiper('.products-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                640: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 }
            }
        });
    }

    // ==========================================
    // 8b. Static Product Gallery (generated product pages)
    // ==========================================
    const galleryThumbs = document.getElementById('product-thumbs');
    const galleryMain = document.getElementById('product-img');

    if (galleryThumbs && galleryMain) {
        const buttons = Array.from(galleryThumbs.querySelectorAll('.pd-thumb'));
        const label = document.getElementById('product-view-label');
        const baseAlt = (galleryMain.alt || '').split(' — ')[0];

        buttons.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                const src = btn.dataset.src;
                const view = btn.dataset.label || '';
                galleryMain.src = src;
                galleryMain.alt = `${baseAlt} — ${view}`;
                if (label) label.innerText = `${view} · ${i + 1} / ${buttons.length}`;
                buttons.forEach((b) => b.classList.toggle('active', b === btn));
            });
        });
    }

    // ==========================================
    // 9. FAQ Accordion Interaction
    // ==========================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Close all items
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('.faq-question');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                });
                // Toggle clicked item
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

});

