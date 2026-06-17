(function () {
    const ITEM_COUNT = 12, STAR_COUNT = 80, Z_GAP = 800;
    const LOOP_SIZE = ITEM_COUNT * Z_GAP, CAM_SPEED = 2.2;
    const TEXTS =["WEB", "FORENSICS","BINARY","ML", "MISC", "CRYPTO", "REVERSE", "OSINT", "NETWORK", "kernal"];

    let mouseX = 0, mouseY = 0, vel = 0, targetVel = 0;
    let paused = false;

    const world = document.getElementById('hi-world');
    const vp = document.getElementById('hi-viewport');
    const elVel = document.getElementById('hi-vel');
    const elCo = document.getElementById('hi-coord');
    const items = [];

    for (let i = 0; i < ITEM_COUNT; i++) {
        const wrap = document.createElement('div');
        wrap.className = 'hi-item';
        if (i % 4 === 0) {
            const t = document.createElement('div');
            t.className = 'hi-big';
            t.textContent = TEXTS[i % TEXTS.length];
            wrap.appendChild(t);
            items.push({ el: wrap, type: 'text', x: 0, y: 0, rot: 0, baseZ: -i * Z_GAP });
        } else {
            const c = document.createElement('div');
            c.className = 'hi-card';
            c.innerHTML = `
        <div style="font-family:'JetBrains Mono',monospace;color:#ff003c;font-size:.75rem;letter-spacing:.1em;">ID-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}</div>
        <div style="font-size:2rem;font-weight:700;text-transform:uppercase;color:#fff;line-height:.95;">${TEXTS[i % TEXTS.length]}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:.65rem;color:rgba(255,255,255,.35);display:flex;justify-content:space-between;">
            <span>GRID ${Math.floor(Math.random() * 9)}x${Math.floor(Math.random() * 9)}</span>
            <span>${(Math.random() * 100).toFixed(1)} MB</span>
        </div>
        <div style="position:absolute;bottom:1.5rem;right:1.5rem;font-size:3rem;font-weight:900;opacity:.06;line-height:1;">0${i}</div>`;
            wrap.appendChild(c);
            const angle = (i / ITEM_COUNT) * Math.PI * 6;
            items.push({
                el: wrap, type: 'card',
                x: Math.cos(angle) * (window.innerWidth * .27),
                y: Math.sin(angle) * (window.innerHeight * .27),
                rot: (Math.random() - .5) * 28, baseZ: -i * Z_GAP
            });
        }
        world.appendChild(wrap);
    }
    for (let i = 0; i < STAR_COUNT; i++) {
        const s = document.createElement('div');
        s.className = 'hi-star';
        world.appendChild(s);
        items.push({
            el: s, type: 'star',
            x: (Math.random() - .5) * 3000, y: (Math.random() - .5) * 3000,
            baseZ: -Math.random() * LOOP_SIZE
        });
    }

    window.addEventListener('mousemove', e => {
        mouseX = (e.clientX / window.innerWidth - .5) * 2;
        mouseY = (e.clientY / window.innerHeight - .5) * 2;
    });

    const section = document.getElementById('hyper-inline');
    let lastSY = window.scrollY;

    const obs = new IntersectionObserver(([entry]) => {
        paused = !entry.isIntersecting;
    }, { threshold: 0 });
    if (section) obs.observe(section);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) paused = true;
        else if (section) {
            const rect = section.getBoundingClientRect();
            paused = rect.bottom < 0 || rect.top > window.innerHeight;
        }
    });

    function raf(t) {
        requestAnimationFrame(raf);
        if (paused) return;

        const sy = window.scrollY;
        const diff = sy - lastSY;
        lastSY = sy;

        targetVel = Math.min(Math.max(diff, -60), 60);
        vel += (targetVel - vel) * .1;

        if (elVel) elVel.textContent = Math.abs(vel).toFixed(2);
        if (elCo) elCo.textContent = Math.round(sy);

        world.style.transform = `rotateX(${mouseY * 4 - vel * .4}deg) rotateY(${mouseX * 4}deg)`;
        vp.style.perspective = `${Math.max(400, 1000 - Math.abs(vel) * 8)}px`;

        const sectionTop = section.offsetTop;
        const progress = Math.max(0, sy - sectionTop);
        const cameraZ = progress * CAM_SPEED;

        items.forEach(item => {
            let vizZ = ((item.baseZ + cameraZ) % LOOP_SIZE + LOOP_SIZE) % LOOP_SIZE;
            if (vizZ > 600) vizZ -= LOOP_SIZE;

            let alpha = 1;
            if (vizZ < -3000) alpha = 0;
            else if (vizZ < -2000) alpha = (vizZ + 3000) / 1000;
            if (vizZ > 100 && item.type !== 'star') alpha = 1 - (vizZ - 100) / 400;
            if (alpha <= 0) { item.el.style.opacity = 0; return; }
            item.el.style.opacity = alpha;

            let tr = `translate3d(${item.x}px,${item.y}px,${vizZ}px)`;
            if (item.type === 'star') {
                tr += ` scale3d(1,1,${Math.max(1, Math.min(1 + Math.abs(vel) * .15, 12))})`;
            } else if (item.type === 'text') {
                tr += ` rotateZ(${item.rot}deg)`;
                const ch = item.el.firstChild;
                if (ch) ch.style.textShadow = Math.abs(vel) > .5
                    ? `${vel * 2.5}px 0 #ff003c,${-vel * 2.5}px 0 #00f3ff` : 'none';
            } else {
                tr += ` rotateZ(${item.rot}deg) rotateY(${Math.sin(t * .0008 + item.x * .01) * 8}deg)`;
            }
            item.el.style.transform = tr;
        });
    }
    requestAnimationFrame(raf);
})();
