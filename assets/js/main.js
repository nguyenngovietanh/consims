/**
 * consIMS — SPA Navigation Engine v3
 * Tối ưu hóa kiến trúc tải một lần (Single-load Sidebar/Topbar)
 * Cơ chế chuyển đổi mượt ngữ cảnh Navigation & Dashboard Tabs
 */

// ── Cấu hình Bản đồ định tuyến (Routing Maps) ──────────────────────────
const PAGE_CONTENT_MAP = {
  "dashboard.html":         { tabs: "modules/dashboard/dashboard-tabs.html" },
  "contract.html":          { tabs: "contract.html" },
  "submission-review.html": { tabs: null },
  "payment.html":           { tabs: null },
  "help.html":              { tabs: null },
  "settings.html":          { tabs: null },
};

const DASH_TAB_MAP = {
  "contract": { module: "modules/dashboard/contract-dashboard.html", hasCharts: true,  initFn: "initContractCharts" },
  "project":  { module: "modules/dashboard/project-dashboard.html",  hasCharts: true,  initFn: "initProjectCharts"  },
  "company":  { module: "modules/dashboard/company-dashboard.html",  hasCharts: true,  initFn: "initCompanyCharts"  }
};

const NAV_CONTEXT = {
  "contract.html":          { title: "Contract",           desc: "Contract Administration & Tracking" },
  "submission-review.html": { title: "Submission Review",  desc: "Submission Review & Approval" },
  "payment.html":           { title: "Payment",            desc: "Payment Management & Invoicing" },
  "help.html":              { title: "Help",               desc: "Usage Guides & Support" },
  "settings.html":          { title: "Settings",           desc: "Application & Account Customization" },
};

const DASH_TAB_CONTEXT = {
  "contract": { title: "Contract Dashboard", desc: "Real-time overview of project performance and health" },
  "project":  { title: "Project Dashboard",  desc: "Project view (Multi contracts)" },
  "company":  { title: "Company Dashboard",  desc: "Contract Management Overview" },
};

const PAGE_TITLES = {
  "dashboard.html":         "consIMS — Dashboard",
  "contract.html":          "consIMS — Contract",
  "submission-review.html": "consIMS — Submission Review",
  "payment.html":           "consIMS — Payment",
  "help.html":              "consIMS — Trợ giúp",
  "settings.html":          "consIMS — Cài đặt",
};

// ── Biến trạng thái hệ thống (Core State) ──────────────────────────────
let currentPage    = null;
let currentDashTab = null;
let isNavigating   = false;
let isDashTabbing  = false;

// ── Thanh tiến trình (Top Progress Bar) ────────────────────────────────
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

// ── Truy xuất và Nạp Fragment (Asynchronous HTML Loaders) ──────────────
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

// ── Hoạt họa (Micro-interactions & Fades) ────────────────────────────
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

function updateTopbarContext(title, desc) {
  const titleEl = document.getElementById("topbar-title");
  const descEl  = document.getElementById("topbar-desc");
  if (!titleEl || !descEl) return;
  
  titleEl.style.opacity = "0";
  descEl.style.opacity  = "0";
  setTimeout(() => {
    titleEl.textContent = title;
    descEl.textContent  = desc;
    titleEl.style.opacity = "1";
    descEl.style.opacity  = "1";
  }, 200);
}

