const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS',
  ]

  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}

module.exports = (client, commandOptions) => {
  let {
    name,
    description = '',
    expectedArgs = '',
    category = '',
    permissionError = 'You do not have permission to run this command.',
    minArgs = 0,
    maxArgs = null,
    permissions = [],
    requiredRoles = [],
    callback,
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof name === 'string') {
    name = [name]
  }

  console.log(`Registering command "${name}"`)

  // Ensure the permissions are in an array and are all valid
  if (permissions.length) {
    if (typeof permissions === 'string') {
      permissions = [permissions]
    }

    validatePermissions(permissions)
  }

  // Listen for messages
  client.on('message', (message) => {
    if (message.channel.id === '789215234376073236') {
      return;
    }
    if (message.channel.id === '704489252125409314') {
      return;
    }
    const { member, content, guild } = message

    for (const alias of name) {
      const command = `p.${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        // A command has been ran

        // Ensure the user has the required permissions
        for (const permission of permissions) {
          if (!member.hasPermission(permission)) {
            message.reply(permissionError)
            return
          }
        }

        // Ensure the user has the required roles
        for (const requiredRole of requiredRoles) {
          const role = guild.roles.cache.find(
            (role) => role.name === requiredRole
          )

          if (!role || !member.roles.cache.has(role.id)) {
            message.reply(
              `You must have the "${requiredRole}" role to use this command.`
            )
            return
          }
        }

        // Split on any number of spaces
        const arguments = content.split(/[ ]+/)

        // Remove the command which is the first index
        arguments.shift()

        let params = message.content.split(' ').slice(1); //array containing each param
        let args = message.content.split(' '); //same as params but also contains command at first index  args[2] == params[1]
        let params1 = message.content.split(' ').slice(1).join(" "); //same as params but as a string with a space in between
        let paramsCom = message.content.split(' ').slice(1).join(" ").split(', '); //array containing each param when set by comma

        if (paramsCom[0] === '') {
          if (
            params.length < minArgs ||
            (maxArgs !== null && params.length > maxArgs)
          ) {
            message.reply(
              `Error: incorrect syntax! use p.${alias} ${expectedArgs}`
            )
            return
          }
        }
        // Ensure we have the correct number of arguments
        if (
          paramsCom.length < minArgs ||
          (maxArgs !== null && paramsCom.length > maxArgs)
        ) {
          message.reply(
            `Error: incorrect syntax! use p.${alias} ${expectedArgs}`
          )
          return
        }

        // Handle the custom command code
        callback(message, paramsCom, client)

        return
      }
    }
  })
}
