// Copy address book entry from one Maximizer database to another
const fs = require('fs/promises');
const sourcePat = require('./maxsourcetoken.js');
const targetPat = require('./maxtargettoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const SOURCE_PAT = sourcePat.personalaccesstoken;
const TARGET_PAT = targetPat.personalaccesstoken;
const SOURCE_AUTH = `Bearer ${SOURCE_PAT}`;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const SOURCE_METHOD = `${BASEURL}/Read`;
const TARGET_METHOD = `${BASEURL}/Create`;

function buildSearchRequest(abEntry) {
    abEntry.Compatibility = {};
    abEntry.Compatibility.AbEntryKey = "2.0"
    abEntry.Configuration = {};
    abEntry.Configuration.Drivers = {};
    abEntry.Configuration.Drivers.IAbEntrySearcher = "Maximizer.Model.Access.Sql.AbEntrySearcher";

    abEntry.AbEntry = {};
    abEntry.AbEntry.Criteria = {};
    abEntry.AbEntry.Criteria.SearchQuery = {};
    abEntry.AbEntry.Criteria.SearchQuery.Type = {};
    abEntry.AbEntry.Criteria.SearchQuery.Type.$EQ = "Company";
    abEntry.AbEntry.Scope = {};
    abEntry.AbEntry.Scope.Fields = {};
    abEntry.AbEntry.Scope.Fields.Name = 1;

    return abEntry;
}

async function getCompIndUdfList(abEntry) {
    const udfList = {
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
                            "$IN": [ "Company", "Individual" ]
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

    const udfListConnectOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Authorization': TARGET_AUTH, 'Content-Type': CONTENT_TYPE },
        body: JSON.stringify(udfList)
    };

    let resList = [];
    let fieldList = [];

    try {
        const response = await fetch(TARGET_METHOD, udfListConnectOptions);
        const res = await response.json();
        let udfType = "";
        const KEY_START = 9; // index to start substring: Udf/$TYPEID(XXX)
        if (res.Code == 0) {
            resList = res.Schema.Data;
            resList.forEach((field) => {
                udfType = field.Key;
                fieldList.push(udfType.substring(KEY_START));
            });

            fieldList.forEach((fieldName) => { abEntry.AbEntry.Scope.Fields[fieldName] = 1; });

            return abEntry;
        } else { console.log("<getUdfs/Response> " + res.Msg[0]); }
    }
    catch (error) {
        console.error("<getUdfs/Fetch> Error: " + error);
    }
}

async function getNotesList(abEntry) {
    const notesList = {
        "Configuration": {
            "Drivers": {
                "INoteSearcher": "Maximizer.Model.Access.Sql.NoteSearcher"
            }
        },
        "Compatibility": {
            "NoiteKey": "2.0"
        },
        "Note": {
            "Criteria": {
                "SearchQuery": {
                    "ParentKey": {
                        "$EQ": abEntry.Key
                    }
                }
            },
            "Scope": {
                "Fields": {
                    "Key": 1,
                    "Text": 1,
                    "RichText": 1,
                    "Category": 1,
                    "Important": 1,
                    "Type": 1,
                    "Creator": 1,
                    "DateTime": 1,
                    "SecAccess/Write": 1,
                    "SecAccess/Read": 1
                }
            }
        }

    };
    
    const notesListConnectOptions = {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Authorization': TARGET_AUTH, 'Content-Type': CONTENT_TYPE },
        body: JSON.stringify(notesList)
    };

    try {
        const response = await fetch(TARGET_METHOD, notesListConnectOptions);
        const res = await response.json();
        // process response
    } 
    catch (error) {
        console.error("<getNotesList/Fetch> Error: " + error);
    }
}

let abEntry = {};
abEntry = buildSearchRequest(abEntry);
getCompIndUdfList(abEntry).then(console.log(JSON.stringify(abEntry)));
