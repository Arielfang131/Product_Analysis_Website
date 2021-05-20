const { query } = require("./mysqlcon");

const getKeywords = async function (topicId) {
    const sql = "SELECT keyword FROM keywords_table WHERE topic_id = ?;";
    const keywords = await query(sql, topicId);
    return keywords;
};

const getSQLcontent = async function (keywords, titleQuery, channel, nowTime, deadline) {
    // const sql = "SELECT * FROM text_table WHERE ? order by time DESC limit 10;;;;;;;";
    try {
        const sql = `SELECT * FROM text_table WHERE ((${keywords}) OR (${titleQuery})) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') order by time DESC;`;

        // if (timeValue === "7"){
        //     const beforeSeven =

        // }

        // const result = await query(sql, [keywords]);
        const result = await query(sql);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
        return {};
    }
};

module.exports = {
    getKeywords,
    getSQLcontent
};
