const config = require('../../config');
const secret = config.SECRETS;
const {db, models: {
    User
}} = require('../../src/db/models');
/*
 * People with multiple accounts with same email
 * One of them being verified
 * But no Github connected
 */
async function runPrune() {
    try {

        const [users, result] = await db.query(`
select count("email"), count("verifiedemail") as "verifieds", "email",
        count("userfacebooks"."id") as "fb", 
        count("usergithubs"."id") as "gh", 
        count("usertwitters"."id") as "tw"
from "users"
    left outer join "userfacebooks" on "userfacebooks"."userId" = "users"."id"
    left outer join "usergithubs" on "usergithubs"."userId" = "users"."id"
    left outer join "usertwitters" on "usertwitters"."userId" = "users"."id"
where "deletedAt" is null
group by "email"
having 
    count("email") > 1 and
    count("usergithubs"."id") < 1 and
    count("verifiedemail") > 0
        `)
        console.log("Going to delete " + users.length + " users")
        /* Delete all without verified emails */
        for (user of users) {
            console.log("Deleting for " + user.email )
            await User.destroy({
                where: {
                    email: user.email,
                    verifiedemail: {$eq: null}
                }
            })
        }



    } catch (err) {
        console.error(err)
    } finally {
        process.exit()
    }
}

runPrune()

/*
NOTES: This deleted (paranoid) 318 users on 2018-06-08
 */