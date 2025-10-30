// getNotes.js
const fs = require('fs/promises');
const sourcePat = require('./maxsourcetoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = sourcePat.personalaccesstoken;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/Read`;

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
        
        return abEntry;

    } 
    catch (error) {
        console.error("<getNotesList/Fetch> Error: " + error);
    }
}