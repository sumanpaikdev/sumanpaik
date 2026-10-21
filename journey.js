(() => {
  const portfolio = window.PORTFOLIO_DATA || {};
  const profile = portfolio.profile || {};
  const entries = Array.isArray(window.JOURNEY_ENTRIES) ? [...window.JOURNEY_ENTRIES] : [];
  const timeline = document.getElementById("journeyTimeline");
  const intro = document.getElementById("journeyIntro");
  const year = document.getElementById("year");
  const footerName = document.getElementById("footerName");
  if (year) year.textContent = new Date().getFullYear();
  if (footerName) footerName.textContent = profile.name || "Writer";
  if (intro && window.JOURNEY_INTRO) intro.textContent = window.JOURNEY_INTRO;
  document.title = `A Writer’s Journey — ${profile.name || "Writer"}`;
  setupTheme();
  if (!timeline) return;

  entries.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  if (!entries.length) return;
  timeline.innerHTML = entries.map((entry, entryIndex) => {
    const title = escapeHTML(entry.title || "Untitled memory");
    const location = escapeHTML(entry.location || "Location not added");
    const date = formatDate(entry.date);
    const photos = normalizePhotos(entry);
    const galleryId = `journey-gallery-${entryIndex}`;
    const slides = photos.map((photo, photoIndex) => `
      <div class="journey-slide" data-slide="${photoIndex}">
        <button class="journey-photo-button" type="button" data-open-photo="${entryIndex}" data-photo-index="${photoIndex}" aria-label="Open photograph ${photoIndex + 1} of ${photos.length}: ${escapeAttr(photo.alt || entry.title || "Journey photograph")}">
          <img class="journey-image" src="${escapeAttr(photo.src)}" alt="${escapeAttr(photo.alt || entry.title || "Journey photograph")}" loading="lazy">
        </button>
      </div>`).join("");
    const placeholder = `<div class="journey-image-placeholder"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg><span class="journey-placeholder-label">Add photographs in journey-data.js</span></div>`;
    return `<article class="journey-event">
      <div class="journey-timeline-marker" aria-hidden="true"></div>
      <div class="journey-event-content">
        <div class="journey-event-heading">
          <div class="journey-card-meta"><span>${location}</span><span class="meta-dot">·</span><time datetime="${escapeAttr(entry.date || "")}">${escapeHTML(date)}</time></div>
          <h2>${title}</h2>
        </div>
        <div class="journey-event-layout">
          <div class="journey-gallery" id="${galleryId}" data-gallery="${entryIndex}" aria-label="Photographs from ${title}">
            ${photos.length ? `<div class="journey-photos-track">${slides}</div>` : placeholder}
            ${photos.length > 1 ? `<div class="journey-gallery-controls">
              <button class="gallery-arrow" type="button" data-gallery-prev="${entryIndex}" aria-label="Previous photograph">←</button>
              <span class="gallery-count" aria-live="polite"><span data-current>1</span> / <span data-total>${photos.length}</span></span>
              <button class="gallery-arrow" type="button" data-gallery-next="${entryIndex}" aria-label="Next photograph">→</button>
              <span class="gallery-swipe-hint">Swipe</span>
            </div>` : photos.length === 1 ? `<div class="journey-gallery-controls single-photo"><span class="gallery-count">1 / 1</span><span class="gallery-swipe-hint">Click to enlarge</span></div>` : ""}
          </div>
          ${entry.reflection ? `<p class="journey-reflection">${escapeHTML(entry.reflection)}</p>` : `<p class="journey-reflection journey-reflection-empty"></p>`}
        </div>
      </div>
    </article>`;
  }).join("");

  const galleryStates = new Map();
  entries.forEach((entry, i) => {
    const gallery = document.querySelector(`[data-gallery="${i}"]`);
    const track = gallery?.querySelector(".journey-photos-track");
    if (!gallery || !track) return;
    const photos = normalizePhotos(entry);
    galleryStates.set(i, { gallery, track, photos, current: 0 });
    track.addEventListener("scroll", () => {
      const slideWidth = track.clientWidth || 1;
      const current = Math.max(0, Math.min(photos.length - 1, Math.round(track.scrollLeft / slideWidth)));
      updateGalleryCount(gallery, current);
    }, { passive: true });
  });

  timeline.addEventListener("click", (event) => {
    const open = event.target.closest("[data-open-photo]");
    if (open) {
      const entryIndex = Number(open.dataset.openPhoto);
      openLightbox(entries, entryIndex, Number(open.dataset.photoIndex));
      return;
    }
    const next = event.target.closest("[data-gallery-next]");
    const prev = event.target.closest("[data-gallery-prev]");
    if (next || prev) {
      const index = Number((next || prev).dataset[next ? "galleryNext" : "galleryPrev"]);
      const state = galleryStates.get(index);
      if (!state) return;
      const direction = next ? 1 : -1;
      const target = Math.max(0, Math.min(state.photos.length - 1, state.current + direction));
      state.track.scrollTo({ left: target * state.track.clientWidth, behavior: "smooth" });
      state.current = target;
      updateGalleryCount(state.gallery, target);
    }
  });

  function updateGalleryCount(gallery, index) {
    const current = gallery.querySelector("[data-current]");
    if (current) current.textContent = String(index + 1);
    const entryIndex = Number(gallery.dataset.gallery);
    const state = galleryStates.get(entryIndex);
    if (state) state.current = index;
  }
})();

