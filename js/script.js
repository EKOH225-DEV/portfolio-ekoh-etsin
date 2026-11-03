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
  const defaultMessage = 'Bonjour EKOH, je viens de voir votre portfolio et je souhaiterais échanger avec vous.';
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
    '.section, .skill-card, .project-card, .timeline__item, .contact-box'
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

initializePortfolio();
