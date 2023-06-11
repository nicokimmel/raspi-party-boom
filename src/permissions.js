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
    }

    loadFromFile() {
        if (!fs.existsSync(this.path)) { return }
        let rawData = fs.readFileSync(this.path);
        let jsonData = JSON.parse(rawData);
        return jsonData;
    }

    saveToFile() {
        let jsonData = JSON.stringify(this.permissionMap);
        fs.writeFileSync(this.path, jsonData);
    }
}

module.exports = { Permissions, Group }