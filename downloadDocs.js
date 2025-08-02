// downloadDocs.js
const fs = require('fs/promises');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJteHBkb2UwbDF4eTVnZDU5dHp5ZCIsIm14LXdzaWQiOiJDMDdEMzI5Qi1GODJDLTQ3Q0UtOUU1QS1DMDRCMkUzRjNCNTciLCJleHAiOjE3NTIwMTkyMDB9.UDzP73kPNEU8Q62itDox9zfeJdZA0bAerb1RbjkBK_o";
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}/BinaryDownload`;

async function downloadDocument(docObject) {
    
    const downloadReq = {};

    const documentConnectOptions = {
        method: 'GET', 
        redirect: 'follow', 
        headers: { 'Authorization': TARGET_AUTH, 'Content-Type': CONTENT_TYPE }, 
        body: JSON.stringify(downloadReq) 
    };

    try {
        const response = await fetch(TARGET_METHOD, documentConnectOptions);
        const res = await response.json();
        
    } catch (error) {
        console.error("<downloadDocument/Fetch> Error: " + error)
    }
}

const docObject = {  };
downloadDocument()

/*
    "Document": {
        "Data": {
            "Key": "RG9jdW1lbnQJNDMxMjQyNzg2"
        }
    }
*/