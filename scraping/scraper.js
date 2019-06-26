var cheerio = require("cheerio");
var axios = require("axios");

function scrape(url) {
    return axios.get(url).then(function (scrapeResponse) {
        var $ = cheerio.load(scrapeResponse.data);
        var articles = [];

        $("article").each(function (index, article) {
            var headline = $(article).find(".article-name")[0].children[0].data;
            var summary = $(article).find(".synopsis")[0].children[0].data;
            var url = $(article.parent).attr('href');

            articles.push({              
                url: url,
                headline: headline,
                summary: summary
            });
        });

        return articles;
    });
}

module.exports = {
    scrape: scrape
};