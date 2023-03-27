let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");



class Nave { 
    constructor(id){
        this.max_life = 100
        this.life = 100
        this.type = undefined
        this.tiros = []
        this.id = id
    } 
    criar(ctx, x, y, w, h){
        this.ctx = ctx
        this.x = x 
        this.y = y 
        this.w = w  
        this.h  = h
        console.log('criou a nave ' + this.type)
        this.draw()
    }

    draw(){
        if(this.tiros){
            this.tiros.forEach((tiro, index )=>{
                let posy = tiro.draw()
                if(posy >= 700){
                    this.tiros.splice(index, 1);
                }
            })
        }
        this.movimentar()
        if(this.type === 'Jogador'){
            this.ctx.fillStyle='#00f'
        }else{
            if(this.life/this.max_life > 0.5){
                this.ctx.fillStyle='#0f0'
            }else  if(this.life/this.max_life > 0.25){
                this.ctx.fillStyle='#ff0'
            }else{
                this.ctx.fillStyle='#f00'
            }
        }
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
        this.ctx.fillStyle='#000'
    }
    movimentar(){
        return null
    }

    atirar() { 
        return null
    }
    gerenciar_vida(){
        return null
    }   

} 

class TiroNave{
    constructor(id, parentNave, ctx, x, y, jogadores, dir=1 ){
        this.id = id
        this.parentNave = parentNave
        this.jogadores = jogadores
        this.ctx = ctx
        this.dir = dir
        this.x = x
        this.y = y
        this.w = 3
        this.h = 5
        this.velocidade = this.get_velocidade()
    }
    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    movimentar(){
        this.y += this.velocidade * this.dir
    }

    verifica_acerto(){
        this.jogadores.forEach((jogador, index)=>{
            if( (jogador.type === 'Jogador')&
                (this.y >= jogador.y)&
                (this.y+this.h <= jogador.y+jogador.h)&
                ((this.x >= jogador.x)&(this.x+this.w <= jogador.x + jogador.w))){
                this.parentNave.remover_tiro(this.id)
                if(jogador.life === 0){
                    jogador.end_game = true    
                }else{
                    jogador.life -= 1
                }
            }
            if( (jogador.type === 'Menor')&
                ((this.y <= jogador.y+jogador.h)&
                (this.y >= jogador.y))&
                ((this.x >= jogador.x)&(this.x <= jogador.x + jogador.w))){
                console.log(jogador.life)
                if(jogador.life === 0){
                    this.parentNave.remover_tiro(this.id, index, true)
                    jogador.end_game = true    
                }else{
                    this.parentNave.remover_tiro(this.id, index)
                    jogador.life -= 1
                }
            }
            if( (jogador.type === 'Maior')&
                ((this.y <= jogador.y+jogador.h)&
                (this.y >= jogador.y))&
                ((this.x >= jogador.x)&(this.x <= jogador.x + jogador.w))){
                console.log(jogador.life)
                if(jogador.life === 0){
                    this.parentNave.remover_tiro(this.id, index, true)
                    jogador.end_game = true    
                }else{
                    this.parentNave.remover_tiro(this.id, index)
                    jogador.life -= 1
                }
            }
        })
        if((this.y < 0)||(this.y > 700)){
            this.parentNave.remover_tiro(this.id)
        }
    }

    draw(){
        this.movimentar()
        this.verifica_acerto()
         if(this.parentNave.type === 'Jogador'){
            this.ctx.fillStyle='#00f'
        }else{
            if(this.life/this.max_life > 0.5){
                this.ctx.fillStyle='#0f0'
            }else  if(this.life/this.max_life > 0.25){
                this.ctx.fillStyle='#ff0'
            }else{
                this.ctx.fillStyle='#f00'
            }
        }
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
        this.ctx.fillStyle='#000'
        return this.y
    }

}

class NaveJogador extends Nave {
    constructor(end_game){
        super()
        this.end_game = end_game
        this.type = "Jogador"
        this.id_tiros = 0
        this.tiros = []
    }
    get_oponents(oponents){
        this.oponents = oponents
    }

    movimentar(direction){
        if(direction === 'left'){
        this.x -= 5
        }
        if(direction === 'right'){
            this.x += 5
        }
        if(direction === 'up'){
            this.atirar()
        }
    
    }
    atirar(){
        if(this.tiros.length < 10){
            this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, this.oponents, -1))
            this.id_tiros += 1
        }
    }
    remover_tiro(id, index_menor, is_oponent){
        if(is_oponent){
            this.oponents.splice(index_menor, 1)
        }
        this.tiros.forEach((tiro, index)=>{
            if(tiro.id === id){
                this.tiros.splice(index, 1)
            }
        })
    }

}

