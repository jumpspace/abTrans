//getDocument.js
const fs = require('fs/promises');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteHA1dnFtNXNycm9jbzltNWNvbCIsImlhdCI6MTc1NDA5NjA0NywiZXhwIjoxNzg1NTQyNDAwLCJteC1jaWQiOiJCMzI2Rjc4My0xMUNELTQwOTMtODNFQy0xRkNDNDE5ODdGODAiLCJteC13c2lkIjoiQzA3RDMyOUItRjgyQy00N0NFLTlFNUEtQzA0QjJFM0YzQjU3IiwibXgtZGIiOiJTdXBwb3J0IiwibXgtdWlkIjoiUFdPTiIsIm14LXBsIjoiY2xvdWQifQ.wHE7mau3DzRoExCUC8pHybKH4ff-8v8G7G6GQwU9OnE";
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;

// objectKey : abEntry, opportunity, cscase
async function getDocument(objectKey) {
    const docRequest = {
        "Document": {
            "Criteria": {
                "SearchQuery": {
                    "ParentKey": {
                        "$EQ": objectKey
                    }
                }
            },
            "Scope": {
                "Fields": {
                    "Name": 1,
                    "Ext": 1,
                    "Key": 1
                }
            }
        },
        "Configuration": {
            "Drivers": {
                "IDocumentSearcher": "Maximizer.Model.Access.Sql.DocumentSearcher"
            }
        }
    };

    const documentConnectOptions = {
        method: 'POST', 
        redirect: 'follow', 
        headers: { 'Authorization': TARGET_AUTH, 'Content-Type': CONTENT_TYPE }, 
        body: JSON.stringify(docRequest) 
    };

    let docLinkList = [];

    try {
        const response = await fetch(TARGET_METHOD, documentConnectOptions);
        const res = await response.json();
        if ((res.Document.Data).length >= 1) {
            (res.Document.Data).forEach((item) => {docLinkList.unshift(item)});
            return docLinkList;
        } else {
            console.error("<getDocument/Response> No records returned!");
            return docLinkList;
        }
    } catch (error) {
        console.error("<getDocument/Fetch> Error: " + error);
        return docLinkList;
    }
}

getDocument('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ=').then((documentList) => { console.log(documentList); });
