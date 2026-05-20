// =====================================================
// consIMS — SPA Navigation Engine v3
// Sidebar & topbar load 1 lần · nav + dash-tab swap mượt
// =====================================================

// ── Map trang nav chính ──────────────────────────────
const PAGE_CONTENT_MAP = {
  "dashboard.html":         { module: null, tabs: "modules/dashboard/dashboard-tabs.html", hasCharts: false },
  "contract.html":          { module: null, tabs: null, hasCharts: false },
  "submission-review.html": { module: null, tabs: null, hasCharts: false },
  "payment.html":           { module: null, tabs: null, hasCharts: false },
  "help.html":              { module: null, tabs: null, hasCharts: false },
  "settings.html":          { module: null, tabs: null, hasCharts: false },
};

// ── Map tab dashboard ────────────────────────────────
const DASH_TAB_MAP = {
  "contract": { module: "modules/dashboard/contract-dashboard.html", hasCharts: true  },
  "project":  { module: "modules/dashboard/project-dashboard.html",  hasCharts: false },
  "company":  { module: "modules/dashboard/company-dashboard.html",  hasCharts: false },
};

const PAGE_TITLES = {
  "dashboard.html":         "consIMS — Dashboard",
  "contract.html":          "consIMS — Contract",
  "submission-review.html": "consIMS — Submission Review",
  "payment.html":           "consIMS — Payment",
  "help.html":              "consIMS — Trợ giúp",
  "settings.html":          "consIMS — Cài đặt",
};

let currentPage    = null;
let currentDashTab = null;
let isNavigating   = false;
let isDashTabbing  = false;

// ── Progress bar ─────────────────────────────────────
function progressStart() {
  const bar = document.getElementById("nav-progress");
  if (!bar) return;
  bar.className = "";
  bar.style.cssText = "width:0%;opacity:1;";
  requestAnimationFrame(() => bar.classList.add("running"));
}
function progressDone() {
  const bar = document.getElementById("nav-progress");
  if (!bar) return;
  bar.style.width = "100%";
  setTimeout(() => bar.classList.add("done"), 150);
  setTimeout(() => { bar.className = ""; bar.style.cssText = "width:0%;opacity:1;"; }, 500);
}

// ── Fetch HTML ───────────────────────────────────────
async function fetchHTML(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    return res.ok ? res.text() : null;
  } catch { return null; }
}

async function loadFragment(url, containerId) {
  const html = await fetchHTML(url);
  const el = document.getElementById(containerId);
  if (el && html) el.innerHTML = html;
  return !!html;
}

// ── Fade helpers ─────────────────────────────────────
function fadeOut(el) {
  el.style.transition = "opacity 0.15s ease, transform 0.15s ease";
  el.style.opacity    = "0";
  el.style.transform  = "translateY(8px)";
}
function fadeIn(el) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.opacity   = "1";
    el.style.transform = "translateY(0)";
  }));
}

