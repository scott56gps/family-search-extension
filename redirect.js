/*
window.onload = function () {
    var parts = window.location.href.split("#token=");
    window.localStorage.setItem("trellochrome_token", parts[1]);

    console.log(parts[1]);
};
*/

// Authorize Trello
var authenticationSuccess = function () {
    console.log('Authentication Success!')

    var token = Trello.token();
    window.localStorage.setItem('trelloToken', token);
    console.log('token: ' + token);

    var idList = '58f533ae840e741be1d1fb01';
    var creationSuccess = function (data) {
        console.log('Card was created successfully.  JSON returned: ' + JSON.stringify(data));
    }

    // This is the body of the new card we will create
    var newCard = {
        name: 'New Card by Scott',
        desc: 'An experimental card to get a card programmatically running on Trello.',
        idList: idList,
        pos: 'top'
    };

    // Now, we post the whole thing to Trello
    Trello.post('/cards/', newCard, creationSuccess);
    return;
}

var authenticationFailure = function () {
    console.log('Authentication Failure!')
    return;
}

Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');

Trello.authorize({
    type: 'redirect',
    name: 'Getting Started Application',
    scope: {
        read: 'true',
        write: 'true'
    },
    interactive: 'true',
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
});
