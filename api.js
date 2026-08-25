const { kv } = require('@vercel/kv');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    
    try {
        let count = await kv.get('visitor_count');
        
        if (count === null) {
            count = 0;
        }
        
        count = parseInt(count) + 1;
        await kv.set('visitor_count', count);
        
        res.status(200).json({ count: count });
    } catch (error) {
        res.status(500).json({ error: 'Counter unavailable', count: 0 });
    }
};
