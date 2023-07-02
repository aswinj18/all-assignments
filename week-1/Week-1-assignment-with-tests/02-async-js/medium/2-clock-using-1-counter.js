
currentTime = new Date();

function printTime2Console(dateTimeObj) {
    console.clear();

    currentTimeString24Hour = dateTimeObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    console.log('24 Hour Clock: ' + currentTimeString24Hour);
    
    currentTimeString12Hour = dateTimeObj.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
    console.log('12 Hour Clock: ' + currentTimeString12Hour);    
}

setInterval(() => {
    currentTime.setSeconds( currentTime.getSeconds() + 1 );
    printTime2Console(currentTime);
}, 1000);
