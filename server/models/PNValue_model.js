const { query } = require("./mysqlcon");
const contentListModel = require("../models/content_list_model.js");
require("dotenv").config();
const { EMOTION_NEGATIVE, EMOTION_NEUTRAL, EMOTION_POSITIVE } = process.env;

const sqlPositiveCount = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_POSITIVE};`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test14");
        console.log(err);
        return {};
    }
};

const sqlNeutralCount = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_NEUTRAL};`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test15");
        console.log(err);
        return {};
    }
};

const sqlNegativeCount = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT COUNT(*) FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_NEGATIVE};`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test16");
        console.log(err);
        return {};
    }
};

const sqlPositive = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT * FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_POSITIVE} order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test14");
        console.log(err);
        return {};
    }
};

const sqlNeutral = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT * FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_NEUTRAL} order by time DESC;`;
        const result = await query(sql);
        return result;
    } catch (err) {
        console.log("test15");
        console.log(err);
        return {};
    }
};

const sqlNegative = async function (sqlResult, channels, nowTime, deadline) {
    try {
        const queryInfo = await contentListModel.getSQLSyntax(sqlResult, channels);
        const sql = `SELECT * FROM text_table_modified WHERE (${queryInfo.contentQuery} OR ${queryInfo.titleQuery}) AND (${queryInfo.channelQuery}) AND (time >'${deadline} 00:00' AND time <= '${nowTime} 23:59') AND emotion ${EMOTION_NEGATIVE} order by time DESC;`;
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
