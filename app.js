(() => {
  const data = window.PORTFOLIO_DATA;
  if (!data) return;
  const profile = data.profile || {};
  const $ = (id) => document.getElementById(id);
  const setText = (id, value) => { const el = $(id); if (el && value != null) el.textContent = value; };

  setText("writerName", profile.name || "Writer Name");
  setText("writerRole", profile.role || profile.location || "");
  setText("writerStatement", profile.statement || "");
  setText("writerBio", profile.bio || "");
  setText("footerName", profile.name || "Writer");
  setText("year", new Date().getFullYear());

  const avatar = $("profileAvatar");
  if (avatar) {
    if (profile.avatar) {
      avatar.innerHTML = `<img src="${escapeAttr(profile.avatar)}" alt="${escapeAttr(profile.name || "Writer")}">`;
      avatar.classList.add("has-image");
    } else {
      avatar.textContent = initials(profile.name || "Writer");
    }
  }

  const emailLink = $("emailLink");
  if (emailLink && profile.email) {
    emailLink.href = `mailto:${profile.email}`;
    emailLink.textContent = profile.email;
  }

  const socials = $("socialLinks");
  if (socials) {
    socials.innerHTML = (profile.socials || []).filter(s => s.url).map(s =>
      `<a class="social-pill" href="${escapeAttr(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label)} ↗</a>`
    ).join("");
  }

  const projects = data.projects || [];
  setText("projectCount", `${String(projects.length).padStart(2, "0")} PROJECT${projects.length === 1 ? "" : "S"}`);
  const list = $("projectList");
  if (list) {
    list.innerHTML = projects.map((p, index) => `
      <a class="project-card" href="film.html?slug=${encodeURIComponent(p.slug)}">
        <span class="project-number">${String(projects.length - index).padStart(2, "0")}</span>
        <span class="project-copy">
          <span class="project-meta">${escapeHTML(p.type || "PROJECT")}${p.year ? " · " + escapeHTML(p.year) : ""}</span>
          <span class="project-title">${escapeHTML(p.title || "Untitled project")}</span>
          ${p.logline ? `<span class="project-logline">${escapeHTML(p.logline)}</span>` : ""}
          <span class="project-open">View project <span aria-hidden="true">↗</span></span>
        </span>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </a>
    `).join("");
  }
  setupTheme();
})();

function initials(name) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toUpperCase();
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function escapeAttr(value) { return escapeHTML(value); }
function setupTheme() {
  const button = document.getElementById("themeToggle");
  const messagesEl = document.getElementById("rotatingMessage");
  const profile = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.profile) || {};
  const messages = profile.navbarMessages && profile.navbarMessages.length
    ? profile.navbarMessages
    : ["Internal Review Only.", "I Paint with Thoughts!", `© ${new Date().getFullYear()} ${profile.name || "Writer"}.`];

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    if (button) {
      const isLight = theme === "light";
      button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
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
      const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
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
