let ANIMA
let INIT_GAME = true
var GAME
let movimento_jogador = {dx:0}
var canvas
var game_dimensions = {}

window.addEventListener('keydown', ({key})=>{   
    if(key === 'ArrowRight'){
        movimento_jogador[key] = true
    }
    if(key === 'ArrowLeft'){
        movimento_jogador[key] = true
    }
    if(key === 'Arrowup'){
        movimento_jogador[key] = true
    }

},true)
window.addEventListener('keyup', ({key})=>{
     if(key === 'ArrowRight'){
        movimento_jogador[key] = false 
    }
    if(key === 'ArrowLeft'){
        movimento_jogador[key] = false 
    }
    if(key === 'Arrowup'){
        movimento_jogador[key] = false
    }
}, true)


class Nave {
    constructor(config, player = false){
        this.ctx = config.ctx
        this.img = config.img || undefined
        this.x = config.x
        this.y = config.y
        this.w = config.w
        this.h = config.h
        this.scale = config.scale
        this.id = config.id
        this.max_tiros = config.max_tiros
        this.potencia = config.potencia
        this.barreira = config.barreira
        this.has_barreira = true
        this.life = config.life
        this.max_life = this.life
        this.tiros = []
        this.id_tiros = 0
        this.dx
        this.velocidade
        this.color
        this.player = player 
        this.init()

    }   

    init(){
         if(this.img){
            this.image = new Image()
            this.image.src = this.img
            this.w = this.image.width * this.scale
            this.h = this.image.height * this.scale
        }
    }

    movimentar(movimento_jogador){
        if(this.player){
            if(movimento_jogador['ArrowRight']){ this.dx = 1 }
            else if(movimento_jogador['ArrowLeft']){ this.dx = -1 } 
            else{ this.dx = 0 }
            this.x += this.velocidade * this.dx 
        }
        this.x += this.velocidade * this.dx
        if((this.x <= 0)||(this.x + this.w >= 600)){
            this.dx = this.dx * -1
        }
    }


    remover_tiro(id){
        this.tiros.forEach((tiro, index)=>{
            if(tiro.id === id){
                this.tiros.splice(index, 1)
            }
        })
    }
    get_random_tiro(){
        return Math.random()
    }

    atirar(movimento_jogador){
        if(this.player){
            if(movimento_jogador['ArrowUp']){ this.dy = -1 }
            if(this.tiros.length <= this.max_tiros){
                this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+this.w/2, this.y+10, -1, this.potencia))
                this.id_tiros += 1
            }
        }else{
            var tiro = this.get_random_tiro()
            if((tiro > 0.97)&(this.tiros.length <= this.max_tiros)){
                if(this.type === 'Maior'){
                    this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, 1, this.potencia, 5, 10))
                }else{
                    this.tiros.push(new TiroNave(this.id_tiros, this, this.ctx, this.x+5, this.y+10, 1, this.potencia))
                }
                this.id_tiros += 1
            }
        }
    } 
    draw_tiros(){
        this.tiros.forEach(tiro=>{
            tiro.draw()
        })
    }

    draw_barreira(){

    }
    remove_barreira(){

    }
    draw_rect(){
        this.ctx.fillStyle = this.color
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
    }
    draw_image(){
       
            this.ctx.save()
            this.ctx.translate(
                this.x ,
                this.y 
            )
            this.ctx.rotate(0.3*this.dx)
            this.ctx.translate(
                -this.x ,
                -this.y 
            )
            
            this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h)
            this.ctx.restore()
    }
    draw(movimento_jogador){
         if(this.img){
            this.draw_image()
        }else{
            this.draw_rect()
        }
        this.movimentar(movimento_jogador)
        this.atirar(movimento_jogador)
        this.draw_tiros()
        this.draw_barreira()
    }

}

class NaveJogador extends Nave {
    constructor(config){
        super(config, true)
        this.type = "Jogador"
        this.id_tiros = 0
        this.tiros = []
        this.color = '#009'
        this.color_barreira = '#009'
        this.velocidade = 1
        this.dx = 1
    }

