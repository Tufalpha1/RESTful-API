"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
mongoose_1.default.connect('mongodb://localhost:27017/wikiDB');
app.set('view engine', 'ejs');
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static('public'));
const articleSchema = new mongoose_1.default.Schema({
    title: String,
    content: String
});
const Article = mongoose_1.default.model('Article', articleSchema);
app.get('/', (req, res, next) => {
    res.send('Hello');
});
//requests targeting all articles
app.route('/articles')
    .get((req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        }
        else {
            res.send(err);
        }
    });
})
    .post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if (!err) {
            console.log('Successfully added an article');
        }
        else {
            console.log(err);
        }
    });
})
    .delete((req, res) => {
    Article.deleteMany({}, (err) => {
        if (!err) {
            res.send('Successfully deleted all the articles');
        }
        else {
            res.send(err);
        }
    });
});
//requests targeting a specific article
app.route('/articles/:articleTitle')
    .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
        if (foundArticle) {
            res.send(foundArticle);
        }
        else {
            res.send('No articles matching that title was found!');
        }
    });
})
    .put((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }, (err) => {
        if (!err) {
            res.send('Successfully updated article');
        }
        else {
            res.send(err);
        }
    });
})
    .patch((req, res) => {
    Article.updateOne({ title: req.params.articleTitle }, { $set: { content: req.body.content }
    }, (err) => {
        if (!err) {
            res.send('Successfully updated(patched) article');
        }
        else {
            res.send(err);
        }
    });
})
    .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
        if (!err) {
            res.send('Successfully deleted the article');
        }
        else {
            res.send(err);
        }
    });
});
app.listen(3000, () => {
    console.log('Server started running on port 3000');
});
