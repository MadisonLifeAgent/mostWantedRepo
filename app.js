"use strict"


//Menu functions.
//Used for the overall flow of the application.
/////////////////////////////////////////////////////////////////
//#region 

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
            // if they answer no prompt start to ask user for search criteria (call a function here)
            let defaultSearch = searchById(data);
      // break;
      // default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", autoValid);

  switch(displayOption){
    case "info":
    // TODO: get person's info
    let response = promptFor(`${person.firstName} ${person.lastName}'s info: \nGender: ${person.gender} \nDate of Birth: ${person.dob} \nHeight: ${person.height} \nWeight: ${person.weight} \nEye color: ${person.eyeColor} \nOccupation: ${person.occupation} \nWould you like to go back 'yes' or 'no'?`, autoValid);
    if(response === "yes"){
      return mainMenu(person, people);
    }
    else if(response === "no"){
      return;
    }
    break;
    case "family":
    // TODO: get person's family
    promptFor
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

//nearly finished function used to search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", autoValid);
  let lastName = promptFor("What is the person's last name?", autoValid);

  let foundPerson = people.filter(function(potentialMatch){
    if(potentialMatch.firstName === firstName && potentialMatch.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  foundPerson = foundPerson[0];
  return foundPerson;
}

//unfinished function to search through an array of people to find matching eye colors. Use searchByName as reference.
function searchByEyeColor(people){
  let eyeColor = promptFor("What is the person's eye color?", autoValid);

  let foundEyeColor = people.filter(function(potentialMatch){
    if(potentialMatch.eyeColor === eyeColor){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return eyeColor;
}

//TODO: add other trait filter functions here.

//function to search through an array of people to find matching genders.
function searchByGender(people){
  let gender = promptFor("What is the person's gender?", autoValid);

  let foundGender = people.filter(function(potentialMatch){
    if(potentialMatch.gender === gender){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return gender;
}

//Function to search through an array of people to find matching Date of Birth
function searchByDOB(people){
  let dOB = promptFor("What is the person's date of birth?", autoValid);

  let foundDOB = people.filter(function(potentialMatch){
    if(potentialMatch.dOB === dOB){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person single person object using the name they entered.
  return dOB;
}

function searchByOccupation(people){
  let occupation = promptFor("What is the person's occupation?", autoValid);
    
  let foundOccupation = people.filter(function(potentialMatch){
    if(potentialMatch.occupation === occupation){
      return true;
    }
    else{
      return false;
    }
  }) 
  // TODO: find the person single person object using the name they entered.
  return occupation;
}

// Function to search through an array of people to find matching ID then out put their name
function searchById(people){
  let personsId = promptFor("Enter an ID number:", autoValid);

  // convert user input from string to number
  let personsIdNumber = parseInt(personsId);

  // filter through for matching id
  let possiblePerson = people.filter(function(potentialMatch){
    if(potentialMatch.id === personsIdNumber){
      return potentialMatch;
      // return potentialMatch.firstName + " " + potentialMatch.lastName;
    }
  })

  // call display function
  displayPerson(possiblePerson);

  return possiblePerson;
}

// Function to search by height
function searchByHeight(people){
  let personsHeight = promptFor("Enter a height (inches)", autoValid);

  // convert user input from string to number
  let personsHeightNumber = parseInt(personsHeight);

  // Filter through for matching heights and store results in object array
  let foundHeight = people.filter(function(potentialMatch){
    if(potentialMatch.height === personsHeightNumber){
      return potentialMatch;
    }
  })

  // call display function
  displayPerson(foundHeight);

  // debug/testing lines (next two lines)
  //   console.log(foundHeight);
  // return foundId;
}


// Function to search by weight
function searchByWeight(people){
  let personsWeight = promptFor("Enter a weight (pounds)", autoValid);

  // convert user input from string to number
  let personsWeightNumber = parseInt(personsWeight);

  // Filter through for matching heights and store results in object array
  let foundWeight = people.filter(function(potentialMatch){
    if(potentialMatch.weight === personsWeightNumber){
      return potentialMatch;
    }
  })

  // call display function
  displayPerson(foundWeight);

  // debug testing lines
  // console.log(foundWeight);
  // return foundWeight;
}

// Function to search by spouse id
function searchBySpouseId(people){
  let personsSpouseId = promptFor("Enter a person's spouse ID number", autoValid);

  // convert user input from string to number
  let personsSpouseNumberId = parseInt(personsSpouseId);

  // Filter through for matching spouse IDs but return the person you want, not the spouse
  let potentialMatchNotSpouse = people.filter(function(potentialMatch){
    if(potentialMatch.currentSpouse === personsSpouseNumberId){
      // return the foundSpouse's spouse since they are actually the person you are searching for
      return potentialMatch;
    }

  })
  // call display function
  displayPerson(foundSpouse);

  // debut/testing lines
  // console.log(potentialMatchNotSpouse);
  // return foundSpouse;
}

// Function to search by parent ids
function searchByParentId(people){
  let parentsId = promptFor("Enter the ID number of a Parent for the person you would like to find", autoValid);

  // convert user input from string to number
  let parentsIdNumber = parseInt(parentsId);

  // filter through for matching parent but return the potenticalmatches you want, not the parent
  let potentialMatchNotParent = people.filter(function(potentialMatch){
    if(potentialMatch.parents[0] === parentsIdNumber || potentialMatch.parents[1] === parentsIdNumber){
      return potentialMatch;
    }
  })

  // call display function
  // displayPerson(potentialMatchNotParent);

  // debut/testing lines
  // console.log(potentialMatchNotParent);
  // return potentialMatchNotParent;
}


//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
}

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  // TODO: finish getting the rest of the information to display.
  alert(personInfo);
}

//#endregion



//Validation functions.
//Functions to validate user input.
/////////////////////////////////////////////////////////////////
//#region 

//a function that takes in a question to prompt, and a callback function to validate the user input.
//response: Will capture the user input.
//isValid: Will capture the return of the validation function callback. true(the user input is valid)/false(the user input was not valid).
//this function will continue to loop until the user enters something that is not an empty string("") or is considered valid based off the callback function(valid).
function promptFor(question, valid){
  let response;
  let isValid;
  do{
    response = prompt(question).trim();
    isValid = valid(response);
  } while(response === ""  ||  isValid === false)
  return response
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

//Unfinished validation function you can use for any of your custom validation callbacks.
//can be used for things like eye color validation for example.
function customValidation(input){
  
}

//#endregion