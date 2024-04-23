let User = require("../model/user");
let Product = require("../model/product");
let Category = require("../model/category");
let Order = require("../model/order");
let Banner = require("../model/banner");
let dbService = require(".//dbService");

const deleteUser = async (filter) => {
  try {
    let user = await dbService.findMany(User, filter);
    if (user && user.length) {
      user = user.map((obj) => obj.id);

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.deleteMany(User, userFilter);

      const productFilter = {
        $or: [
          { sellerId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const productCnt = await dbService.deleteMany(Product, productFilter);

      const categoryFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const categoryCnt = await dbService.deleteMany(Category, categoryFilter);

      const orderFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const orderCnt = await dbService.deleteMany(Order, orderFilter);

      const bannerFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { sellerId: { $in: user } },
        ],
      };
      const bannerCnt = await dbService.deleteMany(Banner, bannerFilter);

      let deleted = await dbService.deleteMany(User, filter);
      let response = {
        user: userCnt + deleted,
        product: productCnt,
        category: categoryCnt,
        order: orderCnt,
        banner: bannerCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProduct = async (filter) => {
  try {
    let response = await dbService.deleteMany(Product, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteCategory = async (filter) => {
  try {
    let category = await dbService.findMany(Category, filter);
    if (category && category.length) {
      category = category.map((obj) => obj.id);

      const productFilter = {
        $or: [
          { category: { $in: category } },
          { subCategory: { $in: category } },
        ],
      };
      const productCnt = await dbService.deleteMany(Product, productFilter);

      const categoryFilter = { $or: [{ parentCategoryId: { $in: category } }] };
      const categoryCnt = await dbService.deleteMany(Category, categoryFilter);

      let deleted = await dbService.deleteMany(Category, filter);
      let response = {
        product: productCnt,
        category: categoryCnt + deleted,
      };
      return response;
    } else {
      return { category: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteOrder = async (filter) => {
  try {
    let response = await dbService.deleteMany(Order, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBanner = async (filter) => {
  try {
    let response = await dbService.deleteMany(Banner, filter);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const countUser = async (filter) => {
  try {
    let user = await dbService.findMany(User, filter);
    if (user && user.length) {
      user = user.map((obj) => obj.id);

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.count(User, userFilter);

      const productFilter = {
        $or: [
          { sellerId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const productCnt = await dbService.count(Product, productFilter);

      const categoryFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const categoryCnt = await dbService.count(Category, categoryFilter);

      const orderFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const orderCnt = await dbService.count(Order, orderFilter);

      const bannerFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { sellerId: { $in: user } },
        ],
      };
      const bannerCnt = await dbService.count(Banner, bannerFilter);

      const cartFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const cartCnt = await dbService.count(Cart, cartFilter);

      const countryFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const countryCnt = await dbService.count(Country, countryFilter);

      const cityFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const cityCnt = await dbService.count(City, cityFilter);

      const pincodeFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const pincodeCnt = await dbService.count(Pincode, pincodeFilter);

      const stateFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const stateCnt = await dbService.count(State, stateFilter);

      const walletFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const walletCnt = await dbService.count(Wallet, walletFilter);

      const walletTransactionFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const walletTransactionCnt = await dbService.count(
        WalletTransaction,
        walletTransactionFilter
      );

      const shippingFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const shippingCnt = await dbService.count(Shipping, shippingFilter);

      const userTokensFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userTokensCnt = await dbService.count(UserTokens, userTokensFilter);

      const roleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const roleCnt = await dbService.count(Role, roleFilter);

      const projectRouteFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const projectRouteCnt = await dbService.count(
        ProjectRoute,
        projectRouteFilter
      );

      const routeRoleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const routeRoleCnt = await dbService.count(RouteRole, routeRoleFilter);

      const userRoleFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userRoleCnt = await dbService.count(UserRole, userRoleFilter);

      let response = {
        user: userCnt,
        product: productCnt,
        category: categoryCnt,
        order: orderCnt,
        banner: bannerCnt,
        cart: cartCnt,
        country: countryCnt,
        city: cityCnt,
        pincode: pincodeCnt,
        state: stateCnt,
        wallet: walletCnt,
        walletTransaction: walletTransactionCnt,
        shipping: shippingCnt,
        userTokens: userTokensCnt,
        role: roleCnt,
        projectRoute: projectRouteCnt,
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countProduct = async (filter) => {
  try {
    const productCnt = await dbService.count(Product, filter);
    return { product: productCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countCategory = async (filter) => {
  try {
    let category = await dbService.findMany(Category, filter);
    if (category && category.length) {
      category = category.map((obj) => obj.id);

      const productFilter = {
        $or: [
          { category: { $in: category } },
          { subCategory: { $in: category } },
        ],
      };
      const productCnt = await dbService.count(Product, productFilter);

      const categoryFilter = { $or: [{ parentCategoryId: { $in: category } }] };
      const categoryCnt = await dbService.count(Category, categoryFilter);

      let response = {
        product: productCnt,
        category: categoryCnt,
      };
      return response;
    } else {
      return { category: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const countOrder = async (filter) => {
  try {
    const orderCnt = await dbService.count(Order, filter);
    return { order: orderCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const countBanner = async (filter) => {
  try {
    const bannerCnt = await dbService.count(Banner, filter);
    return { banner: bannerCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter, updateBody) => {
  try {
    let user = await dbService.findMany(User, filter, { id: 1 });
    if (user.length) {
      user = user.map((obj) => obj.id);

      const userFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const userCnt = await dbService.updateMany(User, userFilter, updateBody);

      const productFilter = {
        $or: [
          { sellerId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const productCnt = await dbService.updateMany(
        Product,
        productFilter,
        updateBody
      );

      const categoryFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const categoryCnt = await dbService.updateMany(
        Category,
        categoryFilter,
        updateBody
      );

      const orderFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const orderCnt = await dbService.updateMany(
        Order,
        orderFilter,
        updateBody
      );

      const bannerFilter = {
        $or: [
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
          { sellerId: { $in: user } },
        ],
      };
      const bannerCnt = await dbService.updateMany(
        Banner,
        bannerFilter,
        updateBody
      );

      const cartFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const cartCnt = await dbService.updateMany(Cart, cartFilter, updateBody);

      const countryFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const countryCnt = await dbService.updateMany(
        Country,
        countryFilter,
        updateBody
      );

      const cityFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const cityCnt = await dbService.updateMany(City, cityFilter, updateBody);

      const pincodeFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const pincodeCnt = await dbService.updateMany(
        Pincode,
        pincodeFilter,
        updateBody
      );

      const stateFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const stateCnt = await dbService.updateMany(
        State,
        stateFilter,
        updateBody
      );

      const walletFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const walletCnt = await dbService.updateMany(
        Wallet,
        walletFilter,
        updateBody
      );

      const walletTransactionFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const walletTransactionCnt = await dbService.updateMany(
        WalletTransaction,
        walletTransactionFilter,
        updateBody
      );

      const shippingFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const shippingCnt = await dbService.updateMany(
        Shipping,
        shippingFilter,
        updateBody
      );

      const userTokensFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userTokensCnt = await dbService.updateMany(
        UserTokens,
        userTokensFilter,
        updateBody
      );

      const roleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const roleCnt = await dbService.updateMany(Role, roleFilter, updateBody);

      const projectRouteFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const projectRouteCnt = await dbService.updateMany(
        ProjectRoute,
        projectRouteFilter,
        updateBody
      );

      const routeRoleFilter = {
        $or: [{ addedBy: { $in: user } }, { updatedBy: { $in: user } }],
      };
      const routeRoleCnt = await dbService.updateMany(
        RouteRole,
        routeRoleFilter,
        updateBody
      );

      const userRoleFilter = {
        $or: [
          { userId: { $in: user } },
          { addedBy: { $in: user } },
          { updatedBy: { $in: user } },
        ],
      };
      const userRoleCnt = await dbService.updateMany(
        UserRole,
        userRoleFilter,
        updateBody
      );
      let updated = await dbService.updateMany(User, filter, updateBody);

      let response = {
        user: userCnt + updated,
        product: productCnt,
        category: categoryCnt,
        order: orderCnt,
        banner: bannerCnt,
        cart: cartCnt,
        country: countryCnt,
        city: cityCnt,
        pincode: pincodeCnt,
        state: stateCnt,
        wallet: walletCnt,
        walletTransaction: walletTransactionCnt,
        shipping: shippingCnt,
        userTokens: userTokensCnt,
        role: roleCnt,
        projectRoute: projectRouteCnt,
        routeRole: routeRoleCnt,
        userRole: userRoleCnt,
      };
      return response;
    } else {
      return { user: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteProduct = async (filter, updateBody) => {
  try {
    const productCnt = await dbService.updateMany(Product, filter);
    return { product: productCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteCategory = async (filter, updateBody) => {
  try {
    let category = await dbService.findMany(Category, filter, { id: 1 });
    if (category.length) {
      category = category.map((obj) => obj.id);

      const productFilter = {
        $or: [
          { category: { $in: category } },
          { subCategory: { $in: category } },
        ],
      };
      const productCnt = await dbService.updateMany(
        Product,
        productFilter,
        updateBody
      );

      const categoryFilter = { $or: [{ parentCategoryId: { $in: category } }] };
      const categoryCnt = await dbService.updateMany(
        Category,
        categoryFilter,
        updateBody
      );
      let updated = await dbService.updateMany(Category, filter, updateBody);

      let response = {
        product: productCnt,
        category: categoryCnt + updated,
      };
      return response;
    } else {
      return { category: 0 };
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteOrder = async (filter, updateBody) => {
  try {
    const orderCnt = await dbService.updateMany(Order, filter);
    return { order: orderCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

const softDeleteBanner = async (filter, updateBody) => {
  try {
    const bannerCnt = await dbService.updateMany(Banner, filter);
    return { banner: bannerCnt };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteProduct,
  deleteCategory,
  deleteOrder,
  deleteBanner,
  countUser,
  countProduct,
  countCategory,
  countOrder,
  countBanner,
  softDeleteUser,
  softDeleteProduct,
  softDeleteCategory,
  softDeleteOrder,
  softDeleteBanner,
};
