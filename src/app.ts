import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import ejs from 'ejs';
import bodyParser from 'body-parser';

const app: Application = express();
mongoose.connect('mongodb://localhost:27017/wikiDB');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.send('Hello');
});

//requests targeting all articles
app.route('/articles')
.get((req: Request, res: Response) =>{
    Article.find({}, (err: any, foundArticles: any) => {
        if(!err){
            res.send(foundArticles);     
        }else{
            res.send(err);
        }
    });
})
.post((req: Request, res: Response) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save((err) => {
        if(!err){
            console.log('Successfully added an article');
        }else{
            console.log(err);
        }
    });
})
.delete((req: Request, res: Response) => {
    Article.deleteMany({}, (err) => {
       if(!err){
        res.send('Successfully deleted all the articles');
       }else{
        res.send(err);
       }  
    });
});

//requests targeting a specific article
app.route('/articles/:articleTitle')
.get((req: Request, res: Response) => {
    Article.findOne({title: req.params.articleTitle}, (err: any, foundArticle: any) => {
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send('No articles matching that title was found!');
        }
    });
})
.put((req: Request, res: Response) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (err: any) => {
            if(!err){
                res.send('Successfully updated article');
            }
            else{
                res.send(err);
            }
    });
})
.patch((req: Request, res: Response) => {
    Article.updateOne(
        {title: req.params.articleTitle},
        {$set:
            {content: req.body.content}
        },
        (err: any) => {
            if(!err){
                res.send('Successfully updated(patched) article');
            }else{
                res.send(err);
            }
        });
})
.delete((req: Request, res: Response) => {
    Article.deleteOne({title: req.params.articleTitle}, (err) => {
        if(!err){
            res.send('Successfully deleted the article');
        }else{
            res.send(err);
        }
    });
});

app.listen(3000, ()=>{
    console.log('Server started running on port 3000');
});