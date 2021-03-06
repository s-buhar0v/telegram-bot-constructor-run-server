const exec = require('child_process').exec
const axios = require('axios')

const apiUrl = require('./config').apiUrl
const commands = require('./commands')

function rebuildDockerContainer(callback) {
    exec(commands.cloneRepository, (err, stdout, stderr) => {
        if (err) { callback(err) }
        exec(commands.removeContainers, (err, stdout, stderr) => {
            if (err) { callback(err) }
            exec(commands.removeImage, (err, stdout, stderr) => {
                if (err) { callback(err) }
                exec(commands.buildImage, (err, stdout, stderr) => {
                    if (err) {
                        callback(err)
                    } else {
                        callback()
                    }
                })
            })
        })
    })
}

function runBotInstacne(botName, botAccessToken, callback) {
    let runCommand = commands.runBotInstance
        .replace(/{token}/g, botAccessToken)
        .replace(/{name}/g, botName)
    exec(runCommand, (err, stdout, stderr) => {
        if (err) {
            callback(err)
        } else {
            callback()
        }
    })

}

function stopBotInstacne(botName, callback) {
    let stopCommand = commands.stopBotInstance.replace(/{name}/g, botName)
    exec(stopCommand, (err, stdout, stderr) => {
        if (err) {
            callback(err)
        } else {
            callback()
        }
    })
}

function getBotById(id, callback) {
    axios.get(`${apiUrl}/api/bots/bot?id=${id}`)
        .then(apiResponse => {
            let botName = apiResponse.data.name
            let botToken = apiResponse.data.token
            callback({
                botName: botName,
                botAccessToken: botToken
            }, null)
        }).catch(err => {
            callback(null, err)
        })
}

function isBotRunning(botName, callback) {
    let checkCommand = commands.check.replace(/{name}/g, botName)
    exec(checkCommand, (err, stdout, stderr) => {
        if (err) {
            callback(null, err)
        } else {
            if (stdout) {
                callback(true, null)
            } else {
                callback(false, null)
            }
        }
    })
}

module.exports.rebuildDockerContainer = rebuildDockerContainer
module.exports.getBotById = getBotById
module.exports.runBotInstacne = runBotInstacne
module.exports.stopBotInstacne = stopBotInstacne
module.exports.isBotRunning = isBotRunning
