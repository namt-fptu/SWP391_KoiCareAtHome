import api from "../../config/axios";
export const authApi = {
  login: ({ email, password }) =>
    api.post(
      "Account/login",
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    ),
};
