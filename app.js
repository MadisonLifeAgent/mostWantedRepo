"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;

  // ask user how they would like to search
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // if user answers no, start to ask user for search criteria
      pickOneOrFiveTraits(people);
      break;

      // restart app
      default:
        app(people);
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  // if person not found restart app
  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  // prompt user for how to proceed after finding person
  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", displayOptionValidation);

  // options for where search will go next
  switch(displayOption){
    case "info":
    // get person's info and display
    displayAllInfo(person, people);
    break;
    
    case "family":
    // Find a person's family and display it

    // find a persons spouse
    let spouseID = person.currentSpouse;
    let foundSpouse = people.filter(function(potentialMatch){
        if(potentialMatch.id === spouseID){
            return true;
        }
        else{
            return false;
        }
    })

    // store spouse search results
    let spouseName = "";
    if(foundSpouse.length === 0){
        spouseName = "Not Married"
    }
    else{
        foundSpouse = foundSpouse[0];
        spouseName = `${foundSpouse.firstName} ${foundSpouse.lastName}`;
    }
    //this will find parents of person
    let parentIDArray = person.parents;
    let parent1 = "";
    let parent2 = "";

    //if person has 2 parents
    if(parentIDArray.length == 2){
      let foundParents = people.filter(function(potentialMatch){
        if(potentialMatch.id === parseInt(parentIDArray[0]) || potentialMatch.id === parseInt(parentIDArray[1])){
            return true;
          }
          else{
            return false;
          }
      })
      parent1 = `${foundParents[0].firstName} ${foundParents[0].lastName}`;
      parent2 = ` & ${foundParents[1].firstName} ${foundParents[1].lastName}`;
    }
    //if person only has 1 parent
    else if(parentIDArray.length == 1){
      let foundParents = people.filter(function(potentialMatch){
        if(potentialMatch.id === parseInt(parentIDArray)){
          return true;
        }
        else{
          return false;
        }
      })
      parent1 = `${foundParents[0].firstName} ${foundParents[0].lastName}`;
      parent2 = "";
    }
    else if (parentIDArray.length == 0){
      parent1 = `No parents recorded`;
      parent2 = "";
    }
    
    //This will find if the person has siblings
    let siblingsString = "";
    
    let siblingsArray = people.filter(function(potentialMatch){
        if(JSON.stringify(potentialMatch.parents) === JSON.stringify(person.parents) && person.parents.length > 0 && potentialMatch.firstName != person.firstName){
            return true;
        }
        else{
            return false;
        }
    })

    //this loop goes through the list of siblings and returns each name into one string variable
    if(siblingsArray < 1){
        siblingsString = "No siblings recorded";
    }
    else{
      for(let i = 0; i < siblingsArray.length; i++){
        if(i == 0){
            siblingsString += `${siblingsArray[0].firstName} ${siblingsArray[0].lastName}`;
        }
        else{
            siblingsString += `, ${siblingsArray[i].firstName} ${siblingsArray[i].lastName}`;
        }
      }
    }

    //This prompt displays the person's family info and then asks if they would like to go back
    let familyResponse = promptFor(`${person.firstName} ${person.lastName}'s family: \nSpouse: ${spouseName} \nParent(s): ${parent1}${parent2} \nSiblings: ${siblingsString}\n\nWould you like to go back 'yes' or 'no'? `, yesNo);
    
    //if user says 'yes', they will return to main menu prompt
    if(familyResponse === "yes"){
        return mainMenu(person, people);
    }

    //if user says 'no', they will exit prompt
    else if(familyResponse === "no"){
        return;
    }
    
    break;
    
    case "descendants":
    // Get person's descendants and display it
      displayDescendants(person, getDescendants(person, data));
      break;

    case "restart":
      app(data); // restart app
      break;

    case "quit":
      return; // stop execution

    default:
      app(data);// ask again if user doesn't input any choice but clicks 'ok' or presses the enter key
  }
}

//#endregion

