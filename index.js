require('dotenv').config()

const { google } = require('googleapis')

const Discord = require('discord.js')
const client = new Discord.Client()

const config = require('./config.json')

const updateDelay = 10 * 60 * 1000 // 5 minutos

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)

  const auth = new google.auth.GoogleAuth({
      keyFile: './google_service_account.json',
      scopes: [
          'https://www.googleapis.com/auth/spreadsheets.readonly'
      ]
  })

  config.forEach(async configEntry => {
    setInterval(() => {
      updateRoles(configEntry, auth)
    }, updateDelay)
    updateRoles(configEntry, auth)
  })
})

async function updateRoles (configEntry, auth) {
  const tag = `[${configEntry.displayName}]`

  console.log(tag, `Updating guild ${configEntry.guildId}, role ${configEntry.roleId}`)

  const guild = client.guilds.cache.get(configEntry.guildId)
  if (!guild) return console.log(tag, `Update failed: Guild ${configEntry.guildId} not found`)

  const role = guild.roles.cache.get(configEntry.roleId)
  if (!role) return console.log(tag, `Update failed: Role ${configEntry.roleId} not found`)

  console.log(tag, `Fetching data from spreadsheet ${configEntry.spreadsheetId}, sheet ${configEntry.sheetId}`)

  const sheets = google.sheets({version: 'v4', auth})
  const values = await sheets.spreadsheets.values.get({
    spreadsheetId: configEntry.spreadsheetId,
    range: `Página1!${configEntry.column}${configEntry.row}:${configEntry.column}`
  }).then(res => res.data.values.flat())

  console.log(tag, 'Got spreadsheet data')

  console.log(tag, 'Fetching guild members')

  const members = await guild.members.fetch()

  console.log(tag, `Got ${members.size} members`)

  for (const member of Array.from(members.values())) {
    // Add role to those who don't have it
    if (values.includes(member.id) && !member.roles.cache.has(configEntry.roleId)) {
      console.log(tag, `Giving role ${configEntry.roleId} to ${member.user.tag}`)
      await member.roles.add(configEntry.roleId)
    }

    // Remove role from those that shoudln't have it
    if (!values.includes(member.id) && member.roles.cache.has(configEntry.roleId)) {
      console.log(tag, `Removing role ${configEntry.roleId} from ${member.user.tag}`)
      await member.roles.remove(configEntry.roleId)
    }
  }
}

client.login(process.env.DISCORD_TOKEN)