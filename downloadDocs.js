// downloadDocs.js
const fs = require('fs/promises');
const sourcePat = require('./maxsourcetoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = sourcePat.personalaccesstoken;
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
        // const res = await response.json();
        if (response.ok) {
            const res = response.buffer();
            const fileType = (docObject.ext == 'Email Message') ? '.eml' : docObject.ext;
            const downloadFile = docObject.name + '.' + fileType;
            const fileRes = await fs.writeFile(downloadFile, res);
            console.log('File Donwloaded');
        }
    } catch (error) {
        console.error("<downloadDocument/Fetch> Error: " + error)
    }
}

const docObject = {};
downloadDocument()
