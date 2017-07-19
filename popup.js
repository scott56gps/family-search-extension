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
      if(Array.isArray(results)){
        console.log(results[0]);
        // Send the results to our background page for processing
        var backgroundPage = chrome.extension.getBackgroundPage();
        
        // document.getElementById('name-result').innerText = 'Name: ' + results[0].fullName;
        // document.getElementById('id-result').innerText = 'ID: ' + results[0].id;
      } else {
        console.log('result is not an array');
      }
    });

	// Now, let's authenticate the user
}



document.addEventListener('DOMContentLoaded', function(){
  console.log('hi');
})

document.addEventListener('DOMContentLoaded', main);
