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
            sub:      `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6.00004 14.6663H10C13.3334 14.6663 14.6667 13.333 14.6667 9.99967V5.99967C14.6667 2.66634 13.3334 1.33301 10 1.33301H6.00004C2.66671 1.33301 1.33337 2.66634 1.33337 5.99967V9.99967C1.33337 13.333 2.66671 14.6663 6.00004 14.6663Z" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.6666 11.3867H10.4332" stroke="#" stroke-linecap="round" stroke-linejoin="round"/> <path d="M8.64671 11.3867H4.33337" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.6666 8.87988H7.97998" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.18004 8.87988H4.33337" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            overview: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.3866 7.99995C10.3866 9.31995 9.31995 10.3866 7.99995 10.3866C6.67995 10.3866 5.61328 9.31995 5.61328 7.99995C5.61328 6.67995 6.67995 5.61328 7.99995 5.61328C9.31995 5.61328 10.3866 6.67995 10.3866 7.99995Z" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 13C10.5253 13 12.8789 11.7432 14.5171 9.56798C15.161 8.71601 15.161 7.28399 14.5171 6.43202C12.8789 4.2568 10.5253 3 8 3C5.47471 3 3.1211 4.2568 1.48288 6.43202C0.839039 7.28399 0.839039 8.71601 1.48288 9.56798C3.1211 11.7432 5.47471 13 8 13Z" stroke="#1E2B58" stroke-width="0.905825" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
            list:     `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.00008 8.00001C9.84103 8.00001 11.3334 6.50763 11.3334 4.66668C11.3334 2.82573 9.84103 1.33334 8.00008 1.33334C6.15913 1.33334 4.66675 2.82573 4.66675 4.66668C4.66675 6.50763 6.15913 8.00001 8.00008 8.00001Z" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.7268 14.6667C13.7268 12.0867 11.1601 10 8.0001 10C4.8401 10 2.27344 12.0867 2.27344 14.6667" stroke="#1E2B58" stroke-linecap="round" stroke-linejoin="round"/></svg>`
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
                    <div class="dd-item" onclick="ContractModule.openMemberList(event, ${row.id}); ContractModule.closeDropdown()">${ic.list} Member list</div>
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
        // ── HÀM MỞ POPUP CÓ HIỆU ỨNG LOADER KHI RENDER NỘI DUNG ──
        activeChartInstance: null,

        // ── STATE & DATA CHO MEMBER POPUP (SINGLE SOURCE OF TRUTH) ──
        currentMemberTab: 'assign', 
        selectedRoles: [], 
        searchQuery: '',   
        selectedMemberIds: [], // Quản lý danh sách ID member đang được tick chọn

        allMembersData: [
            { id: 'm1', name: 'Trần Thị Thanh Thuý', email: 'thuytttt@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', selectedRoles: [] },
            { id: 'm2', name: 'Nguyễn Hoàng Long', email: 'longnh@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', selectedRoles: [] },
            { id: 'm3', name: 'Võ Kim Bản', email: 'banvk@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', selectedRoles: [] },
            { id: 'm4', name: 'Nguyễn Huỳnh Phú Vinh', email: 'vinhnhp@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', selectedRoles: [] },
            { id: 'm5', name: 'Trương Thảo Vy', email: 'vytt@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', selectedRoles: [] },
            { id: 'm6', name: 'Đoàn Nhất Quang', email: 'quangdn@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', selectedRoles: [] },
            { id: 'm7', name: 'Huỳnh Vĩnh Quang', email: 'quanghv@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', selectedRoles: [] },
            { id: 'm8', name: 'Nguyễn Thị Tiểu Duy', email: 'duyntt@centralcons.vn', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', selectedRoles: [] }
        ],

        // ── HÀM MỞ POPUP CONTRACT OVERVIEW GỐC ──
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

            const contractData = {
                id: rowId,
                months: ['2/2026', '3/2026', '4/2026', '5/2026', '6/2026', '7/2026'],
                plannedValues: [22, 38, 38, 48, 62, 42],   
                performedValues: [45, 62, 60, 85, 85, 75]  
            };

            sidePopup.innerHTML = `
                <div class="side-popup-header">
                    <h3 class="popup-title" style="color: #1E2B58; font-weight: 700;">${contractTitle}</h3>
                    <button class="side-popup-close-btn" id="js-close-sidebar-btn" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div class="sidebar-loader-wrapper" id="js-sidebar-loader">
                    <div class="sidebar-spinner"></div>
                    <div class="sidebar-loader-text" style="margin-top: 16px;">Loading performance data...</div>
                </div>

                <div class="side-popup-body" id="js-sidebar-real-content" style="opacity: 0; pointer-events: none; width: 100%; height: 100%;">
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

                <div class="side-popup-footer" id="js-sidebar-footer" style="opacity: 0; pointer-events: none;">
                    <button class="btn-outline-danger" type="button">Delete member</button>
                    <button class="btn-primary-dark" type="button">Assign member</button>
                </div>
            `;

            const self = this;
            overlay.onclick = function(e) { e.stopPropagation(); self.closePopup(); };
            const closeBtn = document.getElementById('js-close-sidebar-btn');
            if (closeBtn) { closeBtn.onclick = function(e) { e.stopPropagation(); self.closePopup(); }; }
            sidePopup.onclick = function(e) { e.stopPropagation(); };

            overlay.style.display = 'block';
            sidePopup.style.display = 'flex';

            setTimeout(() => { overlay.classList.add('open'); sidePopup.classList.add('open'); }, 50);

            setTimeout(() => {
                const loaderEl = document.getElementById('js-sidebar-loader');
                const bodyContentEl = document.getElementById('js-sidebar-real-content');
                const footerEl = document.getElementById('js-sidebar-footer');

                if (loaderEl) { loaderEl.style.opacity = '0'; setTimeout(() => loaderEl.remove(), 300); }
                if (bodyContentEl) { bodyContentEl.style.opacity = '1'; bodyContentEl.style.pointerEvents = 'auto'; bodyContentEl.classList.add('fade-in-content'); }
                if (footerEl) { footerEl.style.opacity = '1'; footerEl.style.pointerEvents = 'auto'; footerEl.classList.add('fade-in-content'); }

                self.renderRealChart(contractData);
            }, 800);
        },

        renderRealChart: function(data) {
            const chartCanvas = document.getElementById('realContractChart');
            if (!chartCanvas) return;
            const ctx = chartCanvas.getContext('2d');

            if (this.activeChartInstance) { this.activeChartInstance.destroy(); }

            this.activeChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.months,
                    datasets: [
                        { label: 'Planned Value', data: data.plannedValues, borderColor: '#52c41a', backgroundColor: '#52c41a', tension: 0.4, borderWidth: 2, pointRadius: 3 },
                        { label: 'Performed Value', data: data.performedValues, borderColor: '#ff9c6e', backgroundColor: '#ff9c6e', tension: 0.4, borderWidth: 2, pointRadius: 3 }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { boxWidth: 5, boxHeight: 5, usePointStyle: true, pointStyle: 'circle', padding: 32, color: '#64748B' }
                        }
                    },
                    scales: {
                        y: { min: 0, max: 100, ticks: { stepSize: 20, color: '#94A3B8' }, grid: { color: '#F1F5F9' }, border: { dash: [5, 5], display: false } },
                        x: { ticks: { color: '#94A3B8' }, grid: { display: false }, border: { display: false } }
                    }
                }
            });
        },

        // ── HÀM MỞ POPUP MEMBER LIST ──
        openMemberList: function(event, rowId) {
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

            this.currentMemberTab = 'assign';
            this.selectedRoles = [];
            this.searchQuery = '';
            this.selectedMemberIds = []; 

            // Khai báo mã SVG chuẩn chỉnh từ thiết kế của bạn
            // Thêm lại biến này để nút Confirm dưới Footer không bị báo lỗi vỡ hàm
            const svgWhiteCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:inline-block; vertical-align:middle;"><path d="M6.36695 10.1L12.0169 4.45C12.1503 4.31667 12.3058 4.25 12.4836 4.25C12.6614 4.25 12.8169 4.31667 12.9503 4.45C13.0836 4.58333 13.1503 4.74178 13.1503 4.92533C13.1503 5.10889 13.0836 5.26711 12.9503 5.4L6.83362 11.5333C6.70028 11.6667 6.54473 11.7333 6.36695 11.7333C6.18917 11.7333 6.03362 11.6667 5.90028 11.5333L3.03362 8.66667C2.90028 8.53333 2.83628 8.37511 2.84162 8.192C2.84695 8.00889 2.9165 7.85044 3.05028 7.71667C3.18406 7.58289 3.34251 7.51622 3.52562 7.51667C3.70873 7.51711 3.86695 7.58378 4.00028 7.71667L6.36695 10.1Z" fill="white"/></svg>`;
            const svgRoleCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:inline-block; vertical-align:middle;"><path d="M6.36695 10.1L12.0169 4.45C12.1503 4.31667 12.3058 4.25 12.4836 4.25C12.6614 4.25 12.8169 4.31667 12.9503 4.45C13.0836 4.58333 13.1503 4.74178 13.1503 4.92533C13.1503 5.10889 13.0836 5.26711 12.9503 5.4L6.83362 11.5333C6.70028 11.6667 6.54473 11.7333 6.36695 11.7333C6.18917 11.7333 6.03362 11.6667 5.90028 11.5333L3.03362 8.66667C2.90028 8.53333 2.83628 8.37511 2.84162 8.192C2.84695 8.00889 2.9165 7.85044 3.05028 7.71667C3.18406 7.58289 3.34251 7.51622 3.52562 7.51667C3.70873 7.51711 3.86695 7.58378 4.00028 7.71667L6.36695 10.1Z" fill="#1E2B58"/></svg>`;
            const svgCancelX = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:inline-block; vertical-align:middle;"><path d="M12 4L4 12M12 12L4 4" stroke="black" stroke-width="1.33333" stroke-linecap="round"/></svg>`;
            sidePopup.innerHTML = `
                <div class="side-popup-header" style="border-bottom: none; padding-bottom: 8px;">
                    <h3 class="popup-title" style="color: #334155; font-weight: 700; font-size: 18px;">Members list</h3>
                    <button class="side-popup-close-btn" id="js-close-sidebar-btn" type="button">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div class="sidebar-loader-wrapper" id="js-member-loader">
                    <div class="sidebar-spinner"></div>
                    <div class="sidebar-loader-text" style="margin-top: 16px;">Loading members data...</div>
                </div>

                <div class="side-popup-body" id="js-member-real-content" style="opacity: 0; pointer-events: none; display: flex; flex-direction: column; height: 100%; padding-top: 0; overflow: hidden;">
                    <div class="member-tabs">
                        <div class="member-tab-item active" id="tab-assign-btn" onclick="ContractModule.switchMemberSubTab('assign')">Assign member</div>
                        <div class="member-tab-item" id="tab-remove-btn" onclick="ContractModule.switchMemberSubTab('remove')">Remove member</div>
                    </div>

                    <div class="member-search-box">
                        <span class="member-search-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input type="text" placeholder="Search name or email..." id="js-member-search-input" oninput="ContractModule.handleMemberSearch(this.value)">
                    </div>

                    <div class="role-pills-container" id="js-member-roles-container">
                        <span style="font-size: 13px; font-weight: 700; color: #334155; width: 100%; margin-bottom: 4px;">Roles</span>
                        <button type="button" class="role-pill" id="role-R" onclick="ContractModule.toggleRoleOption('Responsible')">Responsible <span class="chk-icon" style="display:none; margin-left:6px;">${svgRoleCheck}</span></button>
                        <button type="button" class="role-pill" id="role-A" onclick="ContractModule.toggleRoleOption('Approved')">Approved <span class="chk-icon" style="display:none; margin-left:6px;">${svgRoleCheck}</span></button>
                        <button type="button" class="role-pill" id="role-C" onclick="ContractModule.toggleRoleOption('Consulted')">Consulted <span class="chk-icon" style="display:none; margin-left:6px;">${svgRoleCheck}</span></button>
                        <button type="button" class="role-pill" id="role-I" onclick="ContractModule.toggleRoleOption('Be informed')">Be informed <span class="chk-icon" style="display:none; margin-left:6px;">${svgRoleCheck}</span></button>
                    </div>

                    <div class="table-scroll-wrapper" style="flex: 1; overflow-y: auto; position: relative; margin-top: 8px; border: 1px solid #E2E8F0; border-radius: 8px;">
                        <div class="member-list-table-header" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; position: sticky; top: 0; background: #ECEFFA; z-index: 10; border-bottom: 1px solid #E2E8F0;">
                            <span style="font-weight: 700; color: #475569; font-size: 13px;">Member</span>
                            <div id="js-member-cb-all" onclick="ContractModule.toggleSelectAllMembers()" style="width: 18px; height: 18px; border: 1px solid #CBD5E1; border-radius: 4px; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; margin-left: 4px;"></div>
                        </div>
                        <div id="js-member-list-rows-container"></div>
                    </div>
                </div>

                <div class="side-popup-footer" id="js-member-footer" style="opacity: 0; pointer-events: none; display: flex; justify-content: flex-end; gap: 12px; border-top: none; padding-top: 12px;">
                    <button class="btn-outline-danger" style="border: 1px solid #CBD5E1; background: #fff; color: #000; padding: 8px 16px; border-radius: 6px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; cursor: pointer;" type="button" onclick="ContractModule.closePopup()">
                        Cancel ${svgCancelX} 
                    </button>
                    <button class="btn-primary-dark" style="background: #1E2B58; color: #fff; padding: 8px 18px; border-radius: 6px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; font-size: 13px; border: none; cursor: pointer;" type="button" onclick="ContractModule.handleMemberConfirm()">
                        Confirm ${svgWhiteCheck} 
                    </button>
                </div>
            `;

            const self = this;
            overlay.onclick = function(e) { e.stopPropagation(); self.closePopup(); };
            const closeBtn = document.getElementById('js-close-sidebar-btn');
            if (closeBtn) { closeBtn.onclick = function(e) { e.stopPropagation(); self.closePopup(); }; }
            sidePopup.onclick = function(e) { e.stopPropagation(); };

            overlay.style.display = 'block';
            sidePopup.style.display = 'flex';

            setTimeout(() => { overlay.classList.add('open'); sidePopup.classList.add('open'); }, 50);

            setTimeout(() => {
                const loaderEl = document.getElementById('js-member-loader');
                const bodyContentEl = document.getElementById('js-member-real-content');
                const footerEl = document.getElementById('js-member-footer');

                if (loaderEl) { loaderEl.style.opacity = '0'; setTimeout(() => loaderEl.remove(), 300); }
                if (bodyContentEl) { bodyContentEl.style.opacity = '1'; bodyContentEl.style.pointerEvents = 'auto'; bodyContentEl.classList.add('fade-in-content'); }
                if (footerEl) { footerEl.style.opacity = '1'; footerEl.style.pointerEvents = 'auto'; footerEl.classList.add('fade-in-content'); }

                self.renderMembersData();
            }, 800);
        },

        switchMemberSubTab: function(tabName) {
            this.currentMemberTab = tabName;
            const btnAssign = document.getElementById('tab-assign-btn');
            const btnRemove = document.getElementById('tab-remove-btn');
            const rolesContainer = document.getElementById('js-member-roles-container');

            if (tabName === 'assign') { 
                btnAssign.classList.add('active'); 
                btnRemove.classList.remove('active');
                if (rolesContainer) rolesContainer.style.display = 'flex'; 
            } else { 
                btnRemove.classList.add('active'); 
                btnAssign.classList.remove('active');
                if (rolesContainer) rolesContainer.style.display = 'none'; 
            }
            this.renderMembersData();
        },

        handleMemberSearch: function(value) {
            this.searchQuery = value.trim().toLowerCase();
            this.renderMembersData();
        },

        toggleRoleOption: function(roleName) {
            const index = this.selectedRoles.indexOf(roleName);
            let btnId = '';
            if (roleName === 'Responsible') btnId = 'role-R';
            else if (roleName === 'Approved') btnId = 'role-A';
            else if (roleName === 'Consulted') btnId = 'role-C';
            else if (roleName === 'Be informed') btnId = 'role-I';

            const roleBtn = document.getElementById(btnId);
            if (!roleBtn) return;
            const checkIcon = roleBtn.querySelector('.chk-icon');

            if (index > -1) {
                // Trạng thái BỎ CHỌN
                this.selectedRoles.splice(index, 1);
                roleBtn.classList.remove('active');
                roleBtn.style.color = ''; // Trả về màu chữ mặc định của class
                if (checkIcon) checkIcon.style.display = 'none';
            } else {
                // Trạng thái ĐƯỢC CHỌN
                this.selectedRoles.push(roleName);
                roleBtn.classList.add('active');
                roleBtn.style.color = '#1E2B58'; // Ép màu chữ sang màu xanh đen thương hiệu
                if (checkIcon) checkIcon.style.display = 'inline-block';
            }
        },

        toggleSelectMemberRow: function(memberId) {
            const index = this.selectedMemberIds.indexOf(memberId);
            if (index > -1) {
                this.selectedMemberIds.splice(index, 1);
            } else {
                this.selectedMemberIds.push(memberId);
            }
            this.renderMembersData();
        },

        toggleSelectAllMembers: function() {
            const filteredMembers = this.allMembersData.filter(member => {
                return member.name.toLowerCase().includes(this.searchQuery) || member.email.toLowerCase().includes(this.searchQuery);
            });

            const allFilteredAreChecked = filteredMembers.every(m => this.selectedMemberIds.includes(m.id));

            filteredMembers.forEach(m => {
                const idx = this.selectedMemberIds.indexOf(m.id);
                if (allFilteredAreChecked) {
                    if (idx > -1) this.selectedMemberIds.splice(idx, 1);
                } else {
                    if (idx === -1) this.selectedMemberIds.push(m.id);
                }
            });

            this.renderMembersData();
        },

        // ── RENDER DATA BẢNG MEMBER ──
        renderMembersData: function() {
            const container = document.getElementById('js-member-list-rows-container');
            if (!container) return;

            const filteredMembers = this.allMembersData.filter(member => {
                return member.name.toLowerCase().includes(this.searchQuery) || member.email.toLowerCase().includes(this.searchQuery);
            });

            container.innerHTML = '';
            if (filteredMembers.length === 0) {
                container.innerHTML = `<div style="padding: 30px; text-align: center; color: #94A3B8; font-size: 13px;">No members matching your search.</div>`;
                return;
            }

            const svgBlueCheck = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" style="display:block;"><path d="M6.36695 10.1L12.0169 4.45C12.1503 4.31667 12.3058 4.25 12.4836 4.25C12.6614 4.25 12.8169 4.31667 12.9503 4.45C13.0836 4.58333 13.1503 4.74178 13.1503 4.92533C13.1503 5.10889 13.0836 5.26711 12.9503 5.4L6.83362 11.5333C6.70028 11.6667 6.54473 11.7333 6.36695 11.7333C6.18917 11.7333 6.03362 11.6667 5.90028 11.5333L3.03362 8.66667C2.90028 8.53333 2.83628 8.37511 2.84162 8.192C2.84695 8.00889 2.9165 7.85044 3.05028 7.71667C3.18406 7.58289 3.34251 7.51622 3.52562 7.51667C3.70873 7.51711 3.86695 7.58378 4.00028 7.71667L6.36695 10.1Z" fill="#1E2B58"/></svg>`;

            // ==================== BẮT ĐẦU ĐOẠN THAY THẾ CHÍNH XÁC ====================
            filteredMembers.forEach((member) => {
                const isChecked = this.selectedMemberIds.includes(member.id);
                const row = document.createElement('div');
                row.className = 'member-item-row';
                row.style.flexDirection = 'row-reverse';
                row.style.display = 'flex';
                row.style.alignItems = 'stretch'; 
                row.style.padding = '12px 16px';
                row.style.borderBottom = '1px solid #F1F5F9';

                // 1. XỬ LÝ LỌC LẤY CHỮ CÁI ĐẦU (R, A, C, I):
                // Nếu role là "Be informed" thì lấy chữ "I", còn lại lấy ký tự đầu tiên của chuỗi
                const rolesBadge = member.selectedRoles.length > 0 
                    ? member.selectedRoles.map(r => {
                        const letter = r === 'Be informed' ? 'I' : r.charAt(0);
                        return `<span style="display:inline-flex; align-items:center; justify-content:center; background:#EEF2F6; color:#1E2B58; font-size:10px; width:16px; height:16px; border-radius:50%; font-weight:700; margin-left:6px; vertical-align:middle;">${letter}</span>`;
                    }).join('')
                    : '';

                // Ô bọc checkbox độc lập căn bottom cố định theo dòng chảy dữ liệu
                const checkboxHTML = isChecked 
                    ? `<div style="display: flex; align-items: flex-end; padding-bottom: 5px;"><div onclick="ContractModule.toggleSelectMemberRow('${member.id}')" style="width:18px; height:18px; border:1px solid #CBD5E1; border-radius:4px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:4px; transition: all 0.15s;">${svgBlueCheck}</div></div>`
                    : `<div style="display: flex; align-items: flex-end; padding-bottom: 5px;"><div onclick="ContractModule.toggleSelectMemberRow('${member.id}')" style="width:18px; height:18px; border:1px solid #CBD5E1; border-radius:4px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; margin-left:4px; transition: all 0.15s;"></div></div>`;

                // 2. TÁI CẤU TRÚC HTML: Đưa chuỗi ${rolesBadge} lên nằm chung trong thẻ h5 ngay cạnh chữ Tên
                row.innerHTML = `
                    ${checkboxHTML}
                    <div style="display: flex; align-items: flex-start; gap: 12px; flex: 1;">
                        <img src="${member.avatar}" class="member-avatar" alt="avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div class="member-info-meta" style="display: flex; flex-direction: column;">
                            <h5 style="margin: 0; font-size: 14px; font-weight: 600; color: #334155; line-height: 1.4; display: flex; align-items: center; flex-wrap: wrap;">
                                ${member.name} ${rolesBadge}
                            </h5>
                            <p style="margin: 2px 0 0 0; font-size: 12px; color: #64748B; line-height: 1.4;">${member.email}</p>
                        </div>
                    </div>
                `;
                container.appendChild(row);
            });
            // ==================== KẾT THÚC ĐOẠN THAY THẾ CHÍNH XÁC ====================

            // Đoạn code đồng bộ ô Check All bên dưới giữ nguyên...
            const cbAll = document.getElementById('js-member-cb-all');
            if (cbAll) {
                const allFilteredAreChecked = filteredMembers.every(m => this.selectedMemberIds.includes(m.id));
                if (allFilteredAreChecked && filteredMembers.length > 0) {
                    cbAll.style.border = '1px solid #CBD5E1';
                    cbAll.innerHTML = svgBlueCheck;
                } else {
                    cbAll.style.border = '1px solid #CBD5E1';
                    cbAll.innerHTML = '';
                }
            }
        },

        // ── HÀM HIỂN THỊ TOAST NOTIFICATION ĐỘNG THEO LOẠI THÔNG BÁO ──
        showToastNotification: function(type, title, description) {
            let container = document.getElementById('js-custom-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'js-custom-toast-container';
                container.className = 'custom-toast-container';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = 'custom-toast-card';

            // Định nghĩa các Icon SVG lớn chính xác từ yêu cầu của bạn
            let iconSvg = '';
            let progressColor = '#28A745'; // Mặc định là xanh lá (Success)

            if (type === 'success') {
                progressColor = '#28A745';
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><g clip-path="url(#clip0_781_2974)"><path d="M29.0653 16.1481C29.0653 23.2818 23.2823 29.0647 16.1486 29.0647C9.0149 29.0647 3.23193 23.2818 3.23193 16.1481C3.23193 9.01435 9.0149 3.23138 16.1486 3.23138C23.2823 3.23138 29.0653 9.01435 29.0653 16.1481ZM14.6545 22.9873L24.2379 13.404C24.5633 13.0786 24.5633 12.5509 24.2379 12.2255L23.0594 11.047C22.734 10.7215 22.2063 10.7215 21.8808 11.047L14.0653 18.8625L10.4164 15.2136C10.0909 14.8882 9.56329 14.8882 9.23782 15.2136L8.05933 16.3921C7.73391 16.7175 7.73391 17.2452 8.05933 17.5706L13.476 22.9873C13.8015 23.3127 14.3291 23.3127 14.6545 22.9873V22.9873Z" fill="#28A745"/></g><defs><clipPath id="clip0_781_2974"><rect width="26.6667" height="26.6667" fill="white" transform="translate(2.81494 2.81476)"/></clipPath></defs></svg>`;
            } else if (type === 'warning') {
                progressColor = '#FFC107'; // Sử dụng mã màu vàng hổ phách mới yêu cầu
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M14.3483 5.80499C15.0481 4.47548 16.9521 4.47548 17.652 5.80499L27.8932 25.264C28.5474 26.5069 27.6464 28.0001 26.2418 28.0003H5.75841C4.35386 28.0001 3.45285 26.5069 4.10704 25.264L14.3483 5.80499ZM15.9996 22.2669C15.4107 22.2671 14.9332 22.7443 14.9332 23.3333C14.9332 23.9223 15.4107 24.3995 15.9996 24.3997C16.5887 24.3997 17.066 23.9224 17.066 23.3333C17.066 22.7442 16.5887 22.2669 15.9996 22.2669ZM15.9996 12.9339C15.4107 12.9341 14.9332 13.4113 14.9332 14.0003V20.0003C14.9334 20.5892 15.4108 21.0665 15.9996 21.0667C16.5886 21.0667 17.0659 20.5893 17.066 20.0003V14.0003C17.066 13.4112 16.5887 12.9339 15.9996 12.9339Z" fill="#FECA5C"/></svg>`;
            } else if (type === 'danger' || type === 'remove') {
                progressColor = '#DC3545'; // Sử dụng mã màu đỏ đậm mới yêu cầu
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none"><g clip-path="url(#clip0_781_2971)"><path d="M6.73701 25.5905C5.46354 24.3606 4.44778 22.8893 3.74899 21.2626C3.05021 19.6359 2.68239 17.8863 2.66701 16.1159C2.65162 14.3455 2.98898 12.5898 3.65939 10.9511C4.3298 9.31252 5.31984 7.82383 6.57175 6.57193C7.82365 5.32003 9.31234 4.32999 10.951 3.65957C12.5896 2.98916 14.3453 2.65181 16.1157 2.66719C17.8861 2.68257 19.6357 3.05039 21.2624 3.74918C22.8891 4.44796 24.3604 5.46373 25.5903 6.7372C28.0191 9.25189 29.363 12.6199 29.3327 16.1159C29.3023 19.6118 27.9 22.956 25.4279 25.4281C22.9558 27.9002 19.6117 29.3025 16.1157 29.3328C12.6197 29.3632 9.25171 28.0193 6.73701 25.5905ZM18.0417 16.1639C18.0375 16.1639 18.0354 16.1588 18.0384 16.1558L21.4266 12.7677C21.6348 12.5594 21.6348 12.2217 21.4266 12.0134L20.3015 10.8883C20.0929 10.6798 19.7547 10.6801 19.5466 10.889L16.4465 14C16.2904 14.1567 16.0367 14.1569 15.8803 14.0005L12.7675 10.8877C12.5592 10.6794 12.2215 10.6794 12.0132 10.8877L10.8875 12.0134C10.6792 12.2217 10.6792 12.5594 10.8875 12.7677L14.0008 15.881C14.157 16.0372 14.157 16.2905 14.0008 16.4467L10.8875 19.5601C10.6792 19.7684 10.6792 20.106 10.8875 20.3143L12.0132 21.4401C12.2215 21.6484 12.5592 21.6484 12.7675 21.4401L15.8808 18.3267C16.037 18.1705 16.2903 18.1705 16.4465 18.3267L19.5599 21.4401C19.7682 21.6484 20.1059 21.6484 20.3141 21.4401L21.4399 20.3143C21.6482 20.106 21.6482 19.7684 21.4399 19.5601L18.0451 16.1652C18.0442 16.1644 18.043 16.1639 18.0417 16.1639Z" fill="#DC3545"/></g><defs><clipPath id="clip0_781_2971"><rect width="26.6667" height="26.6667" fill="white" transform="translate(2.6665 2.66669)"/></clipPath></defs></svg>`;
            }

            toast.innerHTML = `
                <div class="toast-icon-wrapper">${iconSvg}</div>
                <div class="toast-content-wrapper">
                    <h5 class="toast-title">${title}</h5>
                    <p class="toast-desc">${description}</p>
                </div>
                <div class="toast-progress-bar" style="background: ${progressColor};"></div>
            `;

            container.appendChild(toast);

            // Trigger Slide In animation
            setTimeout(() => toast.classList.add('show'), 50);

            // Khởi tạo chạy lùi Progress Bar dưới đáy
            const duration = 3000;
            const start = Date.now();
            const progressBar = toast.querySelector('.toast-progress-bar');

            const timer = setInterval(() => {
                const timePassed = Date.now() - start;
                const progress = 100 - (timePassed / duration) * 100;
                
                if (progress <= 0) {
                    clearInterval(timer);
                    progressBar.style.width = '0%';
                } else {
                    progressBar.style.width = `${progress}%`;
                }
            }, 10);

            // Auto Close & Destroy
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    clearInterval(timer);
                    toast.remove();
                }, 300);
            }, duration);
        },

        // ── HÀM XỬ LÝ LƯU HOẶC XÓA DATA KHI CLICK CONFIRM ──
        handleMemberConfirm: function() {
            if (this.selectedMemberIds.length === 0) {
                this.showToastNotification('warning', 'Warning', 'Please select at least one member.');
                return;
            }
            if (this.currentMemberTab === 'assign' && this.selectedRoles.length === 0) {
                this.showToastNotification('warning', 'Warning', 'Please select at least one role.');
                return;
            }

            const totalSelected = this.selectedMemberIds.length;

            if (this.currentMemberTab === 'assign') {
                // Logic Xử lý gán thêm Role (Thêm Role mới, giữ nguyên thành viên cũ)
                this.selectedMemberIds.forEach(memberId => {
                    const member = this.allMembersData.find(m => m.id === memberId);
                    if (member) {
                        this.selectedRoles.forEach(role => {
                            if (!member.selectedRoles.includes(role)) {
                                member.selectedRoles.push(role);
                            }
                        });
                    }
                });

                // Gọi Toast thông báo Thành công màu Xanh lá
                this.showToastNotification(
                    'success',
                    'Success notification',
                    `Successfully assigned ${totalSelected} member${totalSelected > 1 ? 's' : ''} to the contracts.`
                );

            } else if (this.currentMemberTab === 'remove') {
                // THAY ĐỔI QUAN TRỌNG: Logic xóa triệt để thành viên khỏi mảng lưu trữ 'allMembersData'
                this.allMembersData = this.allMembersData.filter(member => !this.selectedMemberIds.includes(member.id));

                // Reset danh sách ID đang được chọn về rỗng để tránh lỗi dữ liệu cũ ở phiên sau
                this.selectedMemberIds = [];

                // Re-render lại view bảng dữ liệu để đồng bộ UI lập tức xóa các row
                this.renderMembersData();

                // Gọi Toast thông báo Xóa màu Đỏ đậm
                this.showToastNotification(
                    'remove',
                    'Remove notification',
                    `Successfully removed ${totalSelected} member${totalSelected > 1 ? 's' : ''} from the list.`
                );
            }

            // Đóng sidebar popup
            this.closePopup();
        },

        closePopup: function() {
            const overlay = document.getElementById('popup-overlay');
            const sidePopup = document.getElementById('contract-overview-sidebar');
            if (overlay) overlay.classList.remove('open');
            if (sidePopup) sidePopup.classList.remove('open');

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