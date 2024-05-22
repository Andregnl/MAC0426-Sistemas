import { promises as fs } from 'fs';

let bigText;
export async function item1ConsultaBigText() {
        let consultaBigText;
        const data = await fs.readFile("./consultas/bigText.txt")
        bigText = data.toString();
        consultaBigText = `INSERT INTO Posts (AcceptedAnswerId, AnswerCount, Body, ClosedDate, CommentCount, CommunityOwnedDate, CreationDate, FavoriteCount, Id, LastActivityDate,LastEditDate, LastEditorDisplayName, LastEditorUserId, OwnerUserId, ParentId, PostTypeId, Score, Tags, Title, ViewCount)
            VALUES (31, 5, ${bigText}, NULL, 0, NULL, '2008-07-31 22:08:09', 10, 12496714, '2016-03-19 06:10:52', '2016-03-19 06:05:48', 'Rich B', 63550, 9, NULL, 1, 256, '<html><css><css3><internet-explorer-7>', 'Percentage width child element in absolutely positioned parent on Internet Explorer 7', 16306);`

      return consultaBigText
}

// item 1
export let consultasItem1 = [
    `INSERT INTO "Comments" ("Id", "CreationDate", "PostId", "Score", "Text", "UserId") VALUES ('2024-05-10 10:00:00', 12496714, 100, 'Comentário 1', 2346543)`,
    
    `INSERT INTO "Posts" ("AcceptedAnswerId", "AnswerCount", "Body", "ClosedDate", "CommentCount", "CommunityOwnedDate", "CreationDate", "FavoriteCount", "Id", "LastActivityDate", "LastEditDate", "LastEditorDisplayName", "LastEditorUserId", "OwnerUserId", "ParentId", "PostTypeId", "Score", "Tags", "Title", "ViewCount")
    VALUES (31, 5, '<p>I have an absolutely positioned <code>div</code> containing several children, one of which is a relatively positioned <code>div</code>. When I use a <strong>percentage-based width</strong> on the child <code>div</code>, it collapses to \'0\' width on <a href="http://en.wikipedia.org/wiki/Internet_Explorer_7" rel="noreferrer">Internet&nbsp;Explorer&nbsp;7</a>, but not on Firefox or Safari.</p> <p>If I use <strong>pixel width</strong>, it works. If the parent is relatively positioned, the percentage width on the child works.</p> <ol> <li>Is there something Im missing here?</li> <li>Is there an easy fix for this besides the <em>pixel-based width</em> on the child?</li> <li>Is there an area of the CSS specification that covers this?</li> </ol>'
    NULL, 0, NULL, '2008-07-31 22:08:09', 10, 12496714, '2016-03-19 06:10:52', '2016-03-19 06:05:48', 'Rich B', 63550, 9, NULL, 1, 256, '<html><css><css3><internet-explorer-7>', 'Percentage width child element in absolutely positioned parent on Internet Explorer 7', 16306);`,
    
    `UPDATE "Posts" SET "Title" = 'Novo título alterado' WHERE "Id" = 12496714`,
    
    `UPDATE "Comments" SET "CreationDate" = '2024-05-12' WHERE "CreationDate" = '2024-05-10 10:00:00' AND "PostId" = 12496714, "Score" = 100, "Text" = 'Comentário 1', "UserId" = 2346543`,

    `DELETE FROM "Posts" WHERE "Id" = 12496714;`,
    
    `DELETE FROM "Comments" WHERE "CreationDate" = '2024-05-10 10:00:00' AND "PostId" = 12496714, "Score" = 100, "Text" = 'Comentário 1', "UserId" = 2346543`,
    
    
    //     `INSERT INTO "Users" ("AboutMe", "Age", "CreationDate", "DisplayName", "DownVotes", "EmailHash", "LastAccessDate", "Location", "Reputation", "UpVotes", "Views", "WebsiteUrl", "AccountId") VALUES (
    //   "I am a test user, I am here to test the database", 0, '2024-05-10 10:00:00', 'zE silva', 0, 'blahblah', '2024-05-10 10:00:00', 'Brasil', 1000000, 1000000, 1000000, 'https://www.google.com.br', 2346543,)`,    
]
export const indexesItem1 = [
    { column_name: `"CreationDate"`, table_name: `"Comments"` },
    { column_name: `"PostId"`, table_name: `"Comments"` },
    { column_name: `"Score"`, table_name: `"Comments"` },
    { column_name: `"Text"`, table_name: `"Comments"` },
    { column_name: `"UserId"`, table_name: `"Comments"` }
]

