const { query } = require("./mysqlcon");
const selectEmail = async function (email) {
    try {
        const sql = "SELECT email, password FROM user_table WHERE email = ?;";
        const result = await query(sql, email);
        return result;
    } catch (err) {
        console.log("test12");
        console.log(err);
    }
};

const registerMember = async function (companyName, companyNo, userName, email, hashedPassword, admin) {
    try {
        // Only companies without duplicates need to be added to company_table
        const checkCompany = "SELECT company_number FROM company_table WHERE company_number = ?;";
        const companyResult = await query(checkCompany, companyNo);
        if (companyResult.length === 0) {
            const addCompany = "INSERT INTO company_table (company_number ,company_name) VALUES ?";
            const info = [companyNo, companyName];
            await query(addCompany, [[info]]);
        }
        const sql = "INSERT INTO user_table (company_number ,user_name, email, password, admin) VALUES ?";
        const data = [companyNo, userName, email, hashedPassword, admin];
        const result = await query(sql, [[data]]);
        return result;
    } catch (err) {
        console.log("test11");
        console.log(err);
    }
};

const selectUserInfo = async function (email) {
    try {
        const sql = "SELECT * FROM user_table WHERE email = ?;";
        const result = await query(sql, email);
        return result;
    } catch (err) {
        console.log("test10");
        console.log(err);
    }
};

module.exports = {
    selectEmail,
    registerMember,
    selectUserInfo
};
