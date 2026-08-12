const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");
const charactersImage = new Image();
charactersImage.src = "postavy.png";

function resize() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);


const firebaseConfig = {

    apiKey: "AIzaSyAydrOovsamCVWpBqN0RB6Xc1yk0fyh7VA",
    authDomain: "elias26-308aa.firebaseapp.com",
    projectId: "elias26-308aa",
    storageBucket: "elias26-308aa.firebasestorage.app",
    messagingSenderId: "860858863725",
    appId: "1:860858863725:web:8abcab463b86f540d16f64"

};


const dreamStars = [];

let hoveredDream = null;

const popup = document.getElementById("dreamPopup");
console.log("popup =", popup);
const popupText = document.getElementById("dreamPopupText");
const popupAuthor = document.getElementById("dreamPopupAuthor");
let popupOpen = false;


async function loadDreamStars() {

    try {

        const { initializeApp } =
            await import(
                "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js"
            );

        const {
            getFirestore,
            collection,
            query,
            where,
            getDocs
        } =
            await import(
                "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js"
            );

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        dreamStars.length = 0;

        const q = query(
            collection(db, "dreams"),
            where("approved", "==", true)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach(doc => {

            const data = doc.data();

            dreamStars.push({

                x: data.x,
                y: data.y,
                size: data.size,
                color: data.color,
                pulse: data.pulse,
                dream: data.dream,
                name: data.name || "Anonym",
                timer: Math.random() * 1000

            });

        });

        console.log(
            "Načítaných snov:",
            dreamStars.length
        );

    } catch(error) {

        console.error(
            "Firebase sa nepodarilo načítať:",
            error
        );

    }

}


let fogTime = 0;

let meteor = null;

let nextMeteor =
    performance.now() +
    25000 +
    Math.random() * 45000;


const stars = [];

for(let i = 0; i < 550; i++){

    const r = Math.random();

    let type = "static";

    if(r > 0.80 && r < 0.97)
        type = "pulse";

    if(r >= 0.97)
        type = "flash";

    stars.push({

        x:Math.random(),

        y:Math.random()*0.68,

        radius:
            Math.random() < .90
            ? Math.random()*.45+.15
            : Math.random()*1.4+.4,

        alpha:Math.random()*.18+.09,

        base:Math.random()*.18+.09,

        speed:Math.random()*.002+.0004,

        timer:Math.random()*1000,

        type,

        color:[
            "#ffffff",
            "#f8f6e7",
            "#d8eaff"
        ][Math.floor(Math.random()*3)]

    });

}

function getDawnProgress() {

    const now = Date.now();

  const dawnStart =
    new Date("2026-10-28T00:00:00").getTime();

const dawnEnd =
    new Date("2026-11-04T00:00:00").getTime();

    if (now < dawnStart) {
        return 0;
    }

    if (now >= dawnEnd) {
        return 1;
    }

const progress = 1;


return Math.pow(progress, 1.8);
}


function drawSky(){

    const g = ctx.createLinearGradient(

        0,
        0,

        0,
        canvas.height

    );

    g.addColorStop(0.00,"#010205");
    g.addColorStop(0.18,"#020611");
    g.addColorStop(0.42,"#06111f");
g.addColorStop(0.70,"#182d45");
    g.addColorStop(1.00,"#31445a");

    ctx.fillStyle = g;

    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    const dawn = getDawnProgress();

   if (dawn > 0) {

const horizonGlow = ctx.createLinearGradient(
    0,
    canvas.height * 0.58,
    0,
    canvas.height
);

horizonGlow.addColorStop(
    0,
    `rgba(210,180,175,${0.05 * dawn})`
);

horizonGlow.addColorStop(
    0.55,
    `rgba(235,195,175,${0.18 * dawn})`
);

horizonGlow.addColorStop(
    1,
    `rgba(245,210,185,${0.50 * dawn})`
);

ctx.fillStyle = horizonGlow;

ctx.fillRect(
    0,
    canvas.height * 0.55,
    canvas.width,
    canvas.height * 0.45
);

    const dawnColor = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    dawnColor.addColorStop(
        0.00,
        `rgba(15,25,60,${0.10 * dawn})`
    );

    dawnColor.addColorStop(
        0.25,
        `rgba(30,55,105,${0.18 * dawn})`
    );

    
   dawnColor.addColorStop(
    0.50,
    `rgba(70,105,170,${0.45 * dawn})`
);

dawnColor.addColorStop(
    0.70,
    `rgba(120,155,210,${0.65 * dawn})`
);

dawnColor.addColorStop(
    0.80,
    `rgba(185,185,210,${0.82 * dawn})`
);

    dawnColor.addColorStop(
        0.88,
        `rgba(220,190,185,${0.78 * dawn})`
    );

    dawnColor.addColorStop(
        1.00,
        `rgba(255,175,115,${0.95 * dawn})`
    );

    ctx.fillStyle = dawnColor;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}
    const milky = ctx.createRadialGradient(

        canvas.width*.72,
        canvas.height*.16,
        0,

        canvas.width*.72,
        canvas.height*.16,
        canvas.width*.45

    );

    milky.addColorStop(0,"rgba(255,255,255,.035)");
    milky.addColorStop(.2,"rgba(220,235,255,.025)");
    milky.addColorStop(.45,"rgba(180,210,255,.015)");
    milky.addColorStop(1,"rgba(255,255,255,0)");

    ctx.fillStyle = milky;

    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

    const vignette = ctx.createRadialGradient(

        canvas.width/2,
        canvas.height/2,
        canvas.width*.20,

        canvas.width/2,
        canvas.height/2,
        canvas.width*.80

    );

    vignette.addColorStop(0,"rgba(0,0,0,0)");
    vignette.addColorStop(.7,"rgba(0,0,0,.08)");
    vignette.addColorStop(1,"rgba(0,0,0,.28)");

    ctx.fillStyle = vignette;

    ctx.fillRect(

        0,
        0,

        canvas.width,
        canvas.height

    );

}
let cosmicCanvas = null;
let cosmicCtx = null;
let cosmicLastWidth = 0;
let cosmicLastHeight = 0;

function createCosmicLayer() {

    cosmicCanvas = document.createElement("canvas");

    cosmicCanvas.width = canvas.width;
    cosmicCanvas.height = canvas.height;

    cosmicCtx = cosmicCanvas.getContext("2d");

    cosmicLastWidth = canvas.width;
    cosmicLastHeight = canvas.height;

    const layers = [
        {
            x: canvas.width * 0.30,
            y: canvas.height * 0.22,
            radius: canvas.width * 0.48,
            color: "rgba(105,145,210,0.018)"
        },
        {
            x: canvas.width * 0.68,
            y: canvas.height * 0.30,
            radius: canvas.width * 0.42,
            color: "rgba(155,125,205,0.014)"
        },
        {
            x: canvas.width * 0.48,
            y: canvas.height * 0.48,
            radius: canvas.width * 0.55,
            color: "rgba(80,125,190,0.010)"
        }
    ];

    layers.forEach(layer => {

        const g = cosmicCtx.createRadialGradient(
            layer.x,
            layer.y,
            0,
            layer.x,
            layer.y,
            layer.radius
        );

        g.addColorStop(0, layer.color);
        g.addColorStop(
            0.35,
            layer.color.replace(/\.\d+\)/, "0.008)")
        );
        g.addColorStop(
            0.70,
            "rgba(120,150,210,0.003)"
        );
        g.addColorStop(
            1,
            "rgba(120,150,210,0)"
        );

        cosmicCtx.fillStyle = g;

        cosmicCtx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    });

}