// item 2
export const consultasItem2 = [
    `SELECT * FROM "Comments" WHERE "Id" = 10;`,
    `SELECT * FROM "Badges" WHERE "Id" = 83663;`,
    `Select * FROM "Users" WHERE "Id" = 7670379;`,
    `Select * FROM "Votes" WHERE "Id" = 5503;`,
    `SELECT * FROM "Posts" WHERE "Id" > 30 AND "Id" < 1000;`,
    `SELECT * FROM "Comments" WHERE "Id" > 10 AND "Id" < 50;`,
    `SELECT * FROM "Badges" WHERE "Id" > 83663 AND "Id" < 725012;`,
    `SELECT * FROM "Users" WHERE "Id" > 4 AND "Id" < 7670379;`,
]

// item 3
export const consultasItem3 = [
    `SELECT "Id", "CreationDate" FROM "Posts" WHERE "CreationDate" >= '2010-01-01' AND "CreationDate" < '2010-05-11';   `,
    `SELECT "Users"."Id" FROM "Users" WHERE "Users"."UpVotes" > 50 AND "Users"."UpVotes" < 60;`,
    `SELECT "Users"."Id" FROM "Users" WHERE "Users"."Age" > 40 AND "Users"."Age" < 50`,
    `SELECT "Users"."Id" FROM "Users" WHERE "Users"."Views" > 100 AND "Users"."Views" < 500`,
]

export const indexesItem3 = [
    { column_name: `"CreationDate"`, table_name: `"Posts"` },
    { column_name: `"UpVotes"`, table_name: `"Users"` },
    { column_name: `"Age"`, table_name: `"Users"` },
    { column_name: `"Views"`, table_name: `"Users"` },
]

// item 4
export const consultasItem4 = [

    `SELECT "Posts"."Id", "PostTypes"."Type" FROM "Posts" JOIN "PostTypes" ON "PostTypeId" = "PostTypes"."Id" WHERE "PostTypes"."Type" LIKE 'Question';`,
    `SELECT "Id", "DisplayName" FROM "Users" WHERE LOWER("DisplayName") LIKE 'jon %' OR LOWER("DisplayName") LIKE 'jon' OR LOWER("DisplayName") LIKE 'jon-%' OR LOWER("DisplayName") LIKE '% jon' OR LOWER("DisplayName") LIKE 'jon.%' OR LOWER("DisplayName") LIKE '%-jon';`,
    `SELECT * FROM "Badges" WHERE "Name" LIKE 'Legendary';`,
    `SELECT * FROM "Badges" WHERE "Name" LIKE 'Supporter';`,
]

export const consultasItem4IndicesMysql = [
    `SELECT "Posts"."Id", "PostTypes"."Type"
    FROM "Posts"
    JOIN "PostTypes" ON "PostTypeId" = "PostTypes"."Id"
    WHERE MATCH ("PostTypes"."Type") AGAINST ('Question' IN NATURAL LANGUAGE MODE);`,

    `SELECT "Id", "DisplayName"
    FROM "Users"
    WHERE MATCH ("DisplayName") AGAINST ('Jon ' IN NATURAL LANGUAGE MODE);`,

    `SELECT *
    FROM "Badges"
    WHERE MATCH ("Name") AGAINST ('"Legendary"' IN NATURAL LANGUAGE MODE);`,

    `SELECT *
    FROM "Badges"
    WHERE MATCH ("Name") AGAINST ('"Supporter"' IN NATURAL LANGUAGE MODE);`
]

export const consultasItem4IndicesPostgres = [
    `SELECT "Posts"."Id", "PostTypes"."Type"
    FROM "Posts"
    JOIN "PostTypes" ON "Posts"."PostTypeId" = "PostTypes"."Id"
    WHERE to_tsvector('english', "PostTypes"."Type") @@ to_tsquery('english', 'Question');`,

    `SELECT "Id", "DisplayName"
    FROM "Users"
    WHERE to_tsvector('english', "DisplayName") @@ to_tsquery('english', 'Jon');`,

    `SELECT *
    FROM "Badges"
    WHERE to_tsvector('english', "Name") @@ to_tsquery('english', 'Legendary');`,

    `SELECT *
    FROM "Badges"
    WHERE to_tsvector('english', "Name") @@ to_tsquery('english', 'Supporter');`
]

