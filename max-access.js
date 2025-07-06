// max-access.js
// Sample JS file for Node.js environment

const token = "";
const action = "";

const auth = `Bearer ${token}`;
const contentType = "application/json; charset=utf-8";
const request = `https://api.maximizer.com/octopus/${action}`;
const  payload = 
{
	"abEntry": {
		"criteria": {
			"searchQuery": {
                		"LastName": { 
					"$EQ": "."
				}
			},
			"top": 100
		},
		"scope": {
			"fields": {
				"key": 1,
				"type": 1,
				 "webSite": 1,
				"displayValue": 1
			}
		}
	},
	"configuration": {
		"drivers": {
			"IAbEntrySearcher": "Maximizer.Model.Access.Sql.AbEntrySearcher"
		}
	},
	"compatibility": {
		"abEntryKey": "2.0"
	}
};

const maxConnectOptions = { 
	method: 'POST', 
	redirect: 'follow', 
	headers: { 'Authorization': auth, 'Content-Type': contentType },
	body: JSON.stringify(payload)
};


fetch(request, maxConnectOptions)
	.then((response) => response.json())
	.then((resultset) => console.log(resultset))
	.catch((error) => console.log("Error!: " + error));

