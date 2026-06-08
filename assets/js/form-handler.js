/* ============================================================
   FORM HANDLER — Universal Contact Form
   Works on:
   1. Hostinger/PHP hosting → sends using send-contact.php
   2. GitHub Pages/static hosting → fallback to mailto
   3. PHP failure/server error → fallback to mailto
   ============================================================ */

const FormHandler = (() => {
  const CONFIG = {
    endpoint: 'send-contact.php',
    fallbackEmail: 'abhishek@docsansar.com',
    requestTimeout: 8000,
    enablePhpSend: true,
    enableMailtoFallback: true
  };

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    addHoneypotField(form);

    form.addEventListener('submit', handleSubmit);

    form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => clearError(field));
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('[type="submit"]');

    if (!validateForm(form)) return;

    const data = getFormData(form);

    setLoading(submitBtn, true);

    try {
      if (CONFIG.enablePhpSend && isLikelyPhpHosting()) {
        const result = await sendUsingPhp(data);

        if (result.success) {
          showSuccess(form, result.message || 'Message sent successfully. I will get back to you soon.');
          form.reset();
          return;
        }

        throw new Error(result.message || 'Server could not send the message.');
      }

      throw new Error('PHP backend not available on this hosting.');
    } catch (error) {
      console.warn('[Contact Form] PHP sending unavailable:', error.message);

      if (CONFIG.enableMailtoFallback) {
        showFallbackMessage('Opening your email app to send the message...');
        openMailtoFallback(data);
      } else {
        showFormError('Message could not be sent. Please email me directly.');
      }
    } finally {
      setLoading(submitBtn, false);
    }
  }

  function isLikelyPhpHosting() {
    const host = window.location.hostname.toLowerCase();

    // GitHub Pages and common static hosts do not support PHP.
    const staticHosts = [
      'github.io',
      'netlify.app',
      'vercel.app',
      'pages.dev',
      'web.app',
      'firebaseapp.com'
    ];

    if (staticHosts.some(staticHost => host.includes(staticHost))) {
      return false;
    }

    // Local file opening cannot run PHP.
    if (window.location.protocol === 'file:') {
      return false;
    }

    // On normal hosting/localhost, try PHP.
    return true;
  }

  async function sendUsingPhp(data) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

    try {
      const response = await fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      });

      clearTimeout(timer);

      const contentType = response.headers.get('content-type') || '';

      // If hosted on static server, PHP file may return HTML/404 page.
      if (!contentType.includes('application/json')) {
        throw new Error('PHP endpoint did not return JSON.');
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Server error.');
      }

      return result;
    } catch (error) {
      clearTimeout(timer);
      throw error;
    }
  }

  function validateForm(form) {
    const fields = form.querySelectorAll('[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function getFormData(form) {
    return {
      name: form.querySelector('#field-name')?.value.trim() || '',
      email: form.querySelector('#field-email')?.value.trim() || '',
      subject: form.querySelector('#field-subject')?.value.trim() || 'Portfolio Contact',
      message: form.querySelector('#field-message')?.value.trim() || '',
      website: form.querySelector('#field-website')?.value.trim() || ''
    };
  }

  function validateField(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById(`error-${field.id.replace('field-', '')}`);

    if (field.required && !value) {
      setError(field, errorEl, 'This field is required.');
      return false;
    }

    if (field.id === 'field-name' && value.length < 2) {
      setError(field, errorEl, 'Name should be at least 2 characters.');
      return false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setError(field, errorEl, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.id === 'field-subject' && value.length < 3) {
      setError(field, errorEl, 'Subject should be at least 3 characters.');
      return false;
    }

    if (field.tagName === 'TEXTAREA' && value.length < 10) {
      setError(field, errorEl, 'Message should be at least 10 characters.');
      return false;
    }

    clearError(field, errorEl);
    return true;
  }

  function setError(field, errorEl, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(field, errorEl) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');

    if (!errorEl && field.id) {
      errorEl = document.getElementById(`error-${field.id.replace('field-', '')}`);
    }

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function setLoading(button, loading) {
    if (!button) return;

    if (loading) {
      button.dataset.originalText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = 'Sending...';
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText || 'Send Message';
    }
  }

  function showSuccess(form, message) {
    const successEl = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }

    if (successEl) {
      successEl.textContent = message;
      successEl.classList.add('visible');

      setTimeout(() => {
        successEl.classList.remove('visible');
      }, 6000);
    }
  }

  function showFallbackMessage(message) {
    let infoEl = document.getElementById('form-info');

    if (!infoEl) {
      const form = document.getElementById('contact-form');
      infoEl = document.createElement('div');
      infoEl.id = 'form-info';
      infoEl.className = 'form-info visible';
      form?.prepend(infoEl);
    }

    infoEl.textContent = message;
    infoEl.classList.add('visible');

    setTimeout(() => {
      infoEl.classList.remove('visible');
    }, 5000);
  }

  function showFormError(message) {
    let errorEl = document.getElementById('form-error');

    if (!errorEl) {
      const form = document.getElementById('contact-form');
      errorEl = document.createElement('div');
      errorEl.id = 'form-error';
      errorEl.className = 'form-error visible';
      form?.prepend(errorEl);
    }

    errorEl.textContent = message;
    errorEl.classList.add('visible');

    setTimeout(() => {
      errorEl.classList.remove('visible');
    }, 7000);
  }

  function openMailtoFallback(data) {
    const subject = encodeURIComponent(data.subject || 'Portfolio Contact');

    const body = encodeURIComponent(
      `Hi Abhishek,\n\n${data.message}\n\n---\nFrom: ${data.name}\nEmail: ${data.email}`
    );

    const mailtoLink = `mailto:${CONFIG.fallbackEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      window.location.href = mailtoLink;
    }, 700);
  }

  function addHoneypotField(form) {
    if (form.querySelector('#field-website')) return;

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none';
    wrapper.setAttribute('aria-hidden', 'true');

    wrapper.innerHTML = `
      <label for="field-website">Website</label>
      <input type="text" id="field-website" name="website" tabindex="-1" autocomplete="off">
    `;

    form.appendChild(wrapper);
  }

  /* ── COPY TO CLIPBOARD ──────────────────────────────────────── */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;

        if (!text) return;

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text)
            .then(() => showCopyFeedback(btn.dataset.copyLabel || 'Copied!'))
            .catch(() => fallbackCopy(text, btn));
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';

    document.body.appendChild(ta);
    ta.select();

    try {
      document.execCommand('copy');
      showCopyFeedback(btn?.dataset?.copyLabel || 'Copied!');
    } catch (error) {
      showCopyFeedback('Copy failed');
    }

    document.body.removeChild(ta);
  }

  function showCopyFeedback(message) {
    let fb = document.getElementById('copy-feedback');

    if (!fb) {
      fb = document.createElement('div');
      fb.id = 'copy-feedback';
      fb.className = 'copy-feedback';
      document.body.appendChild(fb);
    }

    fb.textContent = '✓ ' + message;
    fb.classList.add('show');

    clearTimeout(fb._timer);
    fb._timer = setTimeout(() => fb.classList.remove('show'), 2200);
  }

  return {
    init,
    initCopyButtons,
    showCopyFeedback
  };
})();