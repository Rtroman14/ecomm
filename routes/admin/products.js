const express = require("express");
const { validationResult } = require("express-validator");
const multer = require("multer"); // package for receiving files

const productsRepo = require("../../repositories/poducts");
const productsNewTemplate = require("../../views/admin/products/new");
const { requireTitle, requirePrice } = require("../admin/validators");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});

router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTemplate({}));
});

router.post(
    "/admin/products/new",
    upload.single("image"),
    [requireTitle, requirePrice],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.send(productsNewTemplate({ errors }));
        }

        const image = req.file.buffer.toString("base64");

        const { title, price } = req.body;
        await productsRepo.create({ title, price, image });

        res.send("Submitted");
    }
);

module.exports = router;
