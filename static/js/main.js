axios.get('http://localhost:8080/', function (req, res) {
    req.header("Access-Control-Allow-Origin", "*")
}).then(resp => {
    console.log(resp.data)
    document.getElementsByClassName("container-div")[0].innerText = resp.data;
});