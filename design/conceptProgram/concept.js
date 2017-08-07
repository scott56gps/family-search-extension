function main() {
    console.log('Authorized!');

    // Now that we're authorized, get the info that we need to display a card
    var loadButton = $('.loadAncestor')[0];
    loadButton.addEventListener('click', function () {
        var name = $('.inputAncestor')[0].value

        getCardInfo(name, function (error, cardData) {
            if (cardData) {
                // Then, display the data

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
