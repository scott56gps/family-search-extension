var authenticationSuccess = function () {
  console.log('Authentication Success!')

  var idList = '58f533ae840e741be1d1fb01';
  var creationSuccess = function (data) {
    console.log('Card was created successfully.  JSON returned: ' + data);
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

Trello.authorize({
  type: 'popup',
  name: 'Getting Started Application',
  scope: {
    read: 'true',
    write: 'true'
  },
  interactive: 'false',
  expiration: 'never',
  success: authenticationSuccess,
  error: authenticationFailure
});
