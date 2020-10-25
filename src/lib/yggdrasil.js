const axios = require("axios");

exports.authenticate = async (email, password, raw = false) => {
  const json = {
      agent: { name: "Minecraft", version: 1 },
      username: email,
      password: password,
      headers: {"Content-Type": "application/json"}
  }

  try{
    const req = await axios.post("https://authserver.mojang.com/authenticate", json);
    if (raw) return req.data;
    return {token: req.data.accessToken, uuid: req.data.selectedProfile.id, username: req.data.selectedProfile.name};
  } catch (err) {
    return err.response;
  }

}

exports.refresh = async (accessToken, clientToken, id, name) => {
  const json = {
    accessToken: accessToken,
    clientToken: clientToken,
    selectedProfile: {
        id: id,
        name: name
    },
    headers: {"Content-Type": "application/json"}
  }

  try{
    const req = await axios.post("https://authserver.mojang.com/refresh", json);
    return req.data;
  } catch (err) {
    return err.response;
  }
}


exports.validate = async (token) => {
  const json = {
    accessToken: token,
    headers: {"Content-Type": "application/json"}
  }
  try{
    const req = await axios.post("https://authserver.mojang.com/validate", json);
    if (req.status != 204) return false;
    return true;
  } catch (err) {
    return false;
  }
}
