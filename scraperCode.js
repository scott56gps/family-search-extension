function scrapeNameAndId() {
    // Get the name and Id
    var fullName = document.querySelector('span.fs-person-vitals__name-full').innerText.trim();
    var id = document.querySelector('span.fs-person-details__id').innerText.trim();

    console.log('fullName: ' + fullName);
    console.log('ID: ' + id);

    return {
        fullName: fullName,
        id: id
    };
}

scrapeNameAndId();

// The following is prototype code to include a new element in the page that will help users
//  immediately see if this person is already in trello or not.
/*var personInformationElement = document.querySelector('.person-information')
var newH1 = document.createElement('h1')
var newContent = document.createTextNode('In Trello');
personInformationElement.appendChild(newContent);*/
