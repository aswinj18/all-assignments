/*
 * Write a function that halts the JS thread (make it busy wait) for a given number of milliseconds.
 * During this time the thread should not be able to do anything else.
 */

function sleep (seconds) {
    startTime = performance.now();
    while(performance.now() - startTime < seconds*1000) {}
}

console.time('Sleep time');
sleep(10);
console.timeEnd('Sleep time');