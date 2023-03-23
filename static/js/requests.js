function get_data_from_form(){
    var fd = new FormData();
    var ids = []
    var inputs = [...document.getElementsByTagName('input')]
    var selects = [...document.getElementsByTagName('select')]
    var textareas = [...document.getElementsByTagName('textarea')]
    inputs.forEach(input => {
        if(input.id !== ''){
            ids.push(input.id)
        }
    });
    selects.forEach(select => {
        if(select.id !== ''){
            ids.push(select.id)
        }
    });
    textareas.forEach(textarea => {
        if(textarea.id !== ''){
            ids.push(textarea.id)
        }
    });
    ids.forEach(id =>{
        if(document.getElementById(id).type === 'file'){
            fd.append(id, document.getElementById(id).files[0] )
        } else{
            fd.append(id, document.getElementById(id).value)
        }
    })
    return fd
}

function get_data_from_ids(ids){
    var fd = new FormData();
    forms = ['INPUT','SELECT','TEXTAREA']
    ids.forEach(id => {     
        if(forms.includes(document.getElementById(id).tagName)){
             fd.append(id, document.getElementById(id).value)
        }else if(document.getElementById(id).type === 'file'){
            fd.append(id, document.getElementById(id).files[0] )
        }else{
            fd.append(id, document.getElementById(id).dataset.value)
        }
    })
    return fd
}

function clear_form(ids){
     ids.forEach(id => {
        document.getElementById(id).value = ''
    });
}

function create_request(){
    const Http = new XMLHttpRequest();
    return Http
}

function send_request_GET(endpoint, success_function=undefined, fail_function=undefined, callback=undefined){

    var Http = create_request()
    Http.onreadystatechange = function() {
        if (Http.readyState === 4) {
                    console.log(Http.status)
            if (Http.status === 200) {
                if(typeof success_function === 'function') {
                    success_function(Http);
                }
            } else {
                if(typeof fail_function === 'function') {
                    fail_function()
                }
            }
        }
    }

    const protocol = document.URL.split('/')[0]
    const base_url = document.URL.split('/')[2]
    const url = protocol + '//'+ base_url + endpoint;
    console.log(url)
    Http.open('GET', url, true);
    Http.send();

     if(typeof callback === 'function') {
        callback();
    }
}


function send_request_POST(endpoint, ids='', success_function=undefined,fail_function=undefined, callback=undefined){

    if(ids===''){
       var fd = get_data_from_form()
    } else {
        var fd = get_data_from_ids(ids)
    }

    var Http = create_request()
    Http.onreadystatechange = function() {
        if (Http.readyState === 4) {
                    console.log(Http.status)
            if (Http.status === 200) {
                if(typeof success_function === 'function') {
                    success_function(Http);
                }
            } else {
                if(typeof fail_function === 'function') {
                    fail_function()
                }
            }
        }
    }

    const protocol = document.URL.split('/')[0]
    const base_url = document.URL.split('/')[2]
    const url = protocol + '//'+ base_url + endpoint;
    console.log(url)
    Http.open('POST', url, true);
    Http.send(fd);

     if(typeof callback === 'function') {
        callback();
    }
}