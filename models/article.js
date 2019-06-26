var articleConfig = {
    schema: undefined,
    model: undefined,
    init: init
};

function init(mongoose) {
    articleConfig.schema = new mongoose.Schema({        
        url: String,
        headline: String,
        summary: String,
        saved: Boolean
    });

    articleConfig.model = mongoose.model('Article', articleConfig.schema);
    return articleConfig;
}

module.exports = articleConfig;