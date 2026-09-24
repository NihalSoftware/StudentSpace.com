/**
 * StudentSpace Client Application
 * Clean History-based router & full-stack API integration
 */
(function () {
  'use strict';

  // Registered application routes and dynamic SEO metadata
  const ROUTE_MAP = {
    '/': {
      viewId: 'view-home',
      title: 'StudentSpace — Twenty-Seven Years Building Edtech. Now Giving It Away to New Mexico.',
      description: 'StudentSpace is opening its 27 years of student-tracking software, source code, and business playbooks free to New Mexico builders, alongside edplan.ai, a free student planning portal.'
    },
    '/home': {
      viewId: 'view-home',
      title: 'StudentSpace — Twenty-Seven Years Building Edtech. Now Giving It Away to New Mexico.',
      description: 'StudentSpace is opening its 27 years of student-tracking software, source code, and business playbooks free to New Mexico builders.'
    },
    '/our-story': {
      viewId: 'view-story',
      title: 'Our Story — StudentSpace: From Santa Fe Startup to Statewide Give-Back',
      description: 'Learn how StudentSpace grew from a 1998 Santa Fe startup to serving 250+ institutions, and why we are now dedicating our tools to New Mexico.'
    },
    '/edplan-ai': {
      viewId: 'view-edplan',
      title: 'edplan.ai — Free Education Planning Portal for Every Student in New Mexico',
      description: 'A free education-planning portal funded through StudentSpace CSR to help every New Mexico student navigate their academic journey into a career.'
    },
    '/give-back': {
      viewId: 'view-giveback',
      title: 'Give-Back Program — Source Code, Playbooks & Mentorship for New Mexico Builders',
      description: 'Take what we built. StudentSpace is giving away source code, product designs, and business playbooks free with no cost and no equity to New Mexico founders.'
    },
    '/clients': {
      viewId: 'view-clients',
      title: 'Clients | StudentSpace',
      description: 'Meet some of the colleges, universities, and education organizations in the StudentSpace client community.'
    },
    '/leadership': {
      viewId: 'view-team',
      title: 'Leadership Team — StudentSpace',
      description: 'Meet Prof. S.N.S Nagra, Dr. Stephen Cox, Dr. Frances Levine, and Mr. Deep Bhangoo, the people behind StudentSpace.'
    },
    '/products/full-circle-tracking': {
      viewId: 'view-fct',
      title: 'Full Circle Tracking — SIS, CRM & LMS Unified Advising System',
      description: 'Full Circle Tracking connects student records into one unified retention view. Source code and sales playbooks available free for eligible New Mexico builders.'
    },
    '/products/school-view': {
      viewId: 'view-schoolview',
      title: 'SchoolView — Enrollment & Advancement Dashboard for Small Colleges',
      description: 'Turnkey institutional analytics for small colleges without large IT departments. Available free to New Mexico startups via the Give-Back Program.'
    },
    '/products/assessment-of-student-learning': {
      viewId: 'view-asl',
      title: 'Assessment of Student Learning (ASL) — Competency-Based Outcome Framework',
      description: 'Software and framework for tracking competency-based learning outcomes and regional accreditation reporting, open for transfer to New Mexico founders.'
    },
    '/faq': {
      viewId: 'view-faq',
      title: 'Frequently Asked Questions — StudentSpace Give-Back Program',
      description: 'Answers to key questions on business registration, non-technical founder eligibility, rolling deadlines, and licensing for the Give-Back Program.'
    },
    '/contact': {
      viewId: 'view-contact',
      title: 'Contact & Apply — StudentSpace Give-Back Program & edplan.ai',
      description: 'Apply to receive StudentSpace source code or bring edplan.ai to your school district. 802 Early Street, Santa Fe, New Mexico.'
    }
  };

  const metaDesc = document.querySelector('meta[name="description"]');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  /**
   * Router: Navigates to given path, toggles DOM views, updates SEO and history
   */
  function navigate(path, pushState = true) {
    // Normalize path
    let normalized = path.split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';
    
    // Fallback if not found
    const route = ROUTE_MAP[normalized] || ROUTE_MAP['/'];
    if (!ROUTE_MAP[normalized]) {
      normalized = '/';
    }

    // 1. Toggle page views
    document.querySelectorAll('.page-view').forEach(view => {
      const isTarget = view.id === route.viewId;
      view.classList.toggle('active', isTarget);
      if (isTarget) {
        view.focus();
      }
    });

    // 2. Update active states on nav links
    document.querySelectorAll('[data-route]').forEach(link => {
      const linkTarget = link.getAttribute('data-route');
      if (linkTarget === normalized) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    // 3. Update Document Title and Meta Description
    document.title = route.title;
    if (metaDesc) {
      metaDesc.setAttribute('content', route.description);
    }

    // 4. Update Browser History
    if (pushState) {
      history.pushState(null, '', normalized);
    }

    // 5. Scroll to top & close mobile drawer
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (primaryNav) {
      primaryNav.classList.remove('open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }

  // Intercept all clicks on data-route links
  document.addEventListener('click', function (e) {
    const link = e.target.closest('[data-route]');
    if (link) {
      e.preventDefault();
      const targetPath = link.getAttribute('data-route');
      navigate(targetPath);
    }
  });

  // Handle Browser Back / Forward buttons
  window.addEventListener('popstate', function () {
    navigate(window.location.pathname, false);
  });

  // Mobile navigation drawer toggle
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = primaryNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Mobile dropdown menus
  document.querySelectorAll('.dropdown-toggle').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (window.innerWidth <= 920) {
        e.preventDefault();
        const parent = this.closest('.dropdown');
        if (parent) {
          const isOpen = parent.classList.toggle('mobile-open');
          this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }
      }
    });
  });

  // Initialize view from current browser URL
  navigate(window.location.pathname, false);

  // ============================================================
  // FULL-STACK APPLICATION FORM: POST /api/apply
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Reset previous error indicators
      document.querySelectorAll('.field-error').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
      });
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        reason: formData.get('reason') || 'give_back',
        city: formData.get('city') || '',
        message: formData.get('message') || ''
      };

      // Client pre-validation
      let hasClientError = false;
      if (!payload.name.trim()) {
        showFieldError('f-name', 'Full name is required.');
        hasClientError = true;
      }
      if (!payload.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showFieldError('f-email', 'Please provide a valid email address.');
        hasClientError = true;
      }
      if (!payload.message.trim()) {
        showFieldError('f-msg', 'Please tell us what you are hoping to build or ask.');
        hasClientError = true;
      }

      if (hasClientError) return;

      // Pending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting application...';

      try {
        const res = await fetch('/api/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';

        if (res.ok && data.success) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML = `
            <strong>Thank you, ${escapeHtml(payload.name)}!</strong><br>
            Your application regarding <em>"${escapeHtml(payload.reason)}"</em> has been received by our Santa Fe team.<br>
            <small style="display:inline-block; margin-top:6px; opacity:0.9;">
              Confirmation ID: <code>${data.id}</code> · Stored in database &amp; notification dispatched.
            </small>
          `;
          contactForm.reset();
        } else {
          // Server validation errors
          if (data.errors) {
            Object.keys(data.errors).forEach(field => {
              showFieldError(`f-${field}`, data.errors[field]);
            });
          }
          formStatus.className = 'form-status error';
          formStatus.textContent = data.message || 'There was an issue submitting your application. Please check the fields above.';
        }
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Network error connecting to application server. Please email givingback@studentspace.com.';
      }
    });
  }

  function showFieldError(fieldId, message) {
    const fieldInput = document.getElementById(fieldId);
    if (!fieldInput) return;
    const parentField = fieldInput.closest('.field');
    if (!parentField) return;
    let errEl = parentField.querySelector('.field-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'field-error';
      parentField.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
    fieldInput.focus();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

})();
