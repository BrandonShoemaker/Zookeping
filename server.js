const fs = require('fs');
const path = require('path');
const express = require('express');
const {animals} = require('./data/animals.json');

const PORT = process.env.PORT || 3001;
let app = express();
app.use(express.static('public'));

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }

function findById(id, animalsArr){
    const result = animalsArr.filter(animal => id === animal.id)[0];
    return result;
}

function validateAnimal(animal){
    if(!animal.name || typeof animal.name !== 'string')
        return false;
    if(!animal.species || typeof animal.species !== 'string')
        return false;
    if(!animal.diet || typeof animal.diet !== 'string')
        return false;
    if(!animal.personalityTraits || !Array.isArray(animal.personalityTraits))
        return false;

    return true;
}

function createNewAnimal(body, animalsArr){
    const animal = body;
    animalsArr.push(animal);
    fs.writeFileSync( path.join(__dirname, './data/animials.json'), JSON.stringify({animals: animalsArr}, null, 2));
    return animal;
}

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animal.html'));
});

app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeeper.html'));
});

app.get('*', (req, res) =>{
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/animals', (req, res) => {
    let results = animals;  
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result)
        res.json(result);
    else   
        res.send(404);
});

app.post('/api/animals', (req, res) => {
    req.body.id = animals.length.toString();
    
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        const animal = createNewAnimal(req.body, animals) 
        res.json(animal);
    }
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
