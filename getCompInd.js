// getCompInd.js - Get top-level (Company or Individual) record
const fs = require('fs/promises');
const token = require('./maxsourcetoken.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const TARGET_PAT = token.personalaccesstoken;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const TARGET_METHOD = `${BASEURL}\Read`;

async function getCompany(abEntry) {
    
}
