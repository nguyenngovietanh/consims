// Hàm này sẽ được gọi sau khi giao diện Dashboard đã được nạp vào HTML thành công
function initContractCharts() {
    // ── Cấu hình mặc định cho Chart ──────────────────────────────────
    Chart.defaults.font.size = 10;
    Chart.defaults.font.family = "'Nunito Sans', system-ui, sans-serif";
    Chart.defaults.color = '#6b7280';

    const months = ['3/2026','4/2026','5/2026','6/2026','7/2026'];
    const mthsLong = ['9/25','10/25','11/25','12/25','1/26','2/26','3/26','4/26'];

    // 1. Finance line chart
    new Chart(document.getElementById('financeChart'), {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                { label:'Revenue', data:[20,35,42,58,78], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Cost',    data:[15,28,35,50,65], borderColor:'#f97316', backgroundColor:'rgba(249,115,22,0.08)', tension:0.4, pointRadius:3, borderWidth:2 },
                { label:'Forecast EAC', data:[18,32,40,55,80], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', tension:0.4, pointRadius:3, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:10, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 2. S-Curve
    new Chart(document.getElementById('sCurveChart'), {
        type: 'line',
        data: {
            labels: ['3/26','4/26','5/26','6/26','7/26','8/26'],
            datasets: [
                { label:'Planned', data:[10,25,40,60,80,100], borderColor:'#6366f1', tension:0.4, pointRadius:2, borderWidth:2 },
                { label:'Actual',  data:[8,22,38,null,null,null], borderColor:'#f97316', tension:0.4, pointRadius:2, borderWidth:2 },
                { label:'Forecast',data:[null,null,38,55,75,100], borderColor:'#22c55e', tension:0.4, pointRadius:2, borderWidth:2, borderDash:[4,3] },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:10} } } }, scales:{ y:{ max:100, grid:{ color:'#f0f3f8' }, ticks:{font:{size:10}} }, x:{ grid:{display:false}, ticks:{font:{size:10}} } } }
    });

    // 3. Milestone donut
    new Chart(document.getElementById('milestoneChart'), {
        type: 'doughnut',
        data: { labels:['Completed','On track','Overdue'], datasets:[{ data:[48,82,15], backgroundColor:['#22c55e','#60a5fa','#fb923c'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });
    

    // 4. Variation donut
    new Chart(document.getElementById('variationDonut'), {
        type: 'doughnut',
        data: { labels:['Design Changes','Client Requests','Site Conditions','Regulatory','Others'], datasets:[{ data:[35,25,20,12,8], backgroundColor:['#3b82f6','#4ade80','#fb923c','#a78bfa','#9ca3af'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 5. Claims donut
    new Chart(document.getElementById('claimsDonut'), {
        type: 'doughnut',
        data: { labels:['EOT','Cost','Disruption','Others'], datasets:[{ data:[40,30,20,10], backgroundColor:['#3b82f6','#4ade80','#fbbf24','#9ca3af'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 6. Receivables donut
    new Chart(document.getElementById('receivablesDonut'), {
        type: 'doughnut',
        data: { labels:['0-20 days','21-40 days','61-90 days','> 90 days'], datasets:[{ data:[2.10,4.20,7.05,3.10], backgroundColor:['#fb923c','#60a5fa','#2563eb','#ef4444'], borderWidth:2, borderColor:'#fff' }] },
        options: { responsive:true, maintainAspectRatio:false, cutout:'60%', plugins:{ legend:{ display:false } } }
    });

    // 7. Billing bar + line
    new Chart(document.getElementById('billingChart'), {
        type: 'bar',
        data: {
            labels:['11/25','12/25','1/26','2/26','3/26','4/26'],
            datasets:[
                { label:'Billed',    data:[28,35,42,50,60,70], backgroundColor:'rgba(59,130,246,0.5)', borderRadius:2, yAxisID:'y' },
                { label:'Collected', data:[22,30,38,45,55,65], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Collection %', data:[78,86,90,90,92,93], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:100, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });

    // 8. Personnel
    new Chart(document.getElementById('personnelChart'), {
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
    new Chart(document.getElementById('materialsChart'), {
        type: 'bar',
        data: {
            labels: mthsLong,
            datasets:[
                { label:'Import Value',         data:[2.5,4.2,8.1,12.5,9.5,7.5,15.2,10.4], backgroundColor:'rgba(99,102,241,0.4)', borderRadius:2, yAxisID:'y' },
                { label:'Actual Consumption',   data:[2.4,3.8,7.8,11.8,9.3,7.2,14.5,13.0], backgroundColor:'rgba(34,197,94,0.5)',  borderRadius:2, yAxisID:'y' },
                { label:'Wastage %',            data:[0.5,1.5,1.2,3.5,2.8,2.5,4.5,2.6], type:'line', borderColor:'#f97316', pointRadius:2, borderWidth:1.5, yAxisID:'y1', tension:0.4 },
            ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ boxWidth:10, padding:8, font:{size:9} } } }, scales:{ y:{ grid:{ color:'#f0f3f8' }, ticks:{font:{size:9}} }, y1:{ position:'right', min:0, max:10, grid:{ display:false }, ticks:{callback:v=>v+'%',font:{size:9}} }, x:{ grid:{display:false}, ticks:{font:{size:9}} } } }
    });
}