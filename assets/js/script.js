"use strict";

function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=" + d.toUTCString();
}

function getCookie(name) {
    for (var c of document.cookie.split('; ')) {
        var parts = c.split('=');
        if (parts[0] === name) return decodeURIComponent(parts[1]);
    }
    return null;
}

document.addEventListener("DOMContentLoaded", function () {

    var toggle = document.getElementById("darkModeToggle");
    var langToggle = document.getElementById("langToggle");
    var burgerBtn = document.getElementById("burgerBtn");
    var navDrawer = document.getElementById("navDrawer");
    var darkMobileBtn = document.getElementById("darkModeToggleMobile");
    var langMobileBtn = document.getElementById("langToggleMobile");
    var popup = document.getElementById("cookiePopup");
    var closeBtn = document.getElementById("closeBtn");
    var snNav = document.getElementById("sideNav");
    var snPill = document.getElementById("sideNavPill");

    // ---- SYNC BOUTONS MOBILES ----

    function syncMobileButtons() {
        if (darkMobileBtn && toggle) darkMobileBtn.innerHTML = toggle.innerHTML;
        if (langMobileBtn && langToggle) langMobileBtn.textContent = langToggle.textContent;
    }

    // ---- DARK MODE ----

    var isDark = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", isDark);

    function updateDarkModeIcon() {
        if (!toggle) return;
        if (isDark) {
            toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>';
        } else {
            toggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>';
        }
        syncMobileButtons();
    }

    updateDarkModeIcon();

    if (toggle) {
        toggle.addEventListener("click", function () {
            isDark = document.body.classList.toggle("dark");
            localStorage.setItem("darkMode", isDark);
            updateDarkModeIcon();
        });
    }

    // ---- LANGUE ----

    var currentLang = getCookie("lang") || "fr";
    document.documentElement.lang = currentLang;

    function updateLangButton() {
        if (!langToggle) return;
        langToggle.textContent = currentLang === "fr" ? "\uD83C\uDDEB\uD83C\uDDF7 FR" : "\uD83C\uDDEC\uD83C\uDDE7 EN";
        syncMobileButtons();
    }

    function translatePage() {
        document.querySelectorAll("[data-fr]").forEach(function (el) {
            el.textContent = el.dataset[currentLang];
        });
        document.querySelectorAll("[data-label-fr]").forEach(function (el) {
            el.setAttribute("data-label", el.dataset["label" + currentLang.charAt(0).toUpperCase() + currentLang.slice(1)]);
        });
        var contactTitle = document.getElementById("contactTitle");
        if (contactTitle) {
            contactTitle.innerHTML = currentLang === "en"
                ? "Let's work<br><span>together.</span>"
                : "Travaillons<br><span>ensemble.</span>";
        }

    }

    translatePage();
    updateLangButton();

    if (langToggle) {
        langToggle.addEventListener("click", function () {
            currentLang = currentLang === "fr" ? "en" : "fr";
            setCookie("lang", currentLang, 365);
            document.documentElement.lang = currentLang;
            translatePage();
            updateLangButton();
        });
    }

    // ---- ANIMATION LOGO ----

    var logoDelay = 100;
    var logoDelayStart = 0;
    document.querySelectorAll(".logo").forEach(function (elem) {
        var contents = elem.textContent.trim();
        elem.textContent = "";
        var letters = contents.split("");
        elem.style.visibility = "visible";
        letters.forEach(function (letter, index) {
            setTimeout(function () { elem.textContent += letter; }, logoDelayStart + logoDelay * index);
        });
        logoDelayStart += logoDelay * letters.length;
    });

    // ---- FONDU DES LIENS NAV ----

    document.querySelectorAll(".header-nav a").forEach(function (el, i) {
        setTimeout(function () { el.classList.add("visible"); }, 800 + i * 200);
    });

    // ---- COOKIE POPUP ----

    if (popup && closeBtn) {
        if (!getCookie("cookiePopupSeen")) {
            setTimeout(function () { popup.classList.add("show"); }, 500);
            setTimeout(function () {
                popup.classList.remove("show");
                setCookie("cookiePopupSeen", "true", 365);
            }, 5500);
        }
        closeBtn.addEventListener("click", function () {
            popup.classList.remove("show");
            setCookie("cookiePopupSeen", "true", 365);
        });
    }

    // ---- BURGER MENU MOBILE ----

    if (burgerBtn && navDrawer) {
        burgerBtn.addEventListener("click", function () {
            burgerBtn.classList.toggle("open");
            navDrawer.classList.toggle("open");
        });

        navDrawer.querySelectorAll(".nav-drawer-link").forEach(function (link) {
            link.addEventListener("click", function () {
                burgerBtn.classList.remove("open");
                navDrawer.classList.remove("open");
            });
        });
    }

    if (darkMobileBtn) darkMobileBtn.addEventListener("click", function () { if (toggle) toggle.click(); });
    if (langMobileBtn) langMobileBtn.addEventListener("click", function () { if (langToggle) langToggle.click(); });

    syncMobileButtons();

    // ---- SIDEBAR ----

    var SN_IDS = ["À_propos", "Skills", "Projets", "Parcours", "Contact"];
    var SN_COLORS = ["#e8ff57", "#ff4d6d", "#00d9ff", "#e8ff57", "#b87cff"];
    var SN_SHADOWS = [
        "rgba(232,255,87,0.5)",
        "rgba(255,77,109,0.5)",
        "rgba(0,217,255,0.5)",
        "rgba(232,255,87,0.5)",
        "rgba(184,124,255,0.5)"
    ];

    var snBtns = [0, 1, 2, 3, 4].map(function (i) { return document.getElementById("snBtn" + i); });
    var snTargets = SN_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    var currentSection = -1;

    function sideNavSetActive(i) {
        if (i === currentSection) return;
        currentSection = i;

        snBtns.forEach(function (btn, j) {
            if (!btn) return;
            btn.classList.toggle("active", j === i);
            btn.style.color = j === i ? SN_COLORS[i] : "";
        });

        if (!snNav || !snPill || !snBtns[i]) return;
        var navRect = snNav.getBoundingClientRect();
        var btnRect = snBtns[i].getBoundingClientRect();
        snPill.style.top = (btnRect.top - navRect.top + (btnRect.height - 28) / 2) + "px";
        snPill.style.background = SN_COLORS[i];
        snPill.style.boxShadow = "0 0 10px 2px " + SN_SHADOWS[i];

        // Met à jour la barre de progression avec la couleur de la section
        var bar = document.getElementById("scrollProgressBar");
        if (bar) bar.style.background = SN_COLORS[i];
    }

    function detectSection() {
        var trigger = window.scrollY + window.innerHeight * 0.30;
        var active = 0;
        snTargets.forEach(function (el, i) {
            if (el.offsetTop <= trigger) active = i;
        });
        sideNavSetActive(active);
    }

    // ---- BARRE DE PROGRESSION SCROLL (feature 5) ----

    var scrollBar = document.getElementById("scrollProgressBar");

    function updateScrollBar() {
        if (!scrollBar) return;
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollBar.style.width = pct + "%";
    }

    var ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                detectSection();
                updateScrollBar();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.sideNavGoTo = function (i) {
        var el = document.getElementById(SN_IDS[i]);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth" });
        sideNavSetActive(i);
    };

    detectSection();
    updateScrollBar();

    // ---- ANIMATIONS AU SCROLL (feature 4) ----
    // Tous les éléments avec .reveal apparaissent en glissant vers le haut

    if ("IntersectionObserver" in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach(function (el) {
            revealObserver.observe(el);
        });

        // Skills — animation des barres
        var skillObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll(".skill-card").forEach(function (card) {
            skillObserver.observe(card);
        });

        // Timeline — animation des items
        var timelineObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll(".timeline-item").forEach(function (item) {
            timelineObserver.observe(item);
        });
    }

    // ---- TITRE ONGLET — FLICKER QUAND INACTIF (feature 6) ----

    var originalTitle = document.title;
    var altTitle = "\uD83D\uDCBC Ouvert aux offres — Clément Humez";
    var titleInterval = null;
    var titleToggle = false;

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            titleInterval = setInterval(function () {
                document.title = titleToggle ? altTitle : originalTitle;
                titleToggle = !titleToggle;
            }, 4000);
        } else {
            clearInterval(titleInterval);
            document.title = originalTitle;
            titleToggle = false;
        }
    });

    // ---- TERMINAL EASTER EGG ----

    var terminalOverlay = document.getElementById("terminalOverlay");
    var terminalBody = document.getElementById("terminalBody");
    var terminalInput = document.getElementById("terminalInput");

    var cmdHistory = [];
    var cmdIndex = -1;

    var KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    var konamiPos = 0;

    var INTRO_LINES = [
        { text: "  \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557      \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2557  \u2588\u2588\u2557", cls: "purple" },
        { text: " \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2554\u255d", cls: "purple" },
        { text: " \u2588\u2588\u2551     \u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2554\u2557 ", cls: "purple" },
        { text: " \u2588\u2588\u2551     \u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2588\u2588\u2557 ", cls: "purple" },
        { text: " \u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2557", cls: "purple" },
        { text: "  \u255a\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d\u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d", cls: "purple" },
        { text: "", cls: "muted" },
        { text: " Clément Humez — Portfolio v2.0.0", cls: "white" },
        { text: " Développeur Junior · Cybersécurité", cls: "muted" },
        { text: "", cls: "muted" },
        { text: " Tu as trouvé l'easter egg \uD83C\uDF89", cls: "green" },
        { text: " Tape 'help' pour voir les commandes.", cls: "muted" },
        { text: "", cls: "muted" },
    ];

    var COMMANDS = {
        help: [
            { text: " Commandes disponibles :", cls: "white" },
            { text: "  whoami    \u2192 qui suis-je ?", cls: "" },
            { text: "  skills    \u2192 mes compétences", cls: "" },
            { text: "  ctf       \u2192 mes challenges", cls: "" },
            { text: "  contact   \u2192 me contacter", cls: "" },
            { text: "  matrix    \u2192 \uD83D\uDC07", cls: "" },
            { text: "  clear     \u2192 vider le terminal", cls: "" },
            { text: "  exit      \u2192 fermer", cls: "" },
        ],
        whoami: [
            { text: " Clément Humez", cls: "white" },
            { text: " Développeur junior full-stack", cls: "" },
            { text: " Passionné de cybersécurité & CTF", cls: "" },
            { text: " Basé en France \uD83C\uDDEB\uD83C\uDDF7", cls: "" },
            { text: " Recherche alternance / stage", cls: "green" },
        ],
        skills: [
            { text: " Stack technique :", cls: "white" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591] HTML/CSS    90%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] Python     85%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] JavaScript 82%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] PHP/Symfony 78%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] React      70%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591] Java       68%", cls: "green" },
            { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591] CTF/Secu   65%", cls: "red" },
        ],
        ctf: [
            { text: " CTF & Cybersécurité :", cls: "white" },
            { text: "  Plateformes : Root-Me, TryHackMe", cls: "" },
            { text: "  Catégories  : Web, Forensics, Misc", cls: "" },
            { text: "  Niveau      : Débutant → Intermédiaire", cls: "" },
            { text: "  Objectif    : Spécialisation sécurité", cls: "green" },
        ],
        contact: [
            { text: " Me contacter :", cls: "white" },
            { text: "  Email    : humez.clement@gmail.com", cls: "" },
            { text: "  LinkedIn : Clément Humez", cls: "" },
            { text: "  GitHub   : Clement-Dev60", cls: "" },
        ],
        matrix: [
            { text: " Wake up, Neo...", cls: "green" },
            { text: " The Matrix has you.", cls: "green" },
            { text: " Follow the white rabbit. \uD83D\uDC07", cls: "green" },
        ],
        exit: null,
        clear: null,
    };

    function addLine(text, cls, delay) {
        var p = document.createElement("p");
        p.className = "terminal-line" + (cls ? " " + cls : "");
        p.textContent = text;
        terminalBody.appendChild(p);
        setTimeout(function () { p.classList.add("show"); }, delay || 0);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function openTerminal() {
        if (!terminalOverlay) return;
        terminalOverlay.classList.add("open");
        terminalBody.innerHTML = "";
        INTRO_LINES.forEach(function (l, i) { addLine(l.text, l.cls, i * 40); });
        setTimeout(function () { if (terminalInput) terminalInput.focus(); }, INTRO_LINES.length * 40 + 100);
    }

    function closeTerminal() {
        if (!terminalOverlay) return;
        terminalOverlay.classList.remove("open");
    }

    window.closeTerminal = closeTerminal;

    function runCommand(cmd) {
        cmd = cmd.trim().toLowerCase();
        if (!cmd) return;
        addLine("\u27A4  " + cmd, "");
        cmdHistory.unshift(cmd);
        cmdIndex = -1;
        if (cmd === "exit") { closeTerminal(); return; }
        if (cmd === "clear") { terminalBody.innerHTML = ""; return; }
        var lines = COMMANDS[cmd];
        if (lines) {
            lines.forEach(function (l, i) { addLine(l.text, l.cls, i * 60); });
        } else {
            addLine(" Commande inconnue : '" + cmd + "'. Tape 'help'.", "red");
        }
        addLine("", "muted");
    }

    if (terminalInput) {
        terminalInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") { runCommand(terminalInput.value); terminalInput.value = ""; }
            if (e.key === "ArrowUp") { cmdIndex = Math.min(cmdIndex + 1, cmdHistory.length - 1); terminalInput.value = cmdHistory[cmdIndex] || ""; }
            if (e.key === "ArrowDown") { cmdIndex = Math.max(cmdIndex - 1, -1); terminalInput.value = cmdIndex >= 0 ? cmdHistory[cmdIndex] : ""; }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { closeTerminal(); return; }
        if (e.ctrlKey && e.shiftKey && e.key === "K") { e.preventDefault(); openTerminal(); return; }
        if (e.keyCode === KONAMI[konamiPos]) {
            konamiPos++;
            if (konamiPos === KONAMI.length) { konamiPos = 0; openTerminal(); }
        } else { konamiPos = 0; }
    });

    if (terminalOverlay) {
        terminalOverlay.addEventListener("click", function (e) {
            if (e.target === terminalOverlay) closeTerminal();
        });
    }

});