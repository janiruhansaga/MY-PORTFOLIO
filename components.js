const navbarHTML = `
    <nav id="global-nav">
        <a href="https://janiruhansaga.com" class="logo">Janiru Hansaga</a>
        <ul class="nav-links" id="navLinks">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="prompt.html">Prompt</a></li>
            <li><a href="post.html">Post</a></li>
            <li><a href="janiruonline.html">MY Tool</a></li>
            <li><a href="https://pastpaperslk.lovable.app/" target="_blank">Past Papers</a></li>
            <li><a href="download.html">Download</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li class="theme-switch-wrapper">
                <label class="theme-switch" for="checkbox">
                    <input type="checkbox" id="checkbox" />
                    <div class="slider round"></div>
                </label>
            </li>
        </ul>
        <div class="hamburger" onclick="toggleMenu()">
            <i class="fa-solid fa-bars"></i>
        </div>
    </nav>
`;

const footerHTML = `
    <footer id="global-footer" class="footer-cyber">
        <div class="footer-content">
            <div class="footer-brand">
                <h3>Janiru Hansaga</h3>
                <p>Building futuristic digital experiences through AI, design and development.</p>
            </div>
            <div class="footer-socials">
                <a href="https://www.tiktok.com/@ceylonedits.lk" class="social-hacker-link" target="_blank" title="TikTok"><i class="fa-brands fa-tiktok"></i></a>
                <a href="https://www.facebook.com/janiruofficial" class="social-hacker-link" target="_blank" title="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://www.instagram.com/janiruofficial/" class="social-hacker-link" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://whatsapp.com/channel/0029VbBx2Y75kg7DlgHl8109" class="social-hacker-link" target="_blank" title="WhatsApp Channel"><i class="fa-brands fa-whatsapp"></i></a>
            </div>
            <div class="footer-copyright">
                <p>&copy; 2026 Janiru Hansaga.<br>All Rights Reserved.</p>
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

    // Active link highlighting
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });

    // Setup Theme Switcher (from old script)
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        if (currentTheme === 'dark-mode') {
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
            if (toggleSwitch) toggleSwitch.checked = true;
        } else if (currentTheme === 'light') {
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
            if (toggleSwitch) toggleSwitch.checked = false;
        }
    }
    if (toggleSwitch) {
        toggleSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
});

// Hamburger menu toggle
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    if(nav) nav.classList.toggle("active");
    const icon = document.querySelector(".hamburger i");
    if(icon) {
        if (nav.classList.contains("active")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }
}
