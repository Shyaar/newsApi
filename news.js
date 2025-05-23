const express = require("express");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 2300;
app.use(express.json());

app.get("/", (req, res) => res.send("Welcome to all News Network"));
app.listen(port);

let news = [];

function genId(array) {
  return array.length + 1;
}

function genDate() {
  let date = new Date();

  return date;
}

genDate();

app.post("/api/create/news", (req, res) => {
  const { author, title, content, description, sources, image } = req.body;
  // console.log(req.body)

  if (!author || !title || !content || !description || !sources || !image) {
    console.log("cant find");
    return res.send({
      message: "fields cannot be empty",
    });
  }

  const exists = news.find((news) => news.title == title);
  if (exists) {
    return res.status(302).send({
      message: `news data already exixt`,
      data: exists,
    });
  }

  let newNews = {
    id: genId(news),
    author: author,
    title: title,
    content: content,
    description: description,
    sources: sources,
    image: image,
    createdDate: genDate(),
    updated: genDate(),
    isDeleted: false,
  };

  news.push(newNews);

  // console.log(news)

  res.status(200).send({
    message: "news created successfully",
    createdNews: newNews,
  });
});

app.get("/api/news", (req, res) => {
  if (news.length == 0) {
    return res.status(404).send({
      message: "No news available",
    });
  }

  const available = news.filter((news) => news.isDeleted === false);
  res.status(200).send({
    message: "All News retrieved successfully",
    data: available,
  });
});

app.get("/api/news/:id", (req, res) => {
  const { id } = req.params;

  if (news.length == 0) {
    return res.status(404).send({
      message: "No news available",
    });
  }

  const found = news.find((news) => news.id == id);
  console.log(found);
  res.status(200).send({
    message: "data fetched successfully",
    data: found,
  });
});

app.delete("/api/news/:id", (req, res) => {
  const { id } = req.params;

  if (news.length == 0) {
    return res.status(404).send({
      message: "No news available",
    });
  }

  const found = news.find((news) => news.id == id);
  const indexOf = news.indexOf(found);
  news[indexOf].isDeleted = true;
  // news = news.filter((news) => news.id !== found.id);
  // console.log(found);

  // console.log(`this is new news state`, news);
  deleted = { ...found };
  // console.log(`this is deleted`, deleted);

  res.status(200).send({
    message: "data deleted successfully",
    news: news,
    data: deleted,
  });
  res.end();
});

app.patch("/api/edit/:id", (req, res) => {
  const { id } = req.params;
  const { author, title, content, description, sources, image } = req.body;

  console.log(id);
  console.log(req.body);

  const found = news.find((news) => news.id == id);
  const unEdited = { ...found };
  const indexOfNews = news.indexOf(found);

  console.log(found);
  console.log(indexOfNews);

  if (author) {
    news[indexOfNews].author = req.body.author;
  }
  if (title) {
    news[indexOfNews].title = req.body.title;
  }
  if (content) {
    news[indexOfNews].content = req.body.content;
  }
  if (description) {
    news[indexOfNews].description = req.body.description;
  }
  if (sources) {
    news[indexOfNews].sources = req.body.sources;
  }
  if (image) {
    news[indexOfNews].image = req.body.image;
  }

  news[indexOfNews].updated = genDate();

  res.status(200).send({
    message: "data fetched successfully",
    previous: unEdited,
    edited: found,
  });
});

app.get("/api/get-by-author", (req, res) => {
  const { author } = req.query;
  if (news.length == 0) {
    return res.status(404).send({
      message: "No news available",
    });
  }

  const filteredNews = news.filter((news) => news.author == author);
  console.log(filteredNews);

  if (filteredNews) {
    res.status(200).send({
      message: `News written by this author: ${author}`,
      data: filteredNews,
    });
  }

  res.status(404).send({
    message: `${author} Not found`
  });
});
