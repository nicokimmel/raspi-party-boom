const { exec } = require("child_process");

class ShellWrapper {

    restartSpotifyd() {
        exec("systemctl --user restart spotifyd.service", (error, stdout, stderr) => {
            console.log(stdout)
        })
    }

    setHostapd(ssid, password) {
        //sed -i -s "s/^ssid=.*/ssid=$PI_SSID/" hostapd.conf
    }

    getConnectedClients() {
        return {
            "00:11:22:33:44:55": "host123",
            "AA:BB:CC:DD:EE:FF": "server456",
            "11:22:33:44:55:66": "client789",
            "FF:EE:DD:CC:BB:AA": "deviceXYZ",
            "12:34:56:78:90:AB": "router789",
            "98:76:54:32:10:FE": "printerXYZ",
            "AB:CD:EF:12:34:56": "laptop123",
            "01:23:45:67:89:0A": "desktop456",
            "23:45:67:89:0A:BC": "phone789",
            "CD:EF:12:34:56:78": "tabletXYZ"
        }
    }

    getBlockedClients() {
        //#deny_mac_file=/etc/hostapd.deny
        return {
            "12:34:56:78:90:AB": "device123",
            "AB:CD:EF:12:34:56": "gateway456",
            "98:76:54:32:10:FE": "workstation789"
        }
    }
}

module.exports = { ShellWrapper }