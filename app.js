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
      // TODO: search by traits
      // if they answer no prompt start to ask user for search criteria (call a function here)
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

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  // prompt user for how to proceed
  let displayOption = promptFor("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'", displayOptionValidation);

  switch(displayOption){
    case "info":
    // get person's info and display
    displayAllInfo(person, people);
    break;
    
    case "family":
    // Find a person's family and display it
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

    //This prompt displays the person's family info and then asks if they would like to go back
    let familyResponse = promptFor(`${person.firstName} ${person.lastName}'s family: \nSpouse: ${spouseName} \nParent(s): ${parent1}${parent2} \nSiblings: ${siblingsString}\nWould you like to go back 'yes' or 'no'? `, yesNo);
    
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
      displayListOfPeople(getDescendants(person, data));
      break;

    case "restart":
      app(data); // restart
      break;

    case "quit":
      return; // stop execution

    default:
      app(data);// ask again
  }
}

//#endregion

//Filter functions.
//Ideally you will have a function for each trait.
/////////////////////////////////////////////////////////////////
//#region 

// FUNCTION to pick by one or more traits
function pickOneOrFiveTraits(people){
  let oneOrFiveTraits = promptFor("Please enter the number of traits you would like to search by:\n\n" +
                        "'1' for one trait\n" +
                        "'2' for two traits\n" +
                        "'3' for three traits\n" +
                        "'4' for four traits\n" +
                        "'5' for five traits\n", numberOfTraitsValidation);

  let searchResults;

  searchResults = pickTraitToSearch(oneOrFiveTraits, people);
}