    get_item(id, increment){
        this.life += Math.round(increment)
        this.droped_items.forEach((item, index)=>{
            if(item.id === id){
                this.droped_items.splice(index, 1)
            }
        })
    }
    get_letter(id){
        this.droped_letters.forEach((letter, index)=>{
            if(letter.id === id){
                verify_letter(letter.letter, this)
                this.droped_letters.splice(index, 1)
            }
        })
    }
    remove_barreira(){
        this.has_barreira = false
        this.color_barreira = '#000'

    }
    draw_barreira(){
        if(this.barreira > 0){
            this.has_barreira = true
            this.color_barreira = '#009'
        }
        this.ctx.strokeStyle  = this.color_barreira
        this.ctx.lineWidth = 5;
        this.ctx.strokeRect(this.x - 10, this.y -10, this.w+20, this.h+20)
    }


}

class NaveInimiga extends Nave{
     constructor(config, type){
        super(config)
        this.type = type
        this.dx = this.get_direcao_inicial()
        this.velocidade = this.get_random_velocidade()
        this.color = '#070'
        this.has_barreira = false
        this.get_position_nave()
    }

    get_position_nave(){
        console.log(this.w,)
        this.x = Math.random()*(600-this.w)
        this.y = this.type === 'Menor' ? 200 : 100
    }

    update_color(){
        if(this.life/this.max_life > 0.5){
             this.color='#070'
        }else  if(this.life/this.max_life > 0.25){
            this.color='#dd0'
        }else{
             this.color='#800'
        }
    }
    get_random_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    get_direcao_inicial(){
        return Math.floor(Math.random() * 2) || -1;
    }

}

class NaveMenor extends NaveInimiga {
       constructor(config){
        super(config, 'Menor')
    } 
}

class NaveMaior extends NaveInimiga {
       constructor(config){
         super(config, 'Maior')
    } 
}

class TiroNave{
    constructor(id, parentNave, ctx, x, y, dy, potencia, w=3, h=5){
        this.id = id
        this.parentNave = parentNave
        this.potencia = potencia
        this.ctx = ctx
        this.dy = dy
        this.x = x
        this.y = y
        this.w = w
        this.h = h
        this.velocidade = this.get_velocidade()
    }
    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    movimentar(){
        this.y += this.velocidade * this.dy
    }

    verifica_acerto(game, jogadores){
        jogadores.forEach( jogador => {
            if(
                ((this.x + this.w >= jogador.x) & (this.x <= jogador.x + jogador.w))&
                ((this.y + this.h >= jogador.y ) & (this.y <= jogador.y + jogador.h)))
            {
                if(jogador.life > 0){
                    if(jogador.has_barreira){
                        if(jogador.barreira > 0){
                            jogador.barreira -= this.potencia
                        }else{
                            jogador.remove_barreira()
                        }
                    }else{
                        jogador.life -= this.potencia
                    }
                    this.remover_tiro_by_id(this.id)
                }else{
                    if(jogador.type === 'Jogador'){
                        game.endgame = true
                    }else{
                        if(jogador.type === 'Menor'){
                            var item = new Item(game.qtd_items, jogador, this.ctx)
                            game.qtd_items += 1
                            game.droped_items.push(item)
                        }else{
                            var letter = new Letter(game.droped_letters, jogador, this.ctx)
                            game.qtd_letters += 1
                            game.droped_letters.push(letter)

                        }
                        game.naves_inimigas.forEach((nave, index)=>{
                            if(nave.id === jogador.id){
                                game.naves_inimigas.splice(index, 1)
                            }
                        })
                        game.naves.forEach((nave, index)=>{
                            if(nave.id === jogador.id){
                                game.naves.splice(index, 1)
                            }
                        })
                    }
                }
            }  
        })
            
    }
    remover_tiro_by_id(id){
        this.parentNave.tiros.forEach((tiro, index)=>{
            if(tiro.id === id){
                this.parentNave.tiros.splice(index, 1)
            }
        })
    }
    remover_tiro(){
        this.parentNave.tiros.forEach((tiro, index)=>{
            if(((tiro.y <= 0)||(tiro.y >= 700))&(tiro.id === this.id)){
                this.parentNave.tiros.splice(index, 1)
            }
        })
    }

    draw(){
        this.movimentar()
        this.ctx.fillStyle = this.parentNave.color
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
        this.remover_tiro()
    }

}

