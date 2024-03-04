const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dataFilePath = path.join(__dirname, 'data.json');

// Function to read the existing data
function readData() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// Function to write data
function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Show the survey form
exports.showSurvey = (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
};

// Handle POST request for survey submission
exports.handleSurveySubmission = (req, res) => {
    const newData = req.body; // Assumes body-parser middleware is used (express.urlencoded)
    const data = readData();

    // Update each array in data.json accordingly
    Object.keys(newData).forEach(question => {
        if (!data[question]) {
            data[question] = [];
        }
        data[question].push(newData[question]);
    });

    writeData(data);

    // Redirect or respond after saving data
    res.status(200).send("Thank you for your submission!");
};

const port = 3001;
app.get('/niceSurvey', exports.showSurvey);
app.post('/niceSurvey', exports.handleSurveySubmission);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
