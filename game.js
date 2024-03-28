// Configurando a cena
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// Renderizador
const renderer = new THREE.WebGLRenderer();

// Tamanho da tela
renderer.setSize(window.innerWidth, window.innerHeight);

// Linkando o renderizador
document.body.appendChild(renderer.domElement);

// Instanciando o loader
const loader = new THREE.GLTFLoader();


// Carregando a árvore
loader.load("../tree/scene.gltf", function(gltf) {
    scene.add(gltf.scene);
    gltf.scene.scale.set(16, 16, 16);
    gltf.scene.position.set(0, -6, -12);
});

// Classe player
class player {
    constructor() {
        const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const player = new THREE.Mesh(geometry, material);
        scene.add(player);
        this.player = player;

        player.position.x = 3;
        player.position.y = 0;
        player.position.z = 0;

        this.playerInfo = {
            positionX: 6,
            velocity: 0,
        }
    }

    anda() {
        this.playerInfo.velocity = 0.1;
    }

    update() {
        this.checa();
        this.playerInfo.positionX -= this.playerInfo.velocity;
        this.player.position.x = this.playerInfo.positionX;
    }

    para() {
        this.playerInfo.velocity = 0;
    }

    checa() {
        if(this.playerInfo.velocity > 0 && !taDeCostas) {
            text.innerText = 'Você Perdeu!';
            gameStatus = 'fimDeJogo';
        }
        if(this.playerInfo.positionX < -8) {
            text.innerText = 'Você Ganhou!';
            gameStatus = 'fimDeJogo';
        }
    }
}

// Delay na boneca
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Classe boneca
class boneca {
    constructor() {
        loader.load("../model/scene.gltf", (gltf) => {
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.4, 0.4, 0.4);
            gltf.scene.position.set(0, -1, -1);
            this.Boneca1 = gltf.scene;
        });
    }

    praTras() {
        gsap.to(this.Boneca1.rotation, { y: -3.15, duration: 1 });
        setTimeout(()=>taDeCostas=true, 450);
    }
    praFrente() {
        gsap.to(this.Boneca1.rotation, { y: 0, duration: 1 });
        setTimeout(()=>taDeCostas=false, 550);
    }

    async start() {
        this.praTras();
        await delay((Math.random()*1000)+1000);
        this.praFrente();
        await delay((Math.random()*1000)+1000);
        this.start();
    }
}

let Player1 = new player();
let Boneca1 = new boneca();
const text = document.querySelector('.text');
const tMaximo = 5;
let gameStatus = 'Esperando';
let taDeCostas = true;

async function init() {
    await delay(500);
    text.innerText = 'Começando em 3...';
    await delay(500);
    text.innerText = 'Começando em 2...';
    await delay(500);
    text.innerText = 'Começando em 1...';
    await delay(500);
    text.innerText = 'Já!!!!';
    startGame();
}

function startGame() {
    gameStatus = 'jogando';
    Boneca1.start();
    setTimeout(() => {
        if(gameStatus != 'fimDeJogo') {
            text.innerText = 'Timeout!';
            gameStatus = 'fimDeJogo';
        }
    }, tMaximo*1000);
}
init();

// Adicionando Luz
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Adicionando cor de fundo
renderer.setClearColor(0x2605af, 0.8);

// Configurar a profundidade da câmera
camera.position.z = 5;

// Loop de renderização
function animate() {
    if(gameStatus == 'fimDeJogo') return;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    Player1.update();
}
animate();

// Capturando a alteração  de resolução
window.addEventListener('resize', onWindowResize, false);

// Função que torna a tela responsiva
function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Pressiona a tecla
window.addEventListener('keydown', function(e) {
    if(gameStatus != 'jogando') return;
    if(e.keyCode == 37) {
        Player1.anda();
    }
});

// Libera a tecla
window.addEventListener('keyup', function(e) {
    if(e.keyCode == 37) {
        Player1.para();
    }
});