function drawCosmicVeil() {

    if (
        !cosmicCanvas ||
        cosmicLastWidth !== canvas.width ||
        cosmicLastHeight !== canvas.height
    ) {
        createCosmicLayer();
    }

    ctx.drawImage(
        cosmicCanvas,
        0,
        0
    );

}

function drawStars(){

    ctx.save();

    const dawn = getDawnProgress();
    const starVisibility = 1 - (dawn * 0.75);

    stars.forEach(star=>{

        switch(star.type){

            case "pulse":

                star.timer += star.speed;

                star.alpha =
                    star.base +
                    Math.sin(star.timer) * 0.025;

                break;

            case "flash":

                star.timer++;

                if(star.timer > 1400 + Math.random()*800){

                    star.alpha = 0.55;
                    star.timer = 0;

                }else{

                    star.alpha += (star.base - star.alpha) * 0.03;

                }

                break;

            default:

                star.alpha = star.base;

        }

        ctx.beginPath();

        ctx.arc(

            star.x * canvas.width,

            star.y * canvas.height,

            star.radius,

            0,

            Math.PI * 2

        );

ctx.globalAlpha = star.alpha * starVisibility;
        ctx.fillStyle = star.color;

      ctx.shadowBlur = 0;
ctx.shadowColor = "transparent";

ctx.fill();

    });

    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

}
function getDreamPosition(star) {

    let x = star.x * canvas.width;
    let y = star.y * canvas.height;

    if (window.innerWidth <= 600) {
        y = canvas.height * (
            0.52 + star.y * 0.42
        );
    }

    // Prevod pozície canvasu na pozíciu na obrazovke
    const rect = canvas.getBoundingClientRect();

    const screenX =
        rect.left + (x / canvas.width) * rect.width;

    const screenY =
        rect.top + (y / canvas.height) * rect.height;

    // Miesta, kam nechceme umiestňovať sny
    const blockedIds = [
        "question",
        "openForm",
        "logo",
        "release",
        "timer"
    ];

    let blocked = false;

    for (const id of blockedIds) {

        const element = document.getElementById(id);

        if (!element) continue;

        const r = element.getBoundingClientRect();

        if (
            screenX >= r.left - 35 &&
            screenX <= r.right + 35 &&
            screenY >= r.top - 35 &&
            screenY <= r.bottom + 35
        ) {
            blocked = true;
            break;
        }
    }

    // Ak je sen pod textom/logom,
    // presunieme ho do voľnej spodnej časti oblohy.
    if (blocked) {

        x = canvas.width * (
            0.10 + ((star.x * 13.731) % 1) * 0.80
        );

        y = canvas.height * (
            0.52 + ((star.y * 17.421) % 1) * 0.30
        );
    }

    return { x, y };
}