class Item{
    constructor(id, parent, ctx){
        this.ctx = ctx
        this.x = parent.x
        this.y = parent.y
        this.w = 10
        this.h = 10
        this.id = id
        this.velocidade = this.get_velocidade()
        this.dir = 1
        this.color = '#0ff'
        this.init()
    }
    init(){
        [this.type, this.color] = this.random_type()
    }
    random_type(){
        let types = ['life','barreira','potencia','max_tiros']
        let colors = ['#0ff','#077','#f90', '#f0f']
        let index = Math.round(Math.random()*types.length)
        return [types[index], colors[index]]
    }

    random_increment(){
        return Math.round(Math.random()*10)
    }

    remover_item(items){
        items.forEach((item, index)=>{
            if(item.id === this.id){
                items.splice(index, 1)
            }
        })
    }

    verifica_acerto(game, jogador){
       if(
            ((this.x + this.w >= jogador.x) & (this.x <= jogador.x + jogador.w))&
            ((this.y + this.h >= jogador.y ) & (this.y <= jogador.y + jogador.h)))
        {
            jogador[this.type] += this.random_increment()+1
            this.remover_item(game.droped_items)        
        }  
            
    }

    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }

    movimentar(){
        this.y += this.velocidade * this.dir
    }

    draw(){
        this.movimentar()
        this.ctx.fillStyle= this.color
        this.ctx.fillRect(this.x, this.y, this.w, this.h)
    }


}

class Letter{
    constructor(id, parent, ctx){
        this.ctx = ctx
        this.x = parent.x
        this.y = parent.y
        this.w = 10
        this.h = 10
        this.id = id
        this.velocidade = this.get_velocidade()
        this.dir = 1
        this.letter = this.random_letter()
    }

    random_letter(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        return characters[Math.round(Math.random()*characters.length-1)]
    }

    remover_letter(letters){
        letters.forEach((letter, index)=>{
            if(letter.id === this.id){
                letters.splice(index, 1)
            }
        })
    }

    verifica_acerto(game, jogador){
       if(
            ((this.x + this.w >= jogador.x) & (this.x <= jogador.x + jogador.w))&
            ((this.y + this.h >= jogador.y ) & (this.y <= jogador.y + jogador.h)))
        {
            this.remover_letter(game.droped_letters)        
        }  
            
    }
    get_velocidade(){
        return Math.floor(Math.random() * 5) + 1
    }
    movimentar(){
        this.y += this.velocidade * this.dir
    }
    draw(){
        this.movimentar()
        this.ctx.textAlign = "center";
        this.ctx.fillStyle='#000'
        this.ctx.fillText(this.letter, this.x, this.y+25,this.w);
        return this.y
    }


}

class Game { 
    constructor(ctx){
        this.jogador_config = {life:100,x:250, y:600, w:20, h:20, id:0, ctx:ctx, barreira:20, potencia:1, max_tiros:10, scale:0.1, img:'../static/img/nave_jogador.png'}
        this.nave_menor_config = {qtd:25, life:5 ,x:200, w:10, h:10, ctx:ctx, potencia:1, max_tiros:10, scale:0.08, img:'../static/img/nave_menor.png'}
        this.nave_maior_config = {qtd:5, life:25 ,x:100, w:30, h:10, ctx:ctx, potencia:1, max_tiros:10, scale:0.15, img:'../static/img/nave_maior.png'}
        this.id_nave_inimiga = 1
        this.total_inimigos = this.nave_maior_config.qtd + this.nave_menor_config.qtd
        this.naves_inimigas = []
        this.naves = []
        this.nave_jogador
        this.endgame = false
        this.droped_items = []
        this.droped_letters = []
        this.qtd_items = 0
        this.qtd_letters = 0
        this.ctx = ctx
    } 

    criar(){
        this.nave_jogador = new NaveJogador(this.jogador_config)
        this.naves.push(this.nave_jogador)
        for(let i = 0; i < this.total_inimigos; i++){
            i<this.nave_menor_config.qtd?this.nave_menor_config.id = this.id_nave_inimiga:this.nave_maior_config.id = this.id_nave_inimiga
            this.naves_inimigas.push(
                i<this.nave_menor_config.qtd?new NaveMenor(this.nave_menor_config):new NaveMaior(this.nave_maior_config)
             )
            this.id_nave_inimiga +=1
        }
        this.naves.push(...this.naves_inimigas)
    }
    
