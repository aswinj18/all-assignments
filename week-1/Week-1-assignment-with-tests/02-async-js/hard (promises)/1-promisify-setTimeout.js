/*
    Write a function that returns a promise that resolves after n seconds have passed, where n is passed as an argument to the function.
*/

async function wait(n) {
    return new Promise((resolve) => {
        setTimeout(resolve, n);
    })
}

async function main() {
    console.time('Wait time');
    await wait(10000);
    console.timeEnd('Wait time');
}

main();