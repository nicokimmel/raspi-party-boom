const fs = require('fs');

const Group = {
    ADMIN: 0,
    DJ: 1,
    USER: 2,
    GUEST: 3,
    BLOCKED: 4,
    DEFAULT: 2
}

class Permissions {

    constructor(path) {
        this.path = path
        this.permissionTable = {}
    }

    isEmpty() {
        return Object.keys(this.permissionTable).length === 0
    }

    getGroup(mac) {
        if (!this.permissionTable.hasOwnProperty(mac)) {
            console.log("[PERMISSIONS] No group found for " + mac + ", setting to default")
            this.permissionTable[mac] = Group.DEFAULT
            this.saveToFile()
        }
        console.log("[PERMISSIONS] Get group of " + mac + ": " + this.permissionTable[mac])
        return this.permissionTable[mac]
    }

    setGroup(mac, group) {
        if (group < Group.ADMIN || group > Group.BLOCKED) { return }
        this.permissionTable[mac] = group
        this.saveToFile()
        console.log("[PERMISSIONS] Set group of " + mac + " to " + group)
    }

    loadFromFile() {
        if (!fs.existsSync(this.path)) { return }
        let jsonData = fs.readFileSync(this.path);
        this.permissionTable = JSON.parse(jsonData);
        console.log("[PERMISSIONS] Loaded permissions from " + this.path)
        console.table(this.permissionTable)
    }

    saveToFile() {
        let jsonData = JSON.stringify(this.permissionTable);
        fs.writeFileSync(this.path, jsonData);
        console.log("[PERMISSIONS] Saved permissions to " + this.path)
    }
}

module.exports = { Permissions, Group }