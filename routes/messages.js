

/** Routes for messages with message.ly. */

const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const Message = require("../models/message")
const { ensureLoggedIn } = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        let msg = await Message.get(id);

        if ((req.user.username !== msg.from_user.username) && (req.user.username !== msg.to_user.username)) {
            throw new ExpressError("Unauthorized", 401);
        }

        return res.json({ message: msg })

    } catch (e) {
        return next(e)
    }
})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const { to_username, body } = req.body;
        const from_username = req.user.username
        if (from_username === to_username) {
            throw new ExpressError("Unauthorized", 401);
        } else {
            let msg = await Message.create({ from_username, to_username, body });
            return res.json({ message: msg })
        }

    } catch (e) {
        return next(e)
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', async (req, res, next) => {
    try {
        const { id } = req.params;
        let msg = await Message.get(id);

        if (req.user.username === msg.to_user.username) {
            const result = await Message.markRead(id)
            return res.json({ result })
        } else {
            throw new ExpressError("Unauthorized", 401);

        }
    } catch (e) {
        return next(e)
    }
})


module.exports = router;