function drawDreamStars(){

    ctx.save();

    dreamStars.forEach(star => {

        star.timer += 0.03;

        const alpha =
            0.75 +
            Math.sin(star.timer * star.pulse) * 0.25;

        const position = getDreamPosition(star);

        const starX = position.x;
        const starY = position.y;

        const radius =
            hoveredDream === star
                ? star.size * 1.6
                : star.size;

        ctx.beginPath();

        ctx.arc(
            starX,
            starY,
            radius,
            0,
            Math.PI * 2
        );

        ctx.globalAlpha = alpha;

        ctx.fillStyle = star.color;

        ctx.shadowBlur =
            hoveredDream === star
                ? 35
                : 18;

        ctx.shadowColor = star.color;

        ctx.fill();

    });

    ctx.restore();

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

}
function drawMeteor(){

    const now = performance.now();

    if(!meteor && now > nextMeteor){

        meteor = {

            x:Math.random()*canvas.width*0.45,

            y:Math.random()*canvas.height*0.22,

            vx:13+Math.random()*3,

            vy:6+Math.random()*2,

            life:0

        };

    }

    if(!meteor) return;

    ctx.save();

    const tail = ctx.createLinearGradient(

        meteor.x,
        meteor.y,

        meteor.x-90,
        meteor.y-45

    );

    tail.addColorStop(0,"rgba(255,255,255,.95)");
    tail.addColorStop(.3,"rgba(220,235,255,.45)");
    tail.addColorStop(1,"rgba(255,255,255,0)");

    ctx.strokeStyle = tail;

    ctx.lineWidth = 1.5;

    ctx.beginPath();

    ctx.moveTo(

        meteor.x,

        meteor.y

    );

    ctx.lineTo(

        meteor.x-90,

        meteor.y-45

    );

    ctx.stroke();

    ctx.beginPath();

    ctx.fillStyle="#ffffff";

    ctx.arc(

        meteor.x,

        meteor.y,

        1.6,

        0,

        Math.PI*2

    );

    ctx.fill();

    ctx.restore();

    meteor.x += meteor.vx;

    meteor.y += meteor.vy;

    meteor.life++;

    if(meteor.life>40){

        meteor = null;

        nextMeteor =

            now +

            30000 +

            Math.random()*60000;

    }

}

