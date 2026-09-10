// Dashboard LF Graph configuration (adapted from plotly-graph.js)

let currentRopeKey = 'rope_1';

// jsonDatas is set globally (window.jsonDatas) once the fetch in the page resolves
let lf = jsonDatas[currentRopeKey].lf || [];
let minScaleY = jsonDatas[currentRopeKey].lf_min_scale || 2.2;
let maxScaleY = jsonDatas[currentRopeKey].lf_max_scale || 2.8;

// Define plot data with LF signal (x will be the index)
let plotData = [{
    y: lf,
    type: 'scatter',
    mode: 'lines',
    name: 'LF Signal',
    line: {
        color: bodyStyle.getPropertyValue('--principal-color') || '#00d335',
        width: 1.5
    }
}];

// Define layout matching plotly-graph.js style
let layout = {
    showlegend: false,
    title: {
        font: {
            family: 'JetBrains Mono, monospace',
            size: 12,
            color: '#ffffff'
        }
    },
    xaxis: {
        title: {
            text: 'Index',
            font: {
                family: 'JetBrains Mono, monospace',
                size: 10,
                color: '#ffffff'
            }
        },
        gridcolor: '#666666',
        tickfont: {
            family: 'JetBrains Mono, monospace',
            size: 9,
            color: '#ffffff'
        }
    },
    yaxis: {
        title: {
            text: 'Voltage (V)',
            font: {
                family: 'JetBrains Mono, monospace',
                size: 10,
                color: '#ffffff'
            }
        },
        gridcolor: '#666666',
        tickfont: {
            family: 'JetBrains Mono, monospace',
            size: 9,
            color: '#ffffff'
        },
        range: [minScaleY, maxScaleY]
    },
    plot_bgcolor: '#4b4b4b',
    paper_bgcolor: '#363636',
    margin: {
        l: 50,
        r: 20,
        t: 30,
        b: 40
    },
    autosize: true,
    font: {
        family: 'JetBrains Mono, monospace',
        color: '#ffffff'
    }
};

// Define config
let config = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
};

// Initialize Plotly graph
Plotly.newPlot('lf-plot', plotData, layout, config);

// Function to update LF graph with new rope data
function updateLFGraphForRope(ropeKey) {
    currentRopeKey = ropeKey;
    
    // Update data
    lf = jsonDatas[currentRopeKey].lf || [];
    minScaleY = jsonDatas[currentRopeKey].lf_min_scale || 2.2;
    maxScaleY = jsonDatas[currentRopeKey].lf_max_scale || 2.8;
    
    // Update plot
    Plotly.update('lf-plot', {
        y: [lf]
    }, {
        'yaxis.range': [minScaleY, maxScaleY]
    });
}
