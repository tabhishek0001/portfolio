// Contact Form Handler
/* ============================================================
   FORM HANDLER — Contact form validation & mailto fallback
   ============================================================ */

const FormHandler = (() => {

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', handleSubmit);

    // Live validation on blur
    form.querySelectorAll('.form-input, .form-textarea').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => clearError(field));
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fields = form.querySelectorAll('[required]');
    let isValid = true;

    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    const name    = form.querySelector('#field-name')?.value.trim() || '';
    const email   = form.querySelector('#field-email')?.value.trim() || '';
    const subject = form.querySelector('#field-subject')?.value.trim() || '';
    const message = form.querySelector('#field-message')?.value.trim() || '';

    // Build mailto link as fallback
    const body = encodeURIComponent(
      `Hi Abhishek,\n\n${message}\n\n---\nFrom: ${name}\nEmail: ${email}`
    );
    const mailtoLink = `mailto:abhishek@docsansar.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Show success, open mail client
    showSuccess(form);
    window.location.href = mailtoLink;
  }

  function validateField(field) {
    const value = field.value.trim();
    const errorEl = document.getElementById(`error-${field.id.replace('field-', '')}`);

    if (field.required && !value) {
      setError(field, errorEl, 'This field is required.');
      return false;
    }

    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError(field, errorEl, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      setError(field, errorEl, 'Message should be at least 10 characters.');
      return false;
    }

    clearError(field, errorEl);
    return true;
  }

  function setError(field, errorEl, message) {
    field.classList.add('error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }

  function clearError(field, errorEl) {
    field.classList.remove('error');
    if (!errorEl) {
      errorEl = document.getElementById(`error-${field.id.replace('field-', '')}`);
    }
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
  }

  function showSuccess(form) {
    const successEl = document.getElementById('form-success');
    if (successEl) successEl.classList.add('visible');
    form.reset();
    setTimeout(() => {
      if (successEl) successEl.classList.remove('visible');
    }, 5000);
  }

  /* ── COPY TO CLIPBOARD ──────────────────────────────────────── */
  function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          showCopyFeedback(btn.dataset.copyLabel || 'Copied!');
        }).catch(() => {
          // fallback
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showCopyFeedback(btn.dataset.copyLabel || 'Copied!');
        });
      });
    });
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

  return { init, initCopyButtons, showCopyFeedback };
})();