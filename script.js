document.addEventListener('DOMContentLoaded', () => {
    
    // Auto Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Smooth Scrolling & Mobile Nav Toggle
    const navToggle = document.getElementById('nav_toggle');
    document.querySelectorAll('.nav_links a, .hero_cta, .rail_brand').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(!targetId || targetId === '#' || !targetId.startsWith('#')) return;
            
            e.preventDefault();
            if(navToggle) navToggle.checked = false; 
            
            const target = document.querySelector(targetId);
            if(target) {
                const navHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - (window.innerWidth > 1023 ? navHeight : 20);
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Parallax Hero Engine ---
    const heroSlider = document.querySelector('.hero_slider');
    const navTop = document.querySelector('.nav_top');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.scrollY;
        
        // Navigation fade effect
        if (scrollY > 50) {
            navTop.classList.add('scrolled');
        } else {
            navTop.classList.remove('scrolled');
        }
        
        // Hero Parallax on desktop
        if(window.innerWidth > 1023) {
            if (heroSlider) {
                heroSlider.style.transform = `translateY(${scrollY * 0.4}px) scale(1.02)`;
            }
        }
    });

    // --- Hero Background Carousel ---
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero_slide');
        if (slides.length < 2) return;
        
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 30000);
    }
    initHeroSlider();

    // --- High-End Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-grid-item');
    
    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, entry.target.classList.contains('reveal-delayed') ? 200 : 0);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealOnScroll.observe(el));

    // Lightbox Logic for exact clone presentation
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxVid = document.getElementById('lightbox-vid');
    const closeBtn = document.querySelector('.close-lightbox');
    
    // Select all images and videos from gallery and headband
    const mediaItems = document.querySelectorAll('.masonry_pack img, .masonry_pack video, .head_cell img, .head_cell video, .about_photo');

    mediaItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Check if Image or Video
            if (item.tagName === 'IMG') {
                lightboxVid.style.display = 'none';
                lightboxVid.pause();
                lightboxVid.src = '';
                
                lightboxImg.style.display = 'block';
                lightboxImg.src = item.src;
            } else if (item.tagName === 'VIDEO') {
                lightboxImg.style.display = 'none';
                lightboxImg.src = '';
                
                lightboxVid.style.display = 'block';
                lightboxVid.src = item.src;
                lightboxVid.play();
            }
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxImg.style.display = 'none';
            lightboxVid.src = '';
            lightboxVid.pause();
            lightboxVid.style.display = 'none';
        }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && e.target !== lightboxVid) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Dynamic Aspect Ratio calculation to prevent cropping of user images
    mediaItems.forEach(el => {
        const setAspectClass = (width, height) => {
            const parent = el.closest('.masonry_pack, .head_cell');
            if (!parent) return;
            const ratio = width / height;
            parent.classList.remove('masonry_h5', 'masonry_h4', 'masonry_r4', 'masonry_r3');
            if (ratio > 1.33) parent.classList.add('masonry_h5');
            else if (ratio > 1.0) parent.classList.add('masonry_h4');
            else if (ratio > 0.75) parent.classList.add('masonry_r4');
            else parent.classList.add('masonry_r3');
        };

        if (el.tagName === 'IMG') {
            if (el.complete && el.naturalWidth) {
                setAspectClass(el.naturalWidth, el.naturalHeight);
            } else {
                el.addEventListener('load', () => setAspectClass(el.naturalWidth, el.naturalHeight));
            }
        } else if (el.tagName === 'VIDEO') {
            if (el.readyState >= 1) {
                setAspectClass(el.videoWidth, el.videoHeight);
            } else {
                el.addEventListener('loadedmetadata', () => setAspectClass(el.videoWidth, el.videoHeight));
            }
        }
    });
});
