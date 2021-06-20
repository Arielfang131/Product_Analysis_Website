const assert = require("assert");
const memberModel = require("../server/models/member_model");
const contentListModel = require("../server/models/content_list_model");
const keywordsModel = require("../server/models/keywords_model");

describe("signIn test", function () {
    it("signIn test", async function () {
        const email = "sunny@gmail.com";
        const response = await memberModel.selectUserInfo(email);
        assert.equal(response[0].user_id, 4);
        assert.equal(response[0].company_number, 9487);
        assert.equal(response[0].user_name, "sunny");
        assert.equal(response[0].password, "$2b$10$oai1MBysEKhrlwQe/VTXbuVVVO5pG5jZn2TxO/.f83KPJMdoWlsQO");
        assert.equal(response[0].admin, "yes");
    });
});

describe("select topic", function () {
    it("select topic", async function () {
        const companyNo = 9487;
        const response = await contentListModel.selectTopic(companyNo);
        assert.equal(response[0].topic_name, "TKLAB");
        assert.equal(response[1].topic_name, "蜜妮");
        assert.equal(response[2].topic_name, "大沛蜜粉");
    });
});

describe("delete topic and keywords", function () {
    it("delete topic and keywords", async function () {
        const topicId = 307;
        const response = await keywordsModel.deleteTopicAndKeywords(topicId);
        assert.equal(response, true);
    });
});
