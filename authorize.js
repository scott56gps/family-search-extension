chrome.windows.create({
    url: "https://trello.com/1/authorize?" + "response_type=token" + "&key=83aa6ecc472eb7e1761b6b649cca40fb" + "&response_type=token" + "&return_url=" + encodeURI(returnUrl) + "&scope=read,write&expiration=never" + "&name=FamilySearchExample",
    width: 520,
    height: 620,
    type: "panel",
    focused: true
}, function (window) {
    console.log('HI!! ' + Trello.token());
    console.log(window.id);
    chrome.windows.remove(window.id, function () {
        Trello.setKey('83aa6ecc472eb7e1761b6b649cca40fb');
        Trello.authorize({
            type: 'redirect',
            name: 'Getting Started Application',
            scope: {
                read: 'true',
                write: 'true',
                account: 'true'
            },
            interactive: 'true',
            expiration: 'never',
            success: addCard,
            error: authenticationFailure
        });
    });
});
