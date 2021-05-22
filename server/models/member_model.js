const { query } = require("./mysqlcon");
const selectEmail = async function (email) {
    try {
        const sql = "SELECT email, password FROM user_table WHERE email = ?;";
        const result = await query(sql, email);
        return result;
    } catch (err) {
        console.log(err);
    }
};

const registerMember = async function (companyName, companyNo, userName, email, hashedPassword, admin) {
    try {
        const sql = "INSERT INTO user_table (company_name ,company_number ,user_name, email, password, admin) VALUES ?";
        const data = [companyName, companyNo, userName, email, hashedPassword, admin];
        const result = await query(sql, [[data]]);
        return result;
    } catch (err) {
        console.log(err);
    }
};

const selectUserInfo = async function (email) {
    try {
        const sql = "SELECT * FROM user_table WHERE email = ?;";
        const result = await query(sql, email);
        return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    selectEmail,
    registerMember,
    selectUserInfo
};
