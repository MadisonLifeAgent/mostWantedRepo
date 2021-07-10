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
    let infoResponse = promptFor(`${person.firstName} ${person.lastName}'s info: \nGender: ${person.gender} \nDate of Birth: ${person.dob} \nHeight: ${person.height} \nWeight: ${person.weight} \nEye color: ${person.eyeColor} \nOccupation: ${person.occupation} \nWould you like to go back 'yes' or 'no'?`, autoValid);
    //if user says 'yes', they will return to main menu prompt
    if(infoResponse === "yes"){
      return mainMenu(person, people);
    }
    //if user says 'no', they will exit prompt
    else if(infoResponse === "no"){
      return;
    }
    break;
    
    case "family":
    // TODO: get person's family
    //This will find spouse ID and print name accordingly
    let spouseID = person.currentSpouse;
    let foundSpouse = people.filter(function(potentialMatch){
      if(potentialMatch.id === spouseID){
        return true;
      }
      else{
        return false;
      }
    })
    let spouseName = "";
    if(foundSpouse = []){
      spouseName = "Not Married"
    }
    else{
      foundSpouse = foundSpouse[0];
      let spouseName = `${foundSpouse.firstName} ${foundSpouse.lastName}`;
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
    
    //This will find if the person has any siblings
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
    //This prompt tells the person's family info and then asks if they would like to go back
    let familyResponse = promptFor(`${person.firstName} ${person.lastName}'s family: \nSpouse: ${spouseName} \nParent(s): ${parent1}${parent2} \nSiblings: ${siblingsString}\nWould you like to go back 'yes' or 'no'? `,autoValid);
    
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
    // TODO: get person's descendants
    getDescendants(person, data);

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

// This function display descendants of found person
function getDescendants(person, people){
  let descendantsOnly = [];
  descendantsOnly = people.filter(function(potentialMatch){
    // check for descendants only
    if(potentialMatch.parents[0] === person.id || potentialMatch.parents[1] === person.id){
      return `${potentialMatch.firstName} ${potentialMatch.lastName}` + getDescendants(potentialMatch, people);
    }
    else {
      return false;
    }
  })

  // call the funciton again to check descendants for their descendants
  console.log(descendantsOnly);
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