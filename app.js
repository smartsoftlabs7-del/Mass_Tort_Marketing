/**
 * MASS TORT MARKETING AGENCY - MASTER JAVASCRIPT
 * Capabilities: 3D Interactive Canvas Particles, Magnetic Cursor, Multi-Step Lead Funnel,
 * ROI Calculator, Palette Engine, Animated Counters, and WhatsApp Integration.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. BRAND PALETTE & THEME ENGINE
  // ==========================================
  const paletteToggleBtn = document.getElementById('paletteToggleBtn');
  const mobilePaletteToggle = document.getElementById('mobilePaletteToggle');
  const paletteDrawer = document.getElementById('paletteDrawer');
  const closePaletteBtn = document.getElementById('closePaletteBtn');
  const paletteOptions = document.querySelectorAll('.palette-option');
  const themeDarkBtn = document.getElementById('themeDarkBtn');
  const themeLightBtn = document.getElementById('themeLightBtn');

  // Toggle Palette modal
  function togglePaletteDrawer() {
    if (paletteDrawer) {
      paletteDrawer.classList.toggle('hidden');
    }
  }

  if (paletteToggleBtn) paletteToggleBtn.addEventListener('click', togglePaletteDrawer);
  if (mobilePaletteToggle) mobilePaletteToggle.addEventListener('click', togglePaletteDrawer);
  if (closePaletteBtn) closePaletteBtn.addEventListener('click', togglePaletteDrawer);

  // Switch Theme Palettes
  paletteOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      paletteOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const theme = btn.getAttribute('data-theme');
      
      if (theme === 'blue-gold') {
        document.documentElement.removeAttribute('data-theme-palette');
      } else {
        document.documentElement.setAttribute('data-theme-palette', theme);
      }
      
      // Update canvas colors if initialized
      updateParticleColors();
    });
  });

  // Switch Dark / Light Mode
  if (themeDarkBtn && themeLightBtn) {
    themeDarkBtn.addEventListener('click', () => {
      document.documentElement.removeAttribute('data-theme-mode');
      themeDarkBtn.classList.add('active', 'bg-brand-primary', 'text-white');
      themeLightBtn.classList.remove('active', 'bg-brand-primary', 'text-white');
    });

    themeLightBtn.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme-mode', 'light');
      themeLightBtn.classList.add('active', 'bg-brand-primary', 'text-white');
      themeDarkBtn.classList.remove('active', 'bg-brand-primary', 'text-white');
    });
  }

  // Header scroll appearance
  const header = document.getElementById('mainHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
    
    // Close drawer when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.add('hidden');
      });
    });
  }


  // ==========================================
  // 2. MAGNETIC CUSTOM CURSOR WITH LERP PHYSICS
  // ==========================================
  const cursorDot = document.getElementById('cursorDot');
  const cursorCircle = document.getElementById('cursorCircle');

  if (cursorDot && cursorCircle && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Position inner dot immediately
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Smooth lerp loop for the outer circle
    function animateCursor() {
      const ease = 0.15;
      circleX += (mouseX - circleX) * ease;
      circleY += (mouseY - circleY) * ease;

      cursorCircle.style.transform = `translate(${circleX}px, ${circleY}px)`;
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);

    // Expand on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, select, .service-card, .tort-choice-btn, .glass-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorCircle.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorCircle.classList.remove('cursor-hover');
      });
    });
  }


  // ==========================================
  // 3. 3D INTERACTIVE CANVAS PARTICLE WEB
  // ==========================================
  const canvas = document.getElementById('heroCanvas');
  let ctx = null;
  let particles = [];
  let particleColor1 = '#3b82f6';
  let particleColor2 = '#f59e0b';

  function updateParticleColors() {
    const computed = getComputedStyle(document.documentElement);
    particleColor1 = computed.getPropertyValue('--primary').trim() || '#3b82f6';
    particleColor2 = computed.getPropertyValue('--accent').trim() || '#f59e0b';
  }
  updateParticleColors();

  if (canvas) {
    ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener('resize', () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
        initParticles();
      }
    });

    const mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.size = Math.random() * 2.5 + 1.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.density = Math.random() * 20 + 5;
        this.isAccent = Math.random() > 0.75;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = this.isAccent ? particleColor2 : particleColor1;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce on boundary
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse physics interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            const directionX = forceDirectionX * force * this.density * 0.4;
            const directionY = forceDirectionY * force * this.density * 0.4;

            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }
    }

    function initParticles() {
      particles = [];
      const numberOfParticles = Math.floor((width * height) / 12000);
      const count = Math.min(Math.max(numberOfParticles, 40), 90);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      const maxDistance = 120;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }


  // ==========================================
  // 4. INTERACTIVE MULTI-STEP LEAD FUNNEL
  // ==========================================
  let selectedTort = 'camp-lejeune';
  let selectedTortName = 'Camp Lejeune PACT Act';

  const tortChoiceBtns = document.querySelectorAll('.tort-choice-btn');
  const funnelStepCounter = document.getElementById('funnelStepCounter');
  const funnelProgressBar = document.getElementById('funnelProgressBar');

  const step1 = document.getElementById('funnelStep1');
  const step2 = document.getElementById('funnelStep2');
  const step3 = document.getElementById('funnelStep3');
  const step4 = document.getElementById('funnelStep4');

  const nextToStep2 = document.getElementById('nextToStep2');
  const backToStep1 = document.getElementById('backToStep1');
  const nextToStep3 = document.getElementById('nextToStep3');
  const backToStep2 = document.getElementById('backToStep2');
  const submitFunnelLead = document.getElementById('submitFunnelLead');
  const resetFunnelBtn = document.getElementById('resetFunnelBtn');
  const resultTortName = document.getElementById('resultTortName');

  // Step 1: Select Tort
  tortChoiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tortChoiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTort = btn.getAttribute('data-tort');
      selectedTortName = btn.querySelector('.font-bold')?.innerText || 'Camp Lejeune PACT Act';
    });
  });

  function goToStep(current, next, stepNumber, percent) {
    if (current) current.classList.add('hidden');
    if (next) next.classList.remove('hidden');
    if (funnelStepCounter) funnelStepCounter.innerText = `Step ${stepNumber} of 4`;
    if (funnelProgressBar) funnelProgressBar.style.width = `${percent}%`;
  }

  if (nextToStep2) {
    nextToStep2.addEventListener('click', () => {
      goToStep(step1, step2, 2, 50);
    });
  }

  if (backToStep1) {
    backToStep1.addEventListener('click', () => {
      goToStep(step2, step1, 1, 25);
    });
  }

  if (nextToStep3) {
    nextToStep3.addEventListener('click', () => {
      goToStep(step2, step3, 3, 75);
    });
  }

  if (backToStep2) {
    backToStep2.addEventListener('click', () => {
      goToStep(step3, step2, 2, 50);
    });
  }

  if (submitFunnelLead) {
    submitFunnelLead.addEventListener('click', () => {
      if (resultTortName) {
        resultTortName.innerText = selectedTortName;
      }
      goToStep(step3, step4, 4, 100);
    });
  }

  if (resetFunnelBtn) {
    resetFunnelBtn.addEventListener('click', () => {
      goToStep(step4, step1, 1, 25);
    });
  }


  // ==========================================
  // 5. DOCKET ROI & COST PER RETAINER CALCULATOR
  // ==========================================
  const calcBudgetSlider = document.getElementById('calcBudgetSlider');
  const calcBudgetValue = document.getElementById('calcBudgetValue');
  const calcTortSelect = document.getElementById('calcTortSelect');
  const calcRetainersOutput = document.getElementById('calcRetainersOutput');
  const calcCprOutput = document.getElementById('calcCprOutput');
  const calcDocketValueOutput = document.getElementById('calcDocketValueOutput');

  function calculateDocketYield() {
    if (!calcBudgetSlider || !calcTortSelect) return;

    const budget = parseFloat(calcBudgetSlider.value);
    calcBudgetValue.innerText = `$${budget.toLocaleString()}`;

    const selectedOption = calcTortSelect.options[calcTortSelect.selectedIndex];
    const cpr = parseFloat(selectedOption.getAttribute('data-cpr') || '750');
    const caseValue = parseFloat(selectedOption.getAttribute('data-val') || '185000');

    const retainers = Math.floor(budget / cpr);
    const totalDocketValue = retainers * caseValue;

    if (calcRetainersOutput) calcRetainersOutput.innerText = retainers.toLocaleString();
    if (calcCprOutput) calcCprOutput.innerText = `$${cpr}`;
    if (calcDocketValueOutput) calcDocketValueOutput.innerText = `$${totalDocketValue.toLocaleString()}`;
  }

  if (calcBudgetSlider) calcBudgetSlider.addEventListener('input', calculateDocketYield);
  if (calcTortSelect) calcTortSelect.addEventListener('change', calculateDocketYield);
  calculateDocketYield();


  // ==========================================
  // 6. INTERACTIVE COUNT-UP ANIMATION OBSERVER
  // ==========================================
  const countUpElements = document.querySelectorAll('.count-up');

  function animateValue(obj, start, end, duration, decimals = 0, prefix = '', suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * (end - start) + start;
      obj.innerHTML = `${prefix}${current.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-target') || '0');
          const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';

          animateValue(el, 0, target, 1600, decimals, prefix, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    countUpElements.forEach(el => countObserver.observe(el));
  }


  // ==========================================
  // 7. FLOATING WHATSAPP BUTTON & CHAT POPUP
  // ==========================================
  const whatsappToggleBtn = document.getElementById('whatsappToggleBtn');
  const whatsappPopup = document.getElementById('whatsappPopup');
  const closeWhatsappPopup = document.getElementById('closeWhatsappPopup');

  if (whatsappToggleBtn && whatsappPopup) {
    whatsappToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsappPopup.classList.toggle('hidden');
    });

    if (closeWhatsappPopup) {
      closeWhatsappPopup.addEventListener('click', (e) => {
        e.stopPropagation();
        whatsappPopup.classList.add('hidden');
      });
    }

    document.addEventListener('click', (e) => {
      if (!whatsappPopup.contains(e.target) && !whatsappToggleBtn.contains(e.target)) {
        whatsappPopup.classList.add('hidden');
      }
    });
  }


  // ==========================================
  // 8. CONSULTATION FORM SUBMISSION SIMULATION
  // ==========================================
  const consultationForm = document.getElementById('consultationForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = consultationForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Reserving Docket Allocation...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (formSuccessMessage) {
          formSuccessMessage.classList.remove('hidden');
          consultationForm.reset();
          if (submitBtn) {
            submitBtn.innerHTML = '<span>Strategy Session Reserved ✓</span>';
            submitBtn.classList.remove('btn-accent');
            submitBtn.classList.add('btn-outline');
          }
        }
      }, 900);
    });
  }

});
