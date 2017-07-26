/********************************************************
 * Popup.js
 * Author: Scott Nicholes
 *
 * This is a program that will scrape a Family Search
 * Person Page for their name and ID.
 *******************************************************/
function main() {
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
            console.log(Trello.token())
            if (Trello.token()) {
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
            }
        } else {
            console.log('result is not an array');
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    console.log('hi');
})

document.addEventListener('DOMContentLoaded', main);
