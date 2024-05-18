// item 2
export const consultasItem2 = [
    `SELECT * FROM "Comments" WHERE "Id" = 10;`,
    `SELECT * FROM "Badges" WHERE "Id" = 83663;`,
    `Select * FROM "Users" WHERE "Id" = 7670379;`,
    `Select * FROM "Votes" WHERE "Id" = 5503;`,
    `SELECT * FROM "Posts" WHERE "Id" > 30 AND "Id" < 1000;`,
    `SELECT * FROM "Comments" WHERE Id > 10 AND "Id" < 50;`,
    `SELECT * FROM "Badges" WHERE "Id" > 83663 AND "Id" < 725012;`,
    `SELECT * FROM "Users" WHERE "Id" > 4 AND "Id" < 7670379;`,
]

// item 3
export const consultasItem3 = [
    `SELECT "Id", "CreationDate" FROM "Posts" WHERE "CreationDate" >= '2010-01-01' AND "CreationDate" < '2010-05-11';"`,
    `SELECT "Users"."Id" FROM "Users" WHERE "Users"."UpVotes" > 50 AND "Users"."UpVotes" < 60;`
]
export const indexesItem3 = [
    { column_name: `"CreationDate"`, table_name: `"Posts"` },
    { column_name: `"UpVotes"`, table_name: `"Users"` }
]

// item 5
export const consultasItem5 = [
    `SELECT "Comments"."Id", "Views" FROM "Comments" JOIN "Users" ON "Comments"."UserId" = "Users"."Id" ORDER BY "Views" DESC;`,
    `SELECT "P"."Id", "V"."VoteTypeId" FROM "Posts" as "P" JOIN "Votes" as "V" ON "P"."Id" = "V"."PostId" WHERE "V"."VoteTypeId" = 3;`,
    `SELECT "Users"."Id", "Users"."DisplayName", "UserBadges1"."Name", "UserBadges2"."Name" FROM (( "Users" JOIN "Badges" AS "UserBadges1" ON "Users"."Id" = "UserBadges1"."UserId") JOIN "Badges" AS "UserBadges2" ON ("UserBadges1"."UserId" = "UserBadges2"."UserId" AND "UserBadges1"."Name" != "UserBadges2"."Name")) WHERE "UserBadges1"."Name" = 'Editor' AND "UserBadges2"."Name" = 'Supporter';`,
]

// item 4
export const consultasItem4 = [
    `SELECT "Title" FROM "Posts" WHERE "Title" LIKE '%teste%';`,
    `SELECT "Posts"."Id", "Posts"."Body", "PostTypes"."Type" FROM "Posts" JOIN "PostTypes" ON "PostTypeId" = "PostTypes"."Id" WHERE "PostTypes"."Type" LIKE 'Question';`,
    `SELECT "Id", "Text" FROM "Comments" WHERE "Text" LIKE '%java%';`,
    `SELECT "Id", "DisplayName" FROM "Users" WHERE "DisplayName" LIKE '%Jon %';`,
    `SELECT * FROM "Badges" WHERE "Name" LIKE 'Legendary';`,
    `SELECT * FROM "Badges" WHERE "Name" LIKE 'Nice Answer';`,
]

export const indexesItem5 = [
    { column_name: `"UserId"`, table_name: `"Comments"` },
    { column_name: `"Views"`, table_name: `"Users"` },
    { column_name: `"PostId"`, table_name: `"Votes"` },
    { column_name: `"VoteTypeId"`, table_name: `"Votes"` },
    { column_name: `"UserId"`, table_name: `"Badges"` },
    { column_name: `"Name"`, table_name: `"Badges"` }
]

// item 6
export const consultasItem6 = [
        `SELECT * FROM "Posts" WHERE "Id" IN
        (
        SELECT "PostId" 
        FROM "Votes" 
        WHERE "UserId" IN (
                        SELECT "Id" 
                        FROM "Users" 
                        WHERE "DownVotes" = (
                            SELECT MAX("Downvotes")         
                            FROM "Users"))
                AND "VoteTypeId" = 2);`,


        `SELECT * 
        FROM "Posts" 
        WHERE "OwnerUserId" IN (SELECT "Users"."Id", COUNT("Badges"."Id") AS "badgeCount" 
                            FROM "Users" JOIN "Badges" ON "Id" = "UserId"
                            WHERE "badgeCount" = (SELECT MAX(COUNT("Badges"."Id")) FROM "Badges" GROUP BY "UserId"));
        `  ,
        `SELECT "Id"
        FROM "Users" 
        WHERE "Id" IN (
                    SELECT "post_comment"."UserId" as "Id"
                    FROM "Comments" as "post_comment", "Comments" as "related_post_comment", "Posts" as "post", "PostLinks" as "post_link"
                    WHERE "post"."Id" = "post_link"."PostId" AND
                        "post_comment"."PostId" = "post"."Id" AND
                        "related_post_comment"."Id" = "post_link"."RelatedPostId" AND
                        "post_comment"."UserId" = "related_post_comment"."UserId"
        );`,
        `SELECT "Id", "Reputation", "UpVotes" FROM "Users" ORDER BY "Reputation" DESC, "UpVotes" ASC;
        `,
        `SELECT "U"."Id"
        FROM (
        SELECT "Id", "UpVotes"
        FROM Users
        WHERE "Reputation" = (SELECT MAX("Reputation") FROM "Users")
        ) As "U"
        WHERE "UpVotes" < 10;
        `,
        `SELECT "U"."Id", "U"."DisplayName", "U"."CreationDate", "U"."DownVotes"
        FROM (
        SELECT "Id", "DisplayName", "DownVotes", "CreationDate"
        FROM "Users" 
        WHERE "CreationDate" > '2010-01-01' AND "CreationDate" < '2010-07-01'
        ) As "U"
        WHERE "DownVotes" > 100
        ORDER BY "DownVotes" DESC;
        `,
        `SELECT "U"."Id"
        FROM (
        SELECT "Id", "DownVotes"
        FROM "Users"
        WHERE "Views" > 1000
        ) As "U"
        WHERE "DownVotes" > 10000;
        `
]

export const consultasItem7 = [
        `SELECT "Users"."Id", COUNT("Badges"."Id") AS "badgeCount" FROM "Users" INNER JOIN "Badges" ON "Users"."Id" = "Badges"."UserId" WHERE "DownVotes" > 100 ORDER BY "badgeCount" DESC;`,
        
        `SELECT "U"."Id"
        FROM (SELECT "Id", "UpVotes"
        FROM "Users"
        WHERE "Reputation" = (SELECT MAX("Reputation") FROM "Users")
        ) AS "U"
        WHERE "UpVotes" = (SELECT MIN("UpVotes") FROM "U");`,

        `SELECT "U"."Id"
        FROM (
        SELECT "Id", "DownVotes"
        FROM "Users"
        WHERE "CreationDate" = (SELECT MIN("CreationDate") FROM "Users")
        ) As "U"
        WHERE "DownVotes" = (SELECT MAX("DownVotes") FROM "U");`,

        `SELECT "U"."Id"
        FROM (
        SELECT "Id", "DownVotes"
        FROM "Users"
        WHERE "Views" = (SELECT MAX("Views") FROM "Users")
        ) AS "U"
        WHERE "DownVotes" = (SELECT MAX("DownVotes") FROM "U");`,

        `SELECT "Id"
        FROM "Users"
        WHERE "DownVotes" > (SELECT AVG("DownVotes") FROM "Users");`
]