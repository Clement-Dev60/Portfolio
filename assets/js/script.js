"use strict";

const translations = {
    fr: {
        dark: "🌙 Mode sombre",
        light: "☀️ Mode clair"
    },
    en: {
        dark: "🌙 Dark mode",
        light: "☀️ Light mode"
    }
};

const toggle = document.getElementById("darkModeToggle");
const langToggle = document.getElementById("langToggle");

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURIComponent(value) + ";path=/;expires=" + d.toUTCString();
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let c of cookies) {
        const [key, value] = c.split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

let isDark = localStorage.getItem("darkMode") === "true";
document.body.classList.toggle("dark", isDark);

let currentLang = getCookie("lang") || "fr";
document.documentElement.lang = currentLang;

translatePage();
updateDarkModeText();
updateLangButton();

toggle.addEventListener("click", () => {
    isDark = document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark);
    updateDarkModeText();
});

function updateDarkModeText() {
    if (isDark) {
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>
        `;
    } else {
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>
        `;
    }
}


langToggle.addEventListener("click", () => {
    currentLang = currentLang === "fr" ? "en" : "fr";
    setCookie("lang", currentLang, 365);
    document.documentElement.lang = currentLang;

    translatePage();
    updateDarkModeText();
    updateLangButton();
});

function updateLangButton() {
    langToggle.textContent = currentLang === "fr" ? "🇫🇷 FR" : "🇬🇧 EN";
}

function translatePage() {
    document.querySelectorAll("[data-fr]").forEach(el => {
        el.textContent = el.dataset[currentLang];
    });

    const contactTitle = document.getElementById('contactTitle');
    if (contactTitle) {
        contactTitle.innerHTML = currentLang === "en"
            ? "Let's work<br><span>together.</span>"
            : "Travaillons<br><span>ensemble.</span>";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    animate_text();
});


function animate_text() {
    let delay = 100,
        delay_start = 0,
        contents,
        letters;

    document.querySelectorAll(".logo").forEach(function (elem) {
        contents = elem.textContent.trim();
        elem.textContent = "";
        letters = contents.split("");
        elem.style.visibility = 'visible';

        letters.forEach(function (letter, index) {
            setTimeout(function () {
                elem.textContent += letter;
            }, delay_start + delay * index);
        });
        delay_start += delay * letters.length;
    });
}


const popup = document.getElementById('cookiePopup');
const closeBtn = document.getElementById('closeBtn');

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function showPopup() {
    popup.classList.add('show');
}

function hidePopup() {
    popup.classList.remove('show');
}

window.addEventListener('load', () => {
    if (!getCookie('cookiePopupSeen')) {
        setTimeout(showPopup, 500);

        setTimeout(() => {
            hidePopup();
            setCookie('cookiePopupSeen', 'true', 365);
        }, 5500);
    }
});

closeBtn.addEventListener('click', () => {
    hidePopup();
    setCookie('cookiePopupSeen', 'true', 365);
});


const elements = document.querySelectorAll('.location');
elements.forEach((el, index) => {
    setTimeout(() => {
        el.classList.add('visible');
    }, 3600 + (index * 600));
});


setTimeout(() => {
    toggle.classList.add('visible');
}, 3100);

const burgerBtn = document.getElementById('burgerBtn');
const navDrawer = document.getElementById('navDrawer');
const darkMobileBtn = document.getElementById('darkModeToggleMobile');
const langMobileBtn = document.getElementById('langToggleMobile');

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('open');
    navDrawer.classList.toggle('open');
});

navDrawer.querySelectorAll('.nav-drawer-link').forEach(link => {
    link.addEventListener('click', () => {
        burgerBtn.classList.remove('open');
        navDrawer.classList.remove('open');
    });
});

darkMobileBtn.addEventListener('click', () => toggle.click());
langMobileBtn.addEventListener('click', () => langToggle.click());

function updateMobileButtons() {
    darkMobileBtn.innerHTML = toggle.innerHTML;
    langMobileBtn.textContent = langToggle.textContent;
}

const _origUpdateDark = updateDarkModeText;
updateDarkModeText = function () {
    _origUpdateDark();
    updateMobileButtons();
};

const _origUpdateLang = updateLangButton;
updateLangButton = function () {
    _origUpdateLang();
    updateMobileButtons();
};

updateMobileButtons();