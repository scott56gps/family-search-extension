/********************************************************
 * Popup.js
 * Author: Scott Nicholes
 *
 * This is a program that will scrape a Family Search
 * Person Page for their name and ID.
 *******************************************************/
/*function main() {
  // Scrape the page
  chrome.tabs.executeScript(null, {
    file: "scraperCode.js"
  }, function (results) {
    if (Array.isArray(results)) {
      console.log(results[0]);

      // Now, let's authenticate the user
      var addCard = function () {
        console.log('Authentication Success!')
        console.log('Authorized: ' + Trello.authorized());

        // Here, we'll need to handle whatever request was given us

        // Get all the cards in the board
        function batchSuccess(boardListsAndCards) {
          // We have the Family History Board

          // FIRST, check to see if the card already exists anywhere in the board
          // The second element of our array contains all the cards on the board
          var cardExists = false;
          var culpritIdList;
          boardListsAndCards[1]['200'].forEach(function (card) {
            if (card.name === results[0].fullName + ' ' + results[0].id) {
              cardExists = true;
              culpritIdList = card.idList;
            }
          });

          if (!cardExists) {
            var availableNamesListId;
            // Now, we will search the array of lists for the 'Available Names' list
            boardListsAndCards[0]['200'].forEach(function (list) {
              if (list.name === 'Available Names') {
                availableNamesListId = list.id;
              }
            });

            Trello.get('/lists/' + availableNamesListId + '/cards', function (availableNamesCards) {
                var creationSuccess = function (data) {
                  console.log('Card was created successfully.  JSON returned: ' + JSON.stringify(data.idList));
                  document.getElementById('boldHeader').innerText = results[0].fullName + ' ' + results[0].id + ' was added to Trello';

                  // Inject code to display on page
                  chrome.tabs.executeScript(null, {
                    code: 'var idList = ' + JSON.stringify(data.idList)
                  }, function () {
                    chrome.tabs.executeScript(null, {
                      file: 'trelloStatusCode.js'
                    });
                  })
                }

                var creationFailure = function (error) {
                  console.error('There was an error in creating the card.  ERROR: ' + error);
                }



                // Get the user id
                Trello.get('/members/me', function (memberData) {
                  var memberId = memberData.id;
                  // This is the body of the new card we will create
                  var newCard = {
                    name: results[0].fullName + ' ' + results[0].id,
                    idList: availableNamesListId,
                    idMembers: memberId,
                    pos: 'top'
                  };

                  // Now, we post the whole thing to Trello
                  Trello.post('/cards/', newCard, creationSuccess, creationFailure);
                  return;
                });
              },
              function (error) {
                console.error('There was an error in retrieving the cards.  ERROR: ' + error);
                return;
              });
          } else {
            console.log('A card already exists with this name.  JSON: ' + culpritIdList);
            document.getElementById('boldHeader').innerText = 'A card already exists with this name: ' + results[0].fullName + ' ' + results[0].id;

            // Inject code to display on page
            chrome.tabs.executeScript(null, {
              code: 'var idList = ' + JSON.stringify(culpritIdList)
            }, function () {
              chrome.tabs.executeScript(null, {
                file: 'trelloStatusCode.js'
              });
            })
          }
        }

        function batchFailure(error) {
          console.error(error);
          return;
        }

        Trello.get('/batch?urls=/boards/PsS7R0Dy/lists,/boards/PsS7R0Dy/cards', batchSuccess, batchFailure);
        return;
      }
      var authenticationFailure = function () {
        console.log('Authentication Failure!')
        return;
      }

      // Check to see if the token still exists
      console.log(localStorage.trelloToken)
      if (localStorage.trelloToken) {
        console.log('hola')
        // Simply authorize and go ahead
        Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
        Trello.authorize({
          type: 'redirect',
          name: 'Getting Started Application',
          scope: {
            read: 'true',
            write: 'true',
            account: 'true'
          },
          interactive: 'false',
          expiration: 'never',
          success: addCard,
          error: authenticationFailure
        });
      } else {
        // Manually get the token and then authorize
        var returnUrl = chrome.extension.getURL("redirect.html");
        chrome.windows.create({
          url: "https://trello.com/1/authorize?" + "response_type=token" + "&key=83aa6ecc472eb7e1761b6b649cca40fb" + "&response_type=token" + "&return_url=" + encodeURI(returnUrl) + "&scope=read,write&expiration=never" + "&name=FamilySearchExample",
          width: 520,
          height: 620,
          type: "panel",
          focused: true
        }, function (window) {

          window.onRemoved.addListener(function (windowId) {
            console.log('HI!! ' + Trello.token());
            console.log(window.id);
            console.log(localStorage);


            Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
            Trello.authorize({
              type: 'redirect',
              name: 'Getting Started Application',
              scope: {
                read: 'true',
                write: 'true',
                account: 'true'
              },
              interactive: 'false',
              expiration: 'never',
              success: addCard,
              error: authenticationFailure
            });
          })
        });
      }
    } else {
      console.log('result is not an array');
    }
  });
}


document.addEventListener('DOMContentLoaded', function () {
  console.log('hi');
})

document.addEventListener('DOMContentLoaded', main);*/


