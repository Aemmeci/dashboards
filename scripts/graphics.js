
let spanNames = document.querySelectorAll(".rope-selection span");
let background = document.querySelector(".rope-background");
let logoAMC = document.querySelector(".logo-div img");
let ropeNumber = Object.keys(jsonDatas).length || 1;
spanWidth = 100 / ropeNumber  + "%";
spanNames[0].textContent = jsonDatas["rope_1"].name;
spanNames[0].style.width = spanWidth;

for (let i = 1; i < ropeNumber; i++) {
    let span = document.createElement('span');
    span.textContent = jsonDatas["rope_"+ (i+1)].name;
    span.style.width = spanWidth;
    document.querySelector(".rope-selection").appendChild(span);
}

// Resélectionner tous les spans après ajout
spanNames = document.querySelectorAll(".rope-selection span");

// Ajouter les événements de clic
spanNames.forEach((span, index) => {
    span.onclick = () => {
        updateRopeSelection(index);
    }
});

function updateRopeSelection(ropeIndex) {
    // Retirer la classe active de tous les spans
    spanNames.forEach(s => s.classList.remove("active"));
    // Ajouter la classe active au span cliqué
    spanNames[ropeIndex].classList.add("active");
    // Calculer la clé de la corde (rope_1, rope_2, etc.)
    const ropeKey = `rope_${ropeIndex + 1}`;
    let ropeName = document.getElementById("rope-name");
    let ropeDiameter = document.getElementById("rope-diameter");
    let ropeConstruction = document.getElementById("rope-construction");
    let ropeInstallation = document.getElementById("rope-installation");
    let acquisitionDay = document.getElementById("acquisition-day");
    let acquisitionHour = document.getElementById("acquisition-hour");
    let acquisitionIntegrityIcon = document.getElementById("check-icon");
    ropeName.textContent = jsonDatas[ropeKey].name;
    ropeDiameter.textContent = jsonDatas[ropeKey].diameter;
    ropeConstruction.textContent = jsonDatas[ropeKey].construction;
    ropeInstallation.textContent = jsonDatas[ropeKey].installation;
    acquisitionDay.textContent = jsonDatas[ropeKey].last_acquisition["day"];
    acquisitionHour.textContent = jsonDatas[ropeKey].last_acquisition["hour"];
    if (jsonDatas[ropeKey].last_acquisition["integrity"] === true) {
        acquisitionIntegrityIcon.classList = "bi bi-check-lg";
    } else {
        acquisitionIntegrityIcon.classList = "bi bi-x-lg";
    }
    if (typeof updateLFGraphForRope === 'function') {
        updateLFGraphForRope(ropeKey);
    }

    if (typeof updateHistogramForRope === 'function') {
        updateHistogramForRope(ropeKey);
    }

    updateAmountGauge(ropeKey)
}

updateRopeSelection(0);
background.style.clipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${logoAMC.clientHeight * 1.1}px), calc(100% - ${logoAMC.clientWidth * 1.1}px) calc(100% - ${logoAMC.clientHeight * 1.1}px), calc(100% - ${logoAMC.clientWidth * 1.4}px) 100%, 0 100%)`
background.style.background = bodyStyle.getPropertyValue('--color-3');
spanNames[0].parentElement.style.background = bodyStyle.getPropertyValue('--color-3');