class NaveMenor extends Nave {
        constructor(jogador){
        super()
        this.jogador = jogador
        this.type = 'Menor'
        this.max_life = 5
        this.life = 5
        this.dx = this.get_direcao_inicial()
        this.velocidade = this.get_velocidade()
        this.id_tiros = 0
        this.tiros = []
    } 
    get_direcao_inicial(){
        return Math.floor(Math.random() * 2) || -1;
    }
    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    get_tiro(){
        return Math.random()
    }
    movimentar(){
        this.x += this.velocidade * this.dx
        if((this.x <= 0)||(this.x + this.w >= 600)){
            this.dx = this.dx * -1
        }
        var tiro = this.get_tiro()
        if(tiro > 0.98){
            this.atirar()
        }
    }
    remover_tiro(id){
        this.tiros.forEach((tiro, index)=>{
            if(tiro.id === id){
                this.tiros.splice(index, 1)
            }
        })
    }

    atirar(){
        this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, [this.jogador]))
        this.id_tiros += 1
    }   

}

class NaveMaior extends Nave {
        constructor(jogador){
        super()
        this.jogador = jogador
        this.type = 'Maior'
        this.max_life = 25
        this.life = 25
        this.dx = this.get_direcao_inicial()
        this.velocidade = this.get_velocidade()
        this.id_tiros = 0
        this.tiros = []
    } 
    get_direcao_inicial(){
        return Math.floor(Math.random() * 2) || -1;
    }
    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    get_tiro(){
        return Math.random()
    }
    movimentar(){
        this.x += this.velocidade * this.dx
        if((this.x <= 0)||(this.x + this.w >= 600)){
            this.dx = this.dx * -1
        }
        var tiro = this.get_tiro()
        if(tiro > 0.99){
            this.atirar()
        }
    }
    remover_tiro(id){
        this.tiros.forEach((tiro, index)=>{
            if(tiro.id === id){
                this.tiros.splice(index, 1)
            }
        })
    }

    atirar(){
        this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, [this.jogador]))
        this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, [this.jogador]))
        this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, [this.jogador]))
        this.id_tiros += 1
    }   
}


let anima
let initGame = true
let end_game = false
let naves 
let qtd_naves_inimigas_pequenas = 25
let qtd_naves_inimigas_grandes = 5
let movimento_personagem = [false, undefined]


function init_naves(end_game){
    var inimigos = []
    var jogador = new NaveJogador(end_game)
    jogador.criar(ctx, 300, 500, 20, 20)
    
    for(i = 0; i < qtd_naves_inimigas_pequenas; i++){
        var inimigo = new NaveMenor(jogador, id=i)
        inimigo.criar(ctx, Math.random()*500 , 200 , 10, 10)
        inimigos.push(inimigo)
    }
    for(i = 0; i < qtd_naves_inimigas_grandes; i++){
        var inimigo = new NaveMaior(jogador, id=i)
        inimigo.criar(ctx, Math.random()*500 , 100 , 50, 20)
        inimigos.push(inimigo)
    }
    jogador.get_oponents(inimigos)
    return [jogador, inimigos]
}

window.addEventListener('keydown', (e)=>{
    // console.log(e.key, 'down')
    movimento_personagem[0] = true
    if(e.key === 'ArrowRight'){
        movimento_personagem[1] = 'right'
    }
    if(e.key === 'ArrowLeft'){
        movimento_personagem[1] = 'left'
    }
    if(e.key==='ArrowUp'){
        movimento_personagem[1] = 'up'
    }
})
window.addEventListener('keyup', (e)=>{
    // console.log(e.key, 'up')
    movimento_personagem[0] = false
})


var jogador, inimigos
function draw_game(){
    ctx.clearRect(0,0,600,700)
    if(initGame){
        [jogador, inimigos] = init_naves(end_game)
        console.log(jogador)
        initGame = false
    }
    if(movimento_personagem[0]){
       jogador.movimentar(movimento_personagem[1])
    }
    jogador.draw()
    ctx.font = "30px serif";
    ctx.fillText('vida '+jogador.life, 10, 50,);
    ctx.fillText('Oponents '+jogador.oponents.length, 200, 50,);
    inimigos.forEach(inimigo=>{
        inimigo.draw()
    })
    if(!jogador.end_game){
        anima = requestAnimationFrame(draw_game)
    }
}


draw_game()
