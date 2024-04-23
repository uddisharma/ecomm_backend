const { default: axios } = require("axios");
const Url = `https://staging-express.delhivery.com`;
const checkservice = async (req, res) => {
  const apiUrl = `${Url}/c/api/pin-codes/json/`;

  const filterCodes = req.body.pincodes;
  // const token="01d429410b486a229f58279c0d4b6afc5ef728c1"
  // const token = "a197518388fa3bbfb5530d6030acd49a1ed61b2b";
  const { token } = req.body;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  axios
    .get(apiUrl, {
      params: {
        filter_codes: filterCodes,
      },
      headers: headers,
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const trackOrder = async (req, res) => {
  const { token, waybill } = req.body;
  const apiUrl = `${Url}/api/v1/packages/json/?waybill=${waybill}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  axios
    .get(apiUrl, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const orderSlip = async (req, res) => {
  const { token, waybill } = req.body;
  const apiUrl = `${Url}/api/p/packing_slip?wbns=${waybill}&pdf=true`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  axios
    .get(apiUrl, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const pickupRequest = async (req, res) => {
  const { token } = req.body;
  const apiUrl = `${Url}/fm/request/new/`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Token ${token}`,
  };

  const data = {
    pickup_time: "10:00:00",
    pickup_date: "2021-09-04",
    pickup_location: "India",
    expected_package_count: 1,
  };

  axios
    .get(apiUrl, data, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const createwareHouse = async (req, res) => {
  const {
    token,
    data: {
      name,
      email,
      phone,
      address,
      city,
      country,
      pin,
      return_address,
      return_pin,
      return_city,
      return_state,
      return_country,
    },
  } = req.body;

  const apiUrl = `${Url}/api/backend/clientwarehouse/create/`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Token ${token}`,
  };

  const data1 = {
    name,
    email,
    phone,
    address,
    city,
    country,
    pin,
    return_address,
    return_pin,
    return_city,
    return_state,
    return_country,
  };

  axios
    .post(apiUrl, data1, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

const calculateShipping = async (req, res) => {
  const apiUrl = `${Url}/api/kinko/v1/invoice/charges/.json`;
  const { token, d_pin, o_pin, cgm } = req.body;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Token ${token}`,
  };

  const params = {
    md: "E",
    ss: "Delivered",
    d_pin: d_pin,
    o_pin: o_pin,
    cgm: cgm,
    pt: "Pre-paid",
    cod: "0",
  };

  axios
    .get(apiUrl, { headers, params })
    .then((response) => {
      return res.send(response.data);
    })
    .catch((error) => {
      return res.send(error);
    });
};

const createOrder = async (req, res) => {
  const apiUrl = "https://staging-express.delhivery.com/api/cmu/create.json";
  const token = req.body.token;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Token ${token}`,
  };

  const data = {
    format: "json",
    pickup_location: {
      add: "Unit No 7, Plot No 71E to T, GOVERNMENT INDUSTRIAL ESTATE, Behind Garuda Petrol Pump, Charkop, KANDIVALI WEST,Mumbai, Maharashtra, ",
      country: "India",
      pin: "400067",
      phone: "7774855283",
      city: "Mumbai",
      name: "BRILLARE SURFACE",
      state: "Maharastra",
    },
    shipments: [
      {
        country: "India",
        city: "Kohima",
        seller_add: "",
        cod_amount: "0",
        return_phone: "7774855283",
        seller_inv_date: "",
        seller_name: "",
        pin: "797001",
        client: "BRILLARE SURFACE",
        seller_inv: "",
        state: "Nagaland",
        return_name: "Unit No 7,GOVERNMENT INDUSTRIAL ESTATE",
        order: "528323",
        add: "MRH- C 113, Ward no - 18. Below Sumi Church, Merhulietsa School Road",
        payment_mode: "Prepaid",
        quantity: "1",
        return_add:
          "Unit No 7, Plot No 71E to T, GOVERNMENT INDUSTRIAL ESTATE, Behind Garuda Petrol Pump, Charkop, KANDIVALI WEST,Mumbai, Maharashtra, ",
        seller_cst: "",
        seller_tin: "",
        phone: "9603304294",
        total_amount: "750",
        name: "Asen  Jamir",
        return_country: "India",
        return_city: "Mumbai",
        return_state: "Maharastra",
        return_pin: "400067",
      },
    ],
  };

  axios
    .post(apiUrl, data, { headers })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      res.send(error);
    });
};

module.exports = {
  checkservice,
  trackOrder,
  orderSlip,
  pickupRequest,
  createwareHouse,
  calculateShipping,
  createOrder,
};
