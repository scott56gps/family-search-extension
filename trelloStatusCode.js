function injectStatus() {
    var availableNamesId = '593eeff5b4e536449b014dca';
    var requestsId = '593ef02548eb8a664b457b01';
    var workingId = '593ef036f31f598432e56856';
    var finishedId = '593ef04b832a24d8cfe13885';

    // Get the right div
    var personInformationElement = document.querySelector('.person-information')
    console.log(personInformationElement)
    var newH1 = document.createElement('h1')

    // Decide what message we should display
    switch (idList) {
        case availableNamesId:
            var newContent = document.createTextNode('Trello: Available');
            personInformationElement.appendChild(newContent);
            break;

        case requestsId:
            var newContent = document.createTextNode('Trello: Requests');
            personInformationElement.appendChild(newContent);
            break;

        case workingId:
            var newContent = document.createTextNode('Trello: Working');
            personInformationElement.appendChild(newContent);
            break;

        case finishedId:
            var newContent = document.createTextNode('Trello: Finished');
            personInformationElement.appendChild(newContent);
            break;
        default:
            break;
    }
}

injectStatus();
