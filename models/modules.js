const { query } = require('../database');
const { EMPTY_RESULT_ERROR, SQL_ERROR_CODE, UNIQUE_VIOLATION_ERROR } = require('../errors');

module.exports.create = function create(code, name, credit) {
    const sql = 'CALL create_module($1, $2, $3)';
    return query(sql, [code, name, credit])
        .then(function (result) {
            console.log('Module created successfully');
        })
        .catch(function (error) {
            if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
                throw new UNIQUE_VIOLATION_ERROR(`Module ${code} already exists! Cannot create duplicate.`);
            }
            throw error;
        });
};
/*
module.exports.create = function create(code, name, credit) {
    const sql = `INSERT INTO module (mod_code, mod_name, credit_unit) VALUES ($1, $2, $3)`;
    return query(sql, [code, name, credit]).catch(function (error) {
        if (error.code === SQL_ERROR_CODE.UNIQUE_VIOLATION) {
            throw new UNIQUE_VIOLATION_ERROR(`Module ${code} already exists`);
        }
        throw error;
    });
};
*/

module.exports.retrieveByCode = function retrieveByCode(code) {
    const sql = `SELECT * FROM module WHERE mod_code = $1`;
    return query(sql, [code]).then(function (result) {
        const rows = result.rows;

        if (rows.length === 0) {
            // Note: result.rowCount returns the number of rows processed instead of returned
            // Read more: https://node-postgres.com/apis/result#resultrowcount-int--null
            throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
        }

        return rows[0];
    });
};

module.exports.deleteByCode = function deleteByCode(code) {
    // When using stored procedure, we need to handle the NOT FOUND error raised by the procedure
    const sql = 'CALL delete_module($1)';
    return query(sql, [code])
        .then(function (result) {
            console.log('Module deleted successfully');
        })
        .catch(function (error) {
            /*
            // Check if the error is raised by our stored procedure for module not found
            if (error.code === 'P0001' && error.message.includes('does not exist')) {
                throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
            }
            */
            throw error;
        });
};
/*
module.exports.deleteByCode = function deleteByCode(code) {
    // Note:
    // If using raw sql: Can use result.rowCount to check the number of rows affected
    // But if using function/stored procedure, result.rowCount will always return null
    const sql = `DELETE FROM module WHERE mod_code = $1`;
    return query(sql, [code]).then(function (result) {
        const rows = result.rowCount;

        if (rows === 0) {
            // Note: result.rowCount returns the number of rows processed instead of returned
            // Read more: https://node-postgres.com/apis/result#resultrowcount-int--null
            throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
        }
    })
};
*/

module.exports.updateByCode = function updateByCode(code, credit) {
    // When using stored procedure, we need to handle the NOT FOUND error raised by the procedure
    const sql = 'CALL update_module($1, $2, $3)';
    
    // Note: the original function only updated credit, but the stored procedure expects name as well
    // We'll need to add name parameter or modify the stored procedure to accept just code and credit
    return query(sql, [code, null, credit])  // Passing null for name to keep existing name
        .then(function (result) {
            console.log('Module updated successfully');
        })
        .catch(function (error) {
            /*
            // Check if the error is raised by our stored procedure for module not found
            if (error.code === 'P0001' && error.message.includes('does not exist')) {
                throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
            }
            */
            throw error;
        });
};
/*
module.exports.updateByCode = function updateByCode(code, credit) {
    // Note:
    // If using raw sql: Can use result.rowCount to check the number of rows affected
    // But if using function/stored procedure, result.rowCount will always return null
    const sql = `UPDATE module SET credit_unit = $1 WHERE mod_code = $2`;
    return query(sql, [credit, code]).then(function (result) {
        const rows = result.rowCount;

        if (rows === 0) {
            // Note: result.rowCount returns the number of rows processed instead of returned
            // Read more: https://node-postgres.com/apis/result#resultrowcount-int--null
            throw new EMPTY_RESULT_ERROR(`Module ${code} not found!`);
        }
    })
};
*/

module.exports.retrieveAll = function retrieveAll() {
    const sql = `SELECT * FROM module`;
    return query(sql).then(function (result) {
        return result.rows;
    });
};

module.exports.retrieveBulk = function retrieveBulk(codes) {
    const sql = 'SELECT * FROM module WHERE code IN ($1)';
    return query(sql, [codes]).then(function (response) {
        const rows = response.rows;
        const result = {};
        for (let i = 0; i < rows.length; i += 1) {
            const row = rows[i];
            const code = row.code;
            result[code] = row;
        }
        return result;
    });
};
