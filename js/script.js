const initializePortfolio = () => {
  const whatsappToggle = document.querySelector('.whatsapp-toggle');
  const whatsappClose = document.querySelector('.whatsapp-close');
  const whatsappChat = document.querySelector('.whatsapp-chat');
  const whatsappForm = document.querySelector('.whatsapp-chat__form');
  const whatsappInput = document.querySelector('#whatsapp-message');
  const whatsappStatus = document.querySelector('.whatsapp-status');
  const channelButtons = document.querySelectorAll('.contact-channel__button');
  const whatsappNumber = '2250555585675';
  const contactEmail = 'etsin.ekohdev@gmail.com';
  let selectedChannel = 'whatsapp';

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

  if (whatsappToggle && whatsappClose && whatsappChat && whatsappForm && whatsappInput && whatsappStatus) {
    whatsappToggle.addEventListener('click', () => {
      setChatState(!whatsappChat.classList.contains('is-open'));
    });

    whatsappClose.addEventListener('click', () => setChatState(false));

    const channelStatus = {
      whatsapp: 'WhatsApp s’ouvre : appuyez sur « Envoyer » pour me transmettre votre message.',
      email: 'Votre messagerie s’ouvre : il ne reste qu’à envoyer l’e-mail.'
    };

    channelButtons.forEach((button) => {
      button.addEventListener('click', () => {
        selectedChannel = button.dataset.channel;
        channelButtons.forEach((item) => {
          const isSelected = item === button;
          item.classList.toggle('is-selected', isSelected);
          item.setAttribute('aria-pressed', String(isSelected));
        });
        whatsappStatus.textContent = '';
      });
    });

    whatsappForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const message = whatsappInput.value.trim();

      if (!message) {
        return;
      }

      const encodedMessage = encodeURIComponent(message);

      if (selectedChannel === 'email') {
        window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent('Message depuis le portfolio')}&body=${encodedMessage}`;
      } else {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
      }

      whatsappStatus.textContent = channelStatus[selectedChannel];
      whatsappInput.value = '';
    });
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
