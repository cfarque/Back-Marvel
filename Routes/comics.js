require("dotenv").config();
const md5 = require("js-md5");
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  const publickey = process.env.YOUR_PUBLIC_KEY;
  const privatekey = process.env.YOUR_PRIVATE_KEY;
  const date = new Date();
  const ts = date.getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  const limit = req.query.limit || 100;

  const offset = req.query.offset || 0;

  const name = req.query.name || null;
  const title = req.query.title || null;

  const url = `http://gateway.marvel.com/v1/public/comics?orderBy=title&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publickey}&hash=${hash}`;
  const urlSearchTitle = `http://gateway.marvel.com/v1/public/comics?&orderBy=title&titleStartsWith=${title}&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publickey}&hash=${hash}`;
  const urlSearchCharacter = `http://gateway.marvel.com/v1/public/characters?nameStartsWith=${name}&orderBy=name&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publickey}&hash=${hash}`;

  try {
    if (req.query.title) {
      const response = await axios.get(urlSearchTitle);
      res.json(response.data);
    } else if (req.query.name) {
      const response = await axios.get(urlSearchCharacter);
      res.json(response.data);
    } else {
      const response = await axios.get(url);
      res.json(response.data);
    }
  } catch (error) {
    res.status(error).json("raté");
  }
});

router.get("/comics:id", async (req, res) => {
  const publickey = process.env.YOUR_PUBLIC_KEY;
  const privatekey = process.env.YOUR_PRIVATE_KEY;
  const date = new Date();
  const ts = date.getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);
  // var url = "http://gateway.marvel.com:443/v1/public/characters/1009215/comics?orderBy=focDate" + "&ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
  const url =
    "http://gateway.marvel.com/v1/public/characters/" +
    req.params.id +
    "?" +
    "&ts=" +
    ts +
    "&apikey=" +
    publickey +
    "&hash=" +
    hash;
  try {
    const response = await axios.get(url);
    const comics = response.data.data.results;
    res.json(comics);
  } catch (error) {
    res.status(error).json("raté");
  }
});

module.exports = router;
