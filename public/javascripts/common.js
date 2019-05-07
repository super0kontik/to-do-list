function checkTask(id) {
  var req = new XMLHttpRequest();
  req.open('PUT', `http://localhost:3000/checkTask/${id}`, true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
     if(req.status == 200){
      console.log(req.responseText);
      overline(id,req.responseText)
    }else{
      alert("Error!!!");
  }
}};
req.send(null);
}

function deleteTask(id) {
  var req = new XMLHttpRequest();
  req.open('DELETE', `http://localhost:3000/delTask/${id}`, true);
  req.onreadystatechange = function (aEvt) {
    if (req.readyState == 4) {
     if(req.status == 200 ||req.status == 202 ){
      alert('deleted successfully')
    }else{
    //  alert("Error!!!");
  }
}};
req.send(null);
remove(id)
}

overline=(id,done)=>{
  let el = document.getElementById('li'+id)
  if(done=='true'){
    el.style='text-decoration:line-through'
  }else{
    el.style=''
  }
}

remove=(id)=>{
  document.getElementById('div'+id).style='display:none'

}

handlePress=()=>{
  let button = document.getElementById('sButton')
  let form = document.getElementById('sForm')
  if(form.value.trim().length <3){
    button.disabled = true
  }else{
    button.disabled = false
  }
}