function drawHill(){

    const h = canvas.height;

    const points = [

        {x:0.00,y:.965},
        {x:.06,y:.962},
        {x:.12,y:.958},
        {x:.20,y:.950},
        {x:.30,y:.940},
        {x:.40,y:.925},
        {x:.50,y:.905},
        {x:.60,y:.875},
        {x:.67,y:.850},
        {x:.73,y:.835},
        {x:.79,y:.842},
        {x:.86,y:.860},
        {x:.93,y:.885},
        {x:1.00,y:.910}

    ];

    ctx.beginPath();

    ctx.moveTo(0,h);

    ctx.lineTo(0,points[0].y*h);

    for(let i=1;i<points.length;i++){

        const prev=points[i-1];
        const p=points[i];

        const cx=(prev.x+p.x)/2*canvas.width;
        const cy=(prev.y+p.y)/2*h;

        ctx.quadraticCurveTo(

            prev.x*canvas.width,
            prev.y*h,

            cx,
            cy

        );

    }

    const last=points[points.length-1];

    ctx.quadraticCurveTo(

        last.x*canvas.width,
        last.y*h,

        canvas.width,
        last.y*h

    );

    ctx.lineTo(canvas.width,h);

    ctx.closePath();

    ctx.fillStyle="#020203";

    ctx.fill();

    ctx.beginPath();

    ctx.moveTo(0,points[0].y*h);

    for(let i=1;i<points.length;i++){

        const prev=points[i-1];
        const p=points[i];

        const cx=(prev.x+p.x)/2*canvas.width;
        const cy=(prev.y+p.y)/2*h;

        ctx.quadraticCurveTo(

            prev.x*canvas.width,
            prev.y*h,

            cx,
            cy

        );

    }

    ctx.strokeStyle="rgba(120,170,255,.05)";

    ctx.lineWidth=1;

    ctx.stroke();

}

function getCharacterProgress() {

    const now = Date.now();

    const start =
        new Date("2026-11-04T00:00:00").getTime();

    const end =
        new Date("2026-11-11T00:00:00").getTime();

    if (now < start) return 0;

    if (now >= end) return 1;

    const progress =
        (now - start) / (end - start);

    return Math.pow(progress, 1.4);
}


