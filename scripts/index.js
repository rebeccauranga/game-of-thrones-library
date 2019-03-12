let allCharactersArray = [];

function urlForPage(pageNumber=0) {
  return `http://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=${pageNumber}&pageSize=50`;
}

function accumulateCharacters(theActualData) {
  allCharactersArray = [...allCharactersArray, ...theActualData];
  storeCharacters(allCharactersArray);
}

const storageKey = "game-of-thrones";

function storeCharacters(arrayOfCharacters) {
  // convert the array to a JSON string
  const jsonCharacters = JSON.stringify(arrayOfCharacters);
  console.log(`saving ${arrayOfCharacters.length} characters`);
  // store that string in localStorage
  localStorage.setItem(storageKey, jsonCharacters);
}

function loadCharacters() {
  // get the JSON string from localStorage
  const jsonCharacters = localStorage.getItem(storageKey);
  // convert it back to an array
  const arrayOfCharacters = JSON.parse(jsonCharacters);
  if (arrayOfCharacters) {
      console.log(`loaded ${arrayOfCharacters.length} characters`);
  } else {
    console.log('No characters in localStorage');
    }
 // return it
    return arrayOfCharacters;
}

function retrievePageOfCharacters(pageNumber){
    fetch(urlForPage(pageNumber))
      .then(function(response) {
        return response.json();
      })
      .then(accumulateCharacters)
      .then(function() {
        console.log(`Done with page ${pageNumber}`);
      });
}

function drawCharacterToDetail(characterObject){
    console.log(characterObject);
    console.log('what got passed');
    const detailArea = document.querySelector('[data-detail]');
    detailArea.textContent = '';

    const nameDiv = document.createElement('div');
    const bornDiv = document.createElement('div');
    const diedDiv = document.createElement('div');

    nameDiv.textContent = `Name: ${characterObject.name}`;
    bornDiv.textContent = `Born: ${characterObject.born}`;
    diedDiv.textContent = `Died: ${characterObject.died}`;

    detailArea.appendChild(nameDiv);
    detailArea.appendChild(bornDiv);
    detailArea.appendChild(diedDiv);

}

function findCharacterInArray(id) {
    return allCharactersArray.find(function (character) {
        return character.url === url;
        // if (character.url === url) {
        //     return true;
        // } else {
        //     return false;
        // }
    });
}

function drawSingleCharacterToListing(characterObject){
    const characterName = characterObject.name;
    if (characterName.length === 0) {
        return;
    }
    const anchorElement = document.createElement('a');
    anchorElement.textContent = characterName;

    // When you need to pass an argument to the event handler function
    // you must wrap it in an anonymous function
    anchorElement.addEventListener('click', function (event) {
        drawCharacterToDetail(characterObject);
    });

    const listItem = document.createElement('li');
    listItem.appendChild(anchorElement);

    const listArea = document.querySelector('[data-listing]');

    listArea.appendChild(listItem);
}

function drawListOfCharacters() {


    allCharactersArray.forEach(drawSingleCharacterToListing);
}

function sortByName(obj1, obj2){
    const letter1 = obj1.name[0];
    const letter2 = obj2.name[0];

    if (letter1 < letter2) {

        return -1;
    } else if (letter2 < letter1) {

        return 1;
    }

    return 0;
}

function filterbyLetter(letter) {
    console.log(letter);
    if (letter.length === 1) {
        const filtered = allCharactersArray.filter(function (character){
            return character.name.startsWith(letter.toUpperCase());
        });
        console.log(`drawing for ${letter}`);
        drawListOfCharacters(filtered);
    } else {
        console.log('drawing all')
        drawListOfCharacters();
    }
}

function attachClickToLetters() {
    const letters = document.querySelectorAll('[data-index] a');
    letters.forEach(function (letter) {
        letter.addEventListener('click', function () {
            filterbyLetter(letter.textContent);
        });
    });
}



function main() {
    let charactersInLocalStorage = loadCharacters();
    if (charactersInLocalStorage){
        allCharactersArray = [
            ...charactersInLocalStorage.sort(sortByName)
        ];
        drawListOfCharacters();
        attachClickToLetters();
    } else {
        console.log("You got nothing.");
        console.log("Retrieving from the API");
        for (let pageNumber=0; pageNumber<50; pageNumber++) {
            let delay  = pageNumber * 500;
            setTimeout(function () {
                retrievePageOfCharacters(pageNumber);
            }, delay);
        }
    }
}

main();

