// const baseUrl = "http://localhost:3001/persons"; the old baseUrl
const baseUrl = '/api/persons';

//This is simply our abstraction layer to the backend, that's how we will comunicate to the backend, whataever it is
//This downloads all the notes and sends them to the frontend, it's fired at the start of the page
const methodToBackendJsonResponse = async (url, method, objectToSend) => {
    const respFromServer = await 
                        fetch(url, {
                        method: method,
                        headers: {
                        'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(objectToSend)
                    })
    //This guarantees the server response it's between 0 and 200
    if (respFromServer.status - 200 >= 99) {
        throw new Error(`cannot fetch data with error code: ${respFromServer.status}`);
    }      
    return respFromServer.json();
}

const getAll = async () => {
    const resp = await fetch(baseUrl);
    if (resp.status !== 200) {
        throw new Error(`cannot fetch data with error code: ${resp.status}`);
    }  
    const data = await resp.json();
    return data;
}


//The simple POST method using async, restructured to make it easier to use
const sendNewPersonInfo = async (personInfoObject) => {
    const responseFromServer = await methodToBackendJsonResponse(baseUrl, "POST", personInfoObject);
    return responseFromServer;
}

const deletePerson = async personID => {
    const responseFromServer = await methodToBackendJsonResponse(`${baseUrl}/${personID}`, "DELETE", {personID});  
    return responseFromServer;
}

const modifyPersonInfo = async personObject => {
    const responseFromServer = await methodToBackendJsonResponse(`${baseUrl}/${personObject.id}`, "PUT", personObject);  
    return responseFromServer;
}

//Cleaner with object initializer ES2015
const allFunctions = {
    getAll,
    sendNewPersonInfo,
    modifyPersonInfo,
    deletePerson
}

export default allFunctions;