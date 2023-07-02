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

async function main() {

    // Creating a promise wrapper instance for timeout instance
    setTimeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            currentTime.setSeconds( currentTime.getSeconds() + 1 );
            printTime2Console(currentTime);
            resolve();
        }, 1000);
    });
    // Waiting for the timeout instance to call the function
    output = await setTimeoutPromise;

    // REcursion
    main();
}

main();
