// List of Pokemon wrapped in an IIFE
let pokemonRepository = (function () {
    
  // Creating an array to hold pokemon objects
  let pokemonList = []; //empty array 
  // We deleted array of pokemons in order to derive all pokemon via this api
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/"
  // Variable needed in order to show modal and its content
  let modalContainer = document.querySelector('#modal-container');  

  // function to push a pokemon to the pokemonList    
  function add (pokemon) {
      // checks that only certain properties will be accepted when adding a new pokemon
      if (
        typeof pokemon === "object" &&
        "name" in pokemon
      ) {
      //if property has been validated, new pokemon will be added
          pokemonList.push(pokemon);
      } else {
      // otherwise display error message
        console.log("pokemon is not correct");
      }
  }

  // function to return all pokemon from array and display them
  function getAll () {
      return pokemonList;
  }

  // function to list Pokemon in a list and in an invidiual button in HTML
  function addListItem (pokemon) {
      let pokemonList = document.querySelector(".pokemon-list");
      let listpokemon = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      button.classList.add("button-class");
      listpokemon.appendChild(button);
      pokemonList.appendChild(listpokemon);
      button.addEventListener('click', function (event) { // event listener that listens to a mouse click over a button
        showDetails (pokemon); //logs showDetails function
      });    
  }
  // Promise function which is basically a fetch function getting the pokemon from the api
  function loadList() {
      return fetch(apiUrl).then(function (response) {
        return response.json();
      }).then(function (json) {   // we take the json generated above and let it run a forEach loop
        json.results.forEach(function (item) {   // json is the entire data that is available on api-website
          let pokemon = {  //maps pokemon item with 2 parameters
            name: item.name,
            detailsUrl: item.url
          };
          add(pokemon);
          console.log(pokemon); // logs all pokemon on console (take this out and it will only log pokemon one clicks on)
        });
      }).catch(function (e) {
        console.error(e);
      });
  }
  // funtion to load details for each pokemon 
  function loadDetails(item) {
      let url = item.detailsUrl; // item.detailsURL is taken from function above
      return fetch(url).then(function (response) {
        return response.json();
      }).then(function (details) {
        // Now we add the details to the item
        item.imageUrl = details.sprites.front_default;  // sprites is coming from actual api
        item.height = details.height;
        item.weight = details.weight;
        item.types = [];
          details.types.forEach(function (element){
            item.types.push(element.type.name);
          })
        return item
      }).catch(function (e) {
        console.error(e);
      });
  }
  // function that actually shows pokemon details in console
  function showDetails(item) {
      loadDetails(item).then(function (returnValue) {
        console.log(returnValue)
        showModal(returnValue);
      });
  }
  
  function showModal(detailItem) {
    // Clear all existing modal content
    modalContainer.innerHTML = '';
    
    let modal = document.createElement('div');
    modal.classList.add('modal');
    
    // Add the new modal content
    let closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);
    
    let titleElement = document.createElement('h1');
    titleElement.innerText = detailItem.name

    let imageElement = document.createElement('img');
    imageElement.src = detailItem.imageUrl
    
    let heightElement = document.createElement('p');
    heightElement.innerText = "height: " + detailItem.height;
    
    let weightElement = document.createElement('p');
    weightElement.innerText = "weight: " + detailItem.weight;

    let typesElement = document.createElement('p');
    typesElement.innerText = "types: " + detailItem.types.join(", ");
    
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(imageElement);
    modal.appendChild(heightElement);
    modal.appendChild(weightElement);
    modal.appendChild(typesElement);
    modalContainer.appendChild(modal);
    
    modalContainer.classList.add('is-visible');
  }
  
  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }
  
  document.querySelector('#show-modal').addEventListener('click', () => {
    showModal('returnValue', 'This is the modal content!');
  });
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
      hideModal();  
    }
  });
  
  modalContainer.addEventListener('click', (e) => {
    // Since this is also triggered when clicking INSIDE the modal container,
    // We only want to close if the user clicks directly on the overlay
    let target = e.target;
    if (target === modalContainer) {
      hideModal();
    }
  }); 

  // Return needs to be added in order to show functions output
  return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
      showModal: showModal
  };

})();

//IIFE End

//forEach() function that goes through list and displays all pokemons and their names on DOM
pokemonRepository.loadList().then(function() {
  // Now the data is loaded!
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});