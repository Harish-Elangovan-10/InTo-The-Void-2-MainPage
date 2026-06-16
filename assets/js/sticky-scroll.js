document.addEventListener('DOMContentLoaded', () => {
    let isScrolling = false;

    // Get all valid snap points: sections, sponsors div, and footer
    const getSnapPoints = () => {
        // Exclude hyper-inline from generic sections because we handle it specially
        const points = Array.from(document.querySelectorAll('main > section:not(#hyper-inline), #sponsors, footer'));
        const hyper = document.getElementById('hyper-inline');
        if (hyper) points.push(hyper);
        
        // Sort points by their vertical position
        return points.sort((a, b) => a.offsetTop - b.offsetTop);
    };

    function scrollToTarget(direction) {
        if (isScrolling) return;

        const points = getSnapPoints();
        const currentY = window.scrollY;
        const offsetThreshold = 10; 
        
        let targetY = null;

        if (direction === 1) { // scrolling down
            for (let point of points) {
                if (point.id === 'hyper-inline') {
                    // Top edge
                    if (point.offsetTop > currentY + offsetThreshold) {
                        targetY = point.offsetTop;
                        break;
                    }
                    // Bottom edge
                    const bottom = point.offsetTop + point.offsetHeight - window.innerHeight;
                    if (bottom > currentY + offsetThreshold) {
                        targetY = bottom;
                        break;
                    }
                } else {
                    let y = point.offsetTop;
                    // If it has a navbar offset, we can apply it here
                    // e.g. if (point.id === 'event' || point.id === 'registration') y -= 80;
                    if (y > currentY + offsetThreshold) {
                        targetY = y;
                        break;
                    }
                }
            }
        } else { // scrolling up
            for (let i = points.length - 1; i >= 0; i--) {
                let point = points[i];
                if (point.id === 'hyper-inline') {
                    // Bottom edge
                    const bottom = point.offsetTop + point.offsetHeight - window.innerHeight;
                    if (bottom < currentY - offsetThreshold) {
                        targetY = bottom;
                        break;
                    }
                    // Top edge
                    if (point.offsetTop < currentY - offsetThreshold) {
                        targetY = point.offsetTop;
                        break;
                    }
                } else {
                    let y = point.offsetTop;
                    if (y < currentY - offsetThreshold) {
                        targetY = y;
                        break;
                    }
                }
            }
        }

        if (targetY !== null) {
            isScrolling = true;
            window.scrollTo({
                top: Math.max(0, targetY),
                behavior: 'smooth'
            });

            setTimeout(() => {
                isScrolling = false;
            }, 800); // Lock scrolling during the animation
        } else {
            // Fallback
            isScrolling = true;
            window.scrollBy({
                top: window.innerHeight * direction,
                behavior: 'smooth'
            });
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    }

    // Handle mouse wheel scrolling
    window.addEventListener('wheel', (e) => {
        // Allow free scrolling inside hyper-inline
        const hyper = document.getElementById('hyper-inline');
        if (hyper) {
            const rect = hyper.getBoundingClientRect();
            // If viewport is entirely inside hyper-inline (with 5px threshold for sub-pixel rendering)
            if (rect.top <= 5 && rect.bottom >= window.innerHeight - 5) {
                // If we are at the very top and scrolling UP, let it snap to previous section
                if (rect.top >= -5 && e.deltaY < 0) {
                    // fall through to scrollToTarget
                } 
                // If we are at the very bottom and scrolling DOWN, let it snap to next section
                else if (rect.bottom <= window.innerHeight + 5 && e.deltaY > 0) {
                    // fall through to scrollToTarget
                } 
                else {
                    return; // allow free native scroll
                }
            }
        }

        e.preventDefault();
        
        if (isScrolling) return;

        const direction = e.deltaY > 0 ? 1 : -1;
        scrollToTarget(direction);
    }, { passive: false });

    // Handle keyboard scrolling
    window.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) {
            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag === 'input' || activeTag === 'textarea') {
                return;
            }

            const hyper = document.getElementById('hyper-inline');
            if (hyper) {
                const rect = hyper.getBoundingClientRect();
                if (rect.top <= 5 && rect.bottom >= window.innerHeight - 5) {
                    let direction = (e.key === 'ArrowUp' || e.key === 'PageUp') ? -1 : 1;
                    if (rect.top >= -5 && direction === -1) {
                        // fall through
                    } else if (rect.bottom <= window.innerHeight + 5 && direction === 1) {
                        // fall through
                    } else {
                        return; // allow free native scroll
                    }
                }
            }

            e.preventDefault();
            if (isScrolling) return;

            let direction = (e.key === 'ArrowUp' || e.key === 'PageUp') ? -1 : 1;
            scrollToTarget(direction);
        }
    }, { passive: false });
});
