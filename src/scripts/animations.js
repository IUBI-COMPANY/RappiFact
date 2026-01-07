// Intersection Observer para animaciones al hacer scroll
document.addEventListener('DOMContentLoaded', () => {
  // Configuración del observer con mejor threshold
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
  };

  // Callback mejorado con delays escalonados automáticos
  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  };

  // Crear el observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observar elementos con la clase 'scroll-reveal'
  const revealElements = document.querySelectorAll('.scroll-reveal');
  revealElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    el.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(el);
  });

  // Animación específica para cada sección
  const sections = document.querySelectorAll('section');
  sections.forEach((section, sectionIndex) => {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animar título de la sección
          const title = entry.target.querySelector('h2');
          if (title && !title.classList.contains('animated')) {
            title.classList.add('animated', 'animate-fade-in-down');
          }

          // Animar párrafo descriptivo
          const description = entry.target.querySelector('h2 + p, .text-xl');
          if (description && !description.classList.contains('animated')) {
            setTimeout(() => {
              description.classList.add('animated', 'animate-fade-in-up');
            }, 200);
          }

          // Animar elementos hijos con delays escalonados
          const children = entry.target.querySelectorAll('.feature-card, .benefit-card, .pricing-card, .faq-item, [class*="grid"] > div:not(.scroll-reveal)');
          children.forEach((child, index) => {
            if (!child.classList.contains('animated') && !child.classList.contains('scroll-reveal')) {
              setTimeout(() => {
                child.style.opacity = '0';
                child.style.transform = 'translateY(30px)';
                child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                setTimeout(() => {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0)';
                  child.classList.add('animated');
                }, 50);
              }, 100 + (index * 150));
            }
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    sectionObserver.observe(section);
  });

  // Animación de contador para números
  const animateCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-counter'));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;
      let hasAnimated = false;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current).toLocaleString();
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString();
        }
      };

      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            updateCounter();
          }
        });
      }, observerOptions);

      counterObserver.observe(counter);
    });
  };

  animateCounters();

  // Parallax suave para elementos
  let ticking = false;
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  const updateParallax = () => {
    parallaxElements.forEach(el => {
      const speed = el.getAttribute('data-parallax') || 0.5;
      const rect = el.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.style.transform = `translateY(${rate}px)`;
      }
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Animación de hover mejorada para cards
  const cards = document.querySelectorAll('.feature-card, .benefit-card, .pricing-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Efecto de partículas en el cursor (opcional, sutil)
  let mouseX = 0;
  let mouseY = 0;
  let particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.life = 30;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
    }

    draw(ctx) {
      ctx.fillStyle = `rgba(62, 55, 252, ${this.life / 30})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Canvas para partículas (solo en hero)
  const hero = document.querySelector('section');
  if (hero && window.innerWidth > 768) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (Math.random() > 0.8) {
        particles.push(new Particle(mouseX, mouseY));
      }
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter(particle => particle.life > 0);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Smooth scroll mejorado
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Animar iconos individuales con delays
  const icons = document.querySelectorAll('.feature-card svg, .benefit-card svg');
  icons.forEach((icon, index) => {
    const iconObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('icon-animated')) {
          setTimeout(() => {
            entry.target.classList.add('icon-animated', 'animate-scale-in');
            entry.target.style.animationDelay = '0s';
          }, index * 50);
        }
      });
    }, observerOptions);

    iconObserver.observe(icon);
  });

  // Animar listas de features
  const featureLists = document.querySelectorAll('.feature-card ul li, .benefit-card ul li');
  featureLists.forEach((item, index) => {
    const listObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('list-animated')) {
          setTimeout(() => {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateX(-20px)';
            entry.target.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';

            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
              entry.target.classList.add('list-animated');
            }, 50);
          }, index * 80);
        }
      });
    }, observerOptions);

    listObserver.observe(item);
  });

  // Animar badges y etiquetas
  const badges = document.querySelectorAll('[class*="badge"], [class*="rounded-full"]:not(button):not(a)');
  badges.forEach((badge, index) => {
    const badgeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('badge-animated')) {
          setTimeout(() => {
            entry.target.classList.add('badge-animated', 'animate-scale-in');
          }, index * 100);
        }
      });
    }, observerOptions);

    badgeObserver.observe(badge);
  });
});

