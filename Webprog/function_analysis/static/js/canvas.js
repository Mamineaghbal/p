// static/js/canvas.js
let currentFuncId = null;

async function loadFunctions() {
    const res = await fetch('/api/functions');
    const funcs = await res.json();
    const listEl = document.getElementById('function-list');
    listEl.innerHTML = '';
    funcs.forEach(f => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `
            <strong>${f.expression}</strong> <small>(${f.type})</small><br>
            <button onclick="selectFunction(${f.id})">Analyze</button>
            <button class="btn close" style="float:right;" onclick="deleteFunction(${f.id})">×</button>
        `;
        listEl.appendChild(div);
    });
    updatePlot();
}

async function addFunction() {
    const input = document.getElementById('input-definition');
    const expr = input.value.trim();
    if (!expr) return;

    const res = await fetch('/api/functions', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({definition: expr})
    });
    const result = await res.json();
    if (result.success) {
        input.value = '';
        loadFunctions();
    } else {
        alert('Error: ' + result.error);
    }
}

async function deleteFunction(id) {
    if (!confirm('Delete this function?')) return;
    await fetch(`/api/functions/${id}`, { method: 'DELETE' });
    loadFunctions();
    if (currentFuncId === id) {
        document.getElementById('analysis-content').innerHTML = '<p>Select a function to analyze.</p>';
        currentFuncId = null;
    }
}

async function selectFunction(id) {
    currentFuncId = id;
    const res = await fetch(`/api/analyze/${id}`);
    const analysis = await res.json();
    let html = '';
    for (const [key, value] of Object.entries(analysis)) {
        if (typeof value !== 'string') continue;
        html += `
            <div class="collapsible" onclick="this.classList.toggle('active')">
                ${key.replace('_', ' ')}
            </div>
            <div class="collapsible-content mathjax">
                ${value}
            </div>
        `;
    }
    document.getElementById('analysis-content').innerHTML = html || '<p>No analysis available.</p>';
    MathJax.typesetPromise();
}

async function updatePlot() {
    const plotDiv = document.getElementById('plot-container');
    const res = await fetch('/api/plot');
    const data = await res.json();
    const layout = {
        xaxis: { zeroline: true, showgrid: true, color: 'black' },
        yaxis: { zeroline: true, showgrid: true, color: 'black' },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        margin: { t: 20, b: 40, l: 40, r: 20 },
        hovermode: 'closest'
    };
    Plotly.react(plotDiv, data, layout, { responsive: true });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    loadFunctions();
    document.getElementById('analysis-content').innerHTML = '<p>Select a function to analyze.</p>';
});