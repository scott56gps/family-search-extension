const availableNamesId = '593eeff5b4e536449b014dca';
const requestsId = '593ef02548eb8a664b457b01';
const workingId = '593ef036f31f598432e56856';
const finishedId = '593ef04b832a24d8cfe13885';

function main() {
    console.log('Authorized!');


    // Now that we're authorized, get the info that we need to display a card
    var loadButton = $('.loadAncestor')[0];
    loadButton.addEventListener('click', function () {
        var name = $('.inputAncestor')[0].value

        getCardInfo(name, function (error, card) {
            if (card) {
                // Display the card
                displayCard(card);
            }
        });
    });
}

function authorizeUser() {
    // If the user is not already logged in, authenticate the user
    Trello.authorize({
        type: 'popup',
        name: 'Family History Concept App',
        scope: {
            read: 'true',
            write: 'true'
        },
        expiration: 'never',
        success: main,
        error: authenticationFailure
    });
}

function authenticationFailure() {
    console.log('Not Authorized!');
}

function displayCard(card) {
    console.log(card);

    // Choose where to put the card
    if (!card) {
        // Make button 'Share Ancestor With Family'
    } else {
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
}

function getName() {

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

function addCard(name) {

}

function moveCard(destListId) {

}

window.onload = authorizeUser;
