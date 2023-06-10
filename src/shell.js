const { exec } = require("child_process");

class ShellWrapper {

    restartSpotifyd() {
        exec("systemctl --user restart spotifyd.service", (error, stdout, stderr) => {
            console.log(stdout)
        })
    }
}

module.exports = { ShellWrapper }