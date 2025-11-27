// Copy address book entry from one Maximizer database to another
const fs = require('fs/promises');
const sourcePat = require('./maxsourcetoken.js');
const targetPat = require('./maxtargettoken.js');
const { getCompanyUdfs, getIndividualUdfs } = require('./getUdfs.js');
const { getNotesList } = require('./getNotes.js');

const BASEURL = "https://api.maximizer.com/octopus";
const CONTENT_TYPE = "application/json; charset=utf-8";
const SOURCE_PAT = sourcePat.personalaccesstoken;
const TARGET_PAT = targetPat.personalaccesstoken;
const SOURCE_AUTH = `Bearer ${SOURCE_PAT}`;
const TARGET_AUTH = `Bearer ${TARGET_PAT}`;
const SOURCE_METHOD = `${BASEURL}/Read`;
const TARGET_METHOD = `${BASEURL}/Create`;

function buildSearchRequest(abEntry, type) {
    // do not build if type is invalid
    if (type != "Company" && type != "Individual" && type != "Contact") {
        return abEntry;
    }

    abEntry.Compatibility = {};
    abEntry.Compatibility.AbEntryKey = "2.0"
    abEntry.Configuration = {};
    abEntry.Configuration.Drivers = {};
    abEntry.Configuration.Drivers.IAbEntrySearcher = "Maximizer.Model.Access.Sql.AbEntrySearcher";

    abEntry.AbEntry = {};
    abEntry.AbEntry.Criteria = {};
    abEntry.AbEntry.Criteria.SearchQuery = {};
    abEntry.AbEntry.Criteria.SearchQuery.$AND = [{},{}];
    abEntry.AbEntry.Criteria.SearchQuery.$AND[0].Type = {}
    abEntry.AbEntry.Criteria.SearchQuery.$AND[0].Type.$EQ = type;
    abEntry.AbEntry.Criteria.SearchQuery.$AND[1].Name = {};
    abEntry.AbEntry.Criteria.SearchQuiry.$AND[1].Name.$EQ = "*";
    abEntry.AbEntry.Scope = {};
    abEntry.AbEntry.Scope.Fields = {};
    abEntry.AbEntry.Scope.Fields.Name = 1;

    if (type == "Individual" || type == "Contact") {
        abEntry.AbEntry.Scope.Fields.FirstName = 1;
    }

    return abEntry;
}

let abEntry = {};
abEntry = buildSearchRequest(abEntry);
