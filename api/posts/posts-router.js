// posts için gerekli routerları buraya yazın

const express = require("express");
const postsModel = require("./posts-model");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allPosts = await postsModel.find();
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await postsModel.findById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, contents } = req.body;
    if (!title || !contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      const insertedId = await postsModel.insert({
        title: title,
        contents: contents,
      });
      const insertedPost = await postsModel.findById(insertedId.id);
      res.status(201).json(insertedPost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    let postExist = await postsModel.findById(req.params.id);
    if (postExist) {
      let update = req.body;
      if (update.title && update.contents) {
        await postsModel.update(req.params.id, update);

        let currentPosts = await postsModel.findById(req.params.id);
        res.json(currentPosts);
      } else {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      }
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let post = await postsModel.findById(req.params.id);
    if (post) {
      await postsModel.remove(req.params.id);
      res.json(post);
    } else {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    }
  } catch (err) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let post = await postsModel.findById(req.params.id);
    if (post) {
      let comments = await postsModel.findPostComments(req.params.id);
      res.json(comments);
    } else {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    }
  } catch (err) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
