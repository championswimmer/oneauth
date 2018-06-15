const config = require('../../config');
const secret = config.SECRETS;
const {db, models: {
    User
}} = require('../../src/db/models');
/*
 * All those users who have multiple accounts with same email
 * among which one is verified
 */
async function runPrune() {
    try {

        const [users, result] = await db.query(`
SELECT  
        count("email") AS "count", 
        count("verifiedemail") as "Verified", 
        max("createdAt") as "Last Attempt", 
        min("createdAt") as "First Attempt", 
        "public"."users"."email" AS "email"
FROM "public"."users"
GROUP BY "public"."users"."email"
HAVING 
        count("email") > 1 AND 
        count("verifiedemail") = 1
ORDER BY "count" DESC, "public"."users"."email" ASC
        `)
        console.log("Going to delete " + users.length + " users")
        for (user of users) {
            console.log("Deleting for " + user.email )
            await User.destroy({
                where: {
                    email: user.email,
                    verifiedemail: { $eq: null}
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
NOTES: This deleted (paranoid) 817 users on 2018-06-08
 */