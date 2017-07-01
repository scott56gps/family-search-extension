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
