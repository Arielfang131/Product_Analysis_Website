const { query } = require("./mysqlcon");

const sqlPositiveCount = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion > 0.25;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test14");
        console.log(err);
        return {};
    }
};

const sqlNeutralCount = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion BETWEEN '-0.25' AND '0.25';`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test15");
        console.log(err);
        return {};
    }
};

const sqlNegativeCount = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion < -0.25;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test16");
        console.log(err);
        return {};
    }
};

const sqlPositive = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT * FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion > 0.25 order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test14");
        console.log(err);
        return {};
    }
};

const sqlNeutral = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT * FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion BETWEEN '-0.25' AND 0.25 order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test15");
        console.log(err);
        return {};
    }
};

const sqlNegative = async function (contentQuery, titleQuery, channel, nowTime, deadline) {
    try {
        const sql = `SELECT * FROM text_table_modified WHERE (${contentQuery} OR ${titleQuery}) AND (${channel}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion < -0.25 order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test16");
        console.log(err);
        return {};
    }
};

module.exports = {
    sqlPositiveCount,
    sqlNeutralCount,
    sqlNegativeCount,
    sqlPositive,
    sqlNeutral,
    sqlNegative
};
