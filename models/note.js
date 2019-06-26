var noteConfig = {
    schema: undefined,
    model: undefined,
    init: init
};

function init(mongoose) {
    noteConfig.schema = new mongoose.Schema({        
        articleId: mongoose.Schema.ObjectId,
        note: String
    });

    noteConfig.model = mongoose.model('Note', noteConfig.schema);
    return noteConfig;
}

module.exports = noteConfig;