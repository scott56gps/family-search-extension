// Authorize Trello
var authenticationSuccess = function () {
  console.log('Redirect Authentication Success!')

  var token = Trello.token();
  window.localStorage.setItem('trelloToken', token);
  chrome.windows.getCurrent(function (window) {
    chrome.windows.remove(window.id);
  });
}

var authenticationFailure = function () {
  console.log('Authentication Failure!')
  return;
}

window.onload = function () {
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
}
