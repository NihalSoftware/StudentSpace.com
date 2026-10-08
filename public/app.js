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
    '/founder': {
      viewId: 'view-founder',
      title: "Founder — Prof. S.N.S Nagra | StudentSpace",
      description: "Meet Prof. S.N.S Nagra, co-founder of StudentSpace."
    },
    '/research-innovation': {
      viewId: 'view-research',
      title: "Research & Innovation | StudentSpace",
      description: "Explore student success, learning outcomes, AI and education research."
    },
    '/technology': {
      viewId: 'view-technology',
      title: "Technology & Interoperability | StudentSpace",
      description: "How StudentSpace connects SIS, CRM and LMS data for student success."
    },
    '/new-mexico': {
      viewId: 'view-new-mexico',
      title: "New Mexico Initiatives | StudentSpace",
      description: "Education planning and technology access for New Mexico students and entrepreneurs."
    },
    '/community-partners': {
      viewId: 'view-community',
      title: "Community & Partners | StudentSpace",
      description: "Institutions, education organizations, community programs and collaboration opportunities."
    },
    '/open-knowledge': {
      viewId: 'view-knowledge',
      title: "Open Knowledge — Code & Documentation | StudentSpace",
      description: "Source code, technical documentation and engineering guidance for qualified entrepreneurs."
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
      title: 'Give Back to — Students, Educators, Institutions & Entrepreneurs',
      description: 'Take what we built. StudentSpace is giving away source code, product designs, and business playbooks free with no cost and no equity to New Mexico founders.'
    },
    '/clients': {
      viewId: 'view-clients',
      title: 'Clients | StudentSpace',
      description: 'Meet some of the colleges, universities, and education organizations in the StudentSpace client community.'
    },
    '/nihal-foundation': {
      viewId: 'view-foundation',
      title: 'Nihal Foundation — StudentSpace',
      description: 'Explore the Nihal Foundation story: youth skills, Simbarashi Creche, Sunshine Van, and the community initiatives of StudentSpace.'
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
    },
    '/press-release': {
      viewId: 'view-press-release',
      title: 'Press Release — StudentSpace & Nihal Software: SEWA Project',
      description: 'StudentSpace and Nihal Software share the SEWA custom solution project announcement.'
    },
    '/playground': {
      viewId: 'view-playground',
      title: 'Dashboard Playground — Data Storytelling & Analytics | StudentSpace',
      description: 'Explore interactive student data dashboards: Admission Dashboard, Advising Log, Early Alert, and Retention insights.'
    },
    '/projects': {
      viewId: 'view-playground',
      title: 'Projects & Dashboards — StudentSpace Playground',
      description: 'Explore StudentSpace project dashboards: Admission Dashboard, Advising Log, Early Alert, and Retention insights.'
    },
    '/new-mexico-projects': {
      viewId: 'view-regional-projects',
      title: 'Northern New Mexico Projects | StudentSpace',
      description: "Early work with GEAR UP, Title V and Title III programs in Northern New Mexico, helping educators follow each student's progress."
    },
    '/startup-access': {
      viewId: 'view-startup-access',
      title: 'Startup Access | StudentSpace',
      description: 'Startup Access gives qualified New Mexico entrepreneurs access to selected StudentSpace technology, code, AI architecture, and technical knowledge to help turn ambitious ideas into new companies.'
    }
  };

  const metaDesc = document.querySelector('meta[name="description"]');
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');

  /**
   * Playground Dashboard Tab Switching
   */
  function switchPlaygroundTab(tabId) {
    const validTabs = ['admission', 'advising', 'early-alert', 'retention'];
    if (!validTabs.includes(tabId)) return;

    document.querySelectorAll('.playground-tab-btn').forEach(btn => {
      const isMatch = btn.getAttribute('data-tab') === tabId;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    document.querySelectorAll('.playground-tab-panel').forEach(panel => {
      const isMatch = panel.id === `tab-panel-${tabId}`;
      panel.classList.toggle('active', isMatch);
    });
  }

  /**
   * Router: Navigates to given path, toggles DOM views, updates SEO and history
   */
  function navigate(path, pushState = true) {
    // Extract hash if present
    const url = new URL(path, window.location.origin);
    const hash = url.hash.slice(1);

    // Normalize path
    let normalized = url.pathname.replace(/\/+$/, '') || '/';
    
    // Fallback if not found
    const route = ROUTE_MAP[normalized] || ROUTE_MAP['/'];
    document.body.classList.toggle('home-theme', route.viewId === 'view-home');
    if (!ROUTE_MAP[normalized]) {
      normalized = '/';
    }

    document.getElementById('foundationContact').hidden = normalized !== '/nihal-foundation';

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
      const linkBase = linkTarget ? linkTarget.split(/[?#]/)[0] : '';
      if (linkTarget === path || linkBase === normalized) {
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
      const fullUrl = normalized + url.search + (hash ? '#' + hash : '');
      history.pushState(null, '', fullUrl);
    }

    if (normalized === '/contact') {
      contactForm.reset();
      clearFormFeedback(contactForm, formStatus);
      const reason = document.getElementById('f-reason');
      const requested = url.searchParams.get('reason');
      reason.value = Array.from(reason.options).some(option => option.value === requested) ? requested : '';
      updateContactContext();
    }
    if (normalized === '/startup-access') {
      startupForm.reset();
      startupForm.style.display = '';
      startupSuccessBox.style.display = 'none';
      clearFormFeedback(startupForm, startupStatus);
    }

    // 5. Handle Tab Activation if on Playground
    if (normalized === '/playground' || normalized === '/projects') {
      const validTabs = ['admission', 'advising', 'early-alert', 'retention'];
      switchPlaygroundTab(validTabs.includes(hash) ? hash : 'admission');
    }

    // 6. Scroll to top or element & close mobile drawer
    if (hash && document.getElementById(hash)) {
      document.getElementById(hash).scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

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

    const tabBtn = e.target.closest('.playground-tab-btn');
    if (tabBtn) {
      const tabId = tabBtn.getAttribute('data-tab');
      switchPlaygroundTab(tabId);
      history.replaceState(null, '', `/playground#${tabId}`);
    }
  });

  // Handle Browser Back / Forward buttons
  window.addEventListener('popstate', function () {
    navigate(window.location.pathname + window.location.search + window.location.hash, false);
  });

  // Handle hash changes
  window.addEventListener('hashchange', function () {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) {
      switchPlaygroundTab(hash);
    }
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


  // ============================================================
  // FULL-STACK APPLICATION FORM: POST /api/apply
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (submitBtn.disabled) return;
      clearFormFeedback(contactForm, formStatus);
      const formData = new FormData(contactForm);
      const payload = {
        name: (formData.get('name') || '').trim(),
        email: (formData.get('email') || '').trim(),
        reason: formData.get('reason') || '',
        city: (formData.get('city') || '').trim(),
        message: (formData.get('message') || '').trim()
      };
      if (!payload.name) showFieldError('f-name', 'Full name is required.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) showFieldError('f-email', 'Please provide a valid email address.');
      if (!payload.reason) showFieldError('f-reason', 'Please choose what you are reaching out about.');
      if (!payload.message) showFieldError('f-msg', 'Please tell us what you are hoping to build or ask.');
      if (contactForm.querySelector('[aria-invalid="true"]')) {
        focusFirstError(contactForm);
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending message...';
      const inquiry = document.getElementById('f-reason').selectedOptions[0].textContent;
      try {
        const res = await fetch('/api/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          formStatus.className = 'form-status success';
          formStatus.textContent = 'Your message about ' + inquiry + ' has been received. Our team will be in touch.';
          contactForm.reset();
          updateContactContext();
        } else {
          const fieldIds = { name: 'f-name', email: 'f-email', reason: 'f-reason', city: 'f-city', message: 'f-msg' };
          Object.entries(data.errors || {}).forEach(([field, message]) => {
            if (fieldIds[field]) showFieldError(fieldIds[field], message);
          });
          formStatus.className = 'form-status error';
          formStatus.textContent = data.message || data.error || 'There was an issue sending your message. Please check the fields above.';
          focusFirstError(contactForm);
        }
      } catch {
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Network error connecting to application server. Please email givingback@studentspace.com.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message';
        formStatus.style.display = 'block';
      }
    });
  }

  // ============================================================
  // FAQ ACCORDION HANDLER
  // ============================================================
  document.addEventListener('click', function (e) {
    const faqBtn = e.target.closest('.faq-accordion-trigger');
    if (faqBtn) {
      const isExpanded = faqBtn.getAttribute('aria-expanded') === 'true';
      const panelId = faqBtn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      faqBtn.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      if (panel) {
        panel.classList.toggle('open', !isExpanded);
        panel.hidden = isExpanded;
      }
    }
  });

  // ============================================================
  // STARTUP ACCESS FORM HANDLER: POST /api/startup-access
  // ============================================================
  const startupForm = document.getElementById('startupAccessForm');
  const startupStatus = document.getElementById('startupFormStatus');
  const startupSubmitBtn = document.getElementById('startupSubmitBtn');
  const startupSuccessBox = document.getElementById('startupSuccessBox');

  if (startupForm) {
    startupForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Reset previous error messages
      clearFormFeedback(startupForm, startupStatus);

      const formData = new FormData(startupForm);
      const techList = [];
      startupForm.querySelectorAll('input[name="technologies"]:checked').forEach(cb => {
        techList.push(cb.value);
      });

      const payload = {
        fullName: (formData.get('fullName') || '').trim(),
        email: (formData.get('email') || '').trim(),
        phone: (formData.get('phone') || '').trim(),
        linkedin: (formData.get('linkedin') || '').trim(),
        city: (formData.get('city') || '').trim(),
        state: (formData.get('state') || '').trim(),
        companyName: (formData.get('companyName') || '').trim(),
        website: (formData.get('website') || '').trim(),
        stage: formData.get('stage') || 'Idea',
        incorporated: formData.get('incorporated') || 'No',
        incorporatedWhere: (formData.get('incorporatedWhere') || '').trim(),
        nmConnection: (formData.get('nmConnection') || '').trim(),
        problem: (formData.get('problem') || '').trim(),
        customer: (formData.get('customer') || '').trim(),
        product: (formData.get('product') || '').trim(),
        technologies: techList,
        techFit: (formData.get('techFit') || '').trim(),
        commitment: formData.get('commitment') || 'Exploring',
        team: (formData.get('team') || '').trim(),
        progress: (formData.get('progress') || '').trim(),
        nmImpact: (formData.get('nmImpact') || '').trim(),
        pitchDeckUrl: (formData.get('pitchDeckUrl') || '').trim(),
        screenshotsUrl: (formData.get('screenshotsUrl') || '').trim(),
        demoUrl: (formData.get('demoUrl') || '').trim(),
        githubUrl: (formData.get('githubUrl') || '').trim(),
        otherUrl: (formData.get('otherUrl') || '').trim(),
        agreeNoGuarantee: formData.get('agreeNoGuarantee') === 'on',
        agreeContact: formData.get('agreeContact') === 'on'
      };

      let hasError = false;
      function showSaError(fieldId, msg) {
        showFieldError(fieldId, msg);
        hasError = true;
      }

      if (!payload.fullName) showSaError('sa-name', 'Full name is required.');
      if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showSaError('sa-email', 'Please provide a valid email address.');
      }
      if (!payload.companyName) showSaError('sa-company', 'Company or startup name is required.');
      if (!payload.nmConnection) showSaError('sa-nmConnection', 'Please describe your connection or commitment to New Mexico.');
      if (!payload.problem) showSaError('sa-problem', 'Please describe the problem you are solving.');
      if (!payload.customer) showSaError('sa-customer', 'Please specify who has this problem.');
      if (!payload.product) showSaError('sa-product', 'Please describe what you want to build.');
      if (!payload.techFit) showSaError('sa-techFit', 'Please describe how StudentSpace technology would accelerate your company.');
      if (!payload.agreeNoGuarantee) showSaError('sa-agreeNoGuarantee', 'You must acknowledge this item to submit your application.');
      if (!payload.agreeContact) showSaError('sa-agreeContact', 'You must agree to be contacted regarding your application.');

      if (hasError) {
        if (startupStatus) {
          startupStatus.className = 'form-status error';
          startupStatus.textContent = 'Please complete all required fields highlighted above.';
          startupStatus.style.display = 'block';
          focusFirstError(startupForm);
        }
        return;
      }

      // Pending state
      startupSubmitBtn.disabled = true;
      startupSubmitBtn.textContent = 'Submitting application...';

      try {
        const res = await fetch('/api/startup-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        startupSubmitBtn.disabled = false;
        startupSubmitBtn.textContent = 'Submit Startup Access Application';

        if (res.ok && data.success) {
          startupForm.reset();
          startupForm.style.display = 'none';
          if (startupStatus) startupStatus.style.display = 'none';
          if (startupSuccessBox) {
            startupSuccessBox.style.display = 'block';
            startupSuccessBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          const fieldIds = { fullName: 'sa-name', email: 'sa-email', companyName: 'sa-company',
            nmConnection: 'sa-nmConnection', problem: 'sa-problem', customer: 'sa-customer',
            product: 'sa-product', techFit: 'sa-techFit', agreeNoGuarantee: 'sa-agreeNoGuarantee', agreeContact: 'sa-agreeContact' };
          Object.entries(data.errors || {}).forEach(([field, message]) => {
            if (fieldIds[field]) showFieldError(fieldIds[field], message);
          });
          focusFirstError(startupForm);
          if (startupStatus) {
            startupStatus.className = 'form-status error';
            startupStatus.textContent = data.message || 'There was an issue submitting your application. Please check your inputs.';
            startupStatus.style.display = 'block';
          }
        }
      } catch (err) {
        startupSubmitBtn.disabled = false;
        startupSubmitBtn.textContent = 'Submit Startup Access Application';
        if (startupStatus) {
          startupStatus.className = 'form-status error';
          startupStatus.textContent = 'Network or server error connecting to application server. Please try again.';
          startupStatus.style.display = 'block';
        }
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
      errEl.id = fieldId + '-error';
      parentField.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
    fieldInput.setAttribute('aria-invalid', 'true');
    const descriptions = new Set((fieldInput.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    descriptions.add(errEl.id);
    fieldInput.setAttribute('aria-describedby', Array.from(descriptions).join(' '));
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

  function clearFormFeedback(form, status) {
    form.querySelectorAll('.field-error').forEach(el => {
      el.style.display = 'none';
      el.textContent = '';
    });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    status.className = 'form-status';
    status.textContent = '';
    status.style.display = 'none';
  }

  function focusFirstError(form) {
    const field = form.querySelector('[aria-invalid="true"]');
    if (field) field.focus();
  }

  function updateContactContext() {
    const select = document.getElementById('f-reason');
    document.getElementById('contactContext').textContent = select.value
      ? 'Your inquiry: ' + select.selectedOptions[0].textContent
      : 'Choose what you are reaching out about.';
  }

  document.getElementById('f-reason').addEventListener('change', updateContactContext);
  // Initialize after the shared forms and their status elements are available.
  navigate(window.location.pathname + window.location.search + window.location.hash, false);

})();

