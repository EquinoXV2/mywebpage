(function() {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.background = '#FFFFFF';
    dot.style.borderRadius = '50%';
    dot.style.position = 'fixed';
    dot.style.top = '0';
    dot.style.left = '0';
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '99999';
    dot.style.boxShadow = '0 0 10px #FFFFFF, 0 0 20px #FF0000';
    dot.style.transition = 'width 0.2s, height 0.2s';
    
    ring.style.width = '40px';
    ring.style.height = '40px';
    ring.style.border = '2px solid #FF0000';
    ring.style.borderRadius = '50%';
    ring.style.position = 'fixed';
    ring.style.top = '0';
    ring.style.left = '0';
    ring.style.pointerEvents = 'none';
    ring.style.zIndex = '99998';
    ring.style.boxShadow = '0 0 15px #FF0000, 0 0 30px rgba(255, 0, 0, 0.3)';
    ring.style.transition = 'width 0.3s, height 0.3s, border-color 0.3s';
    
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    
    document.body.style.cursor = 'none';
    document.querySelectorAll('a, button, img, marquee, input, select, textarea').forEach(el => {
        el.style.cursor = 'none';
    });
    
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = 'translate(' + (mouseX - 4) + 'px, ' + (mouseY - 4) + 'px)';
    });
    
    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = 'translate(' + (ringX - 20) + 'px, ' + (ringY - 20) + 'px)';
        requestAnimationFrame(animateRing);
    }
    
    animateRing();
    
    document.querySelectorAll('a, button, img, marquee').forEach(el => {
        el.addEventListener('mouseenter', function() {
            dot.style.width = '12px';
            dot.style.height = '12px';
            ring.style.width = '60px';
            ring.style.height = '60px';
            ring.style.borderColor = '#FFFFFF';
            ring.style.boxShadow = '0 0 20px #FFFFFF, 0 0 40px rgba(255, 255, 255, 0.3)';
        });
        
        el.addEventListener('mouseleave', function() {
            dot.style.width = '8px';
            dot.style.height = '8px';
            ring.style.width = '40px';
            ring.style.height = '40px';
            ring.style.borderColor = '#FF0000';
            ring.style.boxShadow = '0 0 15px #FF0000, 0 0 30px rgba(255, 0, 0, 0.3)';
        });
    });
    
    document.addEventListener('mousedown', function(e) {
        const ripple = document.createElement('div');
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.border = '2px solid #FF0000';
        ripple.style.borderRadius = '50%';
        ripple.style.position = 'fixed';
        ripple.style.left = (e.clientX - 5) + 'px';
        ripple.style.top = (e.clientY - 5) + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '99997';
        ripple.style.transition = 'all 0.4s ease-out';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.style.width = '80px';
            ripple.style.height = '80px';
            ripple.style.left = (e.clientX - 40) + 'px';
            ripple.style.top = (e.clientY - 40) + 'px';
            ripple.style.opacity = '0';
            ripple.style.borderColor = '#FFFFFF';
        }, 10);
        
        setTimeout(() => ripple.remove(), 500);
        
        dot.style.width = '16px';
        dot.style.height = '16px';
        dot.style.boxShadow = '0 0 20px #FFFFFF, 0 0 40px #FF0000';
    });
    
    document.addEventListener('mouseup', function() {
        dot.style.width = '8px';
        dot.style.height = '8px';
        dot.style.boxShadow = '0 0 10px #FFFFFF, 0 0 20px #FF0000';
    });
})();