// item 5
export const consultasItem5 = [
    `SELECT "Comments"."Id", "Views" FROM "Comments" JOIN "Users" ON "Comments"."UserId" = "Users"."Id" ORDER BY "Views" DESC;`,
    `SELECT "P"."Id", "V"."VoteTypeId" FROM "Posts" as "P" JOIN "Votes" as "V" ON "P"."Id" = "V"."PostId" WHERE "V"."VoteTypeId" = 3;`,
    `SELECT "Users"."Id", "Users"."DisplayName", "UserBadges1"."Name", "UserBadges2"."Name" FROM (( "Users" JOIN "Badges" AS "UserBadges1" ON "Users"."Id" = "UserBadges1"."UserId") JOIN "Badges" AS "UserBadges2" ON ("UserBadges1"."UserId" = "UserBadges2"."UserId" AND "UserBadges1"."Name" != "UserBadges2"."Name")) WHERE "UserBadges1"."Name" = 'Editor' AND "UserBadges2"."Name" = 'Supporter';`,
]

export const indexesItem5 = [
    { column_name: `"UserId"`, table_name: `"Comments"` },
    { column_name: `"Views"`, table_name: `"Users"` },
    { column_name: `"PostId"`, table_name: `"Votes"` },
    { column_name: `"VoteTypeId"`, table_name: `"Votes"` },
    { column_name: `"UserId"`, table_name: `"Badges"` },
//    { column_name: `"Name"`, table_name: `"Badges"` } pra texto precisa de outro tipo de index
]

// item 6
export const consultasItem6 = [
    `SELECT * 
    FROM "Posts" 
    WHERE "Id" IN (
      SELECT "PostId" 
      FROM "Votes" 
      WHERE "UserId" IN (
        SELECT "Id" 
        FROM "Users"
        WHERE "DownVotes" = (SELECT MAX("DownVotes") FROM "Users")
      )
      AND "VoteTypeId" = 2
    );`,
    
    `SELECT *
    FROM "Posts" 
    WHERE "OwnerUserId" IN (
        SELECT "UserId"
        FROM (
            SELECT "Users"."Id" as "UserId", COUNT("Badges"."Id") AS "badgeCount" 
            FROM "Users" 
            JOIN "Badges" ON "Users"."Id" = "Badges"."UserId"
            GROUP BY "Users"."Id"
        ) AS "UserBadges"
        WHERE "badgeCount" = (
            SELECT MAX("badgeCount")
            FROM (
                SELECT COUNT("Badges"."Id") AS "badgeCount" 
                FROM "Users" 
                JOIN "Badges" ON "Users"."Id" = "Badges"."UserId"
                GROUP BY "Users"."Id"
            ) AS "MaxBadgeCounts"
        )
    );`,
     
    `SELECT "Id", "Reputation", "UpVotes"
    FROM "Users"
    ORDER BY "Reputation" DESC, "UpVotes" ASC;`,
    
    `SELECT "U"."Id"
    FROM (
      SELECT "Id", "UpVotes"
      FROM "Users"
      WHERE "Reputation" = (SELECT MAX("Reputation") FROM "Users")
    ) AS "U"
    WHERE "U"."UpVotes" = (SELECT MIN("UpVotes") FROM "Users" WHERE "Reputation" = (SELECT MAX("Reputation") FROM "Users"));`,
    
    `SELECT "U"."Id", "U"."DisplayName", "U"."CreationDate", "U"."DownVotes"
    FROM (
      SELECT "Id", "DisplayName", "DownVotes", "CreationDate"
      FROM "Users" 
      WHERE "CreationDate" > '2010-01-01' AND "CreationDate" < '2010-07-01'
    ) AS "U"
    WHERE "DownVotes" > 100
    ORDER BY "DownVotes" DESC;`,
    
    `SELECT "U"."Id"
    FROM (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "Views" > 1000
    ) AS "U"
    WHERE "DownVotes" > 10000;`    
]