    verify_qtd_naves(){
        if(this.naves_inimigas.length <= (this.nave_maior_config.qtd + this.nave_menor_config.qtd)/1.3){
            let qtd_inimigos = Math.round(Math.random()*10)
            for(let i=0; i <= qtd_inimigos; i++){
                qtd_inimigos*0.7<i?this.nave_menor_config.id = this.id_nave_inimiga:this.nave_maior_config.id = this.id_nave_inimiga
                let nave = qtd_inimigos*0.7<i?new NaveMenor(this.nave_menor_config):new NaveMaior(this.nave_maior_config)
                this.naves_inimigas.push(nave)
                this.naves.push(nave)
                this.id_nave_inimiga +=1
            }
        }
    }

    clear(){
        this.ctx.clearRect(0,0,600,700)
        this.fillStyle='#000'
        this.ctx.fillRect(0,0,600,700)
    }

    verify_tiros(){
        this.nave_jogador.tiros.forEach(tiro=>{
            tiro.verifica_acerto(this, this.naves_inimigas)
        })
        this.naves_inimigas.forEach(nave =>{
            nave.tiros.forEach(tiro=>{
                tiro.verifica_acerto(this, [this.nave_jogador])
            })
        })
    }

    verify_items(){
        this.droped_items.forEach(item=>{
            item.verifica_acerto(this, this.nave_jogador)
        })
        if(this.droped_items){
            this.droped_items.forEach((item, index )=>{
                let posy = item.draw()
                if(posy >= 700){
                  this.droped_items.splice(index, 1);
                }
            })
        }

    }

    verify_letters(){
        this.droped_letters.forEach(letter=>{
            letter.verifica_acerto(this, this.nave_jogador)
        })
        if(this.droped_letters){
            this.droped_letters.forEach((letter, index )=>{
                let posy = letter.draw()
                if(posy >= 700){
                  this.droped_letters.splice(index, 1);
                }
            })
        }
    }

    draw(movimento_jogador){
        this.naves.forEach(nave => {
            if(typeof nave.update_color === 'function'){
                nave.update_color()
            }
            nave.type==='Jogador'?nave.draw(movimento_jogador):nave.draw()
        })

        this.verify_tiros()
        this.verify_items()
        this.verify_letters()
       
        if(this.droped_letters){
            this.droped_letters.forEach((letter, index )=>{
                let posy = letter.draw()
                if(posy >= 700){
                  this.droped_letters.splice(index, 1);
                }
            })
        }
        this.ctx.fillStyle='#000'
    }
} 

function init_game(){
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    canvas = c
    c.width  = 600;
    c.height = 700; 
    c.style.display = 'flex'
    c.style.maxHeight ='900px'
    // c.style.width  = '600px';
    // c.style.height = '700px';
    var game = new Game(ctx)
    game.criar()
    return game
}

function draw_game(){
    if (INIT_GAME){
        GAME = init_game()
        INIT_GAME = false 
    }
    GAME.clear()
    GAME.ctx.fillStyle = "#fff";
    GAME.ctx.font = "24px serif";
    GAME.ctx.textAlign = "start";
    GAME.ctx.fillText('hp: '+ GAME.nave_jogador.life, 10, 50,);
    GAME.ctx.fillText('bar: '+ GAME.nave_jogador.barreira, 100, 50,);
    GAME.ctx.fillText('pot: '+ GAME.nave_jogador.potencia, 200, 50,);
    GAME.ctx.fillText('max: '+ GAME.nave_jogador.max_tiros, 300, 50,);
    GAME.ctx.fillText('opo: '+ GAME.naves_inimigas.length, 400, 50,);

    GAME.verify_qtd_naves()
    GAME.draw(movimento_jogador)

    if(!GAME.end_game){
        ANIMA = requestAnimationFrame(draw_game)
    }
}

function init(start){
    cancelAnimationFrame(ANIMA)
    INIT_GAME = true
    draw_game()
}