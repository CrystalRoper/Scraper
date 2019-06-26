var scraper = require("../scraping/scraper");

module.exports = function (scrapeUrl, app, router, db) {
    router.get('/', function (req, res) {
        db.Article.find({ saved: false }, function (error, documents) {
            if (error) console.error(error);

            res.render('index', {
                layout: "main",
                articles: documents
            });
        });
    });

    router.get('/saved', function (req, res) {
        db.Article.find({ saved: true }, function (error, documents) {
            res.render('index', {
                layout: "main",
                script: "saveNotes.js",
                articles: documents
            });
        });
    });

    router.get("/save", function (req, res) {
        db.setArticleSaved(req.query.id, true).then(function () {
            res.redirect("/");
        });
    });

    router.get("/unsave", function (req, res) {
        db.setArticleSaved(req.query.id, false).then(function () {
            res.redirect("/saved");
        });
    });

    router.get("/scrape", function (req, res) {
        scraper.scrape(scrapeUrl).then(function (articles) {
            db.addArticles(articles).then(function () {
                res.redirect("/");
            });
        });
    });

    router.get("/clear", function (req, res) {
        console.log("ARTICLE:CLEAR");

        db.Article.deleteMany({ saved: false }, function (errors) {
            if (errors) console.error(errors);
            res.redirect("/");
        });
    });

    router.post("/note", function (req, res) {
        db.Note.create(req.body, function (errors, addedNote) {
            if (errors) console.error(errors);                       
            console.log("NOTE:CREATED");
            res.json(addedNote);           
        });
    });

    router.post("/notes", function (req, res) {
        db.getNotes(req.body.id).then(function (notes) {            
            res.json(notes);
        });
    });


    router.post("/deletenote", function(req, res){
        db.Note.findOneAndDelete(req.body.noteid, function(errors, result){       
            res.json(result._id);
        });
    });
};