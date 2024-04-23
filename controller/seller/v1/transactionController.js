const WalletTransaction = require("../../../model/transactions");
const dbService = require("../../../utils/dbService");
const NodeCache = require("node-cache");
const myCache = new NodeCache({
  stdTTL: 600,
});

const getWalletTransaction = async (req, res) => {
  try {
    // const chachedtransaction = myCache.get("getWalletTransactionseller");

    // if (chachedtransaction) {
    //   return res.success({ data: JSON.parse(chachedtransaction) });
    // } else {
    const foundWalletTransaction = await WalletTransaction?.findById(
      req.params.id
    ).populate({
      path: "seller",
      select: "username shopname shopaddress email",
    });
    if (!foundWalletTransaction) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "getWalletTransactionseller",
    //   JSON.stringify(foundWalletTransaction),
    //   500
    // );
    return res.success({ data: foundWalletTransaction });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

const findSellersTransaction = async (req, res) => {
  try {
    let options = {};
    if (req.query.page) {
      options = {
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        skip: (Number(req.query.page) - 1) * Number(req.query.limit),
        sort: "-createdAt",
      };
    }
    const query = {
      seller: req.user.id,
      isDeleted: req.query.isDeleted,
    };

    // const chachedtransactions = myCache.get("findSellersTransactionseller");

    // if (chachedtransactions) {
    //   return res.success({ data: JSON.parse(chachedtransactions) });
    // } else {
    let foundTransactions = await dbService.paginate(
      WalletTransaction,
      query,
      options
    );

    if (
      !foundTransactions ||
      !foundTransactions.data ||
      !foundTransactions.data.length
    ) {
      return res.recordNotFound();
    }
    // myCache.set(
    //   "findSellersTransactionseller",
    //   JSON.stringify(foundTransactions),
    //   500
    // );
    return res.success({ data: foundTransactions });
    // }
  } catch (error) {
    return res.internalServerError({ message: error.message });
  }
};

module.exports = {
  getWalletTransaction,
  findSellersTransaction,
};
