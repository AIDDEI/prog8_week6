// Imports
import { DecisionTree } from "../libraries/decisiontree.js"
import { VegaTree } from "../libraries/vegatree.js"

// Globals
let decisiontree;

// Accuracy
let amountCorrect = 0;
let totalAmount = 0;

let accuracyPlaceholder = document.getElementById("accuracy");
let p = document.createElement("p");

// Confusion Matrix
let predictedPoisonous = 0;
let actualPoisonous = 0;
let predictedEdible = 0;
let actualEdible = 0;

let realEdible = document.getElementById("realEdible");
let realPoisonous = document.getElementById("realPoisonous");
let fakeEdible = document.getElementById("fakeEdible");
let fakePoisonous = document.getElementById("fakePoisonous");

// Data
const csvFile = "../data/mushrooms.csv";
const trainingLabel = "class";
const ignored = ['class', 'cap-color', 'gill-attachment', 'gill-color', 'stalk-color-above-ring', 'stalk-color-below-ring', 'veil-type', 'veil-color', 'ring-number', 'spore-print-color'];

// Load CSV data as JSON
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data),
    });
}

// Decision Tree
function trainModel(data) {
    // Randomize data and split the data into train data and test data
    data.sort(() => (Math.random() - 0.5));
    let trainData = data.slice(0, Math.floor(data.length * 0.8));
    let testData = data.slice(Math.floor(data.length * 0.8) + 1);

    // Create algorithm
    decisiontree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel
    });

    // Draw the tree structure: DOM-element, width, height, decision tree
    let visual = new VegaTree('#view', 1000, 400, decisiontree.toJSON());

    // Make a prediction with the sample data
    totalAmount = testData.length

    for (let i = 0; i < totalAmount; i++) {
        testMushroom(testData[i]);
    }

    // Calculate the accuracy of the decision tree
    let accuracy = (amountCorrect / totalAmount) * 100;
    p.innerHTML = `Nauwkeurigheid: ${accuracy}%`;
    accuracyPlaceholder.appendChild(p);

    // Fill the confusion matrix
    createConfusionMatrix();

    // Create JSON file to download the model
    let json = decisiontree.stringify()
    console.log(json)
}

function testMushroom(mushroom) {
    // Make copy without the label
    const mushroomWithoutLabel = { ...mushroom };
    delete mushroomWithoutLabel.class;

    // Prediction
    let prediction = decisiontree.predict(mushroomWithoutLabel);

    // Confusion Matrix
    if (prediction == "e" && mushroom.class == "p") {
        actualPoisonous++;
    }
    if (prediction == "p" && mushroom.class == "e") {
        actualEdible++;
    }
    if (prediction == "e" && mushroom.class == "e") {
        predictedEdible++;
    }
    if (prediction == "p" && mushroom.class == "p") {
        predictedPoisonous++;
    }

    // Compare prediction with the real label
    let message = "";
    if (prediction === mushroom.class) {
        message = "De decision tree heeft een juiste voorspelling gedaan!";
        amountCorrect++;
    } else {
        message = "De decision tree heeft een foute voorspelling gedaan...";   
    }
}

// Create the confusion matrix
function createConfusionMatrix() {
    realEdible.innerHTML = predictedEdible;
    realPoisonous.innerHTML = predictedPoisonous;
    fakeEdible.innerHTML = actualPoisonous;
    fakePoisonous.innerHTML = actualEdible;
}

// Start
loadData();