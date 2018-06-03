const Sequelize = require('sequelize')
const models = require('./src/db/models').models

models.User.findAll({
    where: {
        verifiedemail: {
            $ne: null
        }
    }
}).then(usersdata => {
    for (let i = 0; i < usersdata.length; i++) {
        models.User.findAll({
            where: {
                email: usersdata[i].email
            }
        }).then(userdata => {
            for (let j = 0; j < userdata.length; j++) {
                if (userdata[j].verifiedemail === null) {
                    models.UserGithub.find({
                        where: {
                            userId: userdata[j].id
                        }
                    }).then(UserGithubData => {
                        if (UserGithubData === null) {
                            userdata[j].destroy()
                        }
                    })
                }
            }
        })
    }
})