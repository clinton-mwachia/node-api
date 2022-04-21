const expressjwt = require("express-jwt");

function authjwt() {
  const secret = process.env.SECRET;
  const API = process.env.API_URL;
  return expressjwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      `${API}/user/login`,
      `${API}/user/login/`,
      `${API}/user/register`,
      `${API}/user/register/`,
    ],
  });
}

module.exports = authjwt;
