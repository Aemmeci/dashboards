// Dashboard Histogram configuration
// Get CSS variables
// const bodyStyle = getComputedStyle(document.body);

// Parse data from JSON script
let dateData = jsonDatas[currentRopeKey].historical || {};

// Get rope installation date from HTML
function getRopeInstallationDate() {
    const installationDate = jsonDatas[currentRopeKey].installation;
    if (installationDate) {
        const dateText = installationDate.trim();
        // Parse date in format DD/MM/YYYY
        const parts = dateText.split('/');
        if (parts.length === 3) {
            // Create date object (month is 0-indexed in JavaScript)
            const date = new Date(parts[2], parts[1] - 1, parts[0]);
            // Add 1 day for J+1
            date.setDate(date.getDate() + 1);
            return date;
        }
    }
    return null;
}

// Convert date object to arrays for plotting
let allDates = Object.keys(dateData);
let allValues = Object.values(dateData);
let lowThreshold = jsonDatas[currentRopeKey].low_threshold || null;
let highThreshold = jsonDatas[currentRopeKey].high_threshold || null;

// Function to filter data by period
function filterDataByPeriod(period) {
    const today = new Date();
    let filteredDates = [];
    let filteredValues = [];

    if (period === 'all') {
        return { dates: allDates, values: allValues };
    }

    // Calculate cutoff date
    let cutoffDate = new Date();
    if (period === 'week') {
        cutoffDate.setDate(today.getDate() - 7);
    } else if (period === 'month') {
        cutoffDate.setMonth(today.getMonth() - 1);
    } else if (period === 'last-change') {
        // Use rope installation date + 1 day
        const installDate = getRopeInstallationDate();
        if (installDate) {
            cutoffDate = installDate;
        } else {
            // Fallback to 30 days if installation date not found
            cutoffDate.setDate(today.getDate() - 30);
        }
    } else if (period === 'default') {
        // Default: last 30 days with data
        cutoffDate.setDate(today.getDate() - 30);
    }

    // Filter dates and values
    allDates.forEach((date, index) => {
        // Parse date in format DD/MM/YYYY
        const parts = date.split('/');
        if (parts.length === 3) {
            // Create date object (month is 0-indexed in JavaScript)
            const dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            if (dateObj >= cutoffDate) {
                filteredDates.push(date);
                filteredValues.push(allValues[index]);
            }
        }
    });

    return { dates: filteredDates, values: filteredValues };
}

// Initial data (default view)
let currentData = filterDataByPeriod('last-change');

// Define plot data with histogram bars
let histogramPlotData = [{
    x: currentData.dates,
    y: currentData.values,
    type: 'bar',
    name: 'Daily Values',
    marker: {
        color: bodyStyle.getPropertyValue('--color-0') || '#ffffff',
        line: {
            color: bodyStyle.getPropertyValue('--color-3') || '#4b4b4b',
            width: 0.5
        }
    }
}];

// Add low threshold line if available
if (lowThreshold !== null) {
    histogramPlotData.push({
        x: currentData.dates,
        y: Array(currentData.dates.length).fill(lowThreshold),
        type: 'scatter',
        mode: 'lines',
        name: 'Low Threshold',
        line: {
            color: bodyStyle.getPropertyValue('--orange-color') || '#b48900',
            width: 2,
        },
        hoverinfo: 'y'
    });
}

// Add high threshold line if available
if (highThreshold !== null) {
    histogramPlotData.push({
        x: currentData.dates,
        y: Array(currentData.dates.length).fill(highThreshold),
        type: 'scatter',
        mode: 'lines',
        name: 'High Threshold',
        line: {
            color: bodyStyle.getPropertyValue('--red-color') || '#a30b0d',
            width: 2,
        },
        hoverinfo: 'y'
    });
}

// Define layout matching the LF graph style
let histogramLayout = {
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
            font: {
                family: 'JetBrains Mono, monospace',
                size: 10,
                color: '#ffffff'
            }
        },
        gridcolor: '#666666',
        tickfont: {
            family: 'JetBrains Mono, monospace',
            size: 7,
            color: '#ffffff'
        },
        // tickangle: -45,
        type: 'category',
        nticks: 10,
        tickmode: 'auto'
    },
    yaxis: {
        title: {
            font: {
                family: 'JetBrains Mono, monospace',
                size: 12,
                color: '#ffffff'
            }
        },
        gridcolor: '#666666',
        tickfont: {
            family: 'JetBrains Mono, monospace',
            size: 9,
            color: '#ffffff'
        },
        range: [0, 1.2]
    },
    plot_bgcolor: '#4b4b4b',
    paper_bgcolor: '#363636',
    margin: {
        l: 20,
        r: 15,
        t: 30,
        b: 30
    },
    autosize: true,
    font: {
        family: 'JetBrains Mono, monospace',
        color: '#ffffff'
    },
    bargap: 0.1
};

// Define config
let histogramConfig = {
    responsive: true,
    displayModeBar: true,
    modeBarButtonsToRemove: ['lasso2d', 'select2d'],
    displaylogo: false
};

// Initialize Plotly histogram
Plotly.newPlot('histogram-plot', histogramPlotData, histogramLayout, histogramConfig);

// Button event listeners
document.querySelectorAll('.histogram-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.histogram-btn').forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get period and filter data
        const period = this.getAttribute('data-period');
        const newData = filterDataByPeriod(period);
        
        // Prepare update data arrays
        let updateX = [newData.dates];
        let updateY = [newData.values];
        
        // Add threshold lines data if they exist
        if (lowThreshold !== null) {
            updateX.push(newData.dates);
            updateY.push(Array(newData.dates.length).fill(lowThreshold));
        }
        if (highThreshold !== null) {
            updateX.push(newData.dates);
            updateY.push(Array(newData.dates.length).fill(highThreshold));
        }
        
        // Update plot
        Plotly.update('histogram-plot', {
            x: updateX,
            y: updateY
        }, {});
    });
});

// Resize the plot to fit its container
window.addEventListener('resize', function() {
    Plotly.Plots.resize('histogram-plot');
});

// Function to update histogram with new rope data
function updateHistogramForRope(ropeKey) {
    currentRopeKey = ropeKey;
    
    // Update data
    dateData = jsonDatas[currentRopeKey].historical || {};
    allDates = Object.keys(dateData);
    allValues = Object.values(dateData);
    lowThreshold = jsonDatas[currentRopeKey].low_threshold || null;
    highThreshold = jsonDatas[currentRopeKey].high_threshold || null;
    
    // Get current active button period
    const activeButton = document.querySelector('.histogram-btn.active');
    const period = activeButton ? activeButton.getAttribute('data-period') : 'last-change';
    
    // Filter data by current period
    const newData = filterDataByPeriod(period);
    
    // Prepare update data arrays
    let updateX = [newData.dates];
    let updateY = [newData.values];
    
    // Add threshold lines data if they exist
    if (lowThreshold !== null) {
        updateX.push(newData.dates);
        updateY.push(Array(newData.dates.length).fill(lowThreshold));
    }
    if (highThreshold !== null) {
        updateX.push(newData.dates);
        updateY.push(Array(newData.dates.length).fill(highThreshold));
    }
    
    // Update plot
    Plotly.update('histogram-plot', {
        x: updateX,
        y: updateY
    }, {});
}