//Filter functions.
/////////////////////////////////////////////////////////////////
//#region 

// FUNCTION to pick by one or more traits
function pickOneOrFiveTraits(people){
  // ask user for how many traits to search
  let oneOrFiveTraits = promptFor("Please enter the number of traits you would like to search by:\n\n" +
                        "'1' for one trait\n" +
                        "'2' for two traits\n" +
                        "'3' for three traits\n" +
                        "'4' for four traits\n" +
                        "'5' for five traits\n", numberOfTraitsValidation);


  // ask user which traits to search
  let searchResults;
  searchResults = pickTraitToSearch(oneOrFiveTraits, people);
}

// function to determine which trait user would like to search by
function pickTraitToSearch(number, people){
  let searchResults;

  // if user picks a 1 trait search run this switch case
  if(people.length == number){
    let traitSelection = promptFor("Select a Trait to search. Options are: 'gender', 'dob' (date of birth)," +
                        " 'height', 'weight', or 'eye color'", traitsValidation);
    // run the search function based on user selection
    switch(traitSelection){
      case 'gender':
        searchResults = searchByGender(people);
        break;
    
      case 'dob':
        searchResults = searchByDOB(people);
        break;
  
      case 'date of birth':
        searchResults = searchByDOB(people);
        break;
      
      case 'height':
        searchResults = searchByHeight(people);
        break;
      
      case 'weight':
        searchResults = searchByWeight(people);
        break;
  
      case 'eye color':
        searchResults = searchByEyeColor(people);
        break;
      
      case 'occupation':
        searchResults = searchByOccupation(people);
        break;
    }
  }
  // // if user picks more than 1 trait to search this code runs
  else {
    for(let i = 0; i < number; i++){
      let traitSelection = promptFor("Select a Trait to search. Options are: 'gender', 'dob' (date of birth), " +
                          "'height', 'weight', 'eye color', or 'occupation'", traitsValidation);

        // get search results and store in people array so next search only searches remaining object/array
        if(traitSelection === 'gender'){
          searchResults = searchByGender(people);
          people = searchResults;
        }
        else if (traitSelection === 'dob'){
          searchResults = searchByDOB(people);
          people = searchResults;
        }
        else if (traitSelection === 'height'){
          searchResults = searchByHeight(people);
          people = searchResults;
        }
        else if (traitSelection === 'weight'){
          searchResults = searchByWeight(people);
          people = searchResults;
        }
        else if (traitSelection === 'eye color' || traitSelection === 'eyecolor'){
          searchResults = searchByEyeColor(people);
          people = searchResults;
        }
        else if (traitSelection === 'occupation'){
          searchResults = searchByOccupation(people);
          people = searchResults;
        }
    }
  }

     // display the trait search results
     displayListOfPeople(people);

  // restart the app and reset the data to entire data set
  return app(data); // ask again
}

// SPECIFIC TRAIT SEARCH FUNCTIONS

//Search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", firstNameValidation);
  let lastName = promptFor("What is the person's last name?", lastNameValidation);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // find the person single person object using the name they entered.
  foundPerson = foundPerson[0];

  return foundPerson;
}

