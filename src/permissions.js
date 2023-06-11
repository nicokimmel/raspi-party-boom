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
        this.permissionMap = {}
    }
    
    isEmpty() {
        return Object.keys(this.permissionMap).length === 0
    }
    
    getGroup(mac) {
        if (!this.permissionMap[mac]) {
            this.permissionMap[mac] = Group.DEFAULT
            return Group.DEFAULT
        }
        return this.permissionMap[mac]
    }

    setGroup(mac, group) {
        if (group < Group.ADMIN || group > Group.BLOCKED) { return }
        this.permissionMap[mac] = group
        this.saveToFile()
        console.log("[PERMISSIONS] Set group of " + mac + " to " + group)
    }

    loadFromFile() {
        if (!fs.existsSync(this.path)) { return }
        let rawData = fs.readFileSync(this.path);
        let jsonData = JSON.parse(rawData);
        console.log("[PERMISSIONS] Loaded permissions from " + this.path)
        return jsonData;
    }

    saveToFile() {
        let jsonData = JSON.stringify(this.permissionMap);
        fs.writeFileSync(this.path, jsonData);
        console.log("[PERMISSIONS] Saved permissions to " + this.path)
    }
}

module.exports = { Permissions, Group }