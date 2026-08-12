const targetDate =
    new Date("2026-11-11T00:00:00");

const TEST_REVEAL = false;
let revealed = false;


function revealElias(){

    if(revealed) return;

    revealed = true;


    const reveal =
        document.getElementById("reveal");


    if(!reveal) return;


    reveal.classList.add("visible");

}


function updateCountdown(){

    const now =
        new Date();

    const diff =
        targetDate - now;


if(diff <= 0 || TEST_REVEAL){

        document.getElementById("timer")
            .textContent =
            "Eliáš je tu.";


        revealElias();

        return;

    }


    const days =
        Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (diff /
            (1000 * 60 * 60)) % 24
        );


    const minutes =
        Math.floor(
            (diff /
            (1000 * 60)) % 60
        );


    const seconds =
        Math.floor(
            (diff / 1000) % 60
        );


    document.getElementById("timer")
        .textContent =
        `${days} dní ${hours} h ${minutes} min ${seconds} s`;

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);