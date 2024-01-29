const { default: axios } = require("axios");

const GetToken = async (req, res) => {
  const { email, password } = req.body;
  try {
    axios
      .post(`https://apiv2.shiprocket.in/v1/external/auth/login`, {
        email,
        password,
      })
      .then((ress) => {
        return res.send(ress.data);
      })
      .catch((err) => {
        return res.send({ message: err.message });
      });
  } catch (error) {
    return res.send({ message: error.message });
  }
};
const checkservice = async (req, res) => {
  const { token } = req.body;
  axios
    .get(
      `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=134113&delivery_postcode=126102&weight=1&cod=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((ress) => {
      const courierCompanies = ress.data.data.available_courier_companies;

      // Sort the array by freight_charge in ascending order
      courierCompanies.sort((a, b) => a.freight_charge - b.freight_charge);

      // Extract and format the required information
      const sortedCourierData = courierCompanies.map((company) => ({
        courier_name: company.courier_name,
        etd: company.etd,
        freight_charge: company.freight_charge,
      }));
      res.send(sortedCourierData);
    })
    .catch((err) => {
      res.send(err);
    });
};

const createOrder = async (req, res) => {
  const { order, token } = req.body;
  axios
    .post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      order,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((resp) => {
      res.send(resp.data);
    })
    .catch((err) => {
      res.send(err);
    });
};

module.exports = {
  GetToken,
  checkservice,
  createOrder,
};
