const availableNamesId = '593eeff5b4e536449b014dca';
const requestsId = '593ef02548eb8a664b457b01';
const workingId = '593ef036f31f598432e56856';
const finishedId = '593ef04b832a24d8cfe13885';

// Query selectors
var outputDiv = document.getElementById('outputContainer');

function main() {
  console.log('Authorized!');
  var idMembers = [];

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
          addCard(results[0].fullName, results[0].id);
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
      chrome.windows.onRemoved.addListener(function (windowId) {
        // Now that we're authorized, set the token and let's call main!
        Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
        Trello.setToken(localStorage.getItem('trelloToken'));
        main();
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

function addCard(name, id) {
  // Get the current member ID
  var memberId;
  Trello.get('/members/me', {}, function (currentMember) {
    memberId = currentMember.id;
    console.log(memberId);
    Trello.rest('POST', '/cards', {
      name: name + ' ' + id,
      idList: availableNamesId,
      idMembers: `${memberId}`,
      desc: `FamilySearch Ordinance Page: https://familysearch.org/tree/person/${id}/ordinances`
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
    // Add the current user onto the current list of members
    var currentMembers = cardToMove.idMembers;
    currentMembers.push(currentMember.id);

    // Now move the card with all the members in it
    Trello.rest('PUT', `/cards/${cardToMove.id}`, {
      idList: destListId,
      idMembers: currentMembers
    }, function () {
      console.log('Card was moved to ListID: ' + destListId);
    }, function (error) {
      console.log('There was an error in moving the card: ' + error);
    });
  });
}


window.onload = authorizeUser;
