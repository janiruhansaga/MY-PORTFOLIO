const navbarHTML = `
    <nav id="global-nav">
        <a href="index.html" class="logo cursor-hover-trigger" data-cursor="JANIRU">JANIRU HANSAGA</a>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html" class="cursor-hover-trigger" data-cursor="HOME">Home</a></li>
            <li><a href="index.html#about" class="cursor-hover-trigger" data-cursor="ABOUT">About</a></li>
            <li><a href="index.html#expertise" class="cursor-hover-trigger" data-cursor="SKILLS">Expertise</a></li>
            <li><a href="index.html#work" class="cursor-hover-trigger" data-cursor="WORK">Work</a></li>
            <li><a href="https://jhnexustoollk.vercel.app/"target="_blank" class="cursor-hover-trigger" data-cursor="TOOLKIT">Toolkit</a></li>
            <li><a href="download.html" class="cursor-hover-trigger" data-cursor="DOWNLOADS">Downloads</a></li>
            <li><a href="contact.html" class="cursor-hover-trigger" data-cursor="CONTACT">Contact</a></li>
        </ul>
        <div class="hamburger" onclick="toggleMenu()">
            <i class="fa-solid fa-bars"></i>
        </div>
    </nav>
`;

const footerHTML = `
    <footer id="global-footer">
        <div class="footer-content">
            <div class="footer-brand">
                <h3>JANIRU HANSAGA</h3>
                <p>Engineering cinematic digital experiences, interactive web applications, and scalable software architectures.</p>
            </div>
            <div class="footer-socials">
                <a href="https://www.facebook.com/janiruofficial" class="social-hacker-link cursor-hover-trigger" target="_blank" title="Facebook" data-cursor="FB"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/janiruofficial/" class="social-hacker-link cursor-hover-trigger" target="_blank" title="Instagram" data-cursor="IG"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://whatsapp.com/channel/0029VbBx2Y75kg7DlgHl8109" class="social-hacker-link cursor-hover-trigger" target="_blank" title="WhatsApp Channel" data-cursor="WA"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
            <div class="footer-copyright">
                <p>&copy; 2026 JANIRU HANSAGA. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
    </footer>
`;

// Inject components
document.addEventListener("DOMContentLoaded", () => {
    // Ensure style.css is linked for global styles
    if (!document.querySelector('link[href="style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'style.css';
        document.head.appendChild(link);
    }

    // Inject navbar at the start of body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    // Inject footer at the end of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Navbar scroll state
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('global-nav');
        if (nav) {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    }, { passive: true });

    // Active link highlighting
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
});

// Mobile Hamburger menu toggle
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if (nav) nav.classList.toggle("active");
    const icon = document.querySelector(".hamburger i");
    if (icon) {
        if (nav.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }
}
