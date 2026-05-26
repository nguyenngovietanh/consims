// Tự động khởi tạo nếu DOM của contract table đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tableBody')) {
        ContractModule.init();
    }
});

// Lắng nghe sự kiện click để đóng dropdown (Sửa đổi: Bỏ qua nếu click trúng overlay hoặc popup)
document.addEventListener('click', (e) => {
    if (e.target.id === 'popup-overlay' || e.target.closest('#contract-overview-sidebar')) {
        return; 
    }
    if (window.ContractModule) ContractModule.closeDropdown();
});

/**
 * consIMS — Contract Management Module
 */
window.ContractModule = (function() {
    // ── Data ─────────────────────────────────────────────
    const contracts = [
        {
            id:1, type:'main', name:'Sân bay Quảng Trị - 119/2025/HĐTCXD/CHKQT-CENTRAL',
            items:12, code:'CC1000125.07/001', contractor:'Công Ty CP Đầu Tư Synergy Nha Trang',
            sub:[
                { id:101, name:'Sân bay QT - Gói nền móng',  code:'CC1000125.07/001-S1', contractor:'Công Ty CP Nền Móng Việt', items:4 },
                { id:102, name:'Sân bay QT - Gói cơ điện',    code:'CC1000125.07/001-S2', contractor:'Công Ty TNHH Cơ Điện Nam', items:7 },
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
            items:14, code:'CC100723.05/001/007', contractor:'Công Ty TNHH Phát Triển BĐS Masterise Homes',
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
            overview: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.3866 7.99995C10.3866 9.31995 9.31995 10.3866 7.99995 10.3866C6.67995 10.3866 5.61328 9.31995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C9.31995 5.61328 10.3866 6.67995 10.3866 7.99995Z" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13C10.5253 13 12.8789 11.7432 14.5171 9.56798C15.161 8.71601 15.161 7.28399 14.5171 6.43202C12.8789 4.2568 10.5253 3 8 3C5.47471 3 3.1211 4.2568 1.48288 6.43202C0.839039 7.28399 0.839039 8.71601 1.48288 9.56798C3.1211 11.7432 5.47471 13 8 13Z" stroke="#2d3a50" stroke-width="0.905825" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            user:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.99996 7.99967C9.84091 7.99967 11.3333 6.50729 11.3333 4.66634C11.3333 2.82539 9.84091 1.33301 7.99996 1.33301C6.15901 1.33301 4.66663 2.82539 4.66663 4.66634C4.66663 6.50729 6.15901 7.99967 7.99996 7.99967Z" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.27332 14.6667C2.27332 12.0867 4.83998 10 7.99998 10C8.63998 10 9.25999 10.0867 9.83999 10.2467" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/><path d="M14.6667 11.9997C14.6667 12.213 14.64 12.4197 14.5867 12.6197 seawork"/><path d="M14.5267 12.8863 14.42 13.1463 14.28 13.373C13.82 14.1463 12.9734 14.6663 12 14.6663C11.3134 14.6663 10.6934 14.4063 10.2267 13.9797C10.0267 13.8063 9.85337 13.5997 9.72003 13.373C9.47337 12.973 9.33337 12.4997 9.33337 11.9997C9.33337 11.2797 9.62004 10.6197 10.0867 10.1397C10.5734 9.63969 11.2534 9.33301 12 9.33301C12.7867 9.33301 13.5 9.67302 13.98 10.2197C14.4067 10.693 14.6667 11.3197 14.6667 11.9997Z" stroke="#2d3a50" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.9934 11.9873H11.0067" stroke="#2d3a50" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.0002 11.0137V13.007" stroke="#2d3a50" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            sub:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"> <path d="M6.00004 14.6663H10C13.3334 14.6663 14.6667 13.333 14.6667 9.99967V5.99967C14.6667 2.66634 13.3334 1.33301 10 1.33301H6.00004C2.66671 1.33301 1.33337 2.66634 1.33337 5.99967V9.99967C1.33337 13.333 2.66671 14.6663 6.00004 14.6663Z" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.6666 11.3867H10.4332" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.64671 11.3867H4.33337" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.6666 8.87988H7.97998" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.18004 8.87988H4.33337" stroke="#2d3a50" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            remove:   `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M7.9467 14.6667C11.6134 14.6667 14.6134 11.6667 14.6134 8.00001C14.6134 4.33334 11.6134 1.33334 7.9467 1.33334C4.28003 1.33334 1.28003 4.33334 1.28003 8.00001C1.28003 11.6667 4.28003 14.6667 7.9467 14.6667Z" stroke="#DC2626" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.28003 8H10.6134" stroke="#DC2626" stroke-linecap="round" stroke-linejoin="round"/></svg>`,  
        };
    }

    function getVisibleRows() {
        let baseList = contracts;
 
        // Lọc theo Tab
        if (currentTab !== 'all') {
            if (currentTab === 'sub') {
                baseList = [];
                contracts.forEach(c => {
                    if (c.type === 'sub') baseList.push(c);
                    if (c.sub) baseList.push(...c.sub.map(s => ({...s, type: 'sub'})));
                });
            } else if (currentTab === 'supplier') {
                baseList = [];
                contracts.forEach(c => {
                    if (c.type === 'supplier') baseList.push(c);
                    if (c.supplier) baseList.push(...c.supplier.map(s => ({...s, type: 'supplier'})));
                });
            } else {
                baseList = contracts.filter(c => c.type === currentTab);
            }
        }

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            baseList = baseList.filter(c =>
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q) ||
                c.contractor.toLowerCase().includes(q)
            );
        }

        // Sắp xếp Sort
        if (sortMode === 'name-asc')   baseList = [...baseList].sort((a,b) => a.name.localeCompare(b.name));
        if (sortMode === 'name-desc')  baseList = [...baseList].sort((a,b) => b.name.localeCompare(a.name));
        if (sortMode === 'items-desc') baseList = [...baseList].sort((a,b) => b.items - a.items);

        // Biến đổi danh sách dựa trên phân cấp mở rộng
        if (currentTab === 'all' || currentTab === 'main') {
            const flattenedList = [];
            baseList.forEach(row => {
                if (row.type === 'main') {
                    flattenedList.push({ ...row, isParentRow: true });
                    
                    if (expandedIds.has(row.id)) {
                        if (row.sub && row.sub.length > 0) {
                            row.sub.forEach(s => flattenedList.push({ ...s, type: 'sub', isChildRow: true, parentId: row.id, childType: 'sub' }));
                        }
                        if (row.supplier && row.supplier.length > 0) {
                            row.supplier.forEach(s => flattenedList.push({ ...s, type: 'supplier', isChildRow: true, parentId: row.id, childType: 'supplier' }));
                        }
                    }
                } else {
                    flattenedList.push(row);
                }
            });
            return flattenedList;
        }

        return baseList;
    }

    // ── Render ────────────────────────────────────────────
    function render() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        const visibleList = getVisibleRows();
        const total = visibleList.length;
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (currentPage > totalPages) currentPage = totalPages;

        const start = (currentPage - 1) * pageSize;
        const pagedRows = visibleList.slice(start, start + pageSize);
        const ic = ddIcons();

        pagedRows.forEach(row => {
            const tr = document.createElement('tr');
            
            if (row.isChildRow) {
                tr.className = `contract-row child-rows open ${row.childType}-row`;
                tr.dataset.parent = row.parentId;
            } else {
                const isExpanded = expandedIds.has(row.id);
                tr.className = 'contract-row' + (isExpanded ? ' expanded' : '');
                tr.dataset.id = row.id;
            }

            let nameColumnHTML = `<span class="contract-name">${row.name}</span>`;
            if (row.isChildRow) {
                const indentClass = row.childType === 'sub' ? 'sub-indent' : 'supplier-indent';
                nameColumnHTML = `<div class="${indentClass}"><span class="sub-name">${row.name}</span></div>`;
            }

            const isMain = row.type === 'main' && !row.isChildRow;
            
            let actionMenuHTML = `
                <button class="action-btn" onclick="ContractModule.toggleDropdown(event,${row.id})">···</button>
                <div class="dropdown" id="dd-${row.id}">
                    ${isMain ? `<div class="dd-item" onclick="ContractModule.toggleExpand(event,${row.id});ContractModule.closeDropdown()">${ic.sub} Sub contract</div>` : ''}
                    <div class="dd-item" onclick="ContractModule.openPopup(event, ${row.id}); ContractModule.closeDropdown()">${ic.overview} Contract overview</div>
                    <div class="dd-item" onclick="ContractModule.closeDropdown()">${ic.user} Assign user</div>
                    <div class="dd-divider"></div>
                    <div class="dd-item danger" onclick="ContractModule.closeDropdown()">${ic.remove} Remove user</div>
                </div>
            `;

            tr.innerHTML = `
                <td><input type="checkbox" class="cb row-cb"></td>
                <td>${nameColumnHTML}</td>
                <td><span class="items-badge">+${row.items}</span></td>
                <td>${typeBadge(row.type)}</td>
                <td style="color:#6b7a99;font-size:12px;">${row.code}</td>
                <td style="max-width:260px;overflow:hidden;text-overflow:ellipsis;">${row.contractor}</td>
                <td class="action-cell">${actionMenuHTML}</td>
            `;
            tbody.appendChild(tr);
        });

        // Hàng trống bù chân trang
        const remainingRows = pageSize - pagedRows.length;
        for (let i = 0; i < remainingRows; i++) {
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'contract-row empty-row'; 
            emptyRow.innerHTML = `
                <td><input type="checkbox" class="cb row-cb"></td>
                <td><span class="contract-name" style="color:#cbd5e1;">-</span></td>
                <td><span class="items-badge" style="opacity:0;">+0</span></td>
                <td><span class="type-badge" style="opacity:0;">Other contract</span></td>
                <td style="font-size:12px;color:#cbd5e1;">-</td>
                <td style="color:#cbd5e1;">-</td>
                <td class="action-cell"><button class="action-btn" style="opacity:0;">···</button></td>
            `;
            tbody.appendChild(emptyRow);
        }

        const inputEl = document.getElementById('pageGoToInput');
        if (inputEl) {
            inputEl.value = currentPage;
            inputEl.max = totalPages;
        }

        const totalDisplayEl = document.getElementById('totalPageDisplay');
        if (totalDisplayEl) {
            totalDisplayEl.textContent = totalPages;
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
            if (!disabled && !ellipsis) b.onclick = () => { ContractModule.goToPage(page); };
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
            render();
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
        },

        goToPage: function(page) {
            currentPage = page;
            render();
        },

        handlePageKey: function(event, input) {
            if (event.key === 'Enter') {
                let targetPage = parseInt(input.value, 10);
                const maxPage = parseInt(input.max, 10) || 1;

                if (isNaN(targetPage) || targetPage < 1) {
                    targetPage = 1;
                } else if (targetPage > maxPage) {
                    targetPage = maxPage;
                }

                input.value = targetPage;
                this.goToPage(targetPage);
            }
        },

        // ── HÀM MỞ POPUP CHUẨN (ĐÃ FIX CONTEXT & EVENT) ──
        // ── HÀM MỞ POPUP CHUẨN (ĐÃ FIX TOÀN BỘ XUNG ĐỘT CÚ PHÁP & LOGIC) ──
        activeChartInstance: null,

        openPopup: function(event, rowId) {
            if (event) {
                event.stopPropagation();
                event.preventDefault();
            }

            let overlay = document.getElementById('popup-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'popup-overlay';
                overlay.className = 'custom-popup-overlay';
                document.body.appendChild(overlay);
            }

            let sidePopup = document.getElementById('contract-overview-sidebar');
            if (!sidePopup) {
                sidePopup = document.createElement('div');
                sidePopup.id = 'contract-overview-sidebar';
                sidePopup.className = 'custom-side-popup';
                document.body.appendChild(sidePopup);
            }

            let targetRow = contracts.find(c => c.id === rowId);
            if (!targetRow) {
                for (let c of contracts) {
                    if (c.sub) { targetRow = c.sub.find(s => s.id === rowId); if (targetRow) break; }
                    if (c.supplier) { targetRow = c.supplier.find(s => s.id === rowId); if (targetRow) break; }
                }
            }

            const contractTitle = targetRow ? targetRow.name : `Chi tiết hợp đồng (#${rowId})`;
            const contractorName = targetRow ? targetRow.contractor : 'Đang cập nhật';

            // Định nghĩa dữ liệu thật (Mockup data mẫu tương ứng cho từng row)
            const contractData = {
                id: rowId,
                months: ['2/2026', '3/2026', '4/2026', '5/2026', '6/2026', '7/2026'],
                plannedValues: [22, 38, 38, 48, 62, 42],   
                performedValues: [45, 62, 60, 85, 85, 75]  
            };

            // Đổ dữ liệu HTML sạch vào sidebar 
            sidePopup.innerHTML = `
                <div class="side-popup-header">
                    <h3 class="popup-title" style="color: #1E2B58; font-weight: 700;">${contractTitle}</h3>
                    <button class="side-popup-close-btn" id="js-close-sidebar-btn" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div class="side-popup-body">
                    <div class="info-card" style="overflow: hidden;">
                        <h4 class="card-section-title">Contract performance</h4>
                        
                        <div class="details-grid-table">
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Contract type:</span> <span class="val">Sub contract</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Currency:</span> <span class="val">VND</span></div>
                            </div>
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Client:</span> <span class="val">${contractorName}</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Budget:</span> <span class="val">1.500.000.000 VND</span></div>
                            </div>
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Started:</span> <span class="val">2025-05-14</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">Deadline:</span> <span class="val">2026-07-14</span></div>
                            </div>
                        </div>

                        <div style="height:1px;background:#f0f2f7;margin:12px 0;"></div>
                        
                        <div class="details-grid-table">
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">CPI:</span> <span class="val">1.09</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">CMI:</span> <span class="val">+100.000.000 VND</span></div>
                            </div>
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">SPI:</span> <span class="val">0.92</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">DPI:</span> <span class="val">-25 ngày</span></div>
                            </div>
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">BWSP:</span> <span class="val">-100.000.000 VND</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">EAC:</span> <span class="val">1.376.146.789 VND</span></div>
                            </div>
                            <div class="info-row flex justify-between w-full">
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">BCWS:</span> <span class="val">1.300.000.000 VND</span></div>
                                <div style="width: 50%; height: 24px; overflow:hidden; text-overflow: ellipsis; white-space: nowrap;"><span class="lbl">ETC:</span> <span class="val">276.146.789 VND</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="chart-card info-card" style="margin-top: 20px; padding: 20px; background: #fff; border-radius: 8px;">
                        <h4 class="card-section-title">PLANNED VS PERFORMED</h4>
                        <div style="position: relative; height: 240px; width: 100%;">
                            <canvas id="realContractChart"></canvas>
                        </div>
                    </div>
                </div>

                <div class="side-popup-footer">
                    <button class="btn-outline-danger" type="button">
                        Delete member 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.3202 10.3209L11.3202 4.72033L5.63884 4.72041M11.3202 4.72033L4.72051 11.32" stroke="#1E2B58" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="btn-primary-dark" type="button">
                        Assign member 
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.3202 10.3209L11.3202 4.72033L5.63884 4.72041M11.3202 4.72033L4.72051 11.32" stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            `;

            const self = this;

            // Xử lý đóng mở UI bằng CSS Classes
            overlay.onclick = function(e) { e.stopPropagation(); self.closePopup(); };
            const closeBtn = document.getElementById('js-close-sidebar-btn');
            if (closeBtn) { closeBtn.onclick = function(e) { e.stopPropagation(); self.closePopup(); }; }
            sidePopup.onclick = function(e) { e.stopPropagation(); };

            overlay.style.display = 'block';
            sidePopup.style.display = 'flex';

            // Kích hoạt animation lướt
            setTimeout(() => {
                overlay.classList.add('open');
                sidePopup.classList.add('open');
                
                // QUAN TRỌNG: Vẽ biểu đồ khi phần tử canvas đã hiển thị hoàn toàn trên giao diện
                self.renderRealChart(contractData);
            }, 50);
        },

        // Định nghĩa hàm vẽ chart (Đã tích hợp toàn bộ config resize legend và nét đứt grid mượt mà)
        renderRealChart: function(data) {
            const chartCanvas = document.getElementById('realContractChart');
            if (!chartCanvas) return;
            const ctx = chartCanvas.getContext('2d');

            if (this.activeChartInstance) {
                this.activeChartInstance.destroy();
            }

            // Khởi tạo Chart.js kế thừa dữ liệu thật và áp dụng styling resize chuẩn UI
            this.activeChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.months,
                    datasets: [
                        {
                            label: 'Planned Value',
                            data: data.plannedValues,
                            borderColor: '#52c41a',
                            backgroundColor: '#52c41a',
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 3,
                            bottom: 3
                        },
                        {
                            label: 'Performed Value',
                            data: data.performedValues,
                            borderColor: '#ff9c6e',
                            backgroundColor: '#ff9c6e',
                            tension: 0.4,
                            borderWidth: 2,
                            pointRadius: 3,
                            bottom: 3
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            bottom: 10 
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 5,         // Thu nhỏ đường kính chấm tròn lại cho tinh tế
                                boxHeight: 5,        // Giữ tỉ lệ tròn đều 7x7px
                                usePointStyle: true, // Ép icon chú thích thành dạng chấm tròn
                                pointStyle: 'circle',
                                padding: 32,  
                                marginBottom: 4,       // Tăng khoảng cách chiều ngang giữa các nhãn chú thích
                                font: {
                                    family: 'Nunito Sans, sans-serif', 
                                    size: 12,        
                                    weight: '500'
                                },
                                color: '#64748B'     
                            }
                        },
                        tooltip: {
                            cornerRadius: 6,
                            padding: 10
                        }
                    },
                    scales: {
                        y: {
                            min: 0,
                            max: 100, 
                            ticks: { 
                                stepSize: 20, 
                                color: '#94A3B8',
                                font: { size: 11 }
                            },
                            grid: { 
                                color: '#F1F5F9', 
                                drawTicks: false   
                            },
                            border: {
                                dash: [5, 5],      // Biến các đường Grid ngang thành nét đứt thanh mảnh
                                display: false     
                            }
                        },
                        x: {
                            ticks: {
                                color: '#94A3B8',
                                font: { size: 11 }
                            },
                            grid: { 
                                display: false 
                            },
                            border: {
                                display: false 
                            }
                        }
                    }
                }
            });
        },

        // ── HÀM ĐÓNG MODAL SIDEBAR (ĐÃ LỌC BỎ TRÙNG LẶP HÀM) ──
        closePopup: function() {
            const overlay = document.getElementById('popup-overlay');
            const sidePopup = document.getElementById('contract-overview-sidebar');
            
            if (overlay) overlay.classList.remove('open');
            if (sidePopup) sidePopup.classList.remove('open');

            // Giải phóng bộ nhớ của Chart cũ khi đóng popup
            if (this.activeChartInstance) {
                this.activeChartInstance.destroy();
                this.activeChartInstance = null;
            }

            setTimeout(() => {
                if (overlay && !overlay.classList.contains('open')) overlay.style.display = 'none';
                if (sidePopup && !sidePopup.classList.contains('open')) sidePopup.style.display = 'none';
            }, 350);
        }
    };
})();