const express = require("express");
const cartsRepo = require("../repositories/carts");

const router = express.Router();

router.post("/cart/products", async (req, res) => {
    // Episode 434 - 435
    // Figure out if cart
    let cart;
    if (!req.session.cartId) {
        // We don't have a cart, we need to create one
        // and store cart id on req.session.cartId property
        cart = await cartsRepo.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        // We have a cart! Let's get it from the repository
        cart = await cartsRepo.getOne(req.session.cartId);
    }

    // Either incriment existing product quantity
    // OR add new prodcut to cart array
    const existingItem = cart.items.find((item) => item.id === req.body.productId);
    if (existingItem) {
        // Incriment item if item exists
        existingItem.quantity++;
    } else {
        // Add product to cart
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }

    await cartsRepo.update(cart.id, {
        items: cart.items,
    });
    res.send("Product added to cart");
});

module.exports = router;
