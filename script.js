const pages = Array.from(document.querySelectorAll(".page[data-page]"));
const nav = document.querySelector("[data-nav]");
const navLinks = Array.from(document.querySelectorAll("[data-nav] a"));
const menuToggle = document.querySelector("[data-menu-toggle]");
const activePage = document.body.dataset.page || pages.find((page) => page.classList.contains("page-active"))?.id || pages[0]?.id || "misiune";
const legacyRoutes = {
  misiune: "index.html",
  "cine-suntem": "cine-suntem.html",
  "servicii-punctuale": "interventii-punctuale.html",
  "interventii-punctuale": "interventii-punctuale.html",
  abonamente: "ingrijire-medicala-continua.html",
  "ingrijire-medicala-continua": "ingrijire-medicala-continua.html",
  colaborari: "colaborari-b2b.html",
  "colaborari-b2b": "colaborari-b2b.html",
  blog: "blog.html",
  contact: "contact.html",
};
const deepLinkRoutes = {
  "manopere-servicii": "interventii-punctuale.html",
  "tratament-escare": "interventii-punctuale.html",
  "protocoale-perfuzabile": "interventii-punctuale.html",
  "package-vital": "ingrijire-medicala-continua.html",
  "package-proactive": "ingrijire-medicala-continua.html",
  "package-assisted": "ingrijire-medicala-continua.html",
  "package-protect": "ingrijire-medicala-continua.html",
  "package-intensive": "ingrijire-medicala-continua.html",
};

function currentFileName() {
  return window.location.pathname.split("/").pop() || "index.html";
}

function getHash() {
  return window.location.hash.replace("#", "");
}

function redirectLegacyHash() {
  const hash = getHash();
  const targetFile = legacyRoutes[hash] || deepLinkRoutes[hash];

  if (!targetFile || targetFile === currentFileName()) {
    return false;
  }

  const nextHash = deepLinkRoutes[hash] ? `#${hash}` : "";
  window.location.replace(`${targetFile}${nextHash}`);
  return true;
}

function getPageId() {
  const hash = getHash();
  return pages.some((page) => page.id && page.id === hash) ? hash : activePage;
}

function showPage(id) {
  pages.forEach((page) => {
    page.classList.toggle("page-active", page.id === id);
  });

  const currentFile = currentFileName();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkFile = href.split("#")[0] || "index.html";
    link.classList.toggle("active", linkFile === currentFile);
  });

  if (nav) {
    nav.classList.remove("open");
  }

  if (!window.location.hash || pages.some((page) => page.id && page.id === getHash())) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function scrollToOpenedItem(item) {
  const header = document.querySelector("[data-header]");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const top = item.getBoundingClientRect().top + window.scrollY - headerHeight - 14;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

function scrollToSection(section) {
  const header = document.querySelector("[data-header]");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
}

function openAccordionItem(item) {
  const accordion = item.closest("[data-accordion]");
  if (!accordion) return;

  accordion.querySelectorAll(".accordion-item").forEach((entry) => {
    entry.classList.remove("open");
    entry.querySelector("button")?.setAttribute("aria-expanded", "false");
  });

  item.classList.add("open");
  item.querySelector("button")?.setAttribute("aria-expanded", "true");

  requestAnimationFrame(() => scrollToOpenedItem(item));
}

function handleDeepLinkHash() {
  const hash = getHash();
  if (!hash) return;

  const packageTarget = document.querySelector(`.package-detail-accordion .${hash}`);
  if (packageTarget) {
    openAccordionItem(packageTarget);
    return;
  }

  const sectionTarget = document.getElementById(hash);
  if (sectionTarget && !pages.some((page) => page.id && page.id === hash)) {
    requestAnimationFrame(() => scrollToSection(sectionTarget));
  }
}

function syncCurrentPage() {
  if (redirectLegacyHash()) return;

  showPage(getPageId());
  handleDeepLinkHash();
}

window.addEventListener("hashchange", syncCurrentPage);
window.addEventListener("DOMContentLoaded", syncCurrentPage);

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });
}

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const item = button.closest(".accordion-item");
    if (!item || !accordion.contains(item)) return;

    const isOpen = item.classList.contains("open");

    if (!isOpen) {
      openAccordionItem(item);
    } else {
      accordion.querySelectorAll(".accordion-item").forEach((entry) => {
        entry.classList.remove("open");
        entry.querySelector("button")?.setAttribute("aria-expanded", "false");
      });
    }
  });
});

document.querySelectorAll("[data-package-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(`.package-detail-accordion .${button.dataset.packageTarget}`);
    if (target) {
      openAccordionItem(target);
    }
  });
});

document.querySelectorAll("[data-scroll-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTarget);
    if (target) {
      scrollToSection(target);
    }
  });
});

document.querySelectorAll(".contact-form .button").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "Solicitarea a fost pregătită";
    setTimeout(() => {
      button.textContent = "Trimite solicitarea";
    }, 2200);
  });
});