// BEGIN REWRITE
const availableNamesId = '593eeff5b4e536449b014dca';
const requestsId = '593ef02548eb8a664b457b01';
const workingId = '593ef036f31f598432e56856';
const finishedId = '593ef04b832a24d8cfe13885';

// Query selectors
var outputDiv = document.getElementById('outputContainer');

function main() {
  console.log('Authorized!');


  // Now that we're authorized, get the info that we need to display a card
  chrome.tabs.executeScript(null, {
    file: "scraperCode.js"
  }, function (results) {
    var name = results[0].fullName + ' ' + results[0].id;
    console.log(name);
    getCardInfo(name, function (error, card) {
      if (card) {
        // Display the card
        console.log('found card');
        displayCard(card);
        handleDrag(card);
      } else {
        // The card does not exist anywhere on the board
        console.log('no card');
        var newInputElement = document.createElement('input');
        newInputElement.setAttribute('class', 'addAncestor');
        newInputElement.setAttribute('type', 'button');
        newInputElement.setAttribute('value', 'Share Ancestor');
        document.getElementById('outputContainer').appendChild(newInputElement);

        $('.addAncestor').on('click', function () {
          addCard(name);
        });
      }
    });
  });
}

function authenticationFailure() {
  console.log('Not Authorized!');
}

function authorizeUser() {
  // Check to see if the token still exists
  if (localStorage.trelloToken) {
    // Simply authorize and go ahead
    Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
    Trello.authorize({
      type: 'redirect',
      name: 'Family Search Collaborator',
      scope: {
        read: 'true',
        write: 'true',
        account: 'true'
      },
      interactive: 'false',
      expiration: 'never',
      success: main,
      error: authenticationFailure
    });
  } else {
    // Manually get the token and then authorize
    var returnUrl = chrome.extension.getURL("redirect.html");
    chrome.windows.create({
      url: "https://trello.com/1/authorize?" + "response_type=token" + "&key=83aa6ecc472eb7e1761b6b649cca40fb" + "&response_type=token" + "&return_url=" + encodeURI(returnUrl) + "&scope=read,write&expiration=never" + "&name=FamilySearchExample",
      width: 520,
      height: 620,
      type: "panel",
      focused: true
    }, function (window) {

      window.onRemoved.addListener(function (windowId) {
        Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
        Trello.authorize({
          type: 'redirect',
          name: 'Family Search Collaborator',
          scope: {
            read: 'true',
            write: 'true',
            account: 'true'
          },
          interactive: 'false',
          expiration: 'never',
          success: main,
          error: authenticationFailure
        });
      })
    });
  }
}

