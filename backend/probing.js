const fs = require('fs');

const HEALTHZ_TIME = 40000; // 40 seconds

function probeServer(app) {
    // Set the startupTimestamp to the current time
    const startupTimestamp = new Date();
    console.log(`Set startupTimestamp to ${startupTimestamp.toLocaleTimeString('sv-SE')}`);

    // -- StartupProbe --
    // Write a file to /tmp/started to indicate that the microservice has started
    try {
        fs.writeFile('/tmp/started', 'started', () => {
            console.log('Wrote file /tmp/started.');
        });
    } catch (err) {
        console.error(err);
    }

    // -- ReadinessProbe --
    // Checks that the appropriate port has been taken.
    // This is done purely by kubernetes.

    // -- LivenessProbe --
    // Add a route to the microservice that validates the microservice's health
    app.get('/healthz', async (req, res) => {
        const current = new Date();
        console.log(`Route /healthz hit at time ${current.toLocaleTimeString('sv-SE')}, Elapsed seconds since startup: ${(current - startupTimestamp)/1000}`);

        if (current - startupTimestamp < HEALTHZ_TIME) {
            console.log('Route /healthz returning status 200');
            res.sendStatus(200); // If within 40 seconds of the microservice's "startupTimestamp", return status "200" (ok)
        } else {
            console.log('Route /healthz returning status 500');
            res.sendStatus(500); // If not within 40 seconds of the microservice's "startupTimestamp", return status "500" (internal server error)
        }
    });

    return app;
}

module.exports = probeServer;