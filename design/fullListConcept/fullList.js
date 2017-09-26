const availableNamesId = '593eeff5b4e536449b014dca';
const requestsId = '593ef02548eb8a664b457b01';
const workingId = '593ef036f31f598432e56856';
const finishedId = '593ef04b832a24d8cfe13885';

/*******************************************
 * This program will simply display all
 * the names in the available list.
 ******************************************/

function main() {
    console.log('Authorized!');


    // Now that we're authorized, get the info that we need to display the names
    getCardInfo(console.log);
}

function authorizeUser() {
    // If the user is not already logged in, authenticate the user
    Trello.authorize({
        type: 'redirect',
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

function getCardInfo(callback) {
    // IF the card exists on the board, get the card info
    function batchSuccess(batchData) {
        console.log(batchData);
        batchData[1]['200'].forEach(function (card) {
            if (card.idList == availableNamesId || card.idList == workingId) {
                console.log(card.name + ' List:' + convertListIdToName(card));
                $('.outputContainer').append(`<div class="flex-container name-result">` + card.name + ' List:' + convertListIdToName(card) + '</div>');
            }
        });

        callback('Got through function');
        return;
    }

    function batchFailure() {
        console.log('There was a Trello batch request error');
        callback('There were errors');
        return;
    }

    console.log('about to make Trello request');
    Trello.get('/batch?urls=/boards/PsS7R0Dy/lists,/boards/PsS7R0Dy/cards', batchSuccess, batchFailure);

}

function convertListIdToName(card) {
    // Choose what category the card is listed under
    switch (card.idList) {
        case availableNamesId:
            return 'Available';
            break;
        case workingId:
            return 'Working';
            break;
    }
}

window.onload = authorizeUser;
