const asyncHandler = require("express-async-handler");
const Quote = require("../models/Quote");
const { sendSuccess } = require("../utils/apiResponse");
// Create a new quote request
const createQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.create(req.body);
  sendSuccess(
    res,
    quote,
    "Quote request submitted successfully",
    201
  );
});
// Get all quote requests
const getAllQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().sort("-createdAt");
  sendSuccess(
    res,
    quotes,
    "Quote requests fetched successfully"
  );
});
// Get one quote request
const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) {
    res.status(404);
    throw new Error("Quote request not found");
  }
  sendSuccess(
    res,
    quote,
    "Quote request fetched successfully"
  );
});
// Update quote status/details
const updateQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!quote) {
    res.status(404);
    throw new Error("Quote request not found");
  }
  sendSuccess(
    res,
    quote,
    "Quote request updated successfully"
  );
});
// Delete a quote request
const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);
  if (!quote) {
    res.status(404);
    throw new Error("Quote request not found");
  }
  sendSuccess(
    res,
    { id: quote._id },
    "Quote request deleted successfully"
  );
});
module.exports = {
  createQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
};