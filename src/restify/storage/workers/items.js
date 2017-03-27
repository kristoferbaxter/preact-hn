'use strict';

function handleSuccess(item) {
  // Pass results back to parent process
  process.send(item);

  if (item.kids && item.kids.length > 0) {
    item.kids.forEach((kid, index) => retrieveItem(kid));  
  }  
}

function handleError(error) {
  // OH NOES!
  console.log(error);
}

function retrieveItem(id, success=handleSuccess, error=handleError) {
  fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    .then(response => response.json())
    .then((json) => success(json))
    .catch((error) => error(error)); 
}

process.on('message', function(rootId) {
  retrieveItem(rootId, (item) => {
    // Root is slightly different, we want to know when all the children finish
    const childCount = item.kids && item.kids.length;

    if (childCount > 0) {
      item.kids.forEach((kid, index) => {
        retrieveItem(kid, (item) => {
          handleSuccess(item);

          if (index === childCount-1) {
            process.send({complete: true});  
          }
        });
      });
    }

    process.send(item);
  });
});