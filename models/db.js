const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const articleConfig = require("./article").init(mongoose);
const noteConfig = require("./note").init(mongoose);

const db = {
    Article: articleConfig.model,
    Note: noteConfig.model,
    connect: connect,
    addArticle: addArticle,
    addArticles: addArticles,
    addUnlessExists: addArticleUnlessExists,
    setArticleSaved: setArticleSaved,
    getNotes: getNotes
};

function connect(url) {
    db.connection = mongoose.connect(url, { useNewUrlParser: true });
    return db;
}

function addArticles(articles) {
    return new Promise(function (resolve, reject) {
        Promise.all(articles.map(addArticleUnlessExists))
            .then(resolve)
            .catch(reject);
    });
}

function addArticle(articleData) {
    return new Promise(function (resolve, reject) {
        if (typeof articleData.saved === "undefined") {
            articleData.saved = false;
        }

        db.Article.create(articleData, function (errors, addedArticle) {
            if (errors) {
                return reject(errors);
            } else {
                return resolve(addedArticle);
            }
        });
    });
}

function addArticleUnlessExists(articleData) {
    return new Promise(function (resolve, reject) {
        db.Article.find({ url: articleData.url }, function (errors, existing) {
            if (errors) {
                console.log("ARTICLE:ERROR", articleData.url);
                console.error(errors);
                return reject(errors);
            } else if (existing.length > 0) {
                console.log("ARTICLE:EXISTS", articleData.url);
                return resolve(existing);
            }

            console.log("ARTICLE:CREATED", articleData.url);

            return addArticle(articleData)
                .then(resolve)
                .catch(reject);
        });
    });
}

function setArticleSaved(id, saved) {
    return new Promise(function (resolve, reject) {
        db.Article.findByIdAndUpdate(id, { saved: saved }, function (errors, savedArticle) {
            if (errors) return reject(errors);
            console.log(saved ? "ARTICLE:SAVED" : "ARTICLE:UNSAVED", savedArticle.headline);
            return resolve(savedArticle);
        });
    });
}

function getNotes(articleId) {
    return new Promise(function (resolve, reject) {
        db.Note.find({ articleId: articleId }, function (errors, notes) {
            if (errors) return reject(errors);
            return resolve(notes);
        });
    });
}

module.exports = db;