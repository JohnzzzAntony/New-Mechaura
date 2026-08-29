// Register Service Worker for rapid caching & offline support
if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
            console.log('[Mechaura] Service Worker active:', reg.scope);
            // Check for updates on every page load
            reg.update();
            reg.addEventListener('updatefound', () => {
                const newWorker = reg.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[Mechaura] New version found, applying...');
                            window.location.reload();
                        }
                    });
                }
            });
        }).catch((err) => {
            console.warn('[Mechaura] Service Worker registration failed:', err);
        });
    });
}

// Global cache management utility — also callable in console: clearMechauraCache()
window.clearMechauraCache = async function () {
    // 1. Tell the active Service Worker to purge its own CacheStorage
    if ('serviceWorker' in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.active) {
            const channel = new MessageChannel();
            reg.active.postMessage({ action: 'CLEAR_CACHE' }, [channel.port2]);
            await new Promise((resolve) => { channel.port1.onmessage = resolve; });
        }
        // Also unregister so the next load re-installs fresh
        const regs = await navigator.serviceWorker.getRegistrations();
        for (let r of regs) await r.unregister();
    }
    // 2. Purge browser Cache API directly
    if ('caches' in window) {
        const keys = await caches.keys();
        for (let key of keys) await caches.delete(key);
    }
    console.log('[Mechaura] Cache cleared. Reloading…');
    // Hard reload bypassing browser cache
    window.location.reload(true);
};

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

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

    // Mobile fast-path: skip all GSAP entirely — native CSS handles reveals
    if (isMobile) {
        document.body.classList.remove('loading');
        // Ensure all reveal elements are visible without JS
        document.querySelectorAll('.reveal-text, .reveal-fade, .stagger-fade').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
        // Still wire up interactive UI
        _initMenuAndNav();
        _initFaq();
        _initGallery();
        _initFooterAccordion();
        return;
    }

    // If GSAP is unavailable show content immediately
    if (typeof gsap === 'undefined') {
        document.body.classList.remove('loading');
        _initMenuAndNav();
        _initFaq();
        _initGallery();
        _initFooterAccordion();
        return;
    }

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. Lenis Smooth Scroll Setup (Desktop Only)
    // ==========================================
    if (typeof Lenis !== 'undefined') {
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
    // 2. Custom Cursor (Desktop ≥1024px Only)
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

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const interactiveElements = document.querySelectorAll('a, button, .service-row, .prod-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('active'));
            el.addEventListener('mouseleave', () => follower.classList.remove('active'));
        });
    }

    // ==========================================
    // 3. Text Split & Reveal Animations (Desktop)
    // ==========================================
    if (typeof SplitType !== 'undefined') {
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
    }

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
    // 4. Parallax Image Reveal (Desktop Only)
    // ==========================================
    gsap.utils.toArray('.parallax-img-container').forEach(container => {
        const img = container.querySelector('img');

        gsap.to(img, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
                trigger: container,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    });

    // ==========================================
    // 5. Products Swiper Setup
    // ==========================================
    _initSwiper();

    // ==========================================
    // 6. Shared interactive UI
    // ==========================================
    _initMenuAndNav();
    _initFaq();
    _initGallery();
    _initFooterAccordion();

});

// ── Shared interactive helpers (run on both mobile & desktop) ──────────────

function _initMenuAndNav() {
    // Navbar scroll behaviour
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Mobile menu
    const menuBtn = document.querySelector('.menu-btn');
    const mobOverlay = document.querySelector('.mob-overlay');
    const mobClose = document.querySelector('.mob-close');
    const mobLinks = document.querySelectorAll('.mob-link');

    if (menuBtn) menuBtn.addEventListener('click', () => mobOverlay.classList.add('active'));
    if (mobClose) mobClose.addEventListener('click', () => mobOverlay.classList.remove('active'));
    mobLinks.forEach(link => link.addEventListener('click', () => mobOverlay.classList.remove('active')));
}

function _initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => {
                    other.classList.remove('active');
                    const btn = other.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });
                if (!isActive) {
                    item.classList.add('active');
                    questionBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });
}

function _initGallery() {
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
}

function _initSwiper() {
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
}

function _initFooterAccordion() {
    const footerCols = document.querySelectorAll('.footer-col');
    footerCols.forEach(col => {
        const toggleBtn = col.querySelector('.footer-col-title');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                // Only accordion on mobile viewports
                if (window.innerWidth > 768) return;

                const isOpen = col.classList.contains('active');

                // Close other footer columns for clean accordion behavior
                footerCols.forEach(other => {
                    if (other !== col) {
                        other.classList.remove('active');
                        const otherBtn = other.querySelector('.footer-col-title');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                col.classList.toggle('active', !isOpen);
                toggleBtn.setAttribute('aria-expanded', String(!isOpen));
            });
        }
    });
}
