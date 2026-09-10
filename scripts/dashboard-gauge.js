// // Dashboard Gauge visualization (adapted from gauge.js)

let bodyStyle = getComputedStyle(document.body);

function updateAmountGauge(ropeKey) {
    let gaugeAmountDiv = document.querySelector('.gauge-circle.gauge-amount');
    let redLevel = document.querySelector('.gauge-circle.level-red');
    let gaugeNeedle = document.getElementById('gauge-needle-peak');
    let maxAmount = jsonDatas[ropeKey].max_amount || 0;
    let lastAmount = jsonDatas[ropeKey].last_acquisition.amount || 0;
    let currentColor = bodyStyle.getPropertyValue('--green') || '#00d335';
    if (maxAmount > 100/3 * 2) {
        currentColor = bodyStyle.getPropertyValue('--red-color') || '#a30b0d';
    } else if (maxAmount > 100/3) {
        currentColor = bodyStyle.getPropertyValue('--orange-color') || '#b48900';
    }
    gaugeAmountDiv.style.backgroundColor = currentColor;
    gaugeAmountDiv.style.transform = `rotate(calc(.5turn * ${maxAmount / 100}))`;
    
    // Applique la rotation sans affecter le drop-shadow
    let needleWrapper = gaugeNeedle.parentElement;
    if (!needleWrapper.classList.contains('needle-wrapper')) {
        // Créer le wrapper si il n'existe pas encore
        needleWrapper = document.createElement('div');
        needleWrapper.className = 'needle-wrapper';
        gaugeNeedle.parentElement.insertBefore(needleWrapper, gaugeNeedle);
        needleWrapper.appendChild(gaugeNeedle);
    }
    gaugeNeedle.style.transform = `translateX(-50%) rotate(${(180 * lastAmount / 100)}deg)`;

}

document.addEventListener('DOMContentLoaded', () => {
    let gaugeDiv = document.querySelector('.gauge-div .card-body');
    let containerGauge = document.querySelector('.container-gauge');
    let gaugeCenter = document.querySelector('.gauge-center');
    let gaugeNeedle = document.getElementById('gauge-needle-peak');
    let containerGaugeWidth = gaugeDiv.clientWidth * 0.60
    containerGauge.style.width = containerGaugeWidth + "px";
    containerGauge.style.height = containerGaugeWidth / 2 + "px";
    gaugeCenter.style.width = containerGaugeWidth * 0.625 + "px";
    let distanceFromBottom = (gaugeDiv.clientHeight - containerGauge.clientHeight) / 2;

    gaugeCenter.style.height = distanceFromBottom + 0.625 * containerGauge.clientHeight + "px";

    // gaugeNeedle.style.bottom = (distanceFromBottom - gaugeNeedle.clientWidth / 2.2) + "px";
    gaugeNeedle.style.bottom = distanceFromBottom - gaugeNeedle.clientWidth / 2 + 'px';

    gaugeNeedle.style.opacity = 0.6;
    containerGauge.style.opacity = 1;
    gaugeNeedle.parentElement.style.opacity = 1;
    setTimeout(() => {
        updateAmountGauge(currentRopeKey);
    }, 700);
})
