const initializeMenu = () => {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  if (!toggle || !links) {
    return;
  }

  const setOpen = (open) => {
    links.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };

  toggle.addEventListener('click', () => setOpen(!links.classList.contains('is-open')));
  links.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav')) {
      setOpen(false);
    }
  });
};

// The light along the edges only runs on what is on screen: it saves the
// battery of a phone.
const initializeEdgeLight = () => {
  const blocks = document.querySelectorAll(
    '.skill-card, .project-card, .stat, .contact-box, .hero__photo, .gallery-item, #contact'
  );

  if (!('IntersectionObserver' in window)) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('in-view', entry.isIntersecting));
  });

  blocks.forEach((block) => observer.observe(block));
};

const initializePortfolio = () => {
  const whatsappToggle = document.querySelector('.whatsapp-toggle');
  const whatsappClose = document.querySelector('.whatsapp-close');
  const whatsappChat = document.querySelector('.whatsapp-chat');
  const whatsappInput = document.querySelector('#whatsapp-message');
  const whatsappStatus = document.querySelector('.whatsapp-status');
  const whatsappLink = document.querySelector('.contact-direct__link[data-channel="whatsapp"]');
  const emailLink = document.querySelector('.contact-direct__link[data-channel="email"]');
  const whatsappNumber = '2250555585675';
  const contactEmail = 'etsin.ekohdev@gmail.com';
  const defaultMessage = 'Bonjour ETSIN EKOH, je viens de voir votre portfolio et je souhaiterais échanger avec vous.';
  const emailSubject = 'Message depuis le portfolio';

  const contactForm = document.querySelector('.contact-form');
  const contactFormStatus = document.querySelector('.contact-form__status');

  if (contactForm && contactFormStatus) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const formData = new FormData(contactForm);

      submitButton.disabled = true;
      contactFormStatus.textContent = 'Envoi en cours...';
      contactFormStatus.className = 'contact-form__status is-loading';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Formspree request failed');
        }

        contactForm.reset();
        contactFormStatus.textContent = 'Message envoyé avec succès.';
        contactFormStatus.className = 'contact-form__status is-success';
      } catch (error) {
        contactFormStatus.textContent = 'Impossible d’envoyer le message. Réessaie plus tard.';
        contactFormStatus.className = 'contact-form__status is-error';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  const setChatState = (isOpen) => {
    whatsappChat.classList.toggle('is-open', isOpen);
    whatsappChat.setAttribute('aria-hidden', String(!isOpen));
    whatsappToggle.setAttribute('aria-expanded', String(isOpen));
  };

  if (whatsappToggle && whatsappClose && whatsappChat && whatsappInput && whatsappStatus && whatsappLink && emailLink) {
    whatsappToggle.addEventListener('click', () => {
      setChatState(!whatsappChat.classList.contains('is-open'));
    });

    whatsappClose.addEventListener('click', () => setChatState(false));

    const channelStatus = {
      whatsapp: 'WhatsApp s’ouvre : appuyez sur « Envoyer » pour me transmettre votre message.',
      email: 'Votre messagerie s’ouvre : il ne reste qu’à envoyer l’e-mail.'
    };

    const updateContactLinks = () => {
      const message = encodeURIComponent(whatsappInput.value.trim() || defaultMessage);
      whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${message}`;
      emailLink.href = `mailto:${contactEmail}?subject=${encodeURIComponent(emailSubject)}&body=${message}`;
    };

    whatsappInput.addEventListener('input', updateContactLinks);
    [whatsappLink, emailLink].forEach((link) => {
      link.addEventListener('click', () => {
        whatsappStatus.textContent = channelStatus[link.dataset.channel];
      });
    });
    updateContactLinks();
  }

  const codeRain = document.querySelector('.code-rain');

  if (codeRain && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const context = codeRain.getContext('2d');
    const characters = '01{}[]<>/\\\\=+*#$%ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    let columns = 0;
    let drops = [];

    const resizeCodeRain = () => {
      const scale = window.devicePixelRatio || 1;
      codeRain.width = window.innerWidth * scale;
      codeRain.height = window.innerHeight * scale;
      codeRain.style.width = `${window.innerWidth}px`;
      codeRain.style.height = `${window.innerHeight}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      columns = Math.ceil(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -window.innerHeight / fontSize);
    };

    const drawCodeRain = () => {
      context.fillStyle = 'rgba(11, 20, 37, 0.12)';
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      context.font = `${fontSize}px monospace`;

      drops.forEach((drop, column) => {
        const character = characters[Math.floor(Math.random() * characters.length)];
        const x = column * fontSize;
        const y = drop * fontSize;
        context.fillStyle = column % 7 === 0 ? 'rgba(200, 218, 232, 0.65)' : 'rgba(144, 176, 199, 0.4)';
        context.fillText(character, x, y);

        if (y > window.innerHeight && Math.random() > 0.975) {
          drops[column] = 0;
        } else {
          drops[column] += 0.45;
        }
      });

      window.requestAnimationFrame(drawCodeRain);
    };

    window.addEventListener('resize', resizeCodeRain);
    resizeCodeRain();
    drawCodeRain();
  }

  const revealElements = document.querySelectorAll(
    '.section, .skill-card, .project-card, .timeline__item, .contact-box, .gallery-item, .lightbox-trigger--about'
  );

  revealElements.forEach((element) => {
    element.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  const profileDialog = document.querySelector('#profile-dialog');
  const profileTriggers = document.querySelectorAll('.profile-trigger');
  const profileClose = document.querySelector('.profile-dialog__close');

  if (profileDialog && profileClose && typeof profileDialog.showModal === 'function') {
    profileTriggers.forEach((trigger) => {
      trigger.addEventListener('click', () => profileDialog.showModal());
    });

    profileClose.addEventListener('click', () => profileDialog.close());

    profileDialog.addEventListener('click', (event) => {
      if (event.target === profileDialog) {
        profileDialog.close();
      }
    });
  }
};

const initializeLightbox = () => {
  const lightbox = document.querySelector('#lightbox');
  const triggers = Array.from(document.querySelectorAll('.lightbox-trigger'));

  if (!lightbox || triggers.length === 0 || typeof lightbox.showModal !== 'function') {
    return;
  }

  const stage = lightbox.querySelector('.lightbox__stage');
  const image = lightbox.querySelector('.lightbox__image');
  const counter = lightbox.querySelector('.lightbox__counter');
  const caption = lightbox.querySelector('.lightbox__caption');
  const level = lightbox.querySelector('.lightbox__level');
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const ZOOM_STEP = 1.25;
  const pointers = new Map();
  let currentIndex = 0;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let gesture = null;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const clampOffsets = () => {
    const maxX = Math.max(0, (image.offsetWidth * scale - stage.clientWidth) / 2);
    const maxY = Math.max(0, (image.offsetHeight * scale - stage.clientHeight) / 2);
    offsetX = clamp(offsetX, -maxX, maxX);
    offsetY = clamp(offsetY, -maxY, maxY);
  };

  const render = () => {
    clampOffsets();
    image.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    image.classList.toggle('is-zoomed', scale > MIN_SCALE);
    level.textContent = `${Math.round(scale * 100)} %`;
  };

  const setScale = (nextScale) => {
    scale = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    if (scale === MIN_SCALE) {
      offsetX = 0;
      offsetY = 0;
    }
    render();
  };

  const show = (index) => {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    const thumbnail = trigger.querySelector('img');
    const figcaption = trigger.closest('figure')?.querySelector('figcaption');
    image.src = trigger.dataset.full || thumbnail.src;
    image.alt = thumbnail.alt;
    caption.textContent = figcaption ? figcaption.textContent : thumbnail.alt;
    counter.textContent = `${currentIndex + 1} / ${triggers.length}`;
    setScale(MIN_SCALE);
  };

  const actions = {
    in: () => setScale(scale * ZOOM_STEP),
    out: () => setScale(scale / ZOOM_STEP),
    reset: () => setScale(MIN_SCALE),
    prev: () => show(currentIndex - 1),
    next: () => show(currentIndex + 1),
    close: () => lightbox.close()
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      show(index);
      lightbox.showModal();
    });
  });

  lightbox.addEventListener('click', (event) => {
    const button = event.target.closest('[data-zoom], [data-action]');
    if (button) {
      actions[button.dataset.zoom || button.dataset.action]();
    } else if (event.target === stage || event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox.addEventListener('keydown', (event) => {
    const keyActions = { ArrowLeft: 'prev', ArrowRight: 'next', '+': 'in', '=': 'in', '-': 'out', 0: 'reset' };
    const action = keyActions[event.key];
    if (action) {
      event.preventDefault();
      actions[action]();
    }
  });

  stage.addEventListener('wheel', (event) => {
    event.preventDefault();
    setScale(event.deltaY < 0 ? scale * ZOOM_STEP : scale / ZOOM_STEP);
  }, { passive: false });

  image.addEventListener('dblclick', () => setScale(scale > MIN_SCALE ? MIN_SCALE : 2.5));

  const distanceBetweenPointers = () => {
    const [first, second] = [...pointers.values()];
    return Math.hypot(first.x - second.x, first.y - second.y);
  };

  image.addEventListener('pointerdown', (event) => {
    image.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    gesture = pointers.size === 2
      ? { type: 'pinch', distance: distanceBetweenPointers(), scale }
      : { type: 'pan', x: event.clientX - offsetX, y: event.clientY - offsetY };
  });

  image.addEventListener('pointermove', (event) => {
    if (!pointers.has(event.pointerId) || !gesture) {
      return;
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (gesture.type === 'pinch' && pointers.size === 2) {
      setScale(gesture.scale * (distanceBetweenPointers() / gesture.distance));
    } else if (gesture.type === 'pan' && scale > MIN_SCALE) {
      image.classList.add('is-dragging');
      offsetX = event.clientX - gesture.x;
      offsetY = event.clientY - gesture.y;
      render();
    }
  });

  const endPointer = (event) => {
    pointers.delete(event.pointerId);
    image.classList.remove('is-dragging');
    gesture = null;
  };

  image.addEventListener('pointerup', endPointer);
  image.addEventListener('pointercancel', endPointer);
};

const initializeCardGlow = () => {
  const canHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canHover || prefersReducedMotion) {
    return;
  }

  document.querySelectorAll('.skill-card, .project-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--glow-y', `${event.clientY - rect.top}px`);
    });
  });
};

// Depth under the pointer. Nothing on a touch screen: the photo breathes there.
const initializePhotoTilt = () => {
  const canHover = window.matchMedia('(hover: hover)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canHover || prefersReducedMotion) {
    return;
  }

  document.querySelectorAll('.gallery-item .lightbox-trigger, .lightbox-trigger--about').forEach((photo) => {
    photo.addEventListener('pointermove', (event) => {
      const box = photo.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      photo.style.setProperty('--tilt-x', `${(y * -8).toFixed(2)}deg`);
      photo.style.setProperty('--tilt-y', `${(x * 8).toFixed(2)}deg`);
    });
    photo.addEventListener('pointerleave', () => {
      photo.style.removeProperty('--tilt-x');
      photo.style.removeProperty('--tilt-y');
    });
  });
};

document.documentElement.classList.add('js');
initializeMenu();
initializeEdgeLight();
initializePortfolio();
initializeLightbox();
initializeCardGlow();
initializePhotoTilt();
