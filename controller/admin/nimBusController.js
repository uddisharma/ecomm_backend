const axios = require("axios");

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
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
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
        res.send(JSON.stringify(response.data));
      })
      .catch(function (error) {
        res.send(error);
      });
  } catch (error) {
    res.send(error);
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
};
