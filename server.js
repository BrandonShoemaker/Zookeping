const express = require('express');
const animals = require('./data/animals');

let app = express();

function filterByQuery(query, animalsArr){
    let personalityTraitsArr = [];
    let filteredResults = animalsArr;
    if(query.personalityTraits) {
        if(typeof query.personalityTraits === 'string')
            personalityTraitsArr.push(query.personalityTraits);
        else
            personalityTraitsArr = query.personalityTraits;
        personalityTraitsArr.forEach(trait => {
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    }
    if(query.diet) filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    if(query.species) filteredResults = filteredResults.filter(animal => animal.species === query.species);
    if(query.name) filteredResults = filteredResults.filter(animal => animal.name === query.name);

    return filteredResults;
}

app.get('/api/animals', (req, res) => {
    let results = animals;
    if(req.query)
        results = filterByQuery(req.query, results);
    res.json(animals);
});

app.listen(3001, () => {
    console.log("You are now listening on port 3001");
});
