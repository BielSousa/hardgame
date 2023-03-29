var indexs = []
var is_end = false


function show_palavra(http){
    var palavra = http.response
    var areaPalavras = document.getElementById("areaPalavras")
    sessionStorage.setItem("palavra", palavra);
    Array.from(palavra).forEach(letra => {
        var l = document.createElement('div')
        areaPalavras.appendChild(l)
    });
}

function verify_letter(letra, jogador){
    if(!is_end){
        var letras = document.getElementById("areaPalavras").getElementsByTagName('div')
        var palavra = sessionStorage.getItem('palavra')
        var has_letter = [false, undefined]
        Array.from(palavra).forEach( (letter, index) =>{ 
            if((letter.toUpperCase()===letra.toUpperCase()) & (!indexs.includes(index))){
                has_letter=[true, index]
            }
        })
        indexs.push(has_letter[1])
        if(has_letter[0]){
            letras[has_letter[1]].innerText = letra.toUpperCase()
            verify_victory(jogador)
        }else{
            draw_man(jogador)
        }
    }
}

function draw_man(){
    var sequencia = ['cabeca', 'corpo', 'bracos', 'pernas']
    document.getElementById('homem-'+sequencia[parseInt(sessionStorage.getItem('sequencia'))]).style.visibility = 'visible'
    sessionStorage.setItem('sequencia', parseInt(sessionStorage.getItem('sequencia'))+1 )
    if(parseInt(sessionStorage.getItem('sequencia')) === 4 ){
        is_end = true
        jogador.end_game = true
        document.getElementById('chances').innerText = 4 - parseInt(sessionStorage.getItem('sequencia'))
        document.getElementById('aviso').innerText ='Você perdeu tente novamente'

    }else{
        document.getElementById('chances').innerText = 4 - parseInt(sessionStorage.getItem('sequencia'))
    }
}

function verify_victory(){
    var letras = document.getElementById("areaPalavras").getElementsByTagName('div')
    var palavra = ''
    Array.from(letras).forEach((letra)=>{
        palavra = palavra + letra.innerText
        })
    if(palavra === sessionStorage.getItem('palavra').toUpperCase()){
        jogador.end_game = true
        is_end = true
        document.getElementById('aviso').innerText = 'Parabéns voce ganhou'
    }
}

function get_palavra(){
    endpoint = '/get_word/6'
    send_request_GET(endpoint, success_function=show_palavra)
}

function init(){
    get_palavra()   
    sessionStorage.setItem('sequencia', '0')
}


init()