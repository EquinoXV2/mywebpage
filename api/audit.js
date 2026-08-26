module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    try {
        const body = req.body || {};
        
        // Get real IP from Vercel headers
        const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() 
            || req.headers['x-real-ip'] 
            || req.socket.remoteAddress 
            || 'unknown';
        
        // Get location data (Vercel provides this)
        const geo = {
            city: req.headers['x-vercel-ip-city'] || 'unknown',
            country: req.headers['x-vercel-ip-country'] || 'unknown',
            region: req.headers['x-vercel-ip-country-region'] || 'unknown',
            timezone: req.headers['x-vercel-ip-timezone'] || 'unknown',
            latitude: req.headers['x-vercel-ip-latitude'] || 'unknown',
            longitude: req.headers['x-vercel-ip-longitude'] || 'unknown'
        };
        
        const auditData = {
            ip: ip,
            fingerprint: body.fingerprint || 'unknown',
            platform: body.platform || 'unknown',
            browser: body.browser || 'unknown',
            browserVersion: body.browserVersion || 'unknown',
            os: body.os || 'unknown',
            osVersion: body.osVersion || 'unknown',
            screenResolution: body.screenResolution || 'unknown',
            colorDepth: body.colorDepth || 'unknown',
            language: body.language || 'unknown',
            timezone: body.timezone || geo.timezone || 'unknown',
            userAgent: body.userAgent || 'unknown',
            referrer: body.referrer || 'direct',
            page: body.page || 'unknown',
            timestamp: new Date().toISOString(),
            sessionId: body.sessionId || 'unknown',
            cores: body.cores || 'unknown',
            memory: body.memory || 'unknown',
            touchSupport: body.touchSupport || false,
            geo: geo
        };
        
        // Discord webhook URL
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        
        if (webhookUrl) {
            const discordPayload = {
                embeds: [{
                    title: '🖥️ New Unique Visitor',
                    color: 0xFF0000,
                    timestamp: auditData.timestamp,
                    fields: [
                        { name: 'IP Address', value: '```' + auditData.ip + '```', inline: true },
                        { name: 'Fingerprint (HWID)', value: '```' + auditData.fingerprint.substring(0, 30) + '...```', inline: true },
                        { name: 'Platform', value: auditData.platform, inline: true },
                        { name: 'Browser', value: auditData.browser + ' ' + auditData.browserVersion, inline: true },
                        { name: 'OS', value: auditData.os + ' ' + auditData.osVersion, inline: true },
                        { name: 'Screen', value: auditData.screenResolution + ' @ ' + auditData.colorDepth + 'bit', inline: true },
                        { name: 'Language', value: auditData.language, inline: true },
                        { name: 'Timezone', value: auditData.timezone, inline: true },
                        { name: 'Location', value: auditData.geo.city + ', ' + auditData.geo.region + ', ' + auditData.geo.country, inline: true },
                        { name: 'Coordinates', value: auditData.geo.latitude + ', ' + auditData.geo.longitude, inline: true },
                        { name: 'Page Visited', value: auditData.page, inline: true },
                        { name: 'Referrer', value: auditData.referrer, inline: true },
                        { name: 'CPU Cores', value: auditData.cores, inline: true },
                        { name: 'Memory', value: auditData.memory + ' GB', inline: true },
                        { name: 'Touch Device', value: auditData.touchSupport ? 'Yes' : 'No', inline: true },
                        { name: 'Session ID', value: '```' + auditData.sessionId + '```', inline: false },
                        { name: 'User Agent', value: '```' + auditData.userAgent + '```', inline: false }
                    ],
                    footer: { text: 'Audit Log System • ' + auditData.ip }
                }]
            };
            
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            });
        }
        
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Audit failed' });
    }
};