function normalizePhotos(entry) {
  if (Array.isArray(entry.photos)) return entry.photos.filter(photo => photo && (photo.src || photo.image)).map(photo => ({ src: photo.src || photo.image, alt: photo.alt || "" }));
  if (entry.image) return [{ src: entry.image, alt: entry.imageAlt || entry.title || "Journey photograph" }];
  return [];
}
function openLightbox(entries, entryIndex, photoIndex) {
  const modal = document.getElementById("photoLightbox");
  const image = document.getElementById("lightboxImage");
  const caption = document.getElementById("lightboxCaption");
  const count = document.getElementById("lightboxCount");
  const close = document.getElementById("lightboxClose");
  const prev = document.getElementById("lightboxPrev");
  const next = document.getElementById("lightboxNext");
  const photos = normalizePhotos(entries[entryIndex]);
  if (!modal || !photos.length) return;
  let current = Math.max(0, Math.min(photos.length - 1, photoIndex));
  const update = () => {
    const photo = photos[current];
    image.src = photo.src;
    image.alt = photo.alt || entries[entryIndex].title || "Journey photograph";
    caption.textContent = [entries[entryIndex].title, entries[entryIndex].location, formatDate(entries[entryIndex].date)].filter(Boolean).join(" · ");
    count.textContent = `${current + 1} / ${photos.length}`;
    prev.hidden = photos.length < 2;
    next.hidden = photos.length < 2;
  };
  const go = delta => { current = (current + delta + photos.length) % photos.length; update(); };
  const onKey = event => {
    if (event.key === "Escape") closeModal();
    if (event.key === "ArrowLeft") go(-1);
    if (event.key === "ArrowRight") go(1);
  };
  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
    document.removeEventListener("keydown", onKey);
    close.removeEventListener("click", closeModal);
    prev.removeEventListener("click", onPrev);
    next.removeEventListener("click", onNext);
    modal.removeEventListener("click", onBackdrop);
    image.removeEventListener("touchstart", onTouchStart);
    image.removeEventListener("touchend", onTouchEnd);
  };
  const onPrev = () => go(-1);
  const onNext = () => go(1);
  const onBackdrop = event => { if (event.target === modal) closeModal(); };
  let touchX = null;
  const onTouchStart = event => { touchX = event.changedTouches[0].clientX; };
  const onTouchEnd = event => {
    if (touchX === null) return;
    const dx = event.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchX = null;
  };
  update();
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
  document.addEventListener("keydown", onKey);
  close.addEventListener("click", closeModal);
  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);
  modal.addEventListener("click", onBackdrop);
  image.addEventListener("touchstart", onTouchStart, { passive: true });
  image.addEventListener("touchend", onTouchEnd, { passive: true });
  close.focus();
}
function formatDate(value) {
  if (!value) return "Date not added";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function escapeAttr(value) { return escapeHTML(value); }
function setupTheme() {
  const button = document.getElementById("themeToggle");
  const messagesEl = document.getElementById("rotatingMessage");
  const profile = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.profile) || {};
  const messages = profile.navbarMessages && profile.navbarMessages.length ? profile.navbarMessages : ["Internal Review Only.", "I Paint with Thoughts!", `© ${new Date().getFullYear()} ${profile.name || "Writer"}.`];
  const applyTheme = theme => {
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
  let saved = "dark";
  try { saved = localStorage.getItem("writer-theme") || "dark"; } catch (_) {}
  applyTheme(saved === "light" ? "light" : "dark");
  if (button) button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("writer-theme", next); } catch (_) {}
    applyTheme(next);
  });
  if (messagesEl) {
    let index = 0;
    messagesEl.textContent = messages[0];
    if (messages.length > 1) window.setInterval(() => {
      messagesEl.classList.add("is-fading");
      window.setTimeout(() => { index = (index + 1) % messages.length; messagesEl.textContent = messages[index]; messagesEl.classList.remove("is-fading"); }, 300);
    }, 3200);
  }
}
