const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'applications.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Ensure data directory and storage file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// MIME types for static assets
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

// Known client-side routes mapped to main application view
const APP_ROUTES = [
  '/',
  '/home',
  '/our-story',
  '/edplan-ai',
  '/give-back',
  '/contact',
  '/leadership',
  '/clients',
  '/products/full-circle-tracking',
  '/products/school-view',
  '/products/assessment-of-student-learning',
  '/faq'
];

/**
 * Send email notification via Resend if RESEND_API_KEY is configured
 */
function sendNotificationEmail(application) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL || 'givingback@studentspace.com';

  if (!apiKey) {
    console.log(`[Notification Email] (Simulated - set RESEND_API_KEY for live delivery)`);
    console.log(`  To: ${notifyEmail}`);
    console.log(`  Subject: New Give-Back Application: ${application.name}`);
    console.log(`  Applicant: ${application.name} <${application.email}> from ${application.city || 'N/A'}`);
    console.log(`  Reason: ${application.reason}`);
    console.log(`  Message: ${application.message}`);
    return Promise.resolve({ simulated: true });
  }

  const payload = JSON.stringify({
    from: 'StudentSpace <onboarding@resend.dev>',
    to: [notifyEmail],
    subject: `New Give-Back Application from ${application.name}`,
    html: `
      <h2>New StudentSpace Application / Inquiry</h2>
      <p><strong>Name:</strong> ${escapeHtml(application.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(application.email)}</p>
      <p><strong>City, New Mexico:</strong> ${escapeHtml(application.city || 'Not provided')}</p>
      <p><strong>Reason:</strong> ${escapeHtml(application.reason)}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left:3px solid #3AA79C; padding-left:12px; margin:10px 0;">
        ${escapeHtml(application.message).replace(/\n/g, '<br>')}
      </blockquote>
      <p><small>Application ID: ${application.id} · Received at: ${application.created_at}</small></p>
    `
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      'https://api.resend.com/emails',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Resend] Notification email sent successfully to ${notifyEmail}`);
            resolve({ success: true, data: body });
          } else {
            console.error(`[Resend Error] Status ${res.statusCode}: ${body}`);
            resolve({ success: false, error: body });
          }
        });
      }
    );

    req.on('error', (err) => {
      console.error('[Resend Request Error]', err);
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
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

// Request dispatcher
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
  const method = req.method.toUpperCase();

  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // API: POST /api/apply
  // -------------------------------------------------------------
  if (pathname === '/api/apply' && method === 'POST') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk;
      // Safeguard max payload 1MB
      if (rawBody.length > 1e6) {
        req.destroy();
      }
    });

    req.on('end', async () => {
      try {
        let data = {};
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
          data = JSON.parse(rawBody || '{}');
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(rawBody);
          data = Object.fromEntries(params.entries());
        } else {
          data = JSON.parse(rawBody || '{}');
        }

        const name = (data.name || '').trim();
        const email = (data.email || '').trim();
        const reason = (data.reason || 'give_back').trim();
        const city = (data.city || '').trim();
        const message = (data.message || '').trim();

        // Validation per prompt specs
        const errors = {};
        if (!name) {
          errors.name = 'Full name is required.';
        }
        if (!email) {
          errors.email = 'Email is required.';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            errors.email = 'Please provide a valid email address.';
          }
        }
        if (!message) {
          errors.message = 'Please provide details about what you want to build or ask.';
        }

        if (Object.keys(errors).length > 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            message: 'Validation failed.',
            errors: errors
          }));
          return;
        }

        // Create new record matching data model
        const application = {
          id: crypto.randomUUID(),
          name,
          email,
          reason,
          city: city || 'New Mexico',
          message,
          created_at: new Date().toISOString()
        };

        // Persist to local JSON database
        let applications = [];
        try {
          const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
          applications = JSON.parse(fileContent || '[]');
        } catch (readErr) {
          applications = [];
        }

        applications.push(application);
        fs.writeFileSync(DB_FILE, JSON.stringify(applications, null, 2), 'utf-8');
        console.log(`[Database] Saved new application ${application.id} from ${application.name}`);

        // Trigger Resend email
        await sendNotificationEmail(application);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          id: application.id,
          message: 'Application submitted successfully. We will be in touch shortly.'
        }));

      } catch (err) {
        console.error('[API Error]', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'An internal server error occurred. Please try again or email givingback@studentspace.com.'
        }));
      }
    });
    return;
  }

  // -------------------------------------------------------------
  // API: GET /api/applications (View submitted applications)
  // -------------------------------------------------------------
  if (pathname === '/api/applications' && method === 'GET') {
    try {
      const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
      const applications = JSON.parse(fileContent || '[]');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        count: applications.length,
        applications
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // -------------------------------------------------------------
  // Static Files in public/
  // -------------------------------------------------------------
  let filePath = path.join(PUBLIC_DIR, pathname);

  // Check if requested file directly exists in public directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // -------------------------------------------------------------
  // Application Routes: Serve public/index.html
  // -------------------------------------------------------------
  if (APP_ROUTES.includes(pathname) || method === 'GET') {
    const htmlFile = path.join(PUBLIC_DIR, 'index.html');

    if (fs.existsSync(htmlFile)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
      fs.createReadStream(htmlFile).pipe(res);
      return;
    }
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`StudentSpace Full-Stack Node.js Application`);
  console.log(`Server listening at: http://localhost:${PORT}/`);
  console.log(`API endpoint ready:  POST http://localhost:${PORT}/api/apply`);
  console.log(`Database storage:    ${DB_FILE}`);
  console.log(`===================================================`);
});
