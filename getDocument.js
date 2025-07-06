//getDocument.js
const fs = require('fs/promises');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteHBkb2UwbDF4eTVnZDU5dHp5ZCIsIm14LXdzaWQiOiJDMDdEMzI5Qi1GODJDLTQ3Q0UtOUU1QS1DMDRCMkUzRjNCNTciLCJleHAiOjE3NTIwMTkyMDB9.UDzP73kPNEU8Q62itDox9zfeJdZA0bAerb1RbjkBK_o";
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;

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

getDocument('QWJFbnRyeQkyMTExMjQyNTAwMjU1Nzg5NTI1OTlDCTA=').then((documentList) => { console.log(documentList); });