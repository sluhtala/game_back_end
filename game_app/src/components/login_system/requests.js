const Requests = {
    createXMLRequest: function (data, url, callback) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let value = JSON.parse(this.responseText);
                if (value) callback(value);
            }
        };
        xhttp.open("POST", url);
        xhttp.setRequestHeader("Content-Type", "Application/json");
        xhttp.send(JSON.stringify(data));
    },
    createFetchRequest: function (
        method,
        url,
        data,
        callback,
        callbackError = null
    ) {
        if (method === "post" || method === "POST") {
            fetch(url, {
                method: method,
                headers: { "Content-Type": "Application/json" },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    callback(response);
                })
                .catch((err) => {
                    if (callbackError) callbackError(err);
                });
        }
        if (method === "GET" || method === "get") {
            fetch(url, {
                method: method,
            })
                .then((response) => {
                    callback(response);
                })
                .catch((err) => {
                    if (callbackError) callbackError(err);
                });
        }
    },
};
export default Requests;