function displayCard(card) {
  console.log(card);

  // Choose where to put the card
  switch (card.idList) {
    case availableNamesId:
      $('.card').show();
      $('#card').html(card.name); // Displays the name
      $('#available').append($('#card')); // Displays in the proper place
      break;
    case requestsId:
      $('.card').show();
      $('#card').html(card.name);
      $('#request').append($('#card'));
      break;
    case workingId:
      $('.card').show();
      $('#card').html(card.name);
      $('#working').append($('#card'));
      break;
    case finishedId:
      $('.card').show();
      $('#card').html(card.name);
      $('#finished').append($('#card'));
      break;
  }

}

function getCardInfo(name, callback) {
  // IF the card exists on the board, get the card info
  function batchSuccess(batchData) {
    var cardExists = false;
    var foundCard;
    batchData[1]['200'].forEach(function (card) {
      if (card.name.includes(name)) {
        // The card exists.
        cardExists = true;
        foundCard = card;
      }
    });

    if (cardExists) {
      callback(null, foundCard);
    } else {
      callback(null, null);
    }
  }

  function batchFailure() {

  }

  Trello.get('/batch?urls=/boards/PsS7R0Dy/lists,/boards/PsS7R0Dy/cards', batchSuccess, batchFailure);
}

function handleDrag(card) {
  document.getElementById('card').addEventListener('dragstart', function (event) {
    console.log(event.target.innerHTML);
    event.dataTransfer.setData('text', event.target.innerHTML);
  });

  document.querySelectorAll('.card-container').forEach(function (node) {
    node.addEventListener('dragover', function (event) {
      event.preventDefault();
    });
  });

  document.querySelectorAll('.card-container').forEach(function (node) {
    node.addEventListener('drop', function (event) {
      event.preventDefault();
      var data = event.dataTransfer.getData('text');
      event.target.appendChild(document.getElementById('card'));

      // Get the element that we're in
      var destinationListId;
      console.log(event.path[0].id)
      switch (event.path[0].id) {
        case 'available':
          destinationListId = availableNamesId;
          break;
        case 'request':
          destinationListId = requestsId;
          break;
        case 'working':
          destinationListId = workingId;
          break;
        case 'finished':
          destinationListId = finishedId;
          break;
      }

      console.log('destinationListId: ' + destinationListId);

      // Call moveCard
      moveCard(card, destinationListId);
    });
  });
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData('text');
  event.target.appendChild(document.getElementById(name));
  console.log('droppedData: ' + data);
}

function addCard(name) {
  // Get the current member ID
  var memberId;
  Trello.get('/members/me', {}, function (currentMember) {
    memberId = currentMember.id;
    console.log(memberId);
    Trello.rest('POST', '/cards', {
      name: name,
      idList: availableNamesId,
      idMembers: `${memberId}`
    }, function (newCard) {
      $('.addAncestor').replaceWith('Ancestor Shared Successfully');
      displayCard(newCard);
      handleDrag(newCard);
    }, function (error) {
      console.log(error);
    });
  });
}

function moveCard(cardToMove, destListId) {
  // First, check to see if the current user is subscribed to the card
  Trello.get('/members/me', {}, function (currentMember) {
    var memberId = currentMember.id;

    if (cardToMove.idMembers.includes(memberId)) {
      Trello.rest('PUT', `/cards/${cardToMove.id}`, {
        idList: destListId
      }, function () {
        console.log('Card was moved to ListID: ' + destListId);
      }, function (error) {
        console.log('There was an error in moving the card: ' + error);
      });
    } else {
      Trello.rest('PUT', `/cards/${cardToMove.id}`, {
        idList: destListId,
        idMembers: [`${cardToMove.idMembers}`, `${memberId}`]
      }, function () {
        console.log('Card was moved to ListID: ' + destListId);
        // Currently does not work
        //document.getElementById('outputContainer').innerHTML = 'Card was moved successfully';
      }, function (error) {
        console.log('There was an error in moving the card: ' + error);
        //document.getElementById('outputContainer').innerHTML = 'There was a problem in moving the card';
      });
    }
  });
}


window.onload = authorizeUser;
/*********************************************************************/
/********************** CONCEPT.JS ***********************************/
