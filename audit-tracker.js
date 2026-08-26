(function() {
    if (sessionStorage.getItem('audit_sent')) return;
    
    function generateFingerprint() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('HWID:' + navigator.userAgent.length, 2, 15);
        
        const dataURI = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataURI.length; i++) {
            const char = dataURI.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            screen.colorDepth,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown',
            navigator.deviceMemory || 'unknown',
            hash.toString()
        ];
        
        let fingerprintHash = 0;
        const fingerprintString = components.join('|');
        for (let i = 0; i < fingerprintString.length; i++) {
            const char = fingerprintString.charCodeAt(i);
            fingerprintHash = ((fingerprintHash << 5) - fingerprintHash) + char;
            fingerprintHash |= 0;
        }
        
        return Math.abs(fingerprintHash).toString(16) + '-' + Math.abs(hash).toString(16);
    }
    
    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        if (ua.indexOf('Edg/') > -1) {
            browser = 'Edge';
            version = ua.split('Edg/')[1];
        } else if (ua.indexOf('OPR/') > -1) {
            browser = 'Opera';
            version = ua.split('OPR/')[1];
        } else if (ua.indexOf('Chrome/') > -1) {
            browser = 'Chrome';
            version = ua.split('Chrome/')[1].split(' ')[0];
        } else if (ua.indexOf('Firefox/') > -1) {
            browser = 'Firefox';
            version = ua.split('Firefox/')[1];
        } else if (ua.indexOf('Safari/') > -1) {
            browser = 'Safari';
            version = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
        }
        
        return { browser, version };
    }
    
    function getPlatformInfo() {
        const ua = navigator.userAgent;
        const platform = navigator.platform || 'Unknown';
        
        let os = 'Unknown';
        let osVersion = 'Unknown';
        
        if (ua.indexOf('Windows NT') > -1) {
            os = 'Windows';
            osVersion = ua.split('Windows NT ')[1].split(';')[0];
        } else if (ua.indexOf('Mac OS X') > -1) {
            os = 'macOS';
            osVersion = ua.split('Mac OS X ')[1].split(';')[0];
        } else if (ua.indexOf('Android') > -1) {
            os = 'Android';
            osVersion = ua.split('Android ')[1].split(';')[0];
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) {
            os = 'iOS';
            osVersion = ua.split('OS ')[1]?.split(' ')[0] || 'Unknown';
        } else if (ua.indexOf('Linux') > -1) {
            os = 'Linux';
            osVersion = 'Unknown';
        }
        
        return { platform, os, osVersion };
    }
    
    const browserInfo = getBrowserInfo();
    const platformInfo = getPlatformInfo();
    
    const auditData = {
        fingerprint: generateFingerprint(),
        platform: platformInfo.platform,
        browser: browserInfo.browser,
        browserVersion: browserInfo.version,
        os: platformInfo.os,
        osVersion: platformInfo.osVersion,
        screenResolution: screen.width + 'x' + screen.height,
        colorDepth: screen.colorDepth,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown',
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct',
        page: window.location.pathname,
        sessionId: Math.random().toString(36).substring(2) + Date.now().toString(36),
        cores: navigator.hardwareConcurrency || 'unknown',
        memory: navigator.deviceMemory || 'unknown',
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0
    };
    
    fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(auditData)
    }).catch(() => {});
    
    sessionStorage.setItem('audit_sent', 'true');
})();