//search through an array of people to find matching eye colors.
function searchByEyeColor(people){
  let eyeColor = promptFor("What is the person's eye color?", eyeColorValidation);

  let foundEyeColor = people.filter(function(potentialMatch){
    if(potentialMatch.eyeColor === eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  return foundEyeColor;
}

//find people based on gender
function searchByGender(people){
  let gender = promptFor("What is the person's gender?", genderValidation);

  let foundGender = people.filter(function(potentialMatch){
    if(potentialMatch.gender === gender){
      return true;
    }
    else{
      return false;
    }
  })
  return foundGender;
}

//find people by date of birth
function searchByDOB(people){
  let dOB = promptFor("What is the person's date of birth? (i.e. 2/19/1970)", dobValidation);

  let foundDOB = people.filter(function(potentialMatch){
    if(potentialMatch.dob === dOB){
      return true;
    }
    else{
      return false;
    }
  })
  return foundDOB;
}

// find people by occupation
function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", occupationValidation);
    
  let foundOccupation = people.filter(function(potentialMatch){
    if(potentialMatch.occupation === occupation){
      return true;
    }
    else{
      return false;
    }
  }) 
  return foundOccupation;
}

// Find people based on their height
function searchByHeight(people){
  let personsHeight = promptFor("Enter a height (inches)", heightValidation);

  // convert user input from string to number
  let personsHeightNumber = parseInt(personsHeight);

  let foundHeight = people.filter(function(potentialMatch){
    if(potentialMatch.height === personsHeightNumber){
      return potentialMatch;
    }
  })
  return foundHeight;
}

// find someone based on their weight
function searchByWeight(people){
  let personsWeight = promptFor("Enter a weight (pounds)", weightValidation);

  // convert user input from string to number
  let personsWeightNumber = parseInt(personsWeight);

  let foundWeight = people.filter(function(potentialMatch){
    if(potentialMatch.weight === personsWeightNumber){
      return potentialMatch;
    }
  })
  return foundWeight;
}

// This function retrieves descendants of found person
function getDescendants(person, people){
  let descendantsOnly = [];
  //This loop goes through and finds all the first descendants
  for(let i = 0; i < people.length; i++){
    if(people[i].parents.includes(person.id)){
      descendantsOnly.push(people[i]);
    }
  }
  //this loop goes through descendantsOnly one by one to get the next level of descendants
  for(let j = 0; j < descendantsOnly.length; j++){
     descendantsOnly = descendantsOnly.concat(getDescendants(descendantsOnly[j], people))
  }
  return descendantsOnly;
}

//#endregion

//Display functions.
/////////////////////////////////////////////////////////////////
//#region

// display a list of people from a search result
function displayListOfPeople(people){
  let displayNames = "";

  // default search results message
  let displayNamesText = "Your search yielded the following results. \n\n";
  
  // put names together
  for(let i = 0; i < people.length; i++){
      if(i === people.length - 1 && people.length > 1){
        displayNames += `and ${people[i].firstName} ${people[i].lastName}.\n`;
      }
      else if(people.length === 1){
        displayNames += `${people[i].firstName} ${people[i].lastName}`;
      }
      else {
        displayNames += `${people[i].firstName} ${people[i].lastName}, `;
    }
  }

  // display the appropriate message and results based on search results
  let userResponse = "";

  if(people.length === 0){
      userResponse = promptFor("Your search did not return any results" +
      "\n\nWould you like to go back 'yes' or 'no'?", yesNo);
  }
  else{
      userResponse = promptFor(`${displayNamesText}${displayNames}` +
                    `\n\nWould you like to go back 'yes' or 'no'?`, yesNo);
  }
  //if user says 'yes', they will return to main menu prompt
  if(userResponse === "yes"){
    return pickOneOrFiveTraits(data);
  }
  //if user says 'no', they will exit prompt
  else if(userResponse === "no"){
    app(data);
  }
}

function displayAllInfo(person, people){
  // print all of the information about a person and prompt next direction of search:
     let infoResponse = promptFor(`${person.firstName} ${person.lastName}'s info: \nGender: ${person.gender} \nDate of Birth: ${person.dob} \nHeight: ${person.height} \nWeight: ${person.weight} \nEye color: ${person.eyeColor} \nOccupation: ${person.occupation} \n\nWould you like to go back 'yes' or 'no'?`, yesNo);

    //if user says 'yes', they will return to main menu prompt
     if(infoResponse === "yes"){
       return mainMenu(person, people);
     }

    //if user says 'no', they will exit prompt
     else if(infoResponse === "no"){
      // restart search
      return app(data);
    }
}

// display Descendants of found person
function displayDescendants(person, descendants){  
  // display all at once variable
  let displayNames = "";
  // Descendants Phrase/Text
  let displayDescendantsText = `${person.firstName} ${person.lastName}'s Descendants are:\n\n`;

  // loop through and display descendants all at once
  for(let i = 0; i < descendants.length; i++){
    displayNames += `${descendants[i].firstName} ${descendants[i].lastName}\n`;
  }
  
  // display the appropriate message and results based on search results
  let userResponse = "";

  if(descendants.length === 0){
    userResponse = promptFor(`${person.firstName} ${person.lastName} does not have any descendants.` +
                        `\n\nWould you like to go back 'yes' or 'no'?`, yesNo);
  }
  else{
    userResponse = promptFor(`${displayDescendantsText}${displayNames}` +
                    `\n\nWould you like to go back 'yes' or 'no'?`, yesNo);
  }

  //if user says 'yes', they will return to main menu prompt
  if(userResponse === "yes"){
    return mainMenu(person, data);
  }

  //if user says 'no', they will exit prompt
  else if(userResponse === "no"){
    app(data);
  }
}

//#endregion

//Validation functions.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
}

// helper function/callback to pass into promptFor to validate yes/no answers.
function yesNo(input){
  if(input.toLowerCase() == "yes" || input.toLowerCase() == "no"){
    return true;
  }
  else{
    return false;
  }
}

// helper function to pass in as default promptFor validation.
//this will always return true for all inputs.
function autoValid(input){
  return true; // default validation only
}

// function to validate number of traits selection
function numberOfTraitsValidation(input){
  input = parseInt(input);
  console.log(input);
  
  // user must input a number from 1 - 5 only
  if(input > 0 && input < 6 ){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// function to validate traits entered by user
function traitsValidation(input){
  // user can only enter one of these traits
  if(input === "gender" || input === "dob" || input === "height" || input === "weight" || input === "eye color" || input === "occupation"){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// function to validate displayOption prompt
function displayOptionValidation(input){
  // user must enter one of these display or command options
  if(input === "info" || input === "descendants" || input === "family" || input === "restart" || input === "quit"){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// gender input validation
function genderValidation(input){
  // user must enter either male or female gender only
  if(input === "male" || input === "female"){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate firstName input
function firstNameValidation(input){
  // search the data set to see if there is a match for user input then exit the search once found
  let nameMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].firstName){
        nameMatch = data[i].firstName;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(input === nameMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate last name input
function lastNameValidation(input){
  // search the data set to see if there is a match for user input then exit the search once found
  let nameMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].lastName){
        nameMatch = data[i].lastName;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(input === nameMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate height input
function heightValidation(input){
  // convert input string to number
  let heightNumber = parseInt(input);

  // search the data set to see if there is a match for user input then exit the search once found
  let heightMatch = 0;
  for(let i = 0; i < data.length; i++){
      if(heightNumber === data[i].height){
        heightMatch = data[i].height;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(heightNumber === heightMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate weight input
function weightValidation(input){
  // convert input string to number
  let weightNumber = parseInt(input);

  // search the data set to see if there is a match for user input then exit the search once found
  let weightMatch = 0;
  for(let i = 0; i < data.length; i++){
      if(weightNumber === data[i].weight){
        weightMatch = data[i].weight;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(weightNumber === weightMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate last name input
function eyeColorValidation(input){
  // search the data set to see if there is a match for user input then exit the search once found
  let eyeColorMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].eyeColor){
        eyeColorMatch = data[i].eyeColor;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(input === eyeColorMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate dob input
function dobValidation(input){
  // search the data set to see if there is a match for user input then exit the search once found
  let dobMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].dob){
        dobMatch = data[i].dob;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(input === dobMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// validate occupation input
function occupationValidation(input){
  // search the data set to see if there is a match for user input then exit the search once found
  let occupationMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].occupation){
        occupationMatch = data[i].occupation;
        break;
      }
  }
  // find and return the boolean result back to where called
  if(input === occupationMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}
//#endregion