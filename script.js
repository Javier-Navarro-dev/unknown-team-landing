/* ============================================================
   UNKNOWN TEAM — script.js
   Scroll effects · Particles · AOS · Form
   ============================================================ */

/* ─── CURSOR GLOW ─────────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    window.addEventListener('mousemove', e => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top  = e.clientY + 'px';
    });
}

/* ─── HEADER ON SCROLL ────────────────────────────────────── */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

/* ─── HAMBURGER MENU ──────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
        nav.classList.toggle('open');
        const isOpen = nav.classList.contains('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on nav link click
    nav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
        });
    });
}

/* ─── SMOOTH SCROLL ───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
            e.preventDefault();
            const headerH = header ? header.offsetHeight : 70;
            const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerH;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ─── PARTICLES (canvas) ──────────────────────────────────── */
(function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H, particles;

    function resize() {
        W = canvas.width  = container.clientWidth;
        H = canvas.height = container.clientHeight;
    }

    function createParticles() {
        const count = Math.floor((W * H) / 14000);
        particles = Array.from({ length: count }, () => ({
            x:  Math.random() * W,
            y:  Math.random() * H,
            r:  Math.random() * 1.8 + 0.4,
            vx: (Math.random() - 0.5) * 0.18,
            vy: (Math.random() - 0.5) * 0.18,
            a:  Math.random() * 0.5 + 0.1,
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99,102,241,${(1 - dist / 110) * 0.12})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(148,163,184,${p.a})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
        });

        requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
})();

/* ─── AOS (Animate On Scroll) ─────────────────────────────── */
(function initAOS() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
})();

/* ─── FORM HANDLER ────────────────────────────────────────── */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = '✓ Mensaje enviado';
            btn.style.background = 'linear-gradient(135deg, #10b981, #06b6d4)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3000);
        }, 1200);
    });
}
