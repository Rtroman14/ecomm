const express = require("express");
const cartsRepo = require("../repositories/carts");
const productsRepo = require("../repositories/products");
const cartShowTemplate = require("../views/carts/show");

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
    res.redirect("/cart");
});

// Receive a GET request to show all items in cart
router.get("/cart", async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect("/");
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    // Episode 437
    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }

    res.send(cartShowTemplate({ items: cart.items }));
});

// Receive a POST request to delete an item from the cart
router.post("/cart/products/delete", async (req, res) => {
    const { itemId } = req.body;
    const cart = await cartsRepo.getOne(req.session.cartId);

    const items = cart.items.filter((item) => item.id !== itemId);

    await cartsRepo.update(req.session.cartId, { items });

    res.redirect("/cart");
});

module.exports = router;

// Cart object is as follows:
// {
//     items: [
//       { id: '62b582ba', quantity: 3, product: [Object] },
//       { id: 'ac3d7258', quantity: 1, product: [Object] },
//       { id: 'e7fccbd5', quantity: 1, product: [Object] }
//     ],
//     id: '3a85565a'
//   }
