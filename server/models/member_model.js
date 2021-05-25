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
        const sql = "INSERT INTO user_table (company_number ,user_name, email, password, admin) VALUES ?";
        const data = [companyNo, userName, email, hashedPassword, admin];
        const result = await query(sql, [[data]]);
        const checkCompany = "SELECT company_number FROM company_table WHERE company_number = ?;";
        const companyResult = await query(checkCompany, companyNo);
        // 沒有重複的公司才需加到company_table
        if (companyResult.length === 0) {
            const addCompany = "INSERT INTO company_table (company_number ,company_name) VALUES ?";
            const info = [companyNo, companyName];
            const addCompanyResult = await query(addCompany, [[info]]);
        }
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
