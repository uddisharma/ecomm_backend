const cron = require("node-cron");
const Seller = require("../model/seller");

//on every 5 seconds : "*/5 * * * * *"

// Cron job to check for expired subscriptions every day at midnight
cron.schedule("0 0 * * *", async () => {
  try {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(endDate.getMonth() - 1);

    const expiredSellers = await Seller.find({
      onboardAt: { $lte: endDate },
      charge: "0",
      isOnboarded: true,
    });

    await Promise.all(
      expiredSellers.map(async (seller) => {
        seller.charge = seller.priorCharge;
        await seller.save();
      })
    );

    console.log("Expired subscriptions processed:", expiredSellers.length);
  } catch (error) {
    console.log(error);
  }
});

// cron.schedule("*/10 * * * * *", () => {
//   const currentTime = new Date().toLocaleString();
//   console.log("Current time:", currentTime);
// });

module.exports = cron;
