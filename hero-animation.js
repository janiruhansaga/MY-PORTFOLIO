/**
 * PANTHER MASTER ANIMATION ENGINE & SCROLL CONTROLLER
 * Features: 60fps Canvas Frame Sequence, GSAP ScrollTrigger Integration, 
 * Lerp Interpolation, Magnetic Cursor, & Cinematic Section Reveals
 */

document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------------------------
    // 1. HERO FULL-SCREEN CANVAS SCROLL CONTROLLER (Controlled GSAP Pinning)
    // --------------------------------------------------------------------------
    const canvas = document.getElementById("hero-canvas");
    const container = document.getElementById("hero-scroll-track");
    const pinnedViewport = document.getElementById("hero-pinned-viewport");
    const heroTextContent = document.getElementById("hero-text-content");

    if (canvas && container && pinnedViewport) {
        const ctx = canvas.getContext("2d");
        const TOTAL_FRAMES = 240;
        const frames = [];
        const imagesLoaded = new Array(TOTAL_FRAMES).fill(false);
        let lastDrawnIndex = -1;

        // Format frame filename (Scrolling animation/ezgif-frame-001.jpg)
        function getFrameSrc(index) {
            const frameNum = String(index + 1).padStart(3, "0");
            return `Scrolling animation/ezgif-frame-${frameNum}.jpg`;
        }

        // Preload all frames efficiently
        function preloadFrames() {
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                const img = new Image();
                img.src = getFrameSrc(i);
                img.onload = () => {
                    imagesLoaded[i] = true;
                    if (i === 0 || i === lastDrawnIndex) {
                        drawFrame(lastDrawnIndex >= 0 ? lastDrawnIndex : 0);
                    }
                };
                frames.push(img);
            }
        }

        // Resize canvas to match display size & device pixel ratio
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            if (rect.width === 0 || rect.height === 0) return;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (lastDrawnIndex >= 0) {
                drawFrame(lastDrawnIndex);
            }
        }

        // Draw specific frame synchronously matching scroll progress
        function drawFrame(frameIndex) {
            const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIndex)));
            lastDrawnIndex = idx;
            let renderImg = frames[idx];

            if (!imagesLoaded[idx]) {
                for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
                    if (idx - offset >= 0 && imagesLoaded[idx - offset]) {
                        renderImg = frames[idx - offset];
                        break;
                    }
                    if (idx + offset < TOTAL_FRAMES && imagesLoaded[idx + offset]) {
                        renderImg = frames[idx + offset];
                        break;
                    }
                }
            }

            if (!renderImg || !renderImg.complete || renderImg.naturalWidth === 0) return;

            const rect = canvas.getBoundingClientRect();
            const canvasWidth = rect.width;
            const canvasHeight = rect.height;

            if (canvasWidth === 0 || canvasHeight === 0) return;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Cover scaling math
            const imgAspect = renderImg.naturalWidth / renderImg.naturalHeight;
            const canvasAspect = canvasWidth / canvasHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (canvasAspect > imgAspect) {
                drawWidth = canvasWidth;
                drawHeight = canvasWidth / imgAspect;
            } else {
                drawHeight = canvasHeight;
                drawWidth = canvasHeight * imgAspect;
            }

            offsetX = (canvasWidth - drawWidth) / 2;
            offsetY = (canvasHeight - drawHeight) / 2;

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(renderImg, offsetX, offsetY, drawWidth, drawHeight);
        }

        // Scroll-synced cinematic typography scene animator
        function updateCinematicScenes(progress) {
            // Initial Hero CTA Card (fades out from progress 0.06 to 0.16)
            if (heroTextContent) {
                if (progress < 0.06) {
                    heroTextContent.style.opacity = "1";
                    heroTextContent.style.transform = "translateY(0px)";
                    heroTextContent.style.pointerEvents = "auto";
                } else if (progress >= 0.06 && progress <= 0.16) {
                    const t = (progress - 0.06) / (0.16 - 0.06);
                    heroTextContent.style.opacity = (1 - t).toFixed(3);
                    heroTextContent.style.transform = `translateY(${-t * 40}px)`;
                    heroTextContent.style.pointerEvents = "none";
                } else {
                    heroTextContent.style.opacity = "0";
                    heroTextContent.style.pointerEvents = "none";
                }
            }

            // Animate an individual scene block based on progress window
            function animateScene(sceneId, startP, endP, isCenter) {
                const el = document.getElementById(sceneId);
                if (!el) return;

                const lineEl = el.querySelector(".scene-accent-line");

                if (progress < startP || progress > endP) {
                    el.style.opacity = "0";
                    el.style.transform = isCenter 
                        ? "translate(-50%, -50%) translateY(30px)" 
                        : "translateY(30px)";
                    el.style.filter = "blur(6px)";
                    if (lineEl) lineEl.style.width = "0px";
                    return;
                }

                const sceneLen = endP - startP;
                const relP = (progress - startP) / sceneLen; // 0.0 to 1.0 within window

                let opacity = 0;
                let translateY = 30;
                let blur = 6;
                let lineW = 0;

                if (relP <= 0.25) {
                    // Entrance: Fade in, rise, unblur, line expansion
                    const t = relP / 0.25;
                    opacity = t;
                    translateY = 30 * (1 - t);
                    blur = 6 * (1 - t);
                    lineW = 60 * t;
                } else if (relP > 0.25 && relP <= 0.75) {
                    // Hold: Crisp display
                    opacity = 1;
                    translateY = 0;
                    blur = 0;
                    lineW = 60;
                } else {
                    // Exit: Fade out, slide upward, blur
                    const t = (relP - 0.75) / 0.25;
                    opacity = 1 - t;
                    translateY = -25 * t;
                    blur = 4 * t;
                    lineW = 60 * (1 - t);
                }

                el.style.opacity = opacity.toFixed(3);
                el.style.transform = isCenter 
                    ? `translate(-50%, -50%) translateY(${translateY.toFixed(1)}px)` 
                    : `translateY(${translateY.toFixed(1)}px)`;
                el.style.filter = `blur(${blur.toFixed(1)}px)`;
                if (lineEl) lineEl.style.width = `${lineW.toFixed(1)}px`;
            }

            // Sync 5 scenes with visual frame milestones
            animateScene("scene-1", 0.02, 0.20, false);
            animateScene("scene-2", 0.20, 0.40, false);
            animateScene("scene-3", 0.40, 0.60, false);
            animateScene("scene-4", 0.60, 0.80, false);
            animateScene("scene-5", 0.80, 0.98, true);
        }

        // Initialize Canvas & Preload
        preloadFrames();
        resizeCanvas();
        drawFrame(0);
        updateCinematicScenes(0);

        // GSAP ScrollTrigger Pinned Frame Sequence
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);

            // SINGLE Controlled ScrollTrigger for Hero Canvas Pinning & Progress
            ScrollTrigger.create({
                trigger: container,
                pin: pinnedViewport,
                start: "top top",
                end: () => "+=" + Math.max(2500, window.innerHeight * 3),
                scrub: true,
                pinSpacing: true,
                onUpdate: (self) => {
                    const progress = self.progress; // 0.0 to 1.0
                    const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));
                    const index = Math.max(0, Math.min(frameIndex, TOTAL_FRAMES - 1));
                    
                    // Render frame synchronously matching scroll progress
                    drawFrame(index);
                    
                    // Update text scene animations synchronized with frame playback
                    updateCinematicScenes(progress);
                },
                onRefresh: () => {
                    resizeCanvas();
                    if (lastDrawnIndex >= 0) {
                        drawFrame(lastDrawnIndex);
                    }
                }
            });
        }

        window.addEventListener("resize", () => {
            resizeCanvas();
            if (typeof ScrollTrigger !== "undefined") {
                ScrollTrigger.refresh();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 2. MAGNETIC DESKTOP CURSOR SYSTEM
    // --------------------------------------------------------------------------
    function initCustomCursor() {
        const cursor = document.getElementById("custom-cursor");
        const cursorDot = cursor ? cursor.querySelector(".cursor-dot") : null;
        const cursorRing = cursor ? cursor.querySelector(".cursor-ring") : null;
        const cursorText = document.getElementById("cursor-text");

        if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

        let mouseX = -100, mouseY = -100;
        let ringX = -100, ringY = -100;

        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (cursorDot) {
                cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
            }
            cursor.classList.add("active");
        });

        function animateCursorRing() {
            ringX += (mouseX - ringX) * 0.2;
            ringY += (mouseY - ringY) * 0.2;

            if (cursorRing) {
                cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
            }
            requestAnimationFrame(animateCursorRing);
        }
        animateCursorRing();

        // Magnetic hover listeners
        document.addEventListener("mouseover", (e) => {
            const trigger = e.target.closest(".cursor-hover-trigger, a, button, .btn, .editorial-item, .work-card, .featured-card");
            if (trigger) {
                cursor.classList.add("hovering");
                const customLabel = trigger.getAttribute("data-cursor");
                if (customLabel && cursorText) {
                    cursorText.textContent = customLabel;
                    cursor.classList.add("has-text");
                }
            }
        });

        document.addEventListener("mouseout", (e) => {
            const trigger = e.target.closest(".cursor-hover-trigger, a, button, .btn, .editorial-item, .work-card, .featured-card");
            if (trigger) {
                cursor.classList.remove("hovering", "has-text");
                if (cursorText) cursorText.textContent = "";
            }
        });
    }
    initCustomCursor();

    // --------------------------------------------------------------------------
    // 3. GSAP SCROLLTRIGGER SECTION REVEALS
    // --------------------------------------------------------------------------
    function initScrollReveals() {
        if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
            // Animate reveal elements
            gsap.utils.toArray(".reveal-on-scroll").forEach((el) => {
                gsap.fromTo(el, 
                    { opacity: 0, y: 50, scale: 0.98, filter: "blur(6px)" },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // Animate project images scale on scroll
            gsap.utils.toArray(".work-img, .featured-img, .about-img").forEach((img) => {
                gsap.fromTo(img,
                    { scale: 1.12 },
                    {
                        scale: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: img.parentElement,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            });
        } else {
            // IntersectionObserver Fallback
            const observerOptions = {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll(".reveal-on-scroll").forEach(el => {
                revealObserver.observe(el);
            });
        }
    }
    initScrollReveals();
});
