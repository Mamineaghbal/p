// graph.js - Handles interactive Plotly.js plots

document.addEventListener('DOMContentLoaded', function() {
    const plotContainer = document.getElementById('plot-container');
    if (!plotContainer) return;

    // Example: If plot data was passed via template, initialize here
    // In real app, this would be dynamically loaded from backend
    const plotData = window.plotData || [];

    if (plotData.length > 0) {
        Plotly.newPlot(plotContainer, plotData[0].data, plotData[0].layout, {
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['select2d', 'lasso2d']
        });
    }

    // Optional: Add zoom/pan controls or layer toggles here
    // You can also add event listeners for click-to-evaluate, etc.
});

// Helper to update plot dynamically (if needed)
function updatePlot(newData, newLayout) {
    const plotContainer = document.getElementById('plot-container');
    if (plotContainer && newData && newLayout) {
        Plotly.react(plotContainer, newData, newLayout, {
            responsive: true
        });
    }
}