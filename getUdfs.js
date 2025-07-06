// getUdfs.js
const fs = require('fs/promises');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteHBkb2UwbDF4eTVnZDU5dHp5ZCIsIm14LXdzaWQiOiJDMDdEMzI5Qi1GODJDLTQ3Q0UtOUU1QS1DMDRCMkUzRjNCNTciLCJleHAiOjE3NTIwMTkyMDB9.UDzP73kPNEU8Q62itDox9zfeJdZA0bAerb1RbjkBK_o";
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;

dstRequest = {
    "Schema": {
        "Criteria": {
            "SearchQuery": {
                "$AND": [
                {
                    "Key": {
                        "$TREE": "/AbEntry/Udf"
                    }
                },
                {
                    "AppliesTo": {
                        "$IN": [ "Company" ]
                    }
                }
                ]
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

let resList = [];
let udfList = [];

fetch(TARGET_METHOD, targetConnectOptions)
    .then((response) => response.json())
    .then((res) => {
        let udfType = "";
        const KEY_START = 9; // index to start substring: Udf/$TYPEID(XXX)
        if (res.Code == 0) { 
            resList = res.Schema.Data;
            resList.forEach((field) => {
                udfType = field.Key;
                udfList.push(udfType.substring(KEY_START));
            });

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

            //console.log(getAbEntry);
            console.log(getAbEntry.AbEntry);
        } else { console.log("<getUdfs/Response> " + res.Msg[0]); }
    })
    .catch((error) => console.log("<getUdfs/Fetch> Error: " + error));
