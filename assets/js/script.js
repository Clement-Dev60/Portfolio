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
    var darkMobileBtn = document.getElementById("darkModeToggleMobile");
    var langMobileBtn = document.getElementById("langToggleMobile");
    var popup = document.getElementById("cookiePopup");
    var closeBtn = document.getElementById("closeBtn");
    var snNav = document.getElementById("sideNav");
    var snPill = document.getElementById("sideNavPill");


    // ---- CHOIX AFFICHAGE ----

    var displayPopup = document.getElementById("displayPopup");
    var uiBtn = document.getElementById("uiBtn");
    var terminalBtn = document.getElementById("terminalBtn");
    var btnSwitch = document.getElementById("btn-switch-terminal-ui");
    var terminalMode = false;

    function setMode(mode, firstVisit) {
        terminalMode = (mode === "terminal");
        localStorage.setItem("displayMode", mode);

        // Met à jour le bouton switch
        if (btnSwitch) {
            if (terminalMode) {
                btnSwitch.innerHTML = '<ion-icon name="browsers-outline"></ion-icon>';
                btnSwitch.setAttribute("data-label-fr", "Interface");
                btnSwitch.setAttribute("data-label-en", "Interface");
                btnSwitch.setAttribute("data-label", "Interface");
            } else {
                btnSwitch.innerHTML = '<ion-icon name="terminal-outline"></ion-icon>';
                btnSwitch.setAttribute("data-label-fr", "Terminal");
                btnSwitch.setAttribute("data-label-en", "Terminal");
                btnSwitch.setAttribute("data-label", "Terminal");
            }
            btnSwitch.classList.remove("active");
        }

        // Ouvre ou ferme le terminal
        if (terminalMode) {
            if (!firstVisit) closeTerminal();
            setTimeout(function () { openTerminal(); }, firstVisit ? 450 : 0);
        } else {
            closeTerminal();
        }
    }

    function closeDisplayPopup() {
        displayPopup.classList.add("hidden");
        setTimeout(function () { displayPopup.style.display = "none"; }, 400);
    }

    // Vérifie si un choix est déjà enregistré
    var savedMode = localStorage.getItem("displayMode");

    if (savedMode) {
        // Pas de popup — applique directement le mode sauvegardé
        displayPopup.style.display = "none";
        setMode(savedMode, true);
    } else {
        // Première visite — affiche le popup
        if (uiBtn) {
            uiBtn.addEventListener("click", function () {
                setMode("ui", false);
                closeDisplayPopup();
            });
        }
        if (terminalBtn) {
            terminalBtn.addEventListener("click", function () {
                setMode("terminal", true);
                closeDisplayPopup();
            });
        }
    }

    // Bouton switch — bascule entre les deux modes
    if (btnSwitch) {
        btnSwitch.addEventListener("click", function () {
            var newMode = terminalMode ? "ui" : "terminal";
            setMode(newMode, false);
        });
    }

    // ---- SYNC BOUTONS MOBILES ----

    function syncMobileButtons() {
        if (darkMobileBtn && toggle) darkMobileBtn.innerHTML = toggle.innerHTML;
        if (langMobileBtn && langToggle) langMobileBtn.textContent = langToggle.textContent;
    }

    // ---- DARK MODE ----

    var isDark = document.documentElement.classList.contains("dark");
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
            document.documentElement.classList.toggle("dark", isDark); // ← ligne ajoutée
            localStorage.setItem("darkMode", isDark);
            updateDarkModeIcon();
            currentSection = -1;
            detectSection();
        });
    }

    // ---- LANGUE ----


    var browserLang = navigator.language || navigator.userLanguage || "fr";
    var currentLang = getCookie("lang") || (browserLang.startsWith("fr") ? "fr" : "en");
    document.documentElement.lang = currentLang;

    const FLAG_FR = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60" width="20" height="13" style="vertical-align:middle;margin-right:4px"><rect width="30" height="60" fill="#002395"/><rect x="30" width="30" height="60" fill="#EDEDED"/><rect x="60" width="30" height="60" fill="#ED2939"/></svg>`;
    const FLAG_EN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="20" height="13" style="vertical-align:middle;margin-right:4px"><rect width="60" height="30" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4"/><path d="M30,0 V30 M0,15 H60" stroke="#fff" stroke-width="10"/><path d="M30,0 V30 M0,15 H60" stroke="#C8102E" stroke-width="6"/></svg>`;

    function updateLangButton() {
        if (!langToggle) return;
        langToggle.innerHTML = currentLang === "fr"
            ? `${FLAG_FR} FR`
            : `${FLAG_EN} EN`;
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
        var aboutBio = document.getElementById("about-bio");
        if (aboutBio) {
            aboutBio.innerHTML = currentLang === "en"
                ? "Junior <strong>full-stack</strong> developer with a solid grasp of both front-end and back-end environments. Comfortable across multiple languages — from <strong>JavaScript</strong> to <strong>Python</strong>, including <strong>Java</strong> and <strong>PHP/Symfony</strong> — I enjoy building robust applications as much as clean interfaces.<br><br>Passionate about <strong>cybersecurity</strong>, I actively explore attack and defense strategies, and am looking to deepen my expertise in this field through an <strong>apprenticeship or internship</strong>."
                : "Développeur junior <strong>full-stack</strong> avec une bonne maîtrise des environnements front et back. À l'aise sur plusieurs langages — de <strong>JavaScript</strong> à <strong>Python</strong> en passant par <strong>Java</strong> et <strong>PHP/Symfony</strong> — j'aime construire des applications robustes autant que des interfaces propres.<br><br>Passionné par la <strong>cybersécurité</strong>, je m'intéresse activement aux logiques d'attaque et de défense, et cherche à approfondir ce domaine dans le cadre d'une <strong>alternance ou d'un stage</strong>.";
        }
        var displayDesc = document.getElementById("displayDesc");
        if (displayDesc) {
            displayDesc.innerHTML = currentLang === "en"
                ? "Choose a view"
                : "Choisir un affichage";
        }
        var displayDescTitle = document.getElementById("displayDescTitle");
        if (displayDescTitle) {
            displayDescTitle.innerHTML = currentLang === "en"
                ? "How do you want <br> to explore ?"
                : "Comment veux - tu <br> explorer ?";
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
        setTimeout(function () { el.classList.add("visible"); }, 1300 + i * 400);
    });

    // ---- ANIMATION COMPTE DES PROJETS ETC ---- //

    function animateCount(el, from, to, duration) {
        var start = null;

        function step(timestamp) {
            if (!start) start = timestamp;
            var progress = Math.min((timestamp - start) / duration, 1);

            // Easing expo pour que ça décélère à la fin
            var eased = 1 - Math.pow(1 - progress, 4);

            el.textContent = Math.floor(from + (to - from) * eased) + (el.dataset.suffix || "");

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = to + (el.dataset.suffix || "");
            }
        }

        requestAnimationFrame(step);
    }

    // ---- COOKIE POPUP ----

    if (popup && closeBtn) {
        if (!getCookie("cookiePopupSeen")) {
            setTimeout(function () { popup.classList.add("show"); }, 500);
            setTimeout(function () {
                popup.classList.remove("show");
                setCookie("cookiePopupSeen", "true", 365);
            }, 15500);
        }
        closeBtn.addEventListener("click", function () {
            popup.classList.remove("show");
            setCookie("cookiePopupSeen", "true", 365);
        });
    }

    // ---- SIDEBAR ----

    var SN_IDS = ["À_propos", "Skills", "Projets", "Parcours", "Contact"];
    var SN_COLORS_DARK = ["#e8ff57", "#ff4d6d", "#00d9ff", "#ff009d", "#b87cff"];
    var SN_COLORS_LIGHT = ["#2a9d2a", "#cc2244", "#0099bb", "#981666", "#8844cc"];

    var SN_SHADOWS = [
        "rgba(232,255,87,0.5)",
        "rgba(255,77,109,0.5)",
        "rgba(0,217,255,0.5)",
        "rgba(255, 0, 157, 0.5)",
        "rgba(184,124,255,0.5)"
    ];

    var snBtns = [0, 1, 2, 3, 4].map(function (i) { return document.getElementById("snBtn" + i); });
    var snTargets = SN_IDS.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    var currentSection = -1;

    function getSNColors() {
        return document.body.classList.contains("dark") ? SN_COLORS_DARK : SN_COLORS_LIGHT;
    }

    function sideNavSetActive(i) {
        if (i === currentSection) return;
        currentSection = i;
        var colors = getSNColors();

        snBtns.forEach(function (btn, j) {
            if (!btn) return;
            btn.classList.toggle("active", j === i);
            btn.style.color = j === i ? colors[i] : "";
        });

        if (!snNav || !snPill || !snBtns[i]) return;
        var navRect = snNav.getBoundingClientRect();
        var btnRect = snBtns[i].getBoundingClientRect();

        if (window.innerWidth <= 1024) {
            snPill.style.top = "unset";
            snPill.style.left = (btnRect.left - navRect.left + (btnRect.width - 28) / 2) + "px";
            snPill.style.bottom = "0px";
        } else {
            snPill.style.left = "0";
            snPill.style.bottom = "unset";
            snPill.style.top = (btnRect.top - navRect.top + (btnRect.height - 28) / 2) + "px";
        }

        snPill.style.background = colors[i];
        snPill.style.boxShadow = "0 0 10px 2px " + SN_SHADOWS[i];

        // Met à jour la barre de progression avec la couleur de la section
        var bar = document.getElementById("scrollProgressBar");
        if (bar) bar.style.background = colors[i];
    }

    function detectSection() {
        const scrollBottom = window.innerHeight + window.scrollY;
        const docHeight = document.body.offsetHeight;
        const trigger = window.scrollY + window.innerHeight * 0.55;

        var active = 0;

        snTargets.forEach(function (el, i) {
            const top = el.offsetTop;
            const bottom = top + el.offsetHeight;

            if (trigger >= top && trigger < bottom) {
                active = i;
            }
        });

        if (scrollBottom >= docHeight - 2) {
            active = snTargets.length - 1;
        }
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
        { text: "", cls: "muted" },
        { text: "  CLÉMENT HUMEZ", cls: "purple" },
        { text: "  ───────────────────────", cls: "purple" },
        { text: "  Développeur Junior", cls: "white" },
        { text: "  Cybersécurité & CTF", cls: "white" },
        { text: "  ───────────────────────", cls: "purple" },
        { text: "", cls: "muted" },
        { text: "  Portfolio v2.0.0 — France \uD83C\uDDEB\uD83C\uDDF7", cls: "muted" },
        { text: "", cls: "muted" },
        { text: "  Tape 'help' pour voir les commandes.", cls: "muted" },
        { text: "", cls: "muted" },
    ];

    function getCommands() {
        var fr = currentLang === "fr";
        return {
            help: [
                { text: fr ? " Commandes disponibles :" : " Available commands:", cls: "white" },
                { text: "  whoami    \u2192 " + (fr ? "qui suis-je ?" : "who am I?"), cls: "" },
                { text: "  skills    \u2192 " + (fr ? "mes compétences" : "my skills"), cls: "" },
                { text: "  ctf       \u2192 " + (fr ? "mes challenges" : "my challenges"), cls: "" },
                { text: "  contact   \u2192 " + (fr ? "me contacter" : "contact me"), cls: "" },
                { text: "  lang      \u2192 " + (fr ? "changer la langue" : "change language"), cls: "" },
                { text: "  matrix    \u2192 \uD83D\uDC07", cls: "" },
                { text: "  clear     \u2192 " + (fr ? "vider le terminal" : "clear terminal"), cls: "" },
                { text: "  exit      \u2192 " + (fr ? "fermer" : "close"), cls: "" },
            ],
            whoami: [
                { text: " Clément Humez", cls: "white" },
                { text: fr ? " Développeur junior full-stack" : " Junior full-stack developer", cls: "" },
                { text: fr ? " Passionné de cybersécurité & CTF" : " Passionate about cybersecurity & CTF", cls: "" },
                { text: " " + (fr ? "Basé en France" : "Based in France") + " \uD83C\uDDEB\uD83C\uDDF7", cls: "" },
                { text: fr ? " Recherche alternance / stage" : " Looking for apprenticeship / internship", cls: "green" },
            ],
            skills: [
                { text: fr ? " Stack technique :" : " Tech stack:", cls: "white" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] Git         88%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591] Python      85%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] HTML/CSS    72%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591] Tailwind    70%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591] JavaScript  65%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591] React       60%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591] Java        60%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591] PHP         57%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591] Cybersec    55%", cls: "red" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591] Linux       54%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591] Symfony     53%", cls: "green" },
                { text: "  [\u2588\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591] Ruby        45%", cls: "green" },
            ],
            ctf: [
                { text: fr ? " CTF & Cybersécurité :" : " CTF & Cybersecurity:", cls: "white" },
                { text: "  " + (fr ? "Plateformes" : "Platforms") + " : Root-Me, TryHackMe", cls: "" },
                { text: "  " + (fr ? "Catégories" : "Categories") + "  : Web, Forensics, Misc", cls: "" },
                { text: "  " + (fr ? "Niveau" : "Level") + "      : " + (fr ? "Débutant → Intermédiaire" : "Beginner → Intermediate"), cls: "" },
                { text: "  " + (fr ? "Objectif" : "Goal") + "    : " + (fr ? "Spécialisation sécurité" : "Security specialization"), cls: "green" },
            ],
            contact: [
                { text: fr ? " Me contacter :" : " Contact me:", cls: "white" },
                { text: "  Email    : humez.clement@gmail.com", cls: "" },
                { text: "  LinkedIn : Clément Humez", cls: "" },
                { text: "  GitHub   : Clement-Dev60", cls: "" },
            ],
            lang: [
                { text: fr ? " Changer de langue :" : " Change language:", cls: "white" },
                { text: "  lang fr  → français", cls: "" },
                { text: "  lang en  → english", cls: "" },
            ],
            matrix: [
                { text: " Wake up, Neo...", cls: "green" },
                { text: " The Matrix has you...", cls: "green" },
                { text: " Follow the white rabbit. \uD83D\uDC07", cls: "green" },
            ],
            exit: null,
            clear: null,
        };
    }

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
        if (cmd === "exit") {
            if (terminalMode) {
                setMode("ui", false);
            } else {
                closeTerminal();
            }
            return;
        }
        if (cmd === "clear") { terminalBody.innerHTML = ""; return; }

        if (cmd === "lang fr" || cmd === "lang en") {
            var newLang = cmd === "lang fr" ? "fr" : "en";
            currentLang = newLang;
            setCookie("lang", newLang, 365);
            document.documentElement.lang = newLang;
            translatePage();
            updateLangButton();
            addLine(" Langue changée → " + (newLang === "fr" ? "Français 🇫🇷" : "English 🇬🇧"), "green");
            addLine("", "muted");
            return;
        }

        var lines = getCommands()[cmd];
        if (lines) {
            lines.forEach(function (l, i) { addLine(l.text, l.cls, i * 60); });
        } else {
            addLine(" Commande inconnue : '" + cmd + "'. Tape 'help'.", "red");
        }
        addLine("", "muted");
    }

    if (terminalInput) {

        var ghost = document.getElementById("terminalGhost");

        terminalInput.addEventListener("input", function () {
            var val = terminalInput.value.trim().toLowerCase();
            if (!val) { ghost.textContent = ""; return; }

            var commands = Object.keys(COMMANDS);
            var match = commands.find(function (cmd) { return cmd.startsWith(val); });

            if (match && match !== val) {
                ghost.textContent = terminalInput.value + match.slice(val.length);
            } else {
                ghost.textContent = "";
            }
        });

        terminalInput.addEventListener("keydown", function (e) {

            if (e.key === "Tab") {
                e.preventDefault();
                var input = terminalInput.value.trim().toLowerCase();
                if (!input) return;

                var commands = Object.keys(COMMANDS);
                var matches = commands.filter(function (cmd) { return cmd.startsWith(input); });

                if (matches.length === 1) {
                    terminalInput.value = matches[0];
                    ghost.textContent = "";
                } else if (matches.length > 1) {
                    addLine("➜  " + input, "");
                    addLine("  " + matches.join("   "), "muted");
                    addLine("", "muted");
                    ghost.textContent = "";
                }
                return;
            }

            if (e.key === "Enter") {
                ghost.textContent = "";
                runCommand(terminalInput.value);
                terminalInput.value = "";
            }
            if (e.key === "ArrowUp") {
                cmdIndex = Math.min(cmdIndex + 1, cmdHistory.length - 1);
                terminalInput.value = cmdHistory[cmdIndex] || "";
                ghost.textContent = "";
            }
            if (e.key === "ArrowDown") {
                cmdIndex = Math.max(cmdIndex - 1, -1);
                terminalInput.value = cmdIndex >= 0 ? cmdHistory[cmdIndex] : "";
                ghost.textContent = "";
            }
        });
    }

    document.addEventListener("keydown", function (e) {
        if (!terminalMode) {
            if (e.ctrlKey && e.shiftKey && e.key === "K") { e.preventDefault(); setMode("terminal", false); openTerminal(); return; }
            if (e.keyCode === KONAMI[konamiPos]) {
                konamiPos++;
                if (konamiPos === KONAMI.length) { konamiPos = 0; setMode("terminal", false); openTerminal(); }
            } else { konamiPos = 0; }
        }
    });

    if (terminalOverlay) {
        terminalOverlay.addEventListener("click", function (e) {
            if (e.target === terminalOverlay && !terminalMode) closeTerminal();
        });
    }
    var brushCanvas = document.getElementById("brushCanvas");

    if (brushCanvas) {
        var brushMedia = brushCanvas.previousElementSibling;
        var brushHint = document.getElementById("brushHint");
        var ctx = brushCanvas.getContext("2d");
        var isPainting = false;
        var hasStarted = false;
        var BRUSH_SIZE = 60;

        function brushInit() {
            brushCanvas.width = brushCanvas.offsetWidth;
            brushCanvas.height = brushCanvas.offsetHeight;
            ctx.fillStyle = "#111118";
            ctx.fillRect(0, 0, brushCanvas.width, brushCanvas.height);
            ctx.font = "500 14px 'DM Mono', monospace";
            ctx.fillStyle = "rgba(255,255,255,0.06)";
            ctx.textAlign = "center";
            ctx.fillText("// gratte pour révéler", brushCanvas.width / 2, brushCanvas.height / 2);
            hasStarted = false;
            if (brushHint) brushHint.classList.remove("hidden");
        }

        function checkRevealComplete() {
            var pixels = ctx.getImageData(0, 0, brushCanvas.width, brushCanvas.height).data;
            var transparent = 0;
            for (var i = 3; i < pixels.length; i += 4) {
                if (pixels[i] < 128) transparent++;
            }
            var pct = transparent / (pixels.length / 4);
            if (pct > 0.6) {
                ctx.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
            }
        }

        function brushAt(x, y) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(x, y, BRUSH_SIZE, 0, Math.PI * 2);
            ctx.fill();
            if (!hasStarted) {
                hasStarted = true;
                if (brushHint) brushHint.classList.add("hidden");
            }
            checkRevealComplete()
        }

        function getPos(e) {
            var rect = brushCanvas.getBoundingClientRect();
            var scaleX = brushCanvas.width / rect.width;
            var scaleY = brushCanvas.height / rect.height;
            var clientX = e.touches ? e.touches[0].clientX : e.clientX;
            var clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
        }

        brushCanvas.addEventListener("mousedown", function (e) { isPainting = true; brushAt(getPos(e).x, getPos(e).y); });
        brushCanvas.addEventListener("mousemove", function (e) { if (isPainting) brushAt(getPos(e).x, getPos(e).y); });
        brushCanvas.addEventListener("mouseup", function () { isPainting = false; });
        brushCanvas.addEventListener("mouseleave", function () { isPainting = false; });
        brushCanvas.addEventListener("touchstart", function (e) { e.preventDefault(); isPainting = true; brushAt(getPos(e).x, getPos(e).y); }, { passive: false });
        brushCanvas.addEventListener("touchmove", function (e) { e.preventDefault(); if (isPainting) brushAt(getPos(e).x, getPos(e).y); }, { passive: false });
        brushCanvas.addEventListener("touchend", function () { isPainting = false; });

        window.brushReset = function () { brushInit(); };

        window.addEventListener("load", brushInit);
        window.addEventListener("resize", brushInit);
        setTimeout(brushInit, 300);
    }

    // ---- SCRAMBLE TEXT ----

    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

    function scrambleText(el) {
        var target = el.textContent.trim();
        var len = target.length;
        var revealed = 0;
        var frame = 0;
        var SPEED = 2;
        var NOISE = 8;

        el.dataset.scrambling = "true";

        var interval = setInterval(function () {
            var result = "";
            frame++;

            while (revealed < len && target[revealed] === " ") {
                revealed++;
            }

            for (var i = 0; i < len; i++) {
                if (target[i] === " ") {
                    result += " ";
                } else if (i < revealed) {
                    result += target[i];
                } else if (i === revealed) {
                    var noiseFrame = frame - (revealed * SPEED);
                    if (noiseFrame >= NOISE) {
                        revealed++;
                        while (revealed < len && target[revealed] === " ") {
                            revealed++;
                        }
                        result += target[i];
                    } else {
                        result += CHARS[Math.floor(Math.random() * CHARS.length)];
                    }
                } else {
                    result += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }

            el.textContent = result;

            if (revealed >= len) {
                el.textContent = target;
                el.dataset.scrambling = "false";
                clearInterval(interval);
            }
        }, 30);
    }

    if ("IntersectionObserver" in window) {
        var scrambleObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    if (el.dataset.scrambling !== "true") {
                        scrambleText(el);
                    }
                    scrambleObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll("[data-scramble]").forEach(function (el) {
            scrambleObserver.observe(el);
        });
    }

    document.querySelectorAll(".side-nav-btn, .btn-switch-terminal-ui").forEach(function (btn) {
        btn.addEventListener("mouseenter", function () {
            var label = btn.dataset.labelFr || btn.dataset.label || "";
            if (!label) return;
            var tooltip = btn.querySelector("::after");
            var original = label;
            var i = 0;
            var scramInterval = setInterval(function () {
                var result = "";
                for (var c = 0; c < original.length; c++) {
                    if (original[c] === " ") { result += " "; continue; }
                    result += c < i
                        ? original[c]
                        : CHARS[Math.floor(Math.random() * CHARS.length)];
                }
                btn.setAttribute("data-label", result);
                i++;
                if (i > original.length) {
                    btn.setAttribute("data-label", original);
                    clearInterval(scramInterval);
                }
            }, 40);
        });
    });

    // ---- COMPTEURS ANIMÉS ----
    if ("IntersectionObserver" in window) {
        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var el = entry.target;
                    var to = parseInt(el.dataset.count);
                    animateCount(el, 0, to, 3200);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll("[data-count]").forEach(function (el) {
            countObserver.observe(el);
        });
    }
});