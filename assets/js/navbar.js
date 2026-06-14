document.addEventListener("DOMContentLoaded", function () {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                initNavbar();
            }
        })
        .catch(err => {
            console.warn('Error loading navbar via fetch (likely due to file:// protocol CORS restrictions). Using fallback.', err);
            const placeholder = document.getElementById('navbar-placeholder');
            if (placeholder) {
                // Fallback for local viewing without a web server
                placeholder.innerHTML = `
                <header class="liquid-navbar">
                    <div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop h-14 flex items-center justify-center gap-4 md:gap-6">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full border border-primary/40 bg-surface-container-lowest flex items-center justify-center shadow-[0_0_10px_rgba(0,219,233,0.2)]">
                                <span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">hive</span>
                            </div>
                        </div>
                        <div class="hidden md:flex items-center gap-4">
                            <nav class="flex items-center gap-2 md:gap-3">
                                <a class="nav-link active text-primary border-b-2 border-primary-container pb-1 drop-shadow-[0_0_8px_#00dbe9] font-label-caps text-label-caps" href="#home">Home</a>
                                <a class="nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" href="#event">Event</a>
                                <a class="nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" href="#registration">Registration</a>
                                <a class="nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" href="#hyper-inline">Category</a>
                                <a class="nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" href="#sponsors">Sponser</a>
                                <a class="nav-link text-on-surface-variant hover:text-primary transition-colors duration-300 font-label-caps text-label-caps" href="#contact">Contect</a>
                            </nav>
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-full border border-secondary/40 bg-secondary/10 flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(208,91,255,0.2)]">
                                    <span class="material-symbols-outlined text-secondary text-xl">person</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>`;
                initNavbar();
            }
        });
});

function initNavbar() {
    const sections = document.querySelectorAll("section[id], div[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const activeClasses = ["text-primary", "border-b-2", "border-primary-container", "pb-1", "drop-shadow-[0_0_8px_#00dbe9]"];
    const inactiveClasses = ["text-on-surface-variant", "hover:text-primary", "transition-colors", "duration-300"];

    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");

                navLinks.forEach(link => {
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add(...activeClasses);
                        link.classList.remove(...inactiveClasses);
                    } else {
                        link.classList.remove(...activeClasses);
                        link.classList.add(...inactiveClasses);
                    }
                });
            }
        });
    }, observerOptions);

    // Only observe sections that we have links for
    const linkedIds = Array.from(navLinks).map(link => link.getAttribute("href").substring(1));
    sections.forEach(sec => {
        if (linkedIds.includes(sec.getAttribute("id"))) {
            observer.observe(sec);
        }
    });
}
