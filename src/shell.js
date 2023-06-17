const fs = require("fs")
const { exec } = require("child_process")

var HOSTAPD_CONF = "/etc/hostapd/hostapd.conf"
var HOSTAPD_DENY = "/home/nicokimmel/hostapd.deny" //"/etc/hostapd/hostapd.deny"

class ShellWrapper {

    restartSpotifyd() {
        exec("systemctl --user restart spotifyd.service", (error, stdout, stderr) => {
            console.log(stdout)
            console.log("[SHELL] Restarted spotifyd service")
        })
    }

    setHostapd(ssid, passphrase) {
        exec(`sudo sed -i -s "s/^ssid=.*/ssid=${ssid}/" ${HOSTAPD_CONF}`, (error, stdout, stderr) => {
            console.log(stderr)

            exec(`sudo sed -i -s "s/^wpa_passphrase=.*/wpa_passphrase=${passphrase}/" ${HOSTAPD_CONF}`, (error, stdout, stderr) => {
                console.log(stderr)
                console.log("[SHELL] Set new SSID " + ssid + " and new passphrase " + passphrase)

                exec(`sudo systemctl --user restart hostapd`, (error, stdout, stderr) => {
                    console.log(stderr)
                    console.log("[SHELL] Restarted hostapd service")
                })
            })
        })
    }

    getConnectedClients() {
        return ["00:00:00:00:00:00", "AA:BB:CC:DD:EE:FF", "11:22:33:44:55:66", "FF:EE:DD:CC:BB:AA", "12:34:56:78:90:AB", "98:76:54:32:10:FE", "AB:CD:EF:12:34:56"]
    }

    getBlockedClients() {
        let blockedClients = []
        const filterList = fs.readFileSync(HOSTAPD_DENY, "utf-8")
        filterList.split(/\r?\n/).forEach(mac => {
            blockedClients.push([mac, 4]) //Soll die ShellWrapper Klasse auch die Gruppen kennen?
        })
        console.log("[SHELL] Get blocked clients (" + blockedClients.length + ")")
        return blockedClients
    }

    setBlockedClients(macList) {
        let filterList = ""
        macList.forEach(mac => {
            filterList += mac + "\n"
        })
        fs.writeFileSync(HOSTAPD_DENY, filterList)
        console.log("[SHELL] Set new blocked clients (" + macList.length + ")")
    }
}

module.exports = { ShellWrapper }