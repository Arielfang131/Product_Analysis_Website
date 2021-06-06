const { query } = require("./mysqlcon");

// const selectTopic = async function (companyNo) {
//     const sql = "SELECT company_table.company_id, topic_table.topic_id, topic_table.topic_name FROM company_table INNER JOIN topic_table ON company_table.company_id = topic_table.company_id WHERE company_table.company_number = ?;";
//     const result = await query(sql, companyNo);
//     return result;
// };

// const selectNegative = async function (keywordsId, deadline) {
//     try {
//         const sql = "SELECT keywords, symbols FROM keywords_table WHERE keywords_id = ?;";
//         const result = await query(sql, keywordsId);
//         const symbols = result[0].symbols.split(",");
//         const symbols2 = symbols.map((element) => {
//             return element;
//         });
//         const firstKeywordsArr = result[0].keywords.split("+")[0].split(",");
//         // if (sqlResult[0].keywords.split("+")[1].length !== 0) {
//         //     const secondKeywordsArr = sqlResult[0].keywords.split("+")[1].split(",");
//         // }
//         let strFirst = "(";
//         let strSecond = "(";
//         let titleFirst = "(";
//         let titleSecond = "(";
//         let contentQuery = "";
//         let titleQuery = "";
//         for (let i = 0; i < firstKeywordsArr.length; i++) {
//             if (i === (firstKeywordsArr.length - 1)) {
//                 strFirst += `content LIKE "%${firstKeywordsArr[i]}%" `;
//                 strFirst += ") ";
//                 strFirst += `${symbols.shift()} `;
//                 titleFirst += `title LIKE "%${firstKeywordsArr[i]}%" `;
//                 titleFirst += ") ";
//                 titleFirst += `${symbols2.shift()} `;
//                 contentQuery = strFirst;
//                 titleQuery = titleFirst;
//                 continue;
//             }
//             strFirst += `content LIKE "%${firstKeywordsArr[i]}%" `;
//             strFirst += `${symbols.shift()} `;
//             titleFirst += `title LIKE "%${firstKeywordsArr[i]}%" `;
//             titleFirst += `${symbols2.shift()} `;
//         }

//         if (result[0].keywords.split("+")[1].length !== 0) {
//             const secondKeywordsArr = result[0].keywords.split("+")[1].split(",");
//             for (let j = 0; j < secondKeywordsArr.length; j++) {
//                 if (j === (secondKeywordsArr.length - 1)) {
//                     strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
//                     strSecond += ") ";
//                     titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
//                     titleSecond += ") ";
//                     contentQuery = strFirst + strSecond;
//                     titleQuery = titleFirst + titleSecond;
//                     continue;
//                 }
//                 strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
//                 strSecond += `${symbols.shift()} `;
//                 titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
//                 titleSecond += `${symbols2.shift()} `;
//             }
//         }
//         const sqlText = `SELECT * FROM text_table WHERE (${contentQuery} OR ${titleQuery}) AND (time >'${deadline} 00:00') AND emotion < -0.25 order by time DESC;`;
//         const sqlResult = await query(sqlText);
//         console.log(sqlResult);
//         return sqlResult;
//     } catch (err) {
//         console.log("test13");
//         console.log(err);
//         return {};
//     }
// };