export const indexesItem6 = [
    { column_name: `"UpVotes"`, table_name: `"Users"` },
    { column_name: `"UserId"`, table_name: `"Votes"` },
    { column_name: `"DownVotes"`, table_name: `"Users"` },
    { column_name: `"VoteTypeId"`, table_name: `"Votes"` },
    { column_name: `"OwnerUserId"`, table_name: `"Posts"` },
    { column_name: `"UserId"`, table_name: `"Badges"` },
    { column_name: `"UserId"`, table_name: `"Comments"` },
    { column_name: `"PostsId"`, table_name: `"PostLinks"` },
    { column_name: `"PostId"`, table_name: `"Comments"` },
    { column_name: `"RelatedPostId"`, table_name: `"PostLinks"` },
    { column_name: `"Reputation"`, table_name: `"Users"` },
    { column_name: `"CreationDate"`, table_name: `"Users"` },
    { column_name: `"Views"`, table_name: `"Users"` },
]

export const consultasItem7 = [
    `SELECT "Users"."Id", COUNT("Badges"."Id") AS "badgeCount"
    FROM "Users"
    INNER JOIN "Badges" ON "Users"."Id" = "Badges"."UserId"
    WHERE "Users"."DownVotes" > 100
    GROUP BY "Users"."Id"
    ORDER BY "badgeCount" DESC;`,

`WITH "MinCreationDateUsers" AS (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "CreationDate" = (SELECT MIN("CreationDate") FROM "Users")
    )
    SELECT "U"."Id"
    FROM "MinCreationDateUsers" AS "U"
    WHERE "U"."DownVotes" = (SELECT MAX("DownVotes") FROM "MinCreationDateUsers");`,

`SELECT "U"."Id"
    FROM (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "CreationDate" = (SELECT MIN("CreationDate") FROM "Users")
    ) AS "U"
    WHERE "U"."DownVotes" = (SELECT MAX("DownVotes") FROM (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "CreationDate" = (SELECT MIN("CreationDate") FROM "Users")
    ) AS "U");`,

`SELECT "U"."Id"
    FROM (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "Views" = (SELECT MAX("Views") FROM "Users")
    ) AS "U"
    WHERE "U"."DownVotes" = (SELECT MAX("DownVotes") FROM (
      SELECT "Id", "DownVotes"
      FROM "Users"
      WHERE "Views" = (SELECT MAX("Views") FROM "Users")
    ) AS "U");`,
`SELECT "Id"
    FROM "Users"
    WHERE "DownVotes" > (SELECT AVG("DownVotes") FROM "Users");`
   
]

export const indexesItem7 = [
    { column_name: `"UserId"`, table_name: `"Badges"` },
    { column_name: `"DownVotes"`, table_name: `"Users"` },
    { column_name: `"Reputation"`, table_name: `"Users"` },
    { column_name: `"UpVotes"`, table_name: `"Users"` },
    { column_name: `"Views"`, table_name: `"Users"` },
]

export const createFullTextIndexPostgres = [
    `CREATE INDEX IF NOT EXISTS "posttypes_type_tsvector_idx" 
    ON "PostTypes" 
    USING gin(to_tsvector('english', "Type"));`,

    `CREATE INDEX IF NOT EXISTS "users_displayname_tsvector4_idx" 
    ON "Users" 
    USING gin(to_tsvector('english', "DisplayName"));`,

    `CREATE INDEX IF NOT EXISTS "badges_name_tsvector_idx" 
    ON "Badges" 
    USING gin(to_tsvector('english', "Name"));`
]

export const createFullTextIndexMysql = [
    `CREATE FULLTEXT INDEX posttypes_type_fulltext_idx 
    ON PostTypes(Type);`,

    `CREATE FULLTEXT INDEX users_displayname_fulltext_idx 
    ON Users(DisplayName);`,

    `CREATE FULLTEXT INDEX badges_name_fulltext_idx 
    ON Badges(Name);`
    
]

export const dropFullTextIndexPostgres = [
    `DROP INDEX IF EXISTS "posttypes_type_tsvector_idx";`,
    `DROP INDEX IF EXISTS "users_displayname_tsvector4_idx";`,
    `DROP INDEX IF EXISTS "badges_name_tsvector_idx";`
];

export const dropFullTextIndexMysql = [
    `DROP INDEX posttypes_type_fulltext_idx ON PostTypes;`,
    `DROP INDEX users_displayname_fulltext_idx ON Users;`,
    `DROP INDEX badges_name_fulltext_idx ON Badges;`
];
