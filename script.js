var juego = new Phaser.Game(600, 900, Phaser.AUTO, 'bloque_juego', null, false, false);


var fondoJuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var enemigos;
var balasEnemigasA;
var balasEnemigasB;
var tiempoDisparoEnemigo = 0;

var balas;
var tiempoBala = 0;
var botonDisparo;
var sonidoDisparo;
var sonidoDaño;
var musicaFondo;
var musicaMenu;
var musicaNivel2;
var musicaDerrota;
var musicaVictoria;
var sonidoEnemigoMuere;
var score = 0;
var scoreText;
var levelText;

var vidaSpiderman;
var vidas = 7;
var iconosVidas = [];


// Estado de menú principal
var estadoMenu = {
    preload: function () {
        WebFont.load({
            google: {
                families: ['Press Start 2P']
            },
            active: () => {
                this.fuenteCargada = true;
            }
        });
        
        juego.load.image('fondo', 'img/menuSpider.png');
        juego.load.image('fondoDerrota', 'img/derrota2Redimension.png');
        juego.load.image('fondoVictoria', 'img/victoria.png');
        juego.load.image('fondoVictoria2', 'img/fondoVictoria.png');
        juego.load.image('boton', 'img/buttonStart.png');
        juego.load.image('botonMenu', 'img/buttonMenu.png');
        juego.load.image('buttonWin', 'img/buttonPlayAgain.png');
        juego.load.audio('audioMenu', 'audio/menu.mp3');

        juego.load.image('cargaNivel1', 'img/cargaNivel1.png');
        juego.load.image('cargaNivel2', 'img/cargaNivel2.png');
        juego.load.image('barraCarga', 'img/barraCarga.png');
        juego.load.image('carga', 'img/carga.png');
        
        juego.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        juego.scale.pageAlignHorizontally = true;
        juego.scale.pageAlignVertically = true;
        juego.scale.refresh();

    },

    create: function () {
        // Esperar hasta que la fuente esté cargada
        if (!this.fuenteCargada) {
            juego.time.events.add(100, this.create, this);
            return;
        }
        
        fondoJuego = juego.add.tileSprite(0, 0, 600, 900, 'fondo');

        var estiloTexto = {
            font: "20px 'Press Start 2P'",
            fill: "#ffffff",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        juego.add.text(100, 800, "Richard", estiloTexto).anchor.setTo(0.5);
        juego.add.text(160, 830, "Rodas Carhuas", estiloTexto).anchor.setTo(0.5);
        juego.add.text(120, 860, "U21225422", estiloTexto).anchor.setTo(0.5);

        var boton = juego.add.button(juego.world.centerX+10, 260, 'boton', this.iniciarJuego, this);
        boton.anchor.setTo(0.5);

        musicaMenu = juego.add.audio('audioMenu');
        musicaMenu.loopFull(1);
    },

    iniciarJuego: function () {
        // Detener música si está sonando
        if (musicaMenu && musicaMenu.isPlaying) {
            musicaMenu.stop();
            musicaMenu.destroy();
        }
        // Reiniciar el nivel
        estadoPrincipal.nivelActual = 1;
        vidas = 7;
        score = 0;
        juego.state.start('estadoCarga1');
    }
};

// Estado de victoria
var estadoVictoria = {
    create: function () {
        var fondoVictoria2 = juego.add.tileSprite(0, 0, 480, 810, 'fondoVictoria2');
        fondoVictoria2.scale.setTo(600 / 480, 900 / 810);
        fondoJuego = juego.add.tileSprite(0, 0, 600, 900, 'fondoVictoria');

        var estiloTitulo = {
            font: "50px 'Press Start 2P'",
            fill: "#e0d202",
            align: "center",
            stroke: '#000000',
            strokeThickness: 18
        };

        var estiloTexto = {
            font: "24px 'Press Start 2P'",
            fill: "#ffffff",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        var estiloButton = {
            font: "26px 'Press Start 2P'",
            fill: "#ffffff",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        // Título de victoria
        juego.add.text(juego.world.centerX, 80, "YOU WIN!", estiloTitulo).anchor.setTo(0.5);

        // Botón Jugar de nuevo
        var textoScore = juego.add.text(0, 0, "SCORE:", estiloTexto);
        var textoValor = juego.add.text(0, 0, score.toString(), estiloTexto);

        // Anclaje a la izquierda (horizontal) y centro (vertical)
        textoScore.anchor.setTo(0, 0.5);
        textoValor.anchor.setTo(0, 0.5);

        var posY = 200;
        var espacio = 5; // Espacio entre los dos textos

        // Calcular ancho total de los dos textos
        var anchoTotal = textoScore.width + espacio + textoValor.width;
        var inicioX = juego.world.centerX - (anchoTotal / 2);

        // Posicionar los textos
        textoScore.x = inicioX;
        textoScore.y = posY;

        textoValor.x = textoScore.x + textoScore.width + espacio;
        textoValor.y = posY;


        juego.add.text(juego.world.centerX, 700, "PLAY AGAIN?", estiloTexto).anchor.setTo(0.5);
        var botonJugar = juego.add.button(juego.world.centerX+55, 800, 'buttonWin', this.jugarDeNuevo, this);
        botonJugar.anchor.setTo(0.5);


        // Botón Volver al menú
        var botonMenu = juego.add.button(juego.world.centerX-55, 800, 'botonMenu', this.volverMenu, this);
        botonMenu.anchor.setTo(0.5);

        musicaVictoria = juego.add.audio('victoria');
        musicaVictoria.loopFull(2);

    },

    // Reinicia el juego desde el nivel 1
    jugarDeNuevo: function () {
        if (musicaVictoria && musicaVictoria.isPlaying) {
            musicaVictoria.stop();
            musicaVictoria.destroy();
        }
        score = 0;
        vidas = 7;
        estadoPrincipal.nivelActual = 1;
        juego.world.removeAll();
        juego.state.start('estadoCarga1');
    },

    // Vuelve al menú principal
    volverMenu: function () {
        if (musicaVictoria && musicaVictoria.isPlaying) {
            musicaVictoria.stop();
            musicaVictoria.destroy();
        }
        juego.state.start('menu');
    }
};

var estadoDerrota = {
    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, 600, 900, 'fondoDerrota');

        var estiloTitulo = {
            font: "60px 'Press Start 2P'",
            fill: "#ff0000",
            align: "center",
            stroke: '#000000',
            strokeThickness: 18
        };

        var estiloButton = {
            font: "26px 'Press Start 2P'",
            fill: "#ffffff",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        var estiloTexto = {
            font: "24px 'Press Start 2P'",
            fill: "#ffffff",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        juego.add.text(juego.world.centerX, 130, "GAME OVER", estiloTitulo).anchor.setTo(0.5);

        var textoScore = juego.add.text(0, 0, "SCORE:", estiloTexto);
        var textoValor = juego.add.text(0, 0, score.toString(), estiloTexto);

        // Establecer anclaje al centro vertical
        textoScore.anchor.setTo(0, 0.5);
        textoValor.anchor.setTo(0, 0.5);

        // Posición Y fija
        var posY = 250;

        // Calcular el ancho total
        var espacio = 5; // Espacio entre los textos
        var anchoTotal = textoScore.width + espacio + textoValor.width;

        // Calcular la posición inicial (para centrar el conjunto)
        var inicioX = juego.world.centerX - anchoTotal / 2;

        // Posicionar cada texto
        textoScore.x = inicioX;
        textoScore.y = posY;

        textoValor.x = textoScore.x + textoScore.width + espacio;
        textoValor.y = posY;


        juego.add.text(juego.world.centerX, 700, "TRY AGAIN?", estiloTexto).anchor.setTo(0.5);


        var botonJugar = juego.add.button(juego.world.centerX+55, 800, 'buttonWin', this.jugarDeNuevo, this);
        botonJugar.anchor.setTo(0.5);

        var botonMenu = juego.add.button(juego.world.centerX-55, 800, 'botonMenu', this.volverMenu, this);
        botonMenu.anchor.setTo(0.5);

        musicaDerrota = juego.add.audio('derrota');
        musicaDerrota.loopFull(0.5);
    },

    jugarDeNuevo: function () {
        if (musicaDerrota && musicaDerrota.isPlaying) {
            musicaDerrota.stop();
            musicaDerrota.destroy();
        }
        score = 0;
        vidas = 7;
        estadoPrincipal.nivelActual = 1;
        juego.world.removeAll();
        juego.state.start('estadoCarga1');
    },

    volverMenu: function () {
        if (musicaDerrota && musicaDerrota.isPlaying) {
            musicaDerrota.stop();
            musicaDerrota.destroy();
        }
        juego.state.start('menu');
    }
};

var estadoCarga1 = {
    create: function () {
        juego.add.image(0, 0, 'cargaNivel1');
        var marco = juego.add.image(36, 100, 'barraCarga');
        var barra = juego.add.sprite(76, 100, 'carga');
        barra.width = 0;
        barra.height = marco.height;

        var progreso = juego.add.tween(barra).to({ width: marco.width - 80 }, 3200, Phaser.Easing.Linear.None, true);

        progreso.onComplete.addOnce(function () {
            juego.state.start('principal');
        });
    }
};

var estadoCarga2 = {
    create: function () {
        juego.add.image(0, 0, 'cargaNivel2');
        var marco = juego.add.image(36, 100, 'barraCarga');
        var barra = juego.add.sprite(76, 100, 'carga');
        barra.width = 0;
        barra.height = marco.height;

        var progreso = juego.add.tween(barra).to({ width: marco.width - 80 }, 3200, Phaser.Easing.Linear.None, true);

        progreso.onComplete.addOnce(function () {
            estadoPrincipal.nivelActual = 2;
            juego.state.start('principal');
        });
    }
};


// Estado principal de juego
var estadoPrincipal = {
    nivelActual: 1,

    preload: function () {
        juego.load.image('fondo', 'img/level1.png');
        juego.load.image('fondo2', 'img/level2.png');

        juego.load.image('reposo', 'img/reposo1.png');
        juego.load.spritesheet('personajeCorriendo', 'img/spritesheet1.png', 75, 75);
        juego.load.image('ataque', 'img/ataque1.png');

        juego.load.image('reposo2', 'img/reposo2.png');
        juego.load.spritesheet('personajeCorriendo2', 'img/spritesheet2.png', 75, 75);
        juego.load.image('ataque2', 'img/ataque2.png');

        juego.load.image('misterio', 'img/misterio.png');
        juego.load.image('lagarto', 'img/lagarto.png');
        juego.load.image('electro', 'img/electro.png');
        juego.load.image('buitre', 'img/buitre.png');
        juego.load.image('duende', 'img/duende.png');
        juego.load.image('morbius', 'img/morbius.png');
        juego.load.image('shocker', 'img/shocker.png');

        juego.load.image('venom', 'img/venom.png');
        juego.load.image('rino', 'img/rino.png');
        juego.load.image('octopus', 'img/octopus.png');
        juego.load.image('sandman', 'img/sandman.png');
        juego.load.image('carnage', 'img/carnage.png');
        juego.load.image('kingpin', 'img/kingpin.png');
        juego.load.image('spot', 'img/spot.png');
        juego.load.image('merodeador', 'img/merodeador.png');

        juego.load.image('laserA', 'img/laser.png');
        juego.load.image('laserB', 'img/armaDuende.png');
        juego.load.image('vida', 'img/vida.png');
        juego.load.image('barraVida', 'img/barraVidaLevel01.png');
        juego.load.image('barraVida2', 'img/barraVidaLevel02.png');

        juego.load.image('telaraña', 'img/disp2.png');
        juego.load.audio('sonido_disparo', 'audio/telaraña.mp3');
        juego.load.audio('musica_fondo', 'audio/level1.mp3');
        juego.load.audio('enemigo_muere', 'audio/muerte.mp3');
        juego.load.audio('nivel2', 'audio/level2.mp3');
        juego.load.audio('derrota', 'audio/derrota.mp3');
        juego.load.audio('victoria', 'audio/ganaste.mp3');
        juego.load.audio('audioMenu', 'audio/menu.mp3');
        juego.load.audio('daño', 'audio/ouh.mp3');

        juego.load.image('btnIzq', 'img/btnIzq.png');
        juego.load.image('btnDer', 'img/btnDer.png');
        juego.load.image('btnFire', 'img/btnDisp.png');

    },

    create: function () {
        this.iniciarNivel(this.nivelActual);
    },

    iniciarNivel: function (nivel) {
        if (musicaFondo && musicaFondo.isPlaying) {
            musicaFondo.stop();
            musicaFondo.destroy();
        }

        if (musicaMenu && musicaMenu.isPlaying) {
            musicaMenu.stop();
            musicaMenu.destroy();
        }

        var fondo = (nivel === 1) ? 'fondo' : 'fondo2';
        fondoJuego = juego.add.tileSprite(0, 0, 600, 900, fondo);

        var reposo = (nivel === 1) ? 'reposo' : 'reposo2';
        personaje = juego.add.sprite(300, 820, reposo);

        this.botonesMovil = juego.device.desktop ? null : this.crearBotonesMovil();

        juego.physics.arcade.enable(personaje);
        // personaje.body.collideWorldBounds = false;

        personaje.anchor.setTo(0.5);
        personaje.direccion = 'derecha';

        


        sonidoDisparo = juego.add.audio('sonido_disparo');
        sonidoDaño = juego.add.audio('daño');
        sonidoEnemigoMuere = juego.add.audio('enemigo_muere');

        if (this.nivelActual === 1) {
            musicaFondo = juego.add.audio('musica_fondo');
            musicaFondo.loopFull(0.8);
        }else{
            musicaNivel2 = juego.add.audio('nivel2');
            musicaNivel2.loopFull(1.5);
            if (musicaFondo && musicaFondo.isPlaying) {
                musicaFondo.stop();
                musicaFondo.destroy();
            }
        }

        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        balas = juego.add.group();
        balas.enableBody = true;
        balas.physicsBodyType = Phaser.Physics.ARCADE;
        balas.createMultiple(20, 'telaraña');
        balas.setAll('anchor.x', 0.5);
        balas.setAll('anchor.y', 3);
        balas.setAll('outOfBoundsKill', true);
        balas.setAll('checkWorldBounds', true);

        enemigos = juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;

        balasEnemigasA = juego.add.group();
        balasEnemigasA.enableBody = true;
        balasEnemigasA.physicsBodyType = Phaser.Physics.ARCADE;
        balasEnemigasA.createMultiple(30, 'laserA');
        balasEnemigasA.setAll('anchor.x', 0.5);
        balasEnemigasA.setAll('anchor.y', 0.5);
        balasEnemigasA.setAll('outOfBoundsKill', true);
        balasEnemigasA.setAll('checkWorldBounds', true);

        balasEnemigasB = juego.add.group();
        balasEnemigasB.enableBody = true;
        balasEnemigasB.physicsBodyType = Phaser.Physics.ARCADE;
        balasEnemigasB.createMultiple(30, 'laserB');
        balasEnemigasB.setAll('anchor.x', 0.5);
        balasEnemigasB.setAll('anchor.y', 0.5);
        balasEnemigasB.setAll('outOfBoundsKill', true);
        balasEnemigasB.setAll('checkWorldBounds', true);


        var spritesNivel1 = ['misterio', 'lagarto', 'electro', 'buitre', 'duende', 'morbius', 'shocker'];
        var spritesNivel2 = ['venom', 'rino', 'octopus', 'sandman', 'carnage', 'kingpin', 'spot', 'merodeador'];

        var estiloLetra = {
            font: "20px 'Press Start 2P'",
            fill: "#e0d202",
            align: "center",
            stroke: '#000000',
            strokeThickness: 10
        };

        juego.add.text(465, 80, "SCORE:", estiloLetra).anchor.setTo(0.5);
        scoreText = juego.add.text(560, 80, score, estiloLetra);
        scoreText.anchor.setTo(0.5);

        juego.add.text(455, 40, "LEVEL", estiloLetra).anchor.setTo(0.5);
        levelText = juego.add.text(550, 40, "01", estiloLetra);
        levelText.anchor.setTo(0.5);

        
        // Limpiar iconos anteriores
        iconosVidas.forEach(function(icono) {
            icono.destroy();
        });
        iconosVidas = [];

        var estadoBarra = (nivel === 1) ? 'barraVida' : 'barraVida2';
        vidaSpiderman = juego.add.image(20, 30, estadoBarra);

        // Redibujar los iconos según las vidas actuales
        for (var i = 0; i < vidas; i++) {
            var icono = juego.add.image(110 + i * 31, 55, 'vida');
            iconosVidas.push(icono);
        }


        var filas = (nivel === 1) ? 4 : 5;
        var cols = (nivel === 1) ? 6 : 7;
        for (var y = 0; y < filas; y++) {
            for (var x = 0; x < cols; x++) {
                var key = (nivel === 1) ? Phaser.ArrayUtils.getRandomItem(spritesNivel1) : Phaser.ArrayUtils.getRandomItem(spritesNivel2);
                var enemigo = enemigos.create(x * 100, y * 120 + 110, key);
                var startX = Phaser.Math.between(10, 540);
                var endX = Phaser.Math.between(540, 10);
                enemigo.x = startX;
                juego.add.tween(enemigo).to({ x: endX }, Phaser.Math.between(600, 800), Phaser.Easing.Linear.None, true, 0, -1, true);
                
                enemigo.tipoLaser = (Math.random() < 0.5) ? 'A' : 'B';
            }
        }

        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    },

    update: function () {
        var enMovimiento = false;
        var vel = 3;
        var nivel = this.nivelActual;

        if ((teclaDerecha.isDown || this.movDer) && personaje.x < juego.world.width - 20) {
            personaje.x += vel;
            var anim = (nivel === 1) ? 'personajeCorriendo' : 'personajeCorriendo2';
            if (personaje.key !== anim) {
                personaje.loadTexture(anim);
                personaje.animations.add('movimiento', [0,1,2,3,4], 6, true);
            }
            personaje.scale.x = 1;
            personaje.animations.play('movimiento');
            personaje.direccion = 'derecha';
            enMovimiento = true;
        } else if ((teclaIzquierda.isDown || this.movIzq) && personaje.x > 20) {
            personaje.x -= vel;
            var anim = (nivel === 1) ? 'personajeCorriendo' : 'personajeCorriendo2';
            if (personaje.key !== anim) {
                personaje.loadTexture(anim);
                personaje.animations.add('movimiento', [0,1,2,3,4], 6, true);
            }
            personaje.scale.x = -1;
            personaje.animations.play('movimiento');
            personaje.direccion = 'izquierda';
            enMovimiento = true;
        }

        if (!enMovimiento) {
            var reposo = (nivel === 1) ? 'reposo' : 'reposo2';
            if (personaje.key !== reposo) personaje.loadTexture(reposo);
            personaje.scale.x = (personaje.direccion === 'izquierda') ? -1 : 1;
        }

        if ((botonDisparo.isDown || this.disparoTactil) && juego.time.now > tiempoBala) {
            var atk = (nivel === 1) ? 'ataque' : 'ataque2';
            if (personaje.key !== atk) personaje.loadTexture(atk);
            var bala = balas.getFirstExists(false);
            if (bala) {
                bala.reset(personaje.x, personaje.y);
                bala.body.velocity.y = -300;
                sonidoDisparo.play();
                tiempoBala = juego.time.now + 100;
            }
        }

        if (juego.time.now > tiempoDisparoEnemigo) {
            enemigos.forEachAlive(function(enemigo) {
                if (Math.random() < 0.2) { // 20% chance de disparar
                    var bala = (enemigo.tipoLaser === 'A')
                        ? balasEnemigasA.getFirstExists(false)
                        : balasEnemigasB.getFirstExists(false);
                    if (bala) {
                        bala.reset(enemigo.x + enemigo.width/2, enemigo.y + enemigo.height);
                        bala.body.velocity.y = 200;
                    }
                }
            });
            tiempoDisparoEnemigo = juego.time.now + 1000; // cada segundo
        }
        

        juego.physics.arcade.overlap(balas, enemigos, this.colision, null, this);

        juego.physics.arcade.overlap(personaje, balasEnemigasA, this.personajeGolpeado, null, this);
        juego.physics.arcade.overlap(personaje, balasEnemigasB, this.personajeGolpeado, null, this);



        if (enemigos.countLiving() === 0) {
            if (this.nivelActual === 1) {
                this.nivelActual = 2;
                juego.world.removeAll();
                juego.state.start('estadoCarga2');
                levelText.text = "02";
                if (musicaFondo && musicaFondo.isPlaying) {
                    musicaFondo.stop();
                    musicaFondo.destroy();
                }
            } else {
                juego.state.start('estadoVictoria');
                if (musicaNivel2 && musicaNivel2.isPlaying) {
                    musicaNivel2.stop();
                    musicaNivel2.destroy();
                }
            }
        }
    },

    crearBotonesMovil: function () {
        var btnIzq = juego.add.button(20, 820, 'btnIzq');
        var btnDer = juego.add.button(140, 820, 'btnDer');
        var btnFire = juego.add.button(480, 700, 'btnFire');
    
        btnIzq.alpha = 0.3;
        btnDer.alpha = 0.3;
        btnFire.alpha = 0.6;
    
        btnIzq.fixedToCamera = true;
        btnDer.fixedToCamera = true;
        btnFire.fixedToCamera = true;
    
        btnIzq.events.onInputDown.add(() => this.movIzq = true);
        btnIzq.events.onInputUp.add(() => this.movIzq = false);
    
        btnDer.events.onInputDown.add(() => this.movDer = true);
        btnDer.events.onInputUp.add(() => this.movDer = false);
    
        btnFire.events.onInputDown.add(() => this.disparoTactil = true);
        btnFire.events.onInputUp.add(() => this.disparoTactil = false);
    
        return [btnIzq, btnDer, btnFire];
    },
    

    colision: function (bala, enemigo) {
        bala.kill();
        enemigo.kill();
        sonidoEnemigoMuere.play();
        score += 10;
        scoreText.text = score;
    },

    personajeGolpeado: function(personaje, bala) {
        bala.kill();
        vidas--;
    
        if (iconosVidas[vidas]) {
            iconosVidas[vidas].destroy(); // Elimina el ícono visualmente
            sonidoDaño.play();
        }
    
        if (vidas <= 0) {
            if (musicaFondo && musicaFondo.isPlaying) {
                musicaFondo.stop();
                musicaFondo.destroy();
            }
            if (musicaNivel2 && musicaNivel2.isPlaying) {
                musicaNivel2.stop();
                musicaNivel2.destroy();
            }
            juego.state.start('estadoDerrota');
        }
    }
    
    
};

juego.state.add('menu', estadoMenu);
juego.state.add('estadoCarga1', estadoCarga1);
juego.state.add('estadoCarga2', estadoCarga2);
juego.state.add('principal', estadoPrincipal);
juego.state.add('estadoVictoria', estadoVictoria);
juego.state.add('estadoDerrota', estadoDerrota);
juego.state.start('menu');
