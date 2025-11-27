// getUdfs.js
const fs = require('fs/promises');
const sourcePat = require('./maxsourcetoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = sourcePat.personalaccesstoken;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;


async function getCompanyUdfs(abEntry) {
    let resList = [];
    let udfList = [];

    const dstRequest = {
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
                    "Key": 1,
                    "Alias": 1
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
        //const KEY_START = 9; // index to start substring: Udf/$TYPEID(XXX)
        if (res.Code == 0) { 
            resList = res.Schema.Data;
            resList.forEach((field) => {
                //udfType = field.Key;
                //udfList.push(udfType.substring(KEY_START));
                udfType = field.Alias[1];
                udfList.push(udfType);
            });

            udfList.forEach((fieldName) => { getAbEntry.AbEntry.Scope.Fields[fieldName] = 1; });

            return getAbEntry;
        }
    } catch (error) {
        console.log("<getUdfs/Fetch> Error: " + error);
    }
}


async function getIndividualUdfs(abEntry) {
    let resList = [];
    let udfList = [];

    const dstRequest = {
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
                            "$IN": [ "Individual" ]
                        }
                    }]
                }
            },
            "Scope": {
                "Fields": {
                    "Key": 1,
                    "Alias": 1
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
                //udfType = field.Key;
                //udfList.push(udfType.substring(KEY_START));
                udfType = field.Alias[1];    // get UDF name instead of Type ID
                udfList.push(udfType);
            });

            udfList.forEach((fieldName) => { getAbEntry.AbEntry.Scope.Fields[fieldName] = 1; });

            return getAbEntry;
        }
    } catch (error) {
        console.log("<getUdfs/Fetch> Error: " + error);
    }
}

//module.exports = { getCompanyUdfs, getIndividualUdfs };

getUdfs().then((reqAbEntry) => console.log(JSON.stringify(reqAbEntry)))
.catch((err) => console.log(err));
