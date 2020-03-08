const express = require("express");
const mongoose = require("mongoose");
const ShortURLs = require("./models/shortURLs");
const methodOverride=require('method-override');
const app = express();

mongoose.connect(
	"mongodb://localhost/urlShortner",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("CONNECTION ESTABLISHED!");
		}
	}
);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
	const shortURLs = await ShortURLs.find();
	res.render("index", { shortURLs: shortURLs });
});

app.post("/shortURLs", async function(req, res) {
	await ShortURLs.create({ full: req.body.fullURL });
	res.redirect("/");
});

app.delete("/:id", async (req, res) => {
	await ShortURLs.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("DELETED!");
            res.redirect('/');
        }
    });
});
app.get("/:shortUrl", async (req, res) => {
	const shortUrl = await ShortURLs.findOne({ short: req.params.shortUrl });
	if (shortUrl == null) return res.sendStatus(404);
	shortUrl.clicks++;
	shortUrl.save();
	res.redirect(shortUrl.full);
});
app.listen(process.env.PORT || 5000);