// function to determine which trait they would like to search
function pickTraitToSearch(number, people){
  let searchResults;

  // if user picks a 1 trait search run this code
  if(people.length == number){
    let traitSelection = promptFor("Select a Trait to search. Options are: 'gender', 'dob' (date of birth)," +
                        " 'height', 'weight', or 'eye color'", traitsValidation);

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
    }
  }
  // // if user picks more than 1 trait to search run this code
  else {
    for(let i = 0; i < number; i++){
      let traitSelection = promptFor("Select a Trait to search. Options are: 'gender', 'dob' (date of birth), " +
                          "'height', 'weight', 'eye color', or 'occupation'", traitsValidation);

        // get search results and store in people array so next search only searches remaining objects
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

     // display the users select trait search results
     displayListOfPeople(people);

  // restart the app and reset the data to entire data set
  return app(data); // ask again
}

//Search through an array of people to find matching first and last name and return a SINGLE person object.
function searchByName(people){
  let firstName = promptFor("What is the person's first name?", firstNameValidation);
  let lastName = promptFor("What is the person's last name?", autoValid);

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
  let eyeColor = promptFor("What is the person's eye color?", autoValid);

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
  let dOB = promptFor("What is the person's date of birth? (i.e. 2/19/1970)", autoValid);

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
  let occupation = promptFor("What is the person's occupation?", autoValid);
    
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

// Find people based on their ID
function searchById(people){
  let personsId = promptFor("Enter an ID number:", autoValid);

  // convert user input from string to number
  let personsIdNumber = parseInt(personsId);

  let possiblePerson = people.filter(function(potentialMatch){
    if(potentialMatch.id === personsIdNumber){
      return potentialMatch;
    }
  })
  return possiblePerson;
}

// Find people based on their height
function searchByHeight(people){
  let personsHeight = promptFor("Enter a height (inches)", autoValid);

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
  let personsWeight = promptFor("Enter a weight (pounds)", autoValid);

  // convert user input from string to number
  let personsWeightNumber = parseInt(personsWeight);

  let foundWeight = people.filter(function(potentialMatch){
    if(potentialMatch.weight === personsWeightNumber){
      return potentialMatch;
    }
  })
  return foundWeight;
}

// Find someone using their Spouse's ID number
function searchBySpouseId(people){
  let personsSpouseId = promptFor("Enter a person's spouse ID number", autoValid);

  // convert user input from string to number
  let personsSpouseNumberId = parseInt(personsSpouseId);

  // Filter through for matching spouse IDs but return the person you want, not the spouse
  let potentialMatchNotSpouse = people.filter(function(potentialMatch){
    if(potentialMatch.currentSpouse === personsSpouseNumberId){
      // return the person you are searching for
      return potentialMatch;
    }

  })
  return potentialMatchNotSpouse;
}

// This function retrieves descendants of found person
function getDescendants(person, people){
  let descendantsOnly = [];
  //This loop goes through and finds all the first 
  for(let i = 0; i < people.length; i++){
    if(people[i].parents.includes(person.id)){
      descendantsOnly.push(people[i]);
    }
  }
  //this loop goes through descendantsOnly one by one
  for(let j = 0; j < descendantsOnly.length; j++){
     descendantsOnly = descendantsOnly.concat(getDescendants(descendantsOnly[j], people))
  }
  return descendantsOnly;
}

//#endregion

//Display functions.
//Functions for user interface.
/////////////////////////////////////////////////////////////////
//#region 

// alerts a list of people
// function displayListOfPeople(people){
//   alert(people.map(function(person){
//     return person.firstName + " " + person.lastName;
//   }).join("\n"));
// }

// display a list of people
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

  let userResponse = promptFor(`${displayNamesText}${displayNames}` +
                    `\nWould you like to go back 'yes' or 'no'?`, yesNo);

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
     let infoResponse = promptFor(`${person.firstName} ${person.lastName}'s info: \nGender: ${person.gender} \nDate of Birth: ${person.dob} \nHeight: ${person.height} \nWeight: ${person.weight} \nEye color: ${person.eyeColor} \nOccupation: ${person.occupation} \nWould you like to go back 'yes' or 'no'?`, yesNo);

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
  let displayDescendantsText = `${person.firstName} ${person.lastName}'s Descendants are:\n ` +
                              `(Click 'Ok' after reviewing to go back to the previous menu.)\n\n`;

  // loop through and display descendants all at once
  for(let i = 0; i < descendants.length; i++){
    displayNames += `${descendants[i]}\n`;
  }
  let userResponse = promptFor(`${displayDescendantsText}${displayNames}` +
                    `\nWould you like to go back 'yes' or 'no'?`, yesNo);
  
  //if user says 'yes', they will return to main menu prompt
  if(userResponse === "yes"){
    return mainMenu(person, people);
  }

  //if user says 'no', they will exit prompt
  else if(userResponse === "no"){
    app(data);
  }
}

function displayFamily(person, spouse, parents, siblings){
    //This prompt displays the person's family info and then asks if they would like to go back
    let familyResponse = promptFor(`${person.firstName} ${person.lastName}'s family: \n` +
                        ` Spouse: ${spouse.firstName} ${spouse.lastName} \nParent(s): ${parents} \n` +
                        ` Siblings: ${siblings}\nWould you like to go back 'yes' or 'no'? `, yesNo);
    
    //if user says 'yes', they will return to main menu prompt
    if(familyResponse === "yes"){
        return mainMenu(person, people);
    }

    //if user says 'no', they will exit prompt
    else if(familyResponse === "no"){
        app(data);
    }
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

//Unfinished validation function you can use for any of your custom validation callbacks.

// function to validate number of traits selection
function numberOfTraitsValidation(input){
  input = parseInt(input);
  console.log(input);

  if(input > 0 && input <= 6 ){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// function to validate traits entered by user
function traitsValidation(input){
  if(input === "gender" || input === "dob" || input === "height" || input === "weight" || input === "eye color"){
    return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

// function to validate displayOption prompt
function displayOptionValidation(input){

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
  let nameMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].firstName){
        nameMatch = data[i].firstName;
        break;
      }
  }

  if(input === nameMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}

function firstNameValidation(input){
  let nameMatch = "";
  for(let i = 0; i < data.length; i++){
      if(input === data[i].firstName){
        nameMatch = data[i].firstName;
        break;
      }
  }

  if(input === nameMatch){
      return true;
  }
  else{
    alert("Not a valid choice, please try again.");
    return false;
  }
}
//#endregion