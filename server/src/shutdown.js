function init(db) {
    process.once('SIGUSR2', function () {
        db.close();
        //process.kill(process.pid, 'SIGUSR2');
        process.kill(process.pid, 'SIGTERM');
    });
}
module.exports = init
