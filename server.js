const express = require('express');
const app = express();
const port = 3000;

// Static files
app.use(express.static('public'));

// Import surveyController
const surveyController = require('./surveyController');

// Use surveyController for the /niceSurvey route
app.get('/niceSurvey', surveyController.showSurvey);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
