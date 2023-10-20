import { Router } from "express";
import auth from "../middleware/auth.js";
import roleCheck from "../middleware/roleCheck.js";
import User from "../models/User.js";

const router = Router();

router.get("/details", auth, roleCheck(["user"]), (req, res) => {
    res.status(200).json({ message: "user authenticated." });

});

router.get("/my-account", auth, roleCheck(["user"]), (req, res) => {
    res.status(200).json({ message: "user authenticated." });

});



router.get('/isAdmin/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (user.isAdmin) {
        res.status(200).json({
            status: true,
            role: "Admin",
        });
    }

    else {
        res.status(200).json({
            status: false,
            role: "User",
        });
    }

});

router.get("/getId/:id", async (req, res) => {
    const id = req.params.id;
    const usernames = await User.find();
    const username = usernames.filter(e => e.userName == id);
    if (username) {
        res.status(200).json({
            isAdmin: username[0].isAdmin,
        });
    }
});

router.post("/getTypes", async (req, res) => {
    const id = req.body.id;
    const user = await User.findById(id);
    if (user) {
        res.status(200).json(
            user.itemTypes,
        );
    }
});

router.put("/update-types", async (req, res) => {
    const types = req.body.selectedTypes;
    const id = req.body.id;

    try {
        const user = await User.findById(id);

        if (user) {

            user.itemTypes = types;

            await user.save();

            res.status(200).json({ message: "Item types updated successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;