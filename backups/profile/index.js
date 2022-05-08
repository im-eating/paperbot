const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Prof123', '13243546576879800000', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const PRDB = sequelize.define('Profiles', {
  pID: Sequelize.STRING,
  embed: Sequelize.BOOLEAN,
  authorName: Sequelize.STRING,
  smallpfp: Sequelize.BOOLEAN,
  medpfp: Sequelize.BOOLEAN,
  largepfp: Sequelize.BOOLEAN,
  defaultpfp: Sequelize.BOOLEAN,
  badgeLimit: Sequelize.INTEGER,
  hasBorder: Sequelize.BOOLEAN
});


PRDB.sync()

console.log('\x1b[32m%s\x1b[0m', `Inv DB loaded`);

module.exports = {

  updateField: function(playerID, field, value) {
    return dbQueue.addToQueue({
      "value": this._updateField.bind(this),
      "args": [playerID, field, value]
    });
  },

  _updateField: async function(playerID, field, value) {
    if (!playerID) throw new Error('updateField function is missing parameters!')
    if (!field) throw new Error('updateField function is missing parameters!')
    if (typeof(value) != 'boolean' && !value) throw new Error('updateField function is missing parameters!')

    return new Promise(async (resolve, error) => {
      switch (field) {
        case 'embed':
          var Info = await PRDB.update({
            embed: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'authorName':
          var Info = await PRDB.update({
            authorName: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'smallpfp':
          var Info = await PRDB.update({
            smallpfp: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'medpfp':
          var Info = await PRDB.update({
            medpfp: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'largepfp':
          var Info = await PRDB.update({
            largepfp: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'defaultpfp':
          var Info = await PRDB.update({
            defaultpfp: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'hasBorder':
          var Info = await PRDB.update({
            hasBorder: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        case 'badgeLimit':
          var Info = await PRDB.update({
            badgeLimit: value
          }, {
            where: {
              pID: playerID
            }
          });
        break;
        default:
        return resolve('Error: wrong field type')
        break;
      }
      if (Info > 0) {
        return resolve({
          pID: playerID,
          field: field,
          value: value
        })
      } else {

        try {
          const Info2 = await PRDB.create({
            pID: playerID,
            embed: false,
            authorName: 'paper scraps',
            smallpfp: false,
            medpfp: false,
            largepfp: false,
            badgeLimit: 1,
            hasBorder: false
          });
          return resolve({
            pID: playerID,
            embed: false,
            authorName: 'paper scraps',
            smallpfp: false,
            medpfp: false,
            largepfp: false,
            badgeLimit: 1,
            hasBorder: false
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
          }
          return error(e)
        }

      }

    });
  },

  fetchProfile: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._fetchProfile.bind(this),
      "args": [playerID]
    });
  },

  _fetchProfile: async function(playerID) {
    if (!playerID) throw new Error('fetchProfile function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await PRDB.findOne({
        where: {
          pID: playerID,
        }
      });
      if (Info) {

        return resolve({
          pID: Info.pID,
          embed: Info.embed,
          authorName: Info.authorName,
          smallpfp: Info.smallpfp,
          medpfp: Info.medpfp,
          largepfp: Info.largepfp,
          defaultpfp: Info.defaultpfp,
          badgeLimit: Info.badgeLimit,
          hasBorder: Info.hasBorder
        })
      } else {
        try {
          const Info2 = await PRDB.create({
            pID: playerID,
            embed: false,
            authorName: 'paper scraps',
            smallpfp: false,
            medpfp: false,
            largepfp: false,
            defaultpfp: false,
            badgeLimit: 1,
            hasBorder: false
          });
          return resolve({
            pID: playerID,
            embed: false,
            authorName: 'paper scraps',
            smallpfp: false,
            medpfp: false,
            largepfp: false,
            defaultpfp: false,
            badgeLimit: 1,
            hasBorder: false
          })
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            return resolve(`Duplicate Found, shouldn\'t happen in this function, check typo\'s`)
          }
          return error(e)
        }
      }

    });
  },

}