// ── Quản lý Script Vòng đời (Script Evaluation Setup) ─────────────────
function rerunScripts(container) {
  container.querySelectorAll("script").forEach(oldScript => {
    const newScript = document.createElement("script");
    [...oldScript.attributes].forEach(attr => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.parentNode?.replaceChild(newScript, oldScript);
  });
}

// ── Giao diện Tạm thời (Placeholders & Progress Renderers) ────────────
function buildNavPlaceholder(page) {
  const labels = {
    "contract.html":          { title: "Contract",           icon: "📄" },
    "submission-review.html": { title: "Submission Review",  icon: "📋" },
    "payment.html":           { title: "Payment",            icon: "💳" },
    "help.html":              { title: "Trợ giúp",           icon: "❓" },
    "settings.html":          { title: "Cài đặt",            icon: "⚙️" },
  };
  const info = labels[page] || { title: page, icon: "📁" };
  return `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:60vh;gap:16px;">
      <div style="font-size:56px;opacity:.4;">${info.icon}</div>
      <div style="font-size:20px;font-weight:700;color:#1a3a6b;">${info.title}</div>
      <div style="font-size:14px;color:#8C98C2;">Trang này đang được phát triển</div>
    </div>`;
}

function progressBar(percent, status) {
  const colors = {
    completed: '#22c55e', delayed: '#ef4444', atrisk: '#f97316', inactive: '#d1d5db', ontrack: '#22c55e'
  };
  return `
    <div style="background:#e5e7eb; border-radius:3px; height:10px; min-width:80px;">
      <div style="background:${colors[status] || '#3b82f6'}; height:100%; border-radius:3px; width:${percent}%;"></div>
    </div>`;
}

// ── Trình xử lý Sự kiện & Định tuyến (Navigation & Tab Handlers) ──────
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

function setupDashTabSwitching() {
  document.addEventListener("click", async e => {
    const btn = e.target.closest("[data-dash-tab]");
    if (!btn) return;
    const tab = btn.getAttribute("data-dash-tab");
    if (tab && tab !== currentDashTab && !isDashTabbing) {
      await switchDashTab(tab);
    }
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

  const config = DASH_TAB_MAP[tab];
  const contentEl = document.getElementById("page-content");
  if (!contentEl) { isDashTabbing = false; return; }

  progressStart();
  fadeOut(contentEl);
  updateDashTabActive(tab);

  const ctx = DASH_TAB_CONTEXT[tab];
  if (ctx) updateTopbarContext(ctx.title, ctx.desc);

  const html = await fetchHTML(config?.module);
  contentEl.innerHTML = html || `<div style="display:flex;align-items:center;justify-content:center;height:60vh;font-size:14px;color:#8C98C2;">Không tải được nội dung.</div>`;
  contentEl.scrollTop = 0;

  if (config?.hasCharts) {
    rerunScripts(contentEl);
    const fn = config.initFn && window[config.initFn];
    if (typeof fn === "function") fn();
  }

  progressDone();
  fadeIn(contentEl);

  currentDashTab = tab;
  isDashTabbing  = false;
}

// ── Lõi điều hướng Single Page Application (Core Router) ────────────────
async function navigateTo(page, { pushState = true } = {}) {
  if (isNavigating || page === currentPage) return;
  isNavigating = true;

  const config = PAGE_CONTENT_MAP[page] || {};
  const contentEl = document.getElementById("page-content");
  const tabsEl = document.getElementById("dashboard-tabs");
  if (!contentEl) { isNavigating = false; return; }

  progressStart();
  fadeOut(contentEl);

  updateSidebarActive(page);
  document.title = PAGE_TITLES[page] || "consIMS";
  if (pushState) history.pushState({ page }, "", "?page=" + page);

  // Tải cấu trúc Tabs đi kèm trang nếu có cấu hình định sẵn
  const tabsHTML = await fetchHTML(config.tabs);
  if (tabsEl) tabsEl.innerHTML = tabsHTML || "";

  // BỐ TRÍ PHÂN LUỒNG CÁC TRANG CON KHÔNG THUỘC DASHBOARD KHỞI CHẠY CHÍNH
  if (page !== "dashboard.html") {
    currentDashTab = null; 
    const ctx = NAV_CONTEXT[page];
    if (ctx) updateTopbarContext(ctx.title, ctx.desc);
    
    if (page === "contract.html") {
      const html = await fetchHTML(page);
      if (html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const mainContent = doc.querySelector('.contract-dashboard');
        contentEl.innerHTML = mainContent ? mainContent.outerHTML : html;
        
        // Kích hoạt Module Quản lý Hợp đồng Nghiệp vụ Thực tế
        if (window.ContractModule) {
          setTimeout(() => window.ContractModule.init(), 50);
        }
      } else {
        contentEl.innerHTML = buildNavPlaceholder(page);
      }
    } else {
      contentEl.innerHTML = buildNavPlaceholder(page);
    }
    
    contentEl.scrollTop = 0;
    progressDone();
    fadeIn(contentEl);
    currentPage  = page;
    isNavigating = false;
    return;
  }

  // KHỞI TẠO ĐIỀU HƯỚNG TRANG CHỦ DASHBOARD (Mặc định nạp tab 'contract')
  currentDashTab = null; 
  progressDone();
  await switchDashTab("contract");

  currentPage  = page;
  isNavigating = false;
}

// ── Khởi tạo Hệ thống Shell (System Initialization) ───────────────────
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

// Lắng nghe sự kiện điều hướng lịch sử trình duyệt (Back/Forward)
window.addEventListener("popstate", e => {
  const page = e.state?.page || new URLSearchParams(window.location.search).get("page") || "dashboard.html";
  navigateTo(page, { pushState: false });
});

document.addEventListener("DOMContentLoaded", initShell);