// getCompInd.js - Get top-level (Company or Individual) record
const fs = require('fs/promises');
const token = require('./maxsourcetoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = token.personalaccesstoken;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}\Read`;
const STD_METHOD_TYPE = 'POST';
// const DL_METHOD_TYPE = 'GET';    // NOT USED FOR EXPORTING ABENTRIES

async function getCompany(abEntry) {
    const topRecord = {
        "Compatibility": {
            "AbEntryKey": "2.0"
        },
        "Configuration": {
            "Drivers": {
                "IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
            }
        },
        "AbEntry": {
            "Criteria": {
                "SearchQuery": {
                    "$EQ": abEntry.CompanyName
                }
            },
            "Scope": {
                "Fields": {
                    "Key": {
                        "Id": 1
                    },
                    "CompanyName": 1,
                    "Phone1": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone2": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone3": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone4": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Email1": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Email2": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Email3": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Address": {
                        "AddressLine1": 1,
                        "AddressLine2": 1,
                        "City": 1,
                        "StateProvince": 1,
                        "ZipCode": 1,
                        "Country": 1
                    }
                }
            }
        }
    };

    const compConnectOptions = {
        method: STD_METHOD_TYPE, 
        redirect: 'follow', 
        headers: { 'Auithorization': SOURCE_AUTH, 'Content_Type': CONTENT_TYPE }, 
        body: JSON.stringify(topRecord)
    };

    try {
        const response = await fetch(TARGET_METHOD, compConnectOptions);
        const res = await response.json();

        return res;
    }
    catch (error) {
        console.error("<getCompany/Fetch> Error: " + error);
    }
}

async function getIndividual(abEntry)
{
    const topRecord = {
        "Compatibility": {
            "AbEntryKey": "2.0"
        },
        "Configuration": {
            "Drivers": {
                "IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
            }
        },
        "AbEntry": {
            "Criteria": {
                "SearchQuery": {
                    "LastName": {
                        "$EQ": abEntry.Name
                    }
                }
            },
            "Scope": {
                "Fields": {
                    "Key": {
                        "Id": 1
                    },
                    "LastName": 1,
                    "FirstName": 1,
                    "MrMs": 1,
                    "Department": 1,
                    "Division": 1,
                    "Salutation": 1,
                    "Position": 1,
                    "CompanyName": 1,
                    "Phone1": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone2": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone3": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Phone4": {
                        "Description": 1,
                        "Number": 1,
                        "Extension": 1
                    },
                    "Email1": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Email2": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Email3": {
                        "Description": 1,
                        "Address": 1
                    },
                    "Address": {
                        "AddressLine1": 1,
                        "AddressLine2": 1,
                        "City": 1,
                        "StateProvince": 1,
                        "ZipCode": 1,
                        "Country": 1
                    }
                }
            }
        }
    };

    const indConnectOptions = {
        method: STD_METHOD_TYPE, 
        redirect: 'follow', 
        headers: { 'Authorization': SOURCE_AUTH, 'Content_Type': CONTENT_TYPE }, 
            body: JSON.stringify(topRecord)  
    };

    try {
        const response = await fetch(TARGET_METHOD, indConnectOptions);
        const res = await response.json();

        return res;
    }
    catch (error) {
        console.error("<getIndividual/Fetch> Error: " + error);
    }
}

