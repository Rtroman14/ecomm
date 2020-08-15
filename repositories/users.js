const fs = require("fs");
const crypto = require("crypto");
const util = require("util");

const scrypt = util.promisify(crypto.scrypt);

class UsersRepositories {
    constructor(filename) {
        if (!filename) {
            throw new Error("Creating a repository requires a filename");
        }

        this.filename = filename;

        try {
            fs.accessSync(this.filename);
        } catch {
            fs.writeFileSync(this.filename, "[]");
        }
    }

    async getAll() {
        return JSON.parse(await fs.promises.readFile(this.filename));
    }

    async create(attributes) {
        // attributes === { email: "", password: "" }
        attributes.id = this.randomId();

        // extra security to password
        const salt = crypto.randomBytes(8).toString("hex");
        const buffer = await scrypt(attributes.password, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attributes,
            password: `${buffer.toString("hex")}.${salt}`,
        };

        records.push(record);

        await this.writeAll(records);

        return attributes;
    }

    async comparePasswords(saved, supplied) {
        // saved === password in database. "hashed.salt"
        // supplied === password given from user trying to sign up

        const [hashed, salt] = saved.split(".");

        const hashedSuppliedBuffer = await scrypt(supplied, salt, 64);

        return hashed === hashedSuppliedBuffer.toString("hex");
    }

    async writeAll(records) {
        // writes to fill with 4 spaces to prettyPrint
        await fs.promises.writeFile(this.filename, JSON.stringify(records, null, 4));
    }

    async getUser(id) {
        const records = await this.getAll();

        return records.find((record) => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter((record) => record.id !== id);

        await this.writeAll(filteredRecords);
    }

    async update(id, attributes) {
        const records = await this.getAll();
        const record = records.find((record) => record.id === id);

        if (!record) {
            throw new Error(`Record with id: ${id} not found.`);
        }

        Object.assign(record, attributes);
        await this.writeAll(records);
    }

    async getUserBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;

            for (let key in filters) {
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }

    randomId() {
        return crypto.randomBytes(4).toString("hex");
    }
}

module.exports = new UsersRepositories("users.json");
