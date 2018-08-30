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
        // Only deleting older than 01 May 2018
        const [users, result] = await db.query(`
SELECT  
        count("email") AS "count", 
        count("verifiedemail") as "Verified", 
        max("createdAt") as "Last Attempt", 
        min("createdAt") as "First Attempt",
        "users"."email" AS "email"
FROM "users"
WHERE 
    "deletedAt" is NULL
    AND
    "updatedAt" < date('2018-05-01')
GROUP BY "users"."email"
HAVING 
        count("email") > 1 AND 
        count("verifiedemail") = 0
ORDER BY "count" DESC, "users"."email" ASC
        `)
        console.log("Going to delete " + users.length + " users")
        for (user of users) {
            console.log("Deleting for " + user.email )
            await User.destroy({
                where: {
                    email: user.email,
                    verifiedemail: { $eq: null}
                },
                // force: true // this *REALLY* deletes, not just deletedAt
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
NOTES:
    - This deleted (paranoid) 817 users on 2018-06-08
    - The deleted (force) 841 users on 2018-08-23
 */