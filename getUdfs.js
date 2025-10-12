// getUdfs.js
const fs = require('fs/promises');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteHA1dnFtNXNycm9jbzltNWNvbCIsImlhdCI6MTc1NDA5NjA0NywiZXhwIjoxNzg1NTQyNDAwLCJteC1jaWQiOiJCMzI2Rjc4My0xMUNELTQwOTMtODNFQy0xRkNDNDE5ODdGODAiLCJteC13c2lkIjoiQzA3RDMyOUItRjgyQy00N0NFLTlFNUEtQzA0QjJFM0YzQjU3IiwibXgtZGIiOiJTdXBwb3J0IiwibXgtdWlkIjoiUFdPTiIsIm14LXBsIjoiY2xvdWQifQ.wHE7mau3DzRoExCUC8pHybKH4ff-8v8G7G6GQwU9OnE";
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;


async function getUdfs() {
    let resList = [];
    let udfList = [];

    dstRequest = {
        "Schema": {
            "Criteria": {
                "SearchQuery": {
                    "$AND": [{
                        "Key": {
                            "$TREE": "/AbEntry/Udf"
                        }
                    },
                    {
                        "AppliesTo": {
                            "$IN": [ "Company" ]
                        }
                    }]
                }
            },
            "Scope": {
                "Fields": {
                    "Key": 1
                }
            }
        },
        "Compatibility": {
            "SchemaObject": "1.0"
        }
    };

    const targetConnectOptions = {
        method: 'POST', 
        redirect: 'follow', 
        headers: { 'Authorization': TARGET_AUTH, 'Content-Type': CONTENT_TYPE }, 
        body: JSON.stringify(dstRequest) 
    };

    try {
        const response = await fetch(TARGET_METHOD, targetConnectOptions);
        const res = await response.json();
        let udfType = "";
        const KEY_START = 9; // index to start substring: Udf/$TYPEID(XXX)
        if (res.Code == 0) { 
            resList = res.Schema.Data;
            resList.forEach((field) => {
                udfType = field.Key;
                udfList.push(udfType.substring(KEY_START));
            });

            // set up request with Company UDFs
            const getAbEntry = {};
            getAbEntry.Compatibility = {};
            getAbEntry.Compatibility.AbEntryKey = "2.0"
            getAbEntry.Configuration = {};
            getAbEntry.Configuration.Drivers = {};
            getAbEntry.Configuration.Drivers.IAbEntrySearcher = "Maximizer.Model.Access.Sql.AbEntrySearcher";

            getAbEntry.AbEntry = {};
            getAbEntry.AbEntry.Criteria = {};
            getAbEntry.AbEntry.Criteria.SearchQuery = {};
            getAbEntry.AbEntry.Criteria.SearchQuery.Key = "*";
            getAbEntry.AbEntry.Scope = {};
            getAbEntry.AbEntry.Scope.Fields = {};
            getAbEntry.AbEntry.Scope.Fields.Name = 1;
            udfList.forEach((fieldName) => { getAbEntry.AbEntry.Scope.Fields[fieldName] = 1; });

            return getAbEntry;
        }
    } catch (error) {
        console.log("<getUdfs/Fetch> Error: " + error);
    }
}

getUdfs().then((reqAbEntry) => console.log(reqAbEntry));