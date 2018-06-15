const config = require('../../config');
const secret = config.SECRETS;
const {db, models: {
    User
}} = require('../../src/db/models');

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
        for (user of users) {
            console.log("Deleting for " + user.email )
            await User.destroy({
                where: {
                    email: user.email,
                    verifiedemail: { $eq: null}
                }
            })
//             await db.query(`
// DELETE FROM "users"
// WHERE "email" = '${user.email}' AND "verifiedemail" IS NULL
//             `)
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