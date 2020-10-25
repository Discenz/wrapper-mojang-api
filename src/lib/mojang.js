const axios = require("axios");

exports.check = async () => {
    const req = await axios.get("https://status.mojang.com/check");
    return req.data;
}

exports.nameToUuid = async (names) => {
  notArr = false;
  if (!Array.isArray(names)) {
    names = [names];
    notArr = true;
  }
  const req = await axios.post("https://api.mojang.com/profiles/minecraft", names);
  if(notArr) return req.data[0].id;
  return req.data;
}

exports.uuidAt = async (username, time = 0) => {

  if (time instanceof Date) time = Math.floor(time.getTime() / 1000);

  const req = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+username+"?at="+time);
  if (req.status == 204) return null;
  return req.data.id;
}

exports.nameHistory = async (uuid) => {
    const req = await axios.get("https://api.mojang.com/user/profiles/"+uuid+"/names");
    return req.data;
}

exports.profile = async (uuid) => {
  const req = await axios.get("https://sessionserver.mojang.com/session/minecraft/profile/"+uuid);
  return req.data;
}

exports.changeName = async (uuid, password, name, token) => {
  const req = await axios.post("https://api.mojang.com/user/profile/"+uuid+"/name", {name: name, password: password}, {headers: {'Authorization':'Bearer '+token}});
  return req.status;
}

exports.reserveName = async (name, token) => {
    const req = await axios.put("https://api.mojang.com/user/profile/agent/minecraft/name/"+name, {headers:{'Authorization':'Bearer '+token}});
    return req.status;
}

exports.needSecurity = async (token) => {
  const req = await axios.get("https://api.mojang.com/user/security/location", {headers:{'Authorization':'Bearer '+token}});
  if (req.status == 204) return false;
  return true;
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
