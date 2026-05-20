// ── Shared Chart defaults ─────────────────────────────
function _setChartDefaults() {
    Chart.defaults.font.size   = 10;
    Chart.defaults.font.family = "'Nunito Sans', system-ui, sans-serif";
    Chart.defaults.color       = '#6b7280';
}

// ── Helper: destroy chart nếu đã tồn tại trên canvas ──
function _safeChart(id, config) {
    const el = document.getElementById(id);
    if (!el) return;
    const existing = Chart.getChart(el);
    if (existing) existing.destroy();
    new Chart(el, config);
}

// ═══════════════════════════════════════════════════════
// CONTRACT DASHBOARD — charts cho contract-dashboard.html
// ═══════════════════════════════════════════════════════
function initContractCharts() {
    _setChartDefaults();

    const months   = ['3/2026','4/2026','5/2026','6/2026','7/2026'];
    const mthsLong = ['9/25','10/25','11/25','12/25','1/26','2/26','3/26','4/26'];

    // 1. Finance line chart
    _safeChart('financeChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label:'Revenue',      data:[20,35,42,58,78], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Cost',         data:[15,28,35,50,65], borderColor:'#f97316', backgroundColor:'rgba(249,115,22,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Forecast EAC', data:[18,32,40,55,80], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)',  tension:0.4, pointRadius:3, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:10, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 2. S-Curve
    _safeChart('sCurveChart', {
        type: 'line',
        data: {
            labels: ['3/26','4/26','5/26','6/26','7/26','8/26'],
            datasets: [
                { label:'Planned',  data:[10,25,40,60,80,100],         borderColor:'#6366f1', tension:0.4, pointRadius:2, borderWidth:2 },
                { label:'Actual',   data:[8,22,38,null,null,null],      borderColor:'#f97316', tension:0.4, pointRadius:2, borderWidth:2 },
                { label:'Forecast', data:[null,null,38,55,75,100],      borderColor:'#22c55e', tension:0.4, pointRadius:2, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:10} } } }, scales:{ y:{ max:100, grid:{ color:'#f0f3f8' }, ticks:{font:{size:10}} }, x:{ grid:{display:false}, ticks:{font:{size:10}} } } }
    });

    // 3. Milestone donut
    _safeChart('milestoneChart', {
        type: 'doughnut',
        data: { labels:['Completed','On track','Overdue'], datasets:[{ data:[48,82,15], backgroundColor:['#22c55e','#60a5fa','#fb923c'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 4. Variation donut
    _safeChart('variationDonut', {
        type: 'doughnut',
        data: { labels:['Design Changes','Client Requests','Site Conditions','Regulatory','Others'], datasets:[{ data:[35,25,20,12,8], backgroundColor:['#3b82f6','#4ade80','#fb923c','#a78bfa','#9ca3af'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 5. Claims donut
    _safeChart('claimsDonut', {
        type: 'doughnut',
        data: { labels:['EOT','Cost','Disruption','Others'], datasets:[{ data:[40,30,20,10], backgroundColor:['#3b82f6','#4ade80','#fbbf24','#9ca3af'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 6. Receivables donut
    _safeChart('receivablesDonut', {
        type: 'doughnut',
        data: { labels:['0-20 days','21-40 days','61-90 days','> 90 days'], datasets:[{ data:[2.10,4.20,7.05,3.10], backgroundColor:['#fb923c','#60a5fa','#2563eb','#ef4444'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 7. Billing
    _safeChart('billingChart', {
        type: 'bar',
        data: {
            labels:['11/25','12/25','1/26','2/26','3/26','4/26'],
            datasets:[
                { label:'Billed',       data:[28,35,42,50,60,70], backgroundColor:'rgba(59,130,246,0.5)', borderRadius:2, yAxisID:'y' },
                { label:'Collected',    data:[22,30,38,45,55,65], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Collection %', data:[78,86,90,90,92,93], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:100, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 8. Personnel
    _safeChart('personnelChart', {
        type: 'bar',
        data: {
            labels: mthsLong,
            datasets:[
                { label:'Planned',  data:[100,150,200,250,270,280,300,320], backgroundColor:'rgba(99,102,241,0.4)', borderRadius:2, yAxisID:'y' },
                { label:'Actual',   data:[85,140,210,240,230,260,290,310],  backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Progress', data:[2,9,12,26,31,31,49,89], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:100, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 9. Materials
    _safeChart('materialsChart', {
        type: 'bar',
        data: {
            labels: mthsLong,
            datasets:[
                { label:'Import Value',       data:[2.5,4.2,8.1,12.5,9.5,7.5,15.2,10.4], backgroundColor:'rgba(99,102,241,0.4)', borderRadius:2, yAxisID:'y' },
                { label:'Actual Consumption', data:[2.4,3.8,7.8,11.8,9.3,7.2,14.5,13.0], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Wastage %',          data:[0.5,1.5,1.2,3.5,2.8,2.5,4.5,2.6], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:10, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });
}

// ═══════════════════════════════════════════════════════
// PROJECT DASHBOARD — charts cho project-dashboard.html
// ═══════════════════════════════════════════════════════
function initProjectCharts() {
    _setChartDefaults();

    const months   = ['3/2026','4/2026','5/2026','6/2026','7/2026'];
    const mthsLong = ['9/25','10/25','11/25','12/25','1/26','2/26','3/26','4/26'];

    // 2. proPlaChart — Progress vs Plan (S-Curve)
    _safeChart('proPlaChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label:'Planned - %',  data:[20,35,42,58,78], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Actual - %',   data:[15,28,55, , ], borderColor:'#22c55e', backgroundColor:'rgba(249,115,22,0.08)',  tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Forecast - %', data:[ , ,55,74,90], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)',   tension:0.4, pointRadius:3, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:10, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 3.1 financialChart — Financial Performance
    _safeChart('financialChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label:'Planned - %',  data:[20,35,42,58,78], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Actual - %',   data:[15,28,55, , ], borderColor:'#22c55e', backgroundColor:'rgba(249,115,22,0.08)',  tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Forecast - %', data:[ , ,55,74,90], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)',   tension:0.4, pointRadius:3, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:10, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    //3.2 Profit Waterfall
    const revenue        = 85;
    const forecastProfit = 50;
    const eacCost        = revenue - forecastProfit; // tự tính phần đỏ

    _safeChart('waterfallChart', {
        type: 'bar',
        data: {
            labels: ['Revenue', 'EAC', 'Forecast Profit'],
            datasets: [
                {
                    label: '_base',
                    color: 'rgba(0,0,0,0)',
                    data: [0, forecastProfit, 0],
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderColor: 'rgba(0,0,0,0)',
                    borderWidth: 0,
                    stack: 'stack'
                },
                {
                    label: 'Profit / Revenue',
                    color: 'rgba(0,0,0,0)',
                    data: [revenue, 0, forecastProfit],
                    backgroundColor: 'rgba(34,197,94,0.65)',
                    borderColor: 'rgba(34,197,94,0.9)',
                    borderWidth: 1,
                    borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
                    stack: 'stack'
                },
                {
                    label: 'Cost (EAC)',
                    color: 'rgba(0,0,0,0)',
                    data: [0, eacCost, 0],
                    backgroundColor: 'rgba(250, 68, 96, 0.65)',
                    borderColor: 'rgba(251,113,133,0.9)',
                    borderWidth: 1,
                    borderRadius: { topLeft: 3, topRight: 3, bottomLeft: 0, bottomRight: 0 },
                    stack: 'stack'
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    filter: (item) => item.dataset.label !== '_base',
                    callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y}` }
                }
            },
            scales: {
                x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
                y: { stacked: true, min: 0, max: 100, grid: { color: '#f0f3f8' }, ticks: { font: { size: 10 }, stepSize: 20 } }
            }
        }
    });

    // 4. summaryDonut
    _safeChart('summaryDonut', {
        type: 'doughnut',
        data: { labels:['0-20 days','21-40 days','61-90 days','> 90 days'], datasets:[{ data:[2.10,4.20,7.05], backgroundColor:['#28A745','#FFC107','#DC3545'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 5.1. receivables Aging Donut
    _safeChart('recAgDonut', {
        type: 'doughnut',
        data: { labels:['0-20 days','21-40 days','61-90 days','> 90 days'], datasets:[{ data:[2.10,4.20,7.05,3.4], backgroundColor:['#28A745','#FFC107','#DC3545', '#0093FF'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 5.2 bilColChart — Billing vs Collection
    _safeChart('bilColChart', {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label:'Planned - %',  data:[20,35,42,58,78], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Actual - %',   data:[15,28,55, , ], borderColor:'#22c55e', backgroundColor:'rgba(249,115,22,0.08)',  tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Forecast - %', data:[ , ,55,74,90], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)',   tension:0.4, pointRadius:3, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:10, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 6. claimsStatusChart
    _safeChart('claimsByStatusChart', {
        type: 'doughnut',
        data: { labels:['Approved','Pending','Rejected'], datasets:[{ data:[2.10,4.20,7.05], backgroundColor:['#28A745','#FFC107','#DC3545'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });


    // billingChart
    _safeChart('billingChart', {
        type: 'bar',
        data: {
            labels:['11/25','12/25','1/26','2/26','3/26','4/26'],
            datasets:[
                { label:'Billed',       data:[28,35,42,50,60,70], backgroundColor:'rgba(59,130,246,0.5)', borderRadius:2, yAxisID:'y' },
                { label:'Collected',    data:[22,30,38,45,55,65], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Collection %', data:[78,86,90,90,92,93], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:100, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // personnelChart
    _safeChart('personnelChart', {
        type: 'bar',
        data: {
            labels: mthsLong,
            datasets:[
                { label:'Planned',  data:[100,150,200,250,270,280,300,320], backgroundColor:'rgba(99,102,241,0.4)', borderRadius:2, yAxisID:'y' },
                { label:'Actual',   data:[85,140,210,240,230,260,290,310],  backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Progress', data:[2,9,12,26,31,31,49,89], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:100, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // materialsChart
    _safeChart('materialsChart', {
        type: 'bar',
        data: {
            labels: mthsLong,
            datasets:[
                { label:'Import Value',       data:[2.5,4.2,8.1,12.5,9.5,7.5,15.2,10.4], backgroundColor:'rgba(99,102,241,0.4)', borderRadius:2, yAxisID:'y' },
                { label:'Actual Consumption', data:[2.4,3.8,7.8,11.8,9.3,7.2,14.5,13.0], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Wastage %',          data:[0.5,1.5,1.2,3.5,2.8,2.5,4.5,2.6], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:10, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });
}
