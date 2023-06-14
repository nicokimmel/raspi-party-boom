const fs = require("fs")
const { exec } = require("child_process")

var WPA_SUPPLICANT = "/etc/wpa_supplicant/wpa_supplicant-wlan0.conf"
var HOSTAPD_CONF = "/etc/hostapd/hostapd.conf"
var HOSTAPD_DENY = "/etc/hostapd/hostapd.deny"

class ShellWrapper {

    restartSpotifyd() {
        exec("systemctl --user restart spotifyd.service", (error, stdout, stderr) => {
            console.log(stdout)
            console.log("[SHELL] Restarted spotifyd service")
        })
    }

    setHomeWifi(ssid, passphrase) {
        //https://www.jeffgeerling.com/blog/2021/working-multiple-wifi-interfaces-on-raspberry-pi
        exec(`sudo sed -i -s "s/^ssid=.*/ssid=${ssid}/" ${WPA_SUPPLICANT}`, (error, stdout, stderr) => {
            console.log(stderr)

            exec(`sudo sed -i -s "s/^psk=.*/psk=${passphrase}/" ${WPA_SUPPLICANT}`, (error, stdout, stderr) => {
                console.log(stderr)
                console.log("[SHELL] Set new SSID " + ssid + " and new passphrase " + passphrase + " for home wifi")

                exec(`sudo ifconfig wlan0 down && sudo ifconfig wlan0 up`, (error, stdout, stderr) => {
                    console.log(stderr)
                    console.log("[SHELL] Restarted wlan0")
                })
            })
        })
    }

    setGuestWifi(ssid, passphrase) {
        exec(`sudo sed -i -s "s/^ssid=.*/ssid=${ssid}/" ${HOSTAPD_CONF}`, (error, stdout, stderr) => {
            console.log(stderr)

            exec(`sudo sed -i -s "s/^wpa_passphrase=.*/wpa_passphrase=${passphrase}/" ${HOSTAPD_CONF}`, (error, stdout, stderr) => {
                console.log(stderr)
                console.log("[SHELL] Set new SSID " + ssid + " and new passphrase " + passphrase + " for guest wifi")

                exec(`sudo systemctl --user restart hostapd`, (error, stdout, stderr) => {
                    console.log(stderr)
                    console.log("[SHELL] Restarted hostapd service")
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
        const filterList = fs.readFileSync(HOSTAPD_DENY, "utf-8")
        let blockedClients = filterList.split(/\r?\n/)
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