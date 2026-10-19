(() => {
  const data = window.PORTFOLIO_DATA;
  const root = document.getElementById("filmContent");
  if (!data || !root) return;
  const slug = new URLSearchParams(window.location.search).get("slug");
  const project = (data.projects || []).find((p) => p.slug === slug);
  const profile = data.profile || {};
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("footerName").textContent = profile.name || "Writer";
  setupTheme();

  if (!project) {
    document.title = "Project not found — " + (profile.name || "Writer");
    root.innerHTML = `<p class="eyebrow">PROJECT NOT FOUND</p><h1>This story isn't here.</h1><p class="muted">The project link may be incorrect or the project may have been removed.</p><a class="text-link" href="index.html">← Return to all projects</a>`;
    return;
  }

  document.title = `${project.title} — ${profile.name || "Writer"}`;
  document
    .querySelector('meta[name="description"]')
    .setAttribute(
      "content",
      project.logline ||
        `${project.title} — a film project by ${profile.name || "the writer"}.`,
    );
  const section = (label, value, cls = "") =>
    value
      ? `<section class="detail-section ${cls}"><p class="eyebrow">${label}</p><div class="detail-text">${escapeHTML(value).replace(/\n/g, "<br>")}</div></section>`
      : "";
  const poster = project.poster
    ? `<div class="poster-frame"><img src="${escapeAttr(project.poster)}" alt="Poster for ${escapeAttr(project.title)}"></div>`
    : `<div class="poster-placeholder"><span class="eyebrow">${escapeHTML(project.type || "FILM PROJECT")}</span><span class="poster-title">${escapeHTML(project.title)}</span><span class="poster-credit">${escapeHTML(profile.name || "Writer")}</span></div>`;

  root.innerHTML = `
    <a class="text-link return-link" href="index.html">← Back to portfolio</a>
    <div class="film-heading">
      <div class="film-heading-copy">
        <p class="eyebrow">${escapeHTML(project.type || "FILM PROJECT")}${project.year ? " · " + escapeHTML(project.year) : ""}</p>
        <h1>${escapeHTML(project.title)}</h1>
        ${project.status ? `<p class="status-line">${escapeHTML(project.status)}</p>` : ""}
        ${project.copyright ? `<p class="copyright-line"> Copyright Office - Government of India | ${escapeHTML(project.copyright)}</p>` : ""}
      </div>
    </div>
    <div class="film-layout">
      ${poster}
      <div class="film-details">
        ${section("LOGLINE", project.logline, "logline-section")}
        ${section("GENRE", project.genre)}
        ${section("THEMES", project.themes)}
        ${section("SYNOPSIS", project.synopsis, "synopsis-section")}
        ${project.treatment ? `<div class="screenplay-download"> <a class="download-button" href="${escapeAttr(project.treatment)}" download>  ↓ Download Treatment </a> </div>` : ""}
        ${project.screenplay ? `<div class="screenplay-download"> <a class="download-button" href="${escapeAttr(project.screenplay)}" download>  ↓ Download Screenplay </a> </div>` : ""}
        ${project.copyrightcertificate ? `<div class="screenplay-download"> <a class="download-button" href="${escapeAttr(project.copyrightcertificate)}" download>  ↓ Copyright Certificate </a> </div>` : ""}
      </div>
    </div>
    <section class="project-contact">
      <p class="eyebrow">CONTINUE THE CONVERSATION</p>
      <h2>Every story begins somewhere.</h2>
      <p class="muted">For professional enquiries about this project, contact ${escapeHTML(profile.name || "the writer")}.</p>
      ${profile.email ? `<a class="contact-email" href="mailto:${escapeAttr(profile.email)}">${escapeHTML(profile.email)} ↗</a>` : ""}
      <a class="text-link all-projects" href="index.html">← Explore all projects</a>
    </section>
  `;
})();

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        ch
      ],
  );
}
function escapeAttr(value) {
  return escapeHTML(value);
}
function setupTheme() {
  const button = document.getElementById("themeToggle");
  const messagesEl = document.getElementById("rotatingMessage");
  const profile =
    (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.profile) || {};
  const messages =
    profile.navbarMessages && profile.navbarMessages.length
      ? profile.navbarMessages
      : [
          "Internal Review Only.",
          "I Paint with Thoughts!",
          `© ${new Date().getFullYear()} ${profile.name || "Writer"}.`,
        ];

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (button) {
      const isLight = theme === "light";
      button.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme",
      );
      button.title = isLight ? "Switch to dark theme" : "Switch to light theme";
      button.innerHTML = isLight
        ? '<svg class="moon-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"></path></svg>'
        : '<svg class="sun-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>';
    }
  };

  const saved = localStorage.getItem("writer-theme");
  applyTheme(saved === "light" ? "light" : "dark");

  if (button) {
    button.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "light" ? "dark" : "light";
      localStorage.setItem("writer-theme", next);
      applyTheme(next);
    });
  }

  if (messagesEl) {
    let index = 0;
    messagesEl.textContent = messages[0];
    if (messages.length > 1) {
      window.setInterval(() => {
        messagesEl.classList.add("is-fading");
        window.setTimeout(() => {
          index = (index + 1) % messages.length;
          messagesEl.textContent = messages[index];
          messagesEl.classList.remove("is-fading");
        }, 300);
      }, 3200);
    }
  }
}
