
var counter = 0;

function updateCounter() {
    counter += 1;
    console.log(counter)
}

setInterval(updateCounter, 1000);
