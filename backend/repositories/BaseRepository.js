// Repository Pattern: Abstracts data access logic
const db = require('../config/database');

class BaseRepository {
    constructor(tableName) {
        this.tableName = tableName;
        this.db = db.getPool();
    }

    async findAll(conditions = {}) {
        let query = `SELECT * FROM ${this.tableName}`;
        const values = [];

        if (Object.keys(conditions).length > 0) {
            const whereClause = Object.keys(conditions)
                .map(key => `${key} = ?`)
                .join(' AND ');
            query += ` WHERE ${whereClause}`;
            values.push(...Object.values(conditions));
        }

        const [rows] = await this.db.query(query, values);
        return rows;
    }

    async findById(id) {
        const [rows] = await this.db.query(
            `SELECT * FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return rows[0] || null;
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const [result] = await this.db.query(
            `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );

        return { id: result.insertId, ...data };
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        await this.db.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`,
            [...values, id]
        );

        return this.findById(id);
    }

    async delete(id) {
        await this.db.query(
            `DELETE FROM ${this.tableName} WHERE id = ?`,
            [id]
        );
        return true;
    }
}

module.exports = BaseRepository;

