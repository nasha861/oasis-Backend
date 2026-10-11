const express = require("express");
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} = require("../controllers/quoteController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");
const router = express.Router();
// Public: submit a quote request
router.post("/", createQuote);
// Admin: view all quote requests
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllQuotes
);
// Admin: view one quote request
router.get(
  "/:id",
  protect,
  authorize("admin"),
  getQuoteById
);
// Admin: update quote
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateQuote
);
// Admin: delete quote
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteQuote
);
module.exports = router;