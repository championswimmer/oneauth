const Sequelize = require('sequelize')
const models = require('./src/db/models').models

models.User.findAll({
    where: {
        verifiedemail: null
    }
}).then(usersdata => {
    for (let i = 0; i < usersdata.length; i++) {
        models.User.findAll({
            where: {
                email: usersdata[i].email
            }
        }).then(userdata => {

            for (let z = 0; z < userdata.length; z++) {
                models.UserGithub.find({
                    where: {
                        userId: userdata[z].id
                    }
                }).then(UserGithubData => {
                    if (UserGithubData === null) {
                        userdata.destroy()
                    }
                })
            }
            let socialApps = []
            for (let j = 0; j < userdata.length; j++) {
                let count = 0
                if (userdata[j].verifiedemail === null) {

                    models.UserGithub.find({
                        where: {
                            userId: userdata[j].id
                        }
                    }).then(UserGithubData => {
                        if (UserGithubData !== null) {
                            count++
                        }
                    })

                    models.UserFacebook.find({
                        where: {
                            userId: userdata[j].id
                        }
                    }).then(UserFacebookData => {
                        if (UserFacebookData !== null) {
                            count++
                        }
                    })

                    models.UserTwitter.find({
                        where: {
                            userId: userdata[j].id
                        }
                    }).then(UserTwitterData => {
                        if (UserTwitterData !== null) {
                            count++
                        }
                    })
                }

                socialApps[j] = count
            }

            let max = 0, index = 0

            for (let j = 0; j < socialApps; j++) {
                if (socialApps[j] > max) {
                    max = socialApps[j]
                    index = j
                }
            }

            for (let i = 0; i < userdata.length; i++) {
                if (i !== j) {
                    userdata[i].destroy()
                }
            }

        })
    }
})