const insertAllNegative = async function () {
    try {
        // 選取前十天時間
        const date = new Date();
        date.setDate(date.getDate() - 10);
        let dateInfo = "";
        const dateString = date.getDate().toString();
        if (dateString.length === 1) {
            const dateZero = ("0" + dateString);
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + dateZero;
        } else {
            dateInfo = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
        const sql = "SELECT * FROM keywords_table;";
        const result = await query(sql);
        const data = [];
        for (let i = 0; i < result.length; i++) {
            const keywordsId = result[i].keywords_id;
            const symbols = result[i].symbols.split(",");
            const symbols2 = symbols.map((element) => {
                return element;
            });
            const firstKeywordsArr = result[i].keywords.split("+")[0].split(",");
            let strFirst = "(";
            let strSecond = "(";
            let titleFirst = "(";
            let titleSecond = "(";
            let contentQuery = "";
            let titleQuery = "";
            for (let j = 0; j < firstKeywordsArr.length; j++) {
                if (j === (firstKeywordsArr.length - 1)) {
                    strFirst += `content LIKE "%${firstKeywordsArr[j]}%" `;
                    strFirst += ") ";
                    strFirst += `${symbols.shift()} `;
                    titleFirst += `title LIKE "%${firstKeywordsArr[j]}%" `;
                    titleFirst += ") ";
                    titleFirst += `${symbols2.shift()} `;
                    contentQuery = strFirst;
                    titleQuery = titleFirst;
                    continue;
                }
                strFirst += `content LIKE "%${firstKeywordsArr[j]}%" `;
                strFirst += `${symbols.shift()} `;
                titleFirst += `title LIKE "%${firstKeywordsArr[j]}%" `;
                titleFirst += `${symbols2.shift()} `;
            }

            if (result[i].keywords.split("+")[1].length !== 0) {
                const secondKeywordsArr = result[i].keywords.split("+")[1].split(",");
                for (let j = 0; j < secondKeywordsArr.length; j++) {
                    if (j === (secondKeywordsArr.length - 1)) {
                        strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
                        strSecond += ") ";
                        titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
                        titleSecond += ") ";
                        contentQuery = strFirst + strSecond;
                        titleQuery = titleFirst + titleSecond;
                        continue;
                    }
                    strSecond += `content LIKE "%${secondKeywordsArr[j]}%" `;
                    strSecond += `${symbols.shift()} `;
                    titleSecond += `title LIKE "%${secondKeywordsArr[j]}%" `;
                    titleSecond += `${symbols2.shift()} `;
                }
            }
            // 挑選近十天的負評
            const sqlText = `SELECT id FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (time >'${dateInfo} 00:00') AND emotion < -0.25 order by time DESC;`;
            // const sqlText = `SELECT id FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND emotion < -0.25 order by time DESC;`;
            const sqlResult = await query(sqlText);
            if (sqlResult.length === 0) {
                continue;
            }
            for (const j in sqlResult) {
                const obj = {
                    topic_id: keywordsId,
                    text_id: sqlResult[j].id
                };
                data.push(obj);
            }
        }
        const ansArr = [];
        for (const i in data) {
            const ans = [];
            const topicId = data[i].topic_id;
            const textId = data[i].text_id;
            ans.push(topicId, textId);
            ansArr.push(ans);
        }

        const newArr = [];
        if (ansArr.length !== 0) {
            for (const i in ansArr) {
                const sqlCheck = `SELECT * FROM negative_table WHERE topic_id = ${ansArr[i][0]} AND text_id =${ansArr[i][1]};`;
                const checkResult = await query(sqlCheck);
                if (checkResult.length === 0) {
                    newArr.push(ansArr[i]);
                }
            }
            console.log(newArr);
            if (newArr.length !== 0) {
                const sqlNegative = "INSERT INTO negative_table (topic_id, text_id) VALUES ?";
                await query(sqlNegative, [newArr]);
                const selectQuery = "SELECT user_table.email,company_table.company_number,topic_table.topic_id,negative_table.text_id FROM user_table INNER JOIN company_table ON company_table.company_number = user_table.company_number INNER JOIN topic_table ON topic_table.company_id = company_table.company_id INNER JOIN negative_table ON negative_table.topic_id = topic_table.topic_id;";
                const selectUserInfo = await query(selectQuery);
                return selectUserInfo;
            }
        } else {
            console.log("no negative");
        }
    } catch (err) {
        console.log("test13");
        console.log(err);
        return {};
    }
};

const selectNegative = async function (companyNo, deadline) {
    const sql = "SELECT negative_table.text_id FROM company_table INNER JOIN topic_table ON topic_table.company_id = company_table.company_id INNER JOIN negative_table ON negative_table.topic_id = topic_table.topic_id WHERE company_table.company_number = ?;";
    const result = await query(sql, companyNo);
    if (result.length === 0) {
        return result;
    }
    let idString = "(";
    for (const i in result) {
        if (parseInt(i) === (result.length - 1)) {
            idString += `${result[i].text_id})`;
            break;
        }
        idString += `${result[i].text_id},`;
    }
    const sqlContent = `SELECT * FROM text_table_modified WHERE id IN ${idString} AND (time > '${deadline} 00:00') order by time DESC;`;
    const sqlResult = await query(sqlContent);
    // const ans = [];
    // for (const i in result) {
    //     const sqlContent = `SELECT * FROM text_table WHERE id = ${result[i].text_id};`;
    //     const sqlResult = await query(sqlContent);
    //     ans.push(sqlResult);
    // }
    // // console.log(ans);
    console.log(sqlResult);
    return sqlResult;
};

module.exports = {
    // selectTopic,
    insertAllNegative,
    selectNegative
};
