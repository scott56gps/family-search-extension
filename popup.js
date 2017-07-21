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
        file: "./scraperCode.js"
        //code: 'console.log(document.querySelector(\'span.fs-person-vitals__name-full\').innerText)'
    }, function (results) {
        if (Array.isArray(results)) {
            console.log(results[0]);
            // Send the results to our background page for processing

            // document.getElementById('name-result').innerText = 'Name: ' + results[0].fullName;
            // document.getElementById('id-result').innerText = 'ID: ' + results[0].id;

            // Now, let's authenticate the user
            // EXPERIMENT START
            var authenticationSuccess = function () {
                console.log('Authentication Success!')



                // Get all the cards in the board
                function cardRetrievalSuccess(boardLists) {
                    // We have the Family History Board
                    console.log(Array.isArray(boardLists))

                    var availableNamesListId;
                    // Now, we will search the array of lists for the 'Available Names' list
                    boardLists.forEach(function (list) {
                        if (list.name === 'Available Names') {
                            availableNamesListId = list.id;
                        }
                    });

                    Trello.get('/lists/' + availableNamesListId + '/cards', function (availableNamesCards) {
                        var creationSuccess = function (data) {
                            console.log('Card was created successfully.  JSON returned: ' + JSON.stringify(data));
                        }

                        var creationFailure = function (error) {
                            console.error('There was an error in creating the card.  ERROR: ' + error);
                        }

                        // Does the card exist?
                        var cardExists = false;
                        availableNamesCards.forEach(function (card) {
                            if (card.name === results[0].fullName + ' ' + results[0].id) {
                                cardExists = true;
                            }
                        });

                        if (!cardExists) {
                            // This is the body of the new card we will create
                            var newCard = {
                                name: results[0].fullName + ' ' + results[0].id,
                                idList: availableNamesListId,
                                pos: 'top'
                            };

                            // Now, we post the whole thing to Trello
                            Trello.post('/cards/', newCard, creationSuccess, creationFailure);
                            return;
                        } else {
                            console.log('A card already exists with this name');
                        }
                    }, function (error) {
                        console.error('There was an error in retrieving the cards.  ERROR: ' + error);
                        return;
                    })
                }

                function cardRetrievalFailure(error) {
                    console.error(error);
                    return;
                }

                Trello.get('/boards/PsS7R0Dy/lists', cardRetrievalSuccess, cardRetrievalFailure);
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

            // EXPERIMENT END
        } else {
            console.log('result is not an array');
        }





        //var returnUrl = chrome.extension.getURL("redirect.html");
        /*chrome.windows.create({
            url: "https://trello.com/1/authorize?" + "response_type=token" + "&key=83aa6ecc472eb7e1761b6b649cca40fb" + "&callback_method=fragment" + "&response_type=token" + "&return_url=" + encodeURI(returnUrl) + "&scope=read,write,account&expiration=never" + "&name=Family-History-Extension",
            width: 520,
            height: 620,
            type: "panel",
            focused: true
        });*/
        /*chrome.windows.create({
            url: "redirect.html",
            width: 520,
            height: 620,
            type: "panel",
            focused: true
        });*/
    });
}




document.addEventListener('DOMContentLoaded', function () {
    console.log('hi');
})

document.addEventListener('DOMContentLoaded', main);
