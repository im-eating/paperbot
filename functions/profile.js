const fs = require('fs')
const pf = require('../getJSON/profile.json')

module.exports = {

  updateField: async function (playerID, field, value) {
    if (!playerID) throw new Error('updateField function is missing parameters!')
    if (!field) throw new Error('updateField function is missing parameters!')
    if (typeof(value) != 'boolean' && !value) throw new Error('updateField function is missing parameters!')

    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<pf.length; i++) {
        if (pf[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        switch (field) {
          case 'embed':
            pf[index].embed = value;
          break;
          case 'subheader':
            pf[index].subheader = value;
          break;
          case 'image':
            pf[index].image = value;
          break;
          case 'border':
            pf[index].border = value;
          break;
          case 'badges':
            pf[index].badges = value;
          break;
          case 'pfp':
            pf[index].pfp = value;
          default:
          return resolve('Error: wrong field type')
          break;
        }
        fs.writeFile("./paperbot/getJSON/profile.json", JSON.stringify(pf), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: playerID
        })
      } else {
        //create new
        switch (field) {
          case 'embed':
            pf.push({"id": playerID, "embed": value, "subheader": "paper scraps", "pfp": 0, "image": "none", "badges": 1, "border": 0})
          break;
          case 'subheader':
            pf.push({"id": playerID, "embed": 0, "subheader": value, "pfp": 0, "image": "none", "badges": 1, "border": 0})
          break;
          case 'image':
            pf.push({"id": playerID, "embed": 0, "subheader": "paper scraps", "pfp": 0, "image": value, "badges": 1, "border": 0})
          break;
          case 'border':
            pf.push({"id": playerID, "embed": 0, "subheader": "paper scraps", "pfp": 0, "image": "none", "badges": 1, "border": value})
          break;
          case 'badges':
            pf.push({"id": playerID, "embed": 0, "subheader": "paper scraps", "pfp": 0, "image": "none", "badges": value, "border": 0})
          break;
          case 'pfp':
            pf.push({"id": playerID, "embed": 0, "subheader": "paper scraps", "pfp": 1, "image": "none", "badges": 1, "border": 0})
          break;
          default:
          return resolve('Error: wrong field type')
          break;
        }
        fs.writeFile("./paperbot/getJSON/profile.json", JSON.stringify(pf), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: playerID
        })
      }


    });
  },

  fetchProfile: async function (playerID) {
    if (!playerID) throw new Error('fetchProfile function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<pf.length; i++) {
        if (pf[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {

        return resolve({
          userid: playerID,
          embed: pf[index].embed,
          subheader: pf[index].subheader,
          pfp: pf[index].pfp,
          image: pf[index].image,
          badges: pf[index].badges,
          border: pf[index].border
        })
      } else {
        pf.push({"id": playerID, "embed": 0, "subheader": "paper scraps", "pfp": 0, "image": "none", "badges": 1, "border": 0})
        fs.writeFile("./paperbot/getJSON/profile.json", JSON.stringify(pf), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: playerID,
          embed: 0,
          subheader: "paper scraps",
          pfp: 0,
          image: "none",
          badges: 1,
          border: 0
        })
      }

    });
  }
}
