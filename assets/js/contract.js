/**
 * consIMS — Contract Management Module
 * Sử dụng namespace ContractModule để tránh xung đột biến toàn cục (như currentPage)
 */
window.ContractModule = (function() {
    // ── Data ─────────────────────────────────────────────
    const contracts = [
        {
            id:1, type:'main', name:'Sân bay Quảng Trị - 119/2025/HĐTCXD/CHKQT-CENTRAL',
            items:12, code:'CC1000125.07/001', contractor:'Công Ty CP Đầu Tư Synergy Nha Trang',
            sub:[
                { id:101, name:'Sân bay QT - Gói nền móng',  code:'CC1000125.07/001-S1', contractor:'Công Ty CP Nền Móng Việt', items:4 },
                { id:102, name:'Sân bay QT - Gói cơ điện',   code:'CC1000125.07/001-S2', contractor:'Công Ty TNHH Cơ Điện Nam', items:7 },
            ],
            supplier:[
                { id:201, name:'Sân bay QT - Cung cấp thép hình', code:'CC1000125.07/001-SP1', contractor:'Công Ty CP Thép Miền Trung', items:3 },
            ],
        },
        {
            id:2, type:'main', name:'Vinhomes Grand Park PK2 Thần XD - 0401/2021/HDXD/VHCT',
            items:3, code:'CC1000125.07/002', contractor:'Công Ty CP Địa Ốc Phú Long',
            sub:[
                { id:103, name:'Vinhomes PK2 - Kết cấu thép', code:'CC1000125.07/002-S1', contractor:'Công Ty CP Thép Phương Nam', items:3 },
            ],
            supplier:[],
        },
        {
            id:3, type:'sub', name:'Vinhomes Grand Park Trạm Bơm XD - 1109/2020/HDXD/TPX-CENTRAL',
            items:14, code:'CC1000723.05/001/007', contractor:'Công Ty TNHH Phát Triển BĐS Masterise Homes',
        },
        {
            id:4, type:'sub', name:'Essensia Parkway - Thi công XD Kết cấu, Hoàn thiện mặt ngoài, MEP',
            items:5, code:'CC1003117.10/003', contractor:'Công Ty Cổ Phần Phát Triển Núi Tuyển Sơn',
        },
        {
            id:5, type:'main', name:'Westin XD - 1701/2018/PĐNT-CENTRAL/WCR',
            items:9, code:'CC1003117.10/006', contractor:'Công Ty TNHH Đo Đạc TM XD Minh Long',
            sub:[
                { id:104, name:'Westin - Hoàn thiện nội thất', code:'CC1003117.10/006-S1', contractor:'Công Ty Nội Thất Á Đông', items:5 },
                { id:105, name:'Westin - Hệ thống PCCC',       code:'CC1003117.10/006-S2', contractor:'Công Ty TNHH An Toàn Việt', items:2 },
                { id:106, name:'Westin - Cơ điện lạnh',        code:'CC1003117.10/006-S3', contractor:'Công Ty CP Kỹ Thuật Lạnh Bắc Nam', items:6 },
            ],
            supplier:[
                { id:202, name:'Westin - Cung cấp vật liệu hoàn thiện', code:'CC1003117.10/006-SP1', contractor:'Công Ty TNHH Vật Liệu XD Tiến Đạt', items:8 },
            ],
        },
        {
            id:6, type:'sub', name:'Astral City BD2 XD_Seoul',
            items:13, code:'024/CC/2021/HĐNT-TB', contractor:'Công Ty TNHH Công Nghệ HP Gold Việt Nam',
        },
        {
            id:7, type:'supplier', name:'Vinhomes Grand Park PK2 - Cung cấp cơ điện Hoàng Long',
            items:20, code:'037/TP/VIGPPK2-1', contractor:'Công Ty CP Thương Mại & Dịch Vụ CTE Việt Nam',
        },
        {
            id:8, type:'supplier', name:'Astral City BD2 - Thiết Bị Cơ Khí XD Đại Phát',
            items:29, code:'TCC10028/001-SS', contractor:'Công Ty TNHH Kỹ Thuật SDC',
        },
        {
            id:9, type:'main', name:'Astral City BD1 - Phân Viện Khoa Học Công Nghệ XD Miền Nam',
            items:22, code:'MASTERISE_GP-0001', contractor:'Công Ty TNHH Rankine & Hill (Việt Nam)',
            sub:[
                { id:107, name:'Astral BD1 - Tư vấn giám sát', code:'MASTERISE_GP-0001-S1', contractor:'Công Ty TNHH Tư Vấn Xây Dựng ABC', items:3 },
            ],
            supplier:[],
        },
        {
            id:10, type:'main', name:'Metro Rail Phase 2 - Construction Package A',
            items:8, code:'MR2024/PKG-A/001', contractor:'Công Ty CP Xây Dựng Hòa Bình',
            sub:[
                { id:108, name:'Metro Rail - Gói thầu ray và tà vẹt', code:'MR2024/PKG-A/001-S1', contractor:'Công Ty CP Ray Đường Sắt VN', items:4 },
            ],
            supplier:[
                { id:203, name:'Metro Rail - Cung cấp vật tư ray', code:'MR2024/PKG-A/001-SP1', contractor:'Tổng Công Ty Thép Việt Nam', items:6 },
            ],
        },
        {
            id:11, type:'other', name:'Landmark 81 - MEP System Upgrade 2025',
            items:6, code:'LM81/MEP/2025-02', contractor:'Công Ty TNHH Cơ Điện Lạnh Đức Khải',
        },
        {
            id:12, type:'main', name:'Green Valley Resort - Foundation & Structure',
            items:17, code:'GVR/FND/2024-11', contractor:'Công Ty CP Đầu Tư Xây Dựng Số 1',
            sub:[
                { id:109, name:'Green Valley - Cọc khoan nhồi', code:'GVR/FND/2024-11-S1', contractor:'Công Ty CP Cọc Khoan Miền Nam', items:8 },
                { id:110, name:'Green Valley - Đà giáo coffa',  code:'GVR/FND/2024-11-S2', contractor:'Công Ty TNHH Coffa Đà Giáo VN', items:5 },
            ],
            supplier:[],
        },
        {
            id:13, type:'other', name:'Sunrise City View - Curtain Wall Package',
            items:4, code:'SCV/CW/2025-03', contractor:'Công Ty TNHH Kính Xây Dựng Việt',
        },
        {
            id:14, type:'main', name:'Smart City Bình Dương - Infrastructure Phase 1',
            items:31, code:'SCB/INF/P1-2024', contractor:'Tổng Công Ty Xây Dựng Số 1 - TNHH MTV',
            sub:[
                { id:111, name:'Smart City - Hạ tầng kỹ thuật điện', code:'SCB/INF/P1-2024-S1', contractor:'Tổng Công Ty Điện Lực TP.HCM', items:9 },
            ],
            supplier:[
                { id:204, name:'Smart City - Cung cấp thiết bị điện', code:'SCB/INF/P1-2024-SP1', contractor:'Công Ty CP Thiết Bị Điện Hà Nội', items:12 },
            ],
        },
    ];

    // ── State (Private) ──────────────────────────────────
    let currentPage    = 1;
    let pageSize       = 10;
    let currentTab     = 'all';
    let searchQuery    = '';
    let sortMode       = '';
    let activeDropdown = null;
    let expandedIds    = new Set();

    // ── Helpers ──────────────────────────────────────────
    function typeBadge(type) {
        const map = {
            main:     ['type-main',     'Main contract'],
            sub:      ['type-sub',      'Sub contract'],
            supplier: ['type-supplier', 'Supplier contract'],
            other:    ['type-other',    'Other contract'],
        };
        const [cls, label] = map[type] || ['type-other', type];
        return `<span class="type-badge ${cls}">${label}</span>`;
    }

    function ddIcons() {
        return {
            overview: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`,
            user:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
            sub:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`,
            remove:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>`,
        };
    }

    // ── Filter + sort ─────────────────────────────────────
    function getTopLevel() {
        let list = contracts;
        if (currentTab !== 'all') {
            list = contracts.filter(c => c.type === currentTab);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q) ||
                c.contractor.toLowerCase().includes(q)
            );
        }
        if (sortMode === 'name-asc')   list = [...list].sort((a,b) => a.name.localeCompare(b.name));
        if (sortMode === 'name-desc')  list = [...list].sort((a,b) => b.name.localeCompare(a.name));
        if (sortMode === 'items-desc') list = [...list].sort((a,b) => b.items - a.items);
        return list;
    }

    // ── Render ────────────────────────────────────────────
    function render() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        const list  = getTopLevel();
        const total = list.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const paged = list.slice(start, start + pageSize);
        const ic    = ddIcons();

        tbody.innerHTML = '';

        paged.forEach(row => {
            const isMain      = row.type === 'main';
            const hasSub      = isMain && row.sub      && row.sub.length      > 0;
            const hasSupp     = isMain && row.supplier && row.supplier.length > 0;
            const isExpanded  = expandedIds.has(row.id);

            const tr = document.createElement('tr');
            tr.className = 'contract-row' + (isExpanded ? ' expanded' : '');
            tr.dataset.id = row.id;

            tr.innerHTML = `
                <td><input type="checkbox" class="cb row-cb"></td>
                <td><span class="contract-name">${row.name}</span></td>
                <td><span class="items-badge">+${row.items}</span></td>
                <td>${typeBadge(row.type)}</td>
                <td style="color:#6b7a99;font-size:12px;">${row.code}</td>
                <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;">${row.contractor}</td>
                <td class="action-cell">
                    <button class="action-btn" onclick="ContractModule.toggleDropdown(event,${row.id})">···</button>
                    <div class="dropdown" id="dd-${row.id}">
                        ${isMain ? `<div class="dd-item" onclick="ContractModule.toggleExpand(event,${row.id});ContractModule.closeDropdown()">${ic.sub} Sub contract</div>` : ''}
                        <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.overview} Contract overview</div>
                        <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.user} Assign user</div>
                        <div class="dd-divider"></div>
                        <div class="dd-item danger" onclick="ContractModule.closeDropdown()">${ic.remove} Remove user</div>
                    </div>
                </td>`;
            tbody.appendChild(tr);

            if (isMain && hasSub) {
                row.sub.forEach(s => {
                    const ts = document.createElement('tr');
                    ts.className = 'contract-row sub-row child-rows' + (isExpanded ? ' open' : '');
                    ts.dataset.parent = row.id;
                    ts.innerHTML = `
                        <td><input type="checkbox" class="cb row-cb"></td>
                        <td><div class="sub-indent"><span class="sub-name">${s.name}</span></div></td>
                        <td><span class="items-badge">+${s.items}</span></td>
                        <td>${typeBadge('sub')}</td>
                        <td style="color:#6b7a99;font-size:12px;">${s.code}</td>
                        <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;">${s.contractor}</td>
                        <td class="action-cell">
                            <button class="action-btn" onclick="ContractModule.toggleDropdown(event,${s.id})">···</button>
                            <div class="dropdown" id="dd-${s.id}">
                                <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.overview} Contract overview</div>
                                <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.user} Assign user</div>
                                <div class="dd-divider"></div>
                                <div class="dd-item danger" onclick="ContractModule.closeDropdown()">${ic.remove} Remove user</div>
                            </div>
                        </td>`;
                    tbody.appendChild(ts);
                });
            }

            if (isMain && hasSupp) {
                row.supplier.forEach(s => {
                    const ts = document.createElement('tr');
                    ts.className = 'contract-row supplier-row child-rows' + (isExpanded ? ' open' : '');
                    ts.dataset.parent = row.id;
                    ts.innerHTML = `
                        <td><input type="checkbox" class="cb row-cb"></td>
                        <td><div class="supplier-indent"><span class="sub-name">${s.name}</span></div></td>
                        <td><span class="items-badge">+${s.items}</span></td>
                        <td>${typeBadge('supplier')}</td>
                        <td style="color:#6b7a99;font-size:12px;">${s.code}</td>
                        <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;">${s.contractor}</td>
                        <td class="action-cell">
                            <button class="action-btn" onclick="ContractModule.toggleDropdown(event,${s.id})">···</button>
                            <div class="dropdown" id="dd-${s.id}">
                                <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.overview} Contract overview</div>
                                <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.user} Assign user</div>
                                <div class="dd-divider"></div>
                                <div class="dd-item danger" onclick="ContractModule.closeDropdown()">${ic.remove} Remove user</div>
                            </div>
                        </td>`;
                    tbody.appendChild(ts);
                });
            }
        });

        // ── LOGIC FIX FULL HEIGHT: Render thêm các dòng trống nếu số dòng thực tế ít hơn pageSize ──
        const currentRenderedRows = paged.length; // Số hợp đồng gốc (Top level) của trang hiện tại
        if (currentRenderedRows < pageSize) {
            const remainingRows = pageSize - currentRenderedRows;
            for (let i = 0; i < remainingRows; i++) {
                const emptyTr = document.createElement('tr');
                // Gán các class tr trỏ chuột không tương tác, giữ nguyên chiều cao chuẩn của các dòng khác
                emptyTr.className = 'contract-row empty-placeholder-row select-none pointer-events-none';
                emptyTr.style.height = '48px'; // Chiều cao cố định tương đương row thật
                emptyTr.innerHTML = `
                    <td></td>
                    <td>&nbsp;</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                `;
                tbody.appendChild(emptyTr);
            }
        }

        const pageInfo = document.getElementById('pageInfo');
        if (pageInfo) {
            const s = start + 1, e = Math.min(start + pageSize, total);
            pageInfo.textContent = `${s}–${e} of ${total}`;
        }
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const pc = document.getElementById('pageControls');
        if (!pc) return;
        pc.innerHTML = '';

        const mkBtn = (label, page, disabled = false, active = false, ellipsis = false) => {
            const b = document.createElement('button');
            b.className = 'page-btn' + (active ? ' active' : '') + (ellipsis ? ' ellipsis' : '');
            b.textContent = label;
            b.disabled = disabled;
            if (!disabled && !ellipsis) b.onclick = () => { currentPage = page; render(); };
            return b;
        };

        pc.appendChild(mkBtn('‹ Prev', currentPage - 1, currentPage === 1));

        let pages = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('…');
            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('…');
            pages.push(totalPages);
        }

        pages.forEach(p => {
            if (p === '…') pc.appendChild(mkBtn('…', 0, true, false, true));
            else pc.appendChild(mkBtn(p, p, false, p === currentPage));
        });

        pc.appendChild(mkBtn('Next ›', currentPage + 1, currentPage === totalPages));
    }

    // ── Public API ───────────────────────────────────────
    return {
        init: function() {
            currentPage  = 1;
            currentTab   = 'all';
            searchQuery  = '';
            sortMode     = '';
            expandedIds.clear();
            render();
            
            // Wiring event cho checkbox "All" nếu tồn tại
            const cbAll = document.getElementById('cbAll');
            if (cbAll) {
                cbAll.onchange = (e) => this.toggleAll(e.target);
            }
        },

        filterTab: function(el, tab) {
            document.querySelectorAll('.tab-pill').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            currentTab  = tab;
            currentPage = 1;
            expandedIds.clear();
            render();
        },

        onSearch: function(val) {
            searchQuery = val.trim();
            currentPage = 1;
            render();
        },

        changeSort: function(val) {
            sortMode    = val;
            currentPage = 1;
            render();
        },

        changePageSize: function(val) {
            pageSize    = parseInt(val);
            currentPage = 1;
            render();
        },

        toggleAll: function(cb) {
            document.querySelectorAll('.row-cb').forEach(c => c.checked = cb.checked);
        },

        toggleExpand: function(e, id) {
            e.stopPropagation();
            const isNowOpen = expandedIds.has(id) ? (expandedIds.delete(id), false) : (expandedIds.add(id), true);
            const mainRow = document.querySelector(`tr.contract-row[data-id="${id}"]`);
            if (mainRow) mainRow.classList.toggle('expanded', isNowOpen);
            document.querySelectorAll(`tr[data-parent="${id}"]`).forEach(tr => {
                tr.classList.toggle('open', isNowOpen);
            });
        },

        toggleDropdown: function(e, id) {
            e.stopPropagation();
            const dd = document.getElementById(`dd-${id}`);
            if (!dd) return;
            if (activeDropdown && activeDropdown !== dd) activeDropdown.classList.remove('open');
            dd.classList.toggle('open');
            activeDropdown = dd.classList.contains('open') ? dd : null;
        },

        closeDropdown: function() {
            if (activeDropdown) { activeDropdown.classList.remove('open'); activeDropdown = null; }
        }
    };
})();

// Tự động khởi tạo nếu DOM của contract table đã sẵn sàng (cho trường hợp load trực tiếp)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tableBody')) {
        ContractModule.init();
    }
});

// Lắng nghe sự kiện click để đóng dropdown
document.addEventListener('click', () => {
    if (window.ContractModule) ContractModule.closeDropdown();
});