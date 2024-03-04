const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Set the view engine to ejs and the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Path to the data.json file
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
function showSurvey(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
}

// Handle POST request for survey submission
function handleSurveySubmission(req, res) {
    const newData = req.body;
    const data = readData();

    Object.keys(newData).forEach(question => {
        if (!data[question]) {
            data[question] = [];
        }
        data[question].push(newData[question]);
    });

    writeData(data);

    res.status(200).send("Thank you for your submission!");
}

// Route to display the survey form
app.get('/niceSurvey', showSurvey);

// Route to handle the survey submission
app.post('/niceSurvey', handleSurveySubmission);

// Route to display the analysis results
app.get('/analysis', (req, res) => {
    fs.readFile(dataFilePath, (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error loading survey results.');
        }
        try {
            const results = JSON.parse(data);
            res.render('analysis', { results });
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(500).send('Error processing survey results.');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
