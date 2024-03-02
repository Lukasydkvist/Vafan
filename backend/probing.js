const fs = require('fs');

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

        res.sendStatus(200); 
    });

    return app;
}

module.exports = probeServer;