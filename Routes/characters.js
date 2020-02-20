require("dotenv").config();
md5 = require("js-md5");
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/characters", async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || 100;
  const name = req.query.name || null;
  const title = req.query.title || null;

  const publickey = process.env.YOUR_PUBLIC_KEY;
  const privatekey = process.env.YOUR_PRIVATE_KEY;
  const date = new Date();
  const ts = date.getTime();
  const stringToHash = ts + privatekey + publickey;
  const hash = md5(stringToHash);

  const url = `http://gateway.marvel.com/v1/public/characters?orderBy=name&limit=${limit}&offset=${offset}&ts=${ts}&apikey=${publickey}&hash=${hash}`;

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

module.exports = router;
