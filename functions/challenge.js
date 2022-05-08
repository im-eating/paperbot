const fs = require('fs')
const ch = require('../getJSON/challengeinfo.json')

module.exports = {

  addChallenge: async function (playerID, challengeID, category) {
    if (!playerID) throw new Error('addChallenge function is missing parameters!')
    if (!challengeID) throw new Error('addChallenge function is missing parameters!')
    if (!category) throw new Error('addChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id == playerID && ch[i].cid == challengeID && ch[i].status == "active") {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        return resolve('active challenge already exists')
      }
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //As January is 0.
      var yyyy = today.getFullYear();
      var date = yyyy + '-' + mm + '-' + dd
      ch.push({"id": playerID, "cid": challengeID, "status": "active", "category": category, "date": date})
      fs.writeFile("./paperbot/getJSON/challengeinfo.json", JSON.stringify(ch), err => {
        if (err) throw err;
        console.log('done')
      })
      return resolve({
        userid: playerID,
        cid: challengeID,
        category: category,
        status: 'active',
        date: date
      })
    });
  },

  fetchChallenge: async function (playerID, challengeID) {
    if (!playerID) throw new Error('fetchChallenge function is missing parameters!')
    if (!challengeID) throw new Error('fetchChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id == playerID && ch[i].cid == challengeID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {

        return resolve({
          pID: ch[index].id,
          cID: ch[index].cid,
          status: ch[index].status,
          category: ch[index].category,
          date: ch[index].date
        })
      } else {
        return resolve('No record of this challenge in database!')
      }

    });
  },

  fetchChallenges: async function (playerID) {
    if (!playerID) throw new Error('fetchChallenges function is missing parameters!')

    return new Promise(async (resolve, error) => {

      var hasId = false
      var index = 0
      var chal = []
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id == playerID && ch[i].status == "active") {
          hasId = true
          chal.push(ch[i])
        }
      }
      if (hasId) {
        return resolve(chal)
      } else {
        return resolve('Player has no active challenges')
      }

    });
  },

  fetchAllChallenges: async function (playerID) {
    if (!playerID) throw new Error('fetchAllChallenges function is missing parameters!')

    return new Promise(async (resolve, error) => {

      var hasId = false
      var index = 0
      var chal = []
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id == playerID && (ch[i].status == "active" || ch[i].status == "inactive")) {
          hasId = true
          chal.push(ch[i])
        }
      }
      if (hasId) {
        return resolve(chal)
      } else {
        return resolve('Player has no active challenges')
      }

    });
  },

  updateChallenge: async function (playerID, challengeID, status) {
    if (!playerID) throw new Error('updateChallenge function is missing parameters!')
    if (!challengeID) throw new Error('updateChallenge function is missing parameters!')
    if (!status) throw new Error('updateChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id == playerID && ch[i].cid == challengeID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        ch[index].status = status;
        fs.writeFile("./paperbot/getJSON/challengeinfo.json", JSON.stringify(ch), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          id: playerID,
          cid: challengeID,
          status: status,
        })
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  },

  resetAllChallenges: async function (playerID) {
    if (!playerID) throw new Error('resetAllChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var index = 0
      var chal = []
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id != playerID) {
          //add all challnges that are not of player to list
          chal.push(ch[i])
        }
        ch.splice(0, 1)
        i--
      }
      for (var i=0; i<chal.length; i++) {
        ch.push(chal[i])
      }
      fs.writeFile("./paperbot/getJSON/challengeinfo.json", JSON.stringify(ch), err => {
        if (err) throw err;
        console.log('reset')
      })
      return resolve('Challenge removed')
    });
  },

  resetAllActiveChallenges: async function (playerID) {
    if (!playerID) throw new Error('resetAllActiveChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var index = 0
      var chal = []
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id != playerID && ch[i].status != "active") {
          //add all challnges that are not of active and of player to list
          chal.push(ch[i])
        }
        ch.splice(0, 1)
        i--
      }
      for (var i=0; i<chal.length; i++) {
        ch.push(chal[i])
      }
      fs.writeFile("./paperbot/getJSON/challengeinfo.json", JSON.stringify(ch), err => {
        if (err) throw err;
        console.log('done')
      })
      return resolve('Challenge removed')
    });
  },

  resetAllInactiveChallenges: async function (playerID) {
    if (!playerID) throw new Error('resetAllActiveChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      var chal = []
      for (var i=0; i<ch.length; i++) {
        if (ch[i].id != playerID && ch[i].status != "inactive") {
          //add all challnges that are not of active and of player to list
          hasId = true
          chal.push(ch[i])
        }
      }
      if (hasId) {
        ch = chal;
        fs.writeFile("./paperbot/getJSON/challengeinfo.json", JSON.stringify(ch), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve('Challenge removed')
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  }

}
