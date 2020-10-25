const axios = require("axios");

exports.check = async () => {
  try{
    const req = await axios.get("https://status.mojang.com/check");
    return req.data;
  } catch (err) {
    return err.response.data;
  }
}

exports.nameToUuid = async (names) => {
  if (!Array.isArray(names)) names = [names];
  try{
    const req = await axios.post("https://api.mojang.com/profiles/minecraft", names);
    return req.data;
  } catch (err) {
    return err.response;
  }
}

exports.uuidAt = async (username, time = 0) => {
  try{
    const req = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+username+"?at="+time);
    if (req.status == 204) return null;
    return req.data.id;
  } catch (err) {
    return null;
  }
}

exports.nameHistory = async (uuid) => {
  try{
    const req = await axios.get("https://api.mojang.com/user/profiles/"+uuid+"/names");
    return req.data;
  } catch (err) {
    return null;
  }
}

exports.profile = async (uuid) => {
  try{
    const req = await axios.get("https://sessionserver.mojang.com/session/minecraft/profile/"+uuid);
    return req.data;
  } catch (err) {
    return err.response;
  }
}

exports.changeName = async (uuid, password, name, token) => {
  try{
    const req = await axios.post("https://api.mojang.com/user/profile/"+uuid+"/name", {name: name, password: password}, {headers: {'Authorization':'Bearer '+token}});
    return req.status;
  } catch (err) {
    return err.response.status;
  }
}

exports.reserveName = async (name, token) => {
  try{
    const req = await axios.put("https://api.mojang.com/user/profile/agent/minecraft/name/"+name, {headers:{'Authorization':'Bearer '+token}});
    return req.status;
  } catch (err) {
    return err.response.status;
  }
}

exports.needSecurity = async (token) => {
  try{
    const req = await axios.get("https://api.mojang.com/user/security/challenges", {headers:{'Authorization':'Bearer '+token}});
    if (req.status == 204) return false;
    return true;
  } catch (err) {
    return true;
  }
}

exports.getSecurity = async (token) => {
  try{
    const req = await axios.get("https://api.mojang.com/user/security/challenges", {headers: {"Authorization": "Bearer "+ token}});
    return req.data;
  } catch (err) {
    return null;
  }
}

exports.answerSecurity = async (token, questions) => {
  try{
    const getQuestions = await axios.get("https://api.mojang.com/user/security/challenges", {headers: {"Authorization": "Bearer "+ token}});

    if (getQuestions.data.length == 0) return 200;

    let answer = [];
    for(let i=0; i<3; i++){
      answer.push({
        id: getQuestions.data[i].answer.id,
        answer: questions[i]
      });
    }

    const answerPost = await axios.post("https://api.mojang.com/user/security/location",answer,{headers: {"Authorization": "Bearer "+token}});
    return 200;
  } catch (err) {
    return err.response.status;
  }
}
