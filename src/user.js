// Imports
import { DecisionTree } from "../libraries/decisiontree.js";

// Globals
let decisiontree;

// Predict Button and Text
const predictButton = document.getElementById("predictButton");
predictButton.addEventListener("click", getMushroom);

let predictionPlaceholder = document.getElementById("prediction");
let p = document.createElement("p");
p.innerHTML = "Voer de velden in en klik op de knop om achter de eetbaarheid van de paddestoel te komen!";
predictionPlaceholder.appendChild(p);

// Load model
function loadSavedModel() {
    fetch("model/model.json")
        .then((response) => response.json())
        .then((model) => modelLoaded(model))
}

// After the model is loaded
function modelLoaded(model) {
    decisiontree = new DecisionTree(model);
}

// Function to fetch all mushroom data
function getMushroom() {
    let capShape = document.getElementById("capShape").value;
    let capSurface = document.getElementById("capSurface").value;
    let bruises = document.getElementById("bruises").value;
    let odor = document.getElementById("odor").value;
    let gillSpacing = document.getElementById("gillSpacing").value;
    let gillSize = document.getElementById("gillSize").value;
    let stalkShape = document.getElementById("stalkShape").value;
    let stalkRoot = document.getElementById("stalkRoot").value;
    let stalkSurfaceAboveRing = document.getElementById("stalkSurfaceAboveRing").value;
    let stalkSurfaceBelowRing = document.getElementById("stalkSurfaceBelowRing").value;
    let ringType = document.getElementById("ringType").value;
    let population = document.getElementById("population").value;
    let habitat = document.getElementById("habitat").value;

    let mushroom = {
        'cap-shape': capShape,
        'cap-surface': capSurface,
        'bruises': bruises,
        'odor': odor,
        'gill-spacing': gillSpacing,
        'gill-size': gillSize,
        'stalk-shape': stalkShape,
        'stalk-root': stalkRoot,
        'stalk-surface-above-ring': stalkSurfaceAboveRing,
        'stalk-surface-below-ring': stalkSurfaceBelowRing,
        'ring-type': ringType,
        'population': population,
        'habitat': habitat,
    };

    predict(mushroom);
}

// Predict Function
function predict(mushroom) {
    let prediction = decisiontree.predict(mushroom);

    predictionPlaceholder.removeChild(p);

    if (prediction === "e") {
        p.innerHTML = "De paddestoel is eetbaar!";
        predictionPlaceholder.appendChild(p);
    } else {
        p.innerHTML = "LET OP: Deze paddestoel is NIET eetbaar!";
        predictionPlaceholder.appendChild(p);
    }
}

loadSavedModel();