
var counter=0;

// Defining a function to update counter
function updateCounter(resolveFunction) {
    counter += 1;
    console.log(counter);
}

async function main() {

    // Creating a promise wrapper instance for timeout instance
    setTimeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
            updateCounter();
            resolve();
        }, 1000);
    });
    // Waiting for the timeout instance to call the function
    output = await setTimeoutPromise;

    // REcursion
    main();
}

main();