function drawCharacters() {

    const progress = getCharacterProgress();

    if (progress <= 0) return;

    const h = canvas.height;

    // miesto na pravom kopci
    const baseX = canvas.width * 0.76;
    const baseY = h * 0.842;

    ctx.save();
ctx.filter = "brightness(3.2)";
    // Jemne miznú do tmy pri prvom objavení
    ctx.globalAlpha = Math.min(progress * 1.4, 1);

    /*
       ZBERAČ
    */

    const collectorX = baseX;
    const collectorY = baseY;

    // telo
    ctx.fillStyle = "#050608";

    ctx.beginPath();

    ctx.ellipse(
        collectorX,
        collectorY - h * 0.025,
        canvas.width * 0.007,
        h * 0.035,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // hlava
    ctx.beginPath();

    ctx.arc(
        collectorX,
        collectorY - h * 0.065,
        canvas.width * 0.008,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       ELIÁŠ
    */

    const eliasX = baseX + canvas.width * 0.018;
    const eliasY = baseY;

    ctx.beginPath();

    ctx.ellipse(
        eliasX,
        eliasY - h * 0.020,
        canvas.width * 0.0055,
        h * 0.027,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // hlava
    ctx.beginPath();

    ctx.arc(
        eliasX,
        eliasY - h * 0.052,
        canvas.width * 0.006,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /*
       LAMPÁŠ
    */

    const lanternX =
        baseX + canvas.width * 0.009;

    const lanternY =
        baseY - h * 0.055;

    // jemná žiara
    const glow = ctx.createRadialGradient(
        lanternX,
        lanternY,
        0,
        lanternX,
        lanternY,
        canvas.width * 0.035
    );

    glow.addColorStop(
        0,
        `rgba(255,205,120,${0.35 * progress})`
    );

    glow.addColorStop(
        0.35,
        `rgba(255,190,100,${0.12 * progress})`
    );

    glow.addColorStop(
        1,
        "rgba(255,180,80,0)"
    );

    ctx.fillStyle = glow;

    ctx.beginPath();

    ctx.arc(
        lanternX,
        lanternY,
        canvas.width * 0.035,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // samotný lampáš
    ctx.fillStyle = "#11100c";

    ctx.fillRect(
        lanternX - canvas.width * 0.003,
        lanternY - h * 0.009,
        canvas.width * 0.006,
        h * 0.014
    );

    // svetlo
    ctx.fillStyle =
        `rgba(255,220,150,${0.85 * progress})`;

    ctx.beginPath();

    ctx.arc(
        lanternX,
        lanternY - h * 0.002,
        canvas.width * 0.0022,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();

}

function drawCharacterImage() {

    if (!charactersImage.complete) return;

    const progress = getCharacterProgress();

    if (progress <= 0) return;

    ctx.save();

    ctx.globalAlpha = Math.min(progress * 1.5, 1);

    /*
       Obrázok je pôvodne 1024 × 1536.
       Zmenšíme ho na malú siluetu na kopci.
    */

    const height = canvas.height * 0.24;
    const width = height * (1024 / 1536);

    /*
       Pravá strana kopca
    */

    const x = canvas.width * 0.70;
    const y = canvas.height * 0.69;

    ctx.drawImage(
        charactersImage,
        x,
        y,
        width,
        height
    );

    ctx.restore();
}

let fogCanvas = null;
let fogCtx = null;
let fogLastWidth = 0;
let fogLastHeight = 0;

function createFogLayer() {

    fogCanvas = document.createElement("canvas");

    fogCanvas.width = canvas.width;
    fogCanvas.height = canvas.height;

    fogCtx = fogCanvas.getContext("2d");

    fogLastWidth = canvas.width;
    fogLastHeight = canvas.height;

    for(let i = 0; i < 4; i++){

        const g = fogCtx.createLinearGradient(
            0,
            canvas.height * (.55 + i * .05),
            0,
            canvas.height
        );

        g.addColorStop(
            0,
            "rgba(255,255,255,0)"
        );

        g.addColorStop(
            .35,
            "rgba(170,200,255,.015)"
        );

        g.addColorStop(
            .70,
            "rgba(170,200,255,.035)"
        );

        g.addColorStop(
            1,
            "rgba(170,200,255,.05)"
        );

        fogCtx.fillStyle = g;

        fogCtx.fillRect(
            -120,
            canvas.height * (.55 + i * .05),
            canvas.width + 240,
            canvas.height
        );
    }
}

function drawFog(){

    if(
        !fogCanvas ||
        fogLastWidth !== canvas.width ||
        fogLastHeight !== canvas.height
    ){
        createFogLayer();
    }

    ctx.drawImage(
    fogCanvas,
    0,
    0
);

    fogTime += 0.0008;
}

let lastFrame = 0;
const FRAME_INTERVAL = 1000 / 30;

let introFinished = false;

function render(timestamp){

    if (timestamp - lastFrame < FRAME_INTERVAL) {
        requestAnimationFrame(render);
        return;
    }

    lastFrame = timestamp;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawSky();
    drawCosmicVeil();
    drawStars();
    drawDreamStars();
    drawMeteor();

    drawHill();
    drawCharacterImage();

    drawFog();

   if (!document.body.classList.contains("scene-ready")) {
    document.body.classList.add("scene-ready");
}

requestAnimationFrame(render);}

canvas.addEventListener("mousemove", function(e) {

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (e.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (e.clientY - rect.top) *
        (canvas.height / rect.height);

    hoveredDream = null;

    for (const star of dreamStars) {

        const position = getDreamPosition(star);

        const dx = mouseX - position.x;
        const dy = mouseY - position.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance <= 35) {

            hoveredDream = star;
            canvas.style.cursor = "pointer";
            break;

        }
    }

    if (!hoveredDream) {
        canvas.style.cursor = "default";
    }

});
canvas.addEventListener("mouseleave", function() {

    hoveredDream = null;
    canvas.style.cursor = "default";

});
// ==============================
// KLIK / ŤUKNUTIE NA HVIEZDU
// ==============================

canvas.addEventListener("pointerdown", function(e) {
    e.stopPropagation();

    const rect = canvas.getBoundingClientRect();

    const mouseX =
        (e.clientX - rect.left) *
        (canvas.width / rect.width);

    const mouseY =
        (e.clientY - rect.top) *
        (canvas.height / rect.height);


    // Najprv zistíme, či sme klikli na nejakú hviezdu.
    let clickedStar = null;

    for (const star of dreamStars) {

        const position = getDreamPosition(star);

        const dx = mouseX - position.x;
        const dy = mouseY - position.y;

        const distance =
            Math.sqrt(dx * dx + dy * dy);

        if (distance <= 35) {

            clickedStar = star;
            break;

        }

    }


    // Ak sme klikli na hviezdu,
    // otvoríme jej sen.
    if (clickedStar) {

        popupText.textContent = clickedStar.dream;

        popupAuthor.textContent =
            clickedStar.name
                ? "— " + clickedStar.name
                : "";

        popup.classList.remove("hidden");

        popupOpen = true;

        return;

    }


    // Ak sme neklikli na hviezdu a sen je otvorený,
    // zavrieme ho.
    if (popupOpen) {

        popup.classList.add("hidden");

        popupOpen = false;

    }

});


// Sny načítame iba RAZ.
// Až potom spustíme animáciu.

if (popup) {

    popup.addEventListener("pointerdown", function(e) {

        if (e.target === popup) {

            popup.classList.add("hidden");

            popupOpen = false;

        }

    });

}

// Prvé vykreslenie okamžite – nezávisle od Firebase
requestAnimationFrame(render);

// Sny načítame na pozadí
loadDreamStars();