// ── Re-run scripts sau inject ────────────────────────
function rerunScripts(container) {
  container.querySelectorAll("script").forEach(old => {
    const s = document.createElement("script");
    [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
    s.textContent = old.textContent;
    old.parentNode?.replaceChild(s, old);
  });
}

// ── Placeholder nav page ─────────────────────────────
function buildNavPlaceholder(page) {
  const labels = {
    "contract.html":          { title: "Contract",          icon: "📄" },
    "submission-review.html": { title: "Submission Review", icon: "📋" },
    "payment.html":           { title: "Payment",           icon: "💳" },
    "help.html":              { title: "Trợ giúp",          icon: "❓" },
    "settings.html":          { title: "Cài đặt",           icon: "⚙️" },
  };
  const info = labels[page] || { title: page, icon: "📁" };
  return `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:16px;">
    <div style="font-size:56px;opacity:.4;">${info.icon}</div>
    <div style="font-size:20px;font-weight:700;color:#1a3a6b;">${info.title}</div>
    <div style="font-size:14px;color:#8C98C2;">Trang này đang được phát triển</div>
  </div>`;
}

// ── Sidebar nav: setup ───────────────────────────────
function setupSidebarNav() {
  document.getElementById("sidebar-container")?.addEventListener("click", e => {
    const item = e.target.closest(".nav-item[data-page]");
    if (!item) return;
    const page = item.getAttribute("data-page");
    if (page && page !== currentPage) navigateTo(page);
  });
}

function updateSidebarActive(page) {
  document.querySelectorAll(".nav-item[data-page]").forEach(item =>
    item.classList.toggle("active", item.getAttribute("data-page") === page)
  );
}

// ── Dashboard tab: setup ─────────────────────────────
function setupDashTabSwitching() {
  // Dùng event delegation trên toàn document (tabs được inject sau)
  document.addEventListener("click", async e => {
    const btn = e.target.closest("[data-dash-tab]");
    if (!btn) return;
    const tab = btn.getAttribute("data-dash-tab");
    if (!tab || tab === currentDashTab || isDashTabbing) return;
    await switchDashTab(tab);
  });
}

function updateDashTabActive(tab) {
  document.querySelectorAll("[data-dash-tab]").forEach(btn =>
    btn.classList.toggle("active", btn.getAttribute("data-dash-tab") === tab)
  );
}

async function switchDashTab(tab) {
  if (isDashTabbing || tab === currentDashTab) return;
  isDashTabbing = true;

  const config    = DASH_TAB_MAP[tab];
  const contentEl = document.getElementById("page-content");
  if (!contentEl) { isDashTabbing = false; return; }

  progressStart();
  fadeOut(contentEl);
  updateDashTabActive(tab);

  const html = await fetchHTML(config?.module);

  contentEl.innerHTML = html || `<div style="display:flex;align-items:center;justify-content:center;height:60vh;font-size:14px;color:#8C98C2;">Không tải được nội dung.</div>`;
  contentEl.scrollTop = 0;

  if (config?.hasCharts) {
    rerunScripts(contentEl);
    if (typeof initContractCharts === "function") initContractCharts();
  }

  progressDone();
  fadeIn(contentEl);

  currentDashTab = tab;
  isDashTabbing  = false;
}

// ── Core: chuyển trang nav chính ────────────────────
async function navigateTo(page, { pushState = true } = {}) {
  if (isNavigating || page === currentPage) return;
  isNavigating = true;

  const config    = PAGE_CONTENT_MAP[page] || {};
  const contentEl = document.getElementById("page-content");
  const tabsEl    = document.getElementById("dashboard-tabs");
  if (!contentEl) { isNavigating = false; return; }

  progressStart();
  fadeOut(contentEl);

  updateSidebarActive(page);
  document.title = PAGE_TITLES[page] || "consIMS";
  if (pushState) history.pushState({ page }, "", "?page=" + page);

  // Fetch tabs (nếu có)
  const tabsHTML = await fetchHTML(config.tabs);
  if (tabsEl) tabsEl.innerHTML = tabsHTML || "";

  // Reset dash tab state khi rời dashboard
  if (page !== "dashboard.html") {
    currentDashTab = null;
    contentEl.innerHTML = buildNavPlaceholder(page);
    contentEl.scrollTop = 0;
    progressDone();
    fadeIn(contentEl);
    currentPage  = page;
    isNavigating = false;
    return;
  }

  // Dashboard: load tab mặc định (contract) + update active
  currentDashTab = null; // reset để switchDashTab chạy
  progressDone();
  await switchDashTab("contract");

  currentPage  = page;
  isNavigating = false;
}

// ── Khởi động ────────────────────────────────────────
async function initShell() {
  await Promise.all([
    loadFragment("modules/common/sidebar.html", "sidebar-container"),
    loadFragment("modules/common/topbar.html",  "topbar-container"),
  ]);

  setupSidebarNav();
  setupDashTabSwitching();

  const startPage = new URLSearchParams(window.location.search).get("page") || "dashboard.html";
  await navigateTo(startPage, { pushState: false });
}

// ── Back / Forward ───────────────────────────────────
window.addEventListener("popstate", e => {
  const page = e.state?.page
    || new URLSearchParams(window.location.search).get("page")
    || "dashboard.html";
  navigateTo(page, { pushState: false });
});

document.addEventListener("DOMContentLoaded", initShell);
