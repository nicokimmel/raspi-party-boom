const { exec } = require("child_process");

class ShellWrapper {

    restartSpotifyd() {
        exec("systemctl --user restart spotifyd.service", (error, stdout, stderr) => {
            console.log(stdout)
        })
    }

    setHostapd(ssid, passphrase) {        
        exec(`sudo sed -i -s "s/^ssid=.*/ssid=${ssid}/" /etc/hostapd/hostapd.conf`, (error, stdout, stderr) => {
            console.log(stderr)

            exec(`sudo sed -i -s "s/^wpa_passphrase=.*/wpa_passphrase=${passphrase}/" /etc/hostapd/hostapd.conf`, (error, stdout, stderr) => {
                console.log(stderr)

                exec(`sudo systemctl --user restart hostapd`, (error, stdout, stderr) => {
                    console.log(stderr)
                    console.log("[SHELL] Set new SSID " + ssid + " and new passphrase " + passphrase)
                })
            })
        })
    }

    getConnectedClients() {
        return [
            ["00:00:00:00:00:00", "localhost", 2],
            ["AA:BB:CC:DD:EE:FF", "Bob's Smartphone", 2],
            ["11:22:33:44:55:66", "Charlie's Tablet", 1],
            ["FF:EE:DD:CC:BB:AA", "David's Desktop", 2],
            ["12:34:56:78:90:AB", "Emma's iPhone", 3],
            ["98:76:54:32:10:FE", "Frank's Printer", 2],
            ["AB:CD:EF:12:34:56", "Grace's Router", 3]
        ];
    }

    getBlockedClients() {
        //#deny_mac_file=/etc/hostapd.deny
        return [
            ["01:23:45:67:89:0A", "Henry's Smart TV", 4],
            ["23:45:67:89:0A:BC", "Isabella's Smartwatch", 4],
            ["CD:EF:12:34:56:78", "Jack's Gaming Console", 4]
        ];
    }
}

module.exports = { ShellWrapper }