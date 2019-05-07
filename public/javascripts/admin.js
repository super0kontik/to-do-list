function delUser(id) {
    var req = new XMLHttpRequest();
    req.open('DELETE', `http://localhost:3000/admin/delUser/${id}`, true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200 ||req.status == 202 ){
                alert('deleted successfully')
            }else{
                alert("Error!!!");
            }
        }};
    req.send(null);
    document.location.reload(true);
}

function changeAccess(id) {
    let addr =`http://localhost:3000/admin/changeAccess/${id}`
    console.log(id)
    console.log(typeof(id))
    var req = new XMLHttpRequest();
    req.open('PUT', addr , true);
    req.onreadystatechange = function (aEvt) {
        if (req.readyState == 4) {
            if(req.status == 200){
                console.log(req.responseText);
                document.location.reload(true);
            }else{
                alert("Error!!!");
            }
        }};
    req.send(null);
}