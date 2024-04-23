const axios = require("axios");
const Seller = require("../../../model/seller");

function findShipmentComapanyWithLowCharge(data) {
  if (!data || data.length === 0) {
    return null;
  }
  let minCharge = Number.POSITIVE_INFINITY;
  let maxCharge = Number.NEGATIVE_INFINITY;
  let minChargeItem = null;
  for (const item of data) {
    const freightCharge = item.freight_charges;

    if (freightCharge < minCharge) {
      minCharge = freightCharge;
      minChargeItem = item;
    }

    if (freightCharge > maxCharge) {
      maxCharge = freightCharge;
      maxChargeItem = item;
    }
  }
  return minChargeItem;
}

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const data = JSON.stringify({
      email: email,
      password: password,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.nimbuspost.com/v1/users/login",
      headers: {
        "content-type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.json(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.json(error);
      });
  } catch (error) {
    res.json({ error });
  }
};
const CreateShipment = async (req, res) => {
  const {
    order_number,
    shipping_charges,
    discount,
    cod_charges,
    payment_type,
    order_amount,
    package_weight,
    package_length,
    package_breadth,
    package_height,
    consignee: {
      u_name,
      u_address,
      u_address_2,
      u_city,
      u_state,
      u_pincode,
      u_phone,
    },
    pickup: {
      warehouse_name,
      name,
      address,
      address_2,
      city,
      state,
      pincode,
      phone,
    },
    order_items: [{ p_name, qty, price, sku }],
  } = req.body;
  try {
    const data = JSON.stringify({
      order_number,
      shipping_charges,
      discount,
      cod_charges,
      payment_type,
      order_amount,
      package_weight,
      package_length,
      package_breadth,
      package_height,
      consignee: {
        name: u_name,
        address: u_address,
        address_2: u_address_2,
        city: u_city,
        state: u_state,
        pincode: u_pincode,
        phone: u_phone,
      },
      pickup: {
        warehouse_name,
        name,
        address,
        address_2,
        city,
        state,
        pincode,
        phone,
      },
      order_items: [
        {
          name: p_name,
          qty,
          price,
          sku,
        },
      ],
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.nimbuspost.com/v1/shipments",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.json(error);
  }
};
const TrackOrder = async (req, res) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.nimbuspost.com/v1/shipments/track/${req.body.awb}`,
    headers: {},
  };

  axios(config)
    .then(function (response) {
      res.json(JSON.stringify(response.data));
    })
    .catch(function (error) {
      res.json({ error });
    });
};
const TrackBulkOrders = async (req, res) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://api.nimbuspost.com/v1/shipments/track/bulk`,
    data: req.body.awb, //Array
    headers: {
      Authorization: `Bearer ${req.body.token}`,
    },
  };

  axios(config)
    .then(function (response) {
      res.json(JSON.stringify(response.data));
    })
    .catch(function (error) {
      res.json({ error });
    });
};
const Manifest = async (req, res) => {
  try {
    const data = JSON.stringify({
      awbs: req.body.awbs, //Array
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.nimbuspost.com/v1/shipments/manifest",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
};
const CancelShipment = async (req, res) => {
  try {
    const data = JSON.stringify({
      awb: req.body.awb,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.nimbuspost.com/v1/shipments/cancel",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
};
const CreateHyperLocalShipment = async (req, res) => {
  const {
    order_number,
    shipping_charges,
    discount,
    cod_charges,
    payment_type,
    order_amount,
    package_weight,
    package_length,
    package_breadth,
    package_height,
    request_auto_pickup,
    consignee: {
      u_name,
      u_address,
      u_address_2,
      u_city,
      u_state,
      u_pincode,
      u_phone,
      latitude,
      longitude,
    },
    pickup: {
      warehouse_name,
      name,
      address,
      address_2,
      city,
      state,
      pincode,
      phone,
      p_latitude,
      p_longitude,
    },
    order_items: [{ p_name, qty, price, sku }],
    courier_id,
    is_insurance,
    tags,
  } = req.body;
  try {
    const data = JSON.stringify({
      order_number,
      shipping_charges,
      discount,
      cod_charges,
      payment_type,
      order_amount,
      package_weight,
      package_length,
      package_breadth,
      package_height,
      request_auto_pickup, //yes no
      consignee: {
        name: u_name,
        address: u_address,
        address_2: u_address_2,
        city: u_city,
        state: u_state,
        pincode: u_pincode,
        phone: u_phone,
        latitude,
        longitude,
      },
      pickup: {
        warehouse_name,
        name,
        address,
        address_2,
        city,
        state,
        pincode,
        phone,
        p_latitude,
        p_longitude,
      },
      order_items: [
        {
          name: p_name,
          qty,
          price,
          sku,
        },
      ],
      courier_id,
      is_insurance,
      tags,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.nimbuspost.com/v1/shipments/hyperlocal",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${req.body.token}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
};
const CheckServiceAndRate = async (req, res) => {
  const {
    origin,
    destination,
    payment_type,
    order_amount,
    weight,
    length,
    breadth,
    height,
    token,
  } = req.body;
  var data = JSON.stringify({
    origin,
    destination,
    payment_type,
    order_amount,
    weight,
    length,
    breadth,
    height,
  });
  try {
    const config = {
      method: "post",
      url: "https://api.nimbuspost.com/v1/courier/serviceability",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    axios(config)
      .then(function (response) {
        const data = findShipmentComapanyWithLowCharge(response.data.data);
        res.send(JSON.stringify({ status: response?.data?.status, data }));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
  }
};

const getSellerDetails = async (username) => {
  try {
    const seller = await Seller.findOne({ username }).select(
      "deliverypartner shopaddress charge"
    );
    return seller;
  } catch (error) {
    throw error;
  }
};

const loginToDeliveryRates = async (email, password) => {
  const data = JSON.stringify({ email, password });
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://api.nimbuspost.com/v1/users/login",
    headers: { "Content-Type": "application/json" },
    data,
  };

  try {
    const response = await axios(config);
    return response.data?.data;
  } catch (error) {
    throw error;
  }
};

const checkServiceForRates = async (config) => {
  const data = JSON.stringify(config);

  const axiosConfig = {
    method: "post",
    url: "https://api.nimbuspost.com/v1/courier/serviceability",
    data,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
    },
  };

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getDeliveryRates = async (req, res) => {
  const { seller, token, config } = req.body;
  try {
    const sellerDetails = await getSellerDetails(seller);
    const { shopaddress, deliverypartner, charge } = sellerDetails;
    const { email, password, warehouses } = deliverypartner?.partner || {};
    const [deliveryLogin, ratesResp] = await Promise.all([
      loginToDeliveryRates(email, password),
      checkServiceForRates({ ...config, origin: shopaddress?.pincode, token }),
    ]);
    if (ratesResp?.status === false) {
      const newToken = await loginToDeliveryRates(email, password);
      const retryRatesResp = await checkServiceForRates({
        ...config,
        token: newToken,
      });
      const response = {
        token: newToken,
        warehouses,
        charge,
        shopaddress,
        personalDelivery: deliverypartner?.personal,
        rates: retryRatesResp,
      };

      res.status(200).json({ data: response });
    } else {
      const response = {
        token: deliveryLogin,
        warehouses,
        charge,
        shopaddress,
        personalDelivery: deliverypartner?.personal,
        rates: ratesResp,
      };

      res.status(200).json({ data: response });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  Login,
  CreateShipment,
  TrackOrder,
  TrackBulkOrders,
  Manifest,
  CancelShipment,
  CreateHyperLocalShipment,
  CheckServiceAndRate,
  getDeliveryRates,
};
