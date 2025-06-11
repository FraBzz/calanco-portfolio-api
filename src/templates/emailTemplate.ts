// Email template for Calanco.dev
export interface EmailTemplateProps {
  name: string;
  message?: string;
  type?: 'confirmation' | 'welcome' | 'notification';
}

export const generateEmailTemplate = ({ 
  name, 
  message = 'Grazie per il tuo messaggio! Ti risponderemo appena possibile.', 
  type = 'confirmation' 
}: EmailTemplateProps): string => {
  const currentYear = new Date().getFullYear();
  
  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calanco.dev</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo-container {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
        }
        
        .logo {
            width: 48px;
            height: 48px;
            background-color: #60a5fa;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 24px;
            color: white;
        }
        
        .brand-name {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        
        .brand-domain {
            color: #60a5fa;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin-top: 8px;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 20px;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            color: #475569;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-left: 4px solid #60a5fa;
            padding: 20px;
            border-radius: 8px;
            margin: 30px 0;
        }
        
        .highlight-text {
            font-size: 16px;
            color: #334155;
            font-weight: 500;
        }
        
        .cta-section {
            text-align: center;
            margin: 40px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: transform 0.2s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-1px);
        }
        
        .footer {
            background-color: #f8fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer-content {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 15px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .social-link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            background-color: #e2e8f0;
            border-radius: 50%;
            text-decoration: none;
            color: #475569;
            transition: background-color 0.2s ease;
        }
        
        .social-link:hover {
            background-color: #cbd5e1;
        }
        
        .copyright {
            font-size: 12px;
            color: #94a3b8;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e2e8f0, transparent);
            margin: 30px 0;
        }
        
        @media (max-width: 640px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header,
            .content,
            .footer {
                padding: 25px 20px;
            }
            
            .brand-name {
                font-size: 24px;
            }
            
            .greeting {
                font-size: 18px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <div class="logo">C</div>
                <div>
                    <div class="brand-name">calanco<span class="brand-domain">.dev</span></div>
                </div>
            </div>
            <div class="header-subtitle">Full-Stack Development & API Solutions</div>
        </div>
        
        <div class="content">
            <div class="greeting">Ciao ${name}! 👋</div>
            
            <div class="message">
                ${message}
            </div>
            
            <div class="highlight-box">
                <div class="highlight-text">
                    💼 <strong>Lavoriamo insieme:</strong> Realizzo soluzioni backend robuste, API scalabili e applicazioni moderne che portano valore al tuo business.
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="cta-section">
                <a href="https://calanco.dev" class="cta-button">
                    Scopri i miei progetti
                </a>
            </div>
            
            <div class="message">
                <strong>Cosa posso fare per te:</strong><br>
                • 🔧 <strong>Backend Development:</strong> API RESTful, microservizi, autenticazione<br>
                • 🎨 <strong>Frontend Development:</strong> React, TypeScript, interfacce moderne<br>
                • 🚀 <strong>Full-Stack Solutions:</strong> Applicazioni complete dalla A alla Z<br>
                • ☁️ <strong>Cloud & DevOps:</strong> Deployment, ottimizzazione, scalabilità
            </div>
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <strong>Francesca Bozzoli</strong> - Full-Stack Developer<br>
                📧 <a href="mailto:hello@calanco.dev" style="color: #60a5fa; text-decoration: none;">hello@calanco.dev</a> | 
                🌐 <a href="https://calanco.dev" style="color: #60a5fa; text-decoration: none;">calanco.dev</a>
            </div>
            
            <div class="social-links">
                <a href="https://github.com/calanco" class="social-link" title="GitHub">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
                <a href="https://linkedin.com/in/francesca-bozzoli" class="social-link" title="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>
            </div>
            
            <div class="copyright">
                © ${currentYear} Calanco.dev - Tutti i diritti riservati
            </div>
        </div>
    </div>
</body>
</html>
  `.trim();
};

// Shorthand per template di conferma
export const generateConfirmationEmail = (name: string): string => {
  return generateEmailTemplate({
    name,
    message: 'Grazie per il tuo messaggio! Ti risponderemo appena possibile.',
    type: 'confirmation'
  });
};

// Template per email di benvenuto
export const generateWelcomeEmail = (name: string): string => {
  return generateEmailTemplate({
    name,
    message: 'Benvenuto! Sono felice di conoscerti. Esplora i miei progetti e scopri come possiamo lavorare insieme per realizzare le tue idee.',
    type: 'welcome'
  });
};

// Template per notificare il proprietario di un nuovo messaggio
export const generateOwnerNotificationEmail = ({ 
  senderName, 
  senderEmail, 
  message 
}: { 
  senderName: string; 
  senderEmail: string; 
  message: string; 
}): string => {
  const currentYear = new Date().getFullYear();
  const timestamp = new Date().toLocaleString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuovo messaggio - Calanco.dev</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }
        
        .notification-icon {
            width: 64px;
            height: 64px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 32px;
        }
        
        .header-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        
        .header-subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 30px;
        }
        
        .sender-info {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .sender-label {
            font-size: 14px;
            font-weight: 600;
            color: #1e40af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }
        
        .sender-name {
            font-size: 20px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 5px;
        }
        
        .sender-email {
            font-size: 16px;
            color: #3b82f6;
            font-weight: 500;
        }
        
        .timestamp {
            font-size: 14px;
            color: #64748b;
            margin-top: 10px;
            font-style: italic;
        }
        
        .message-section {
            margin-bottom: 30px;
        }
        
        .message-label {
            font-size: 16px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .message-content {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 20px;
            font-size: 15px;
            line-height: 1.7;
            color: #374151;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        
        .action-buttons {
            display: flex;
            gap: 15px;
            margin-top: 30px;
        }
        
        .reply-button {
            flex: 1;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s ease;
        }
        
        .reply-button:hover {
            transform: translateY(-1px);
        }
        
        .admin-button {
            flex: 1;
            background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s ease;
        }
        
        .admin-button:hover {
            transform: translateY(-1px);
        }
        
        .stats-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin-top: 30px;
        }
        
        .stats-title {
            font-size: 16px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 10px;
        }
        
        .stats-text {
            font-size: 14px;
            color: #a16207;
        }
        
        .footer {
            background-color: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        
        @media (max-width: 640px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .content {
                padding: 20px;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="notification-icon">📬</div>
            <div class="header-title">Nuovo Messaggio Ricevuto!</div>
            <div class="header-subtitle">Qualcuno ti ha contattato tramite calanco.dev</div>
        </div>
        
        <div class="content">
            <div class="sender-info">
                <div class="sender-label">💬 Mittente</div>
                <div class="sender-name">${senderName}</div>
                <div class="sender-email">📧 ${senderEmail}</div>
                <div class="timestamp">🕒 Ricevuto il ${timestamp}</div>
            </div>
            
            <div class="message-section">
                <div class="message-label">
                    💌 Messaggio:
                </div>
                <div class="message-content">${message}</div>
            </div>
            
            <div class="action-buttons">
                <a href="mailto:${senderEmail}?subject=Re: Messaggio da calanco.dev&body=Ciao ${senderName},%0D%0A%0D%0AGrazie per avermi contattato!" class="reply-button">
                    ↩️ Rispondi subito
                </a>
                <a href="https://calanco.dev/admin" class="admin-button">
                    ⚙️ Area Admin
                </a>
            </div>
            
            <div class="stats-section">
                <div class="stats-title">📊 Info Utili</div>
                <div class="stats-text">
                    Ricorda di rispondere entro 24h per mantenere un ottimo servizio clienti. 
                    Puoi utilizzare il bottone "Rispondi subito" per aprire il tuo client email con una risposta pre-compilata!
                </div>
            </div>
        </div>
        
        <div class="footer">
            Email automatica generata da calanco.dev • © ${currentYear} Francesca Bozzoli
        </div>
    </div>
</body>
</html>
  `.trim();
};
