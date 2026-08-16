const question = document.getElementById("question");
const openForm = document.getElementById("openForm");

const intro = document.getElementById("intro");
const footer = document.getElementById("footer");

const form = document.getElementById("dreamForm");
const thanks = document.getElementById("thanks");

const emailSignup = document.getElementById("emailSignup");
const emailAddress = document.getElementById("emailAddress");
const emailSubscribe = document.getElementById("emailSubscribe");
const emailBackToSky = document.getElementById("emailBackToSky");

const emailThanks =
    document.getElementById("emailThanks");

const emailThanksBack =
    document.getElementById("emailThanksBack");

const dreamName = document.getElementById("dreamName");
const dreamText = document.getElementById("dreamText");

const sendButton = document.getElementById("sendDream");

const backFromForm =
    document.getElementById("backFromForm");

const text =
    "Kam odchádzajú sny,\nktoré sme si nikdy nesplnili?";

let opened = false;


/* =====================================
   ÚVODNÝ TEXT
===================================== */

window.addEventListener("load", function () {

    question.innerHTML =
        text.replace(/\n/g, "<br>");

});


/* =====================================
   OTVORENIE FORMULÁRA
===================================== */

openForm.addEventListener("click", function (e) {

    e.stopPropagation();

    if (opened) return;

    opened = true;

    intro.classList.add("fadeOut");

    footer.classList.add("fadeOut");


    setTimeout(function () {

        form.classList.remove("hidden");

        dreamName.focus();

    }, 700);

});


/* =====================================
   ODOSLANIE SNA
===================================== */

sendButton.addEventListener("click", async function () {

    const name =
        dreamName.value.trim();

    const dream =
        dreamText.value.trim();


    /* ---------------------------------
       PRÁZDNY SEN
    --------------------------------- */

    if (!dream.length) {

        dreamText.focus();

        return;

    }


    /* ---------------------------------
       LIMIT MENA
    --------------------------------- */

    if (name.length > 30) {

        alert(
            "Meno môže mať maximálne 30 znakov."
        );

        dreamName.focus();

        return;

    }


    /* ---------------------------------
       LIMIT SNA
    --------------------------------- */

    if (dream.length > 100) {

        alert(
            "Sen môže mať maximálne 100 znakov."
        );

        dreamText.focus();

        return;

    }


    /* ---------------------------------
       ODOSLANIE DO FIREBASE
    --------------------------------- */

    try {

        sendButton.disabled = true;

        const success =
            await window.saveDream(
                name,
                dream
            );


        if (!success) {

            alert(
                "Nepodarilo sa odoslať sen."
            );

            sendButton.disabled = false;

            return;

        }


    } catch (err) {

        console.error(err);

        alert(
            err.message
        );

        sendButton.disabled = false;

        return;

    }


    /* ---------------------------------
       SEN ÚSPEŠNE ODOSLANÝ
    --------------------------------- */

    form.classList.add("hidden");


    /* ---------------------------------
       POĎAKOVANIE
    --------------------------------- */

    setTimeout(function () {

        thanks.classList.remove("hidden");


        /* ---------------------------------
           POĎAKOVANÍ NASLEDUJE EMAIL
        --------------------------------- */

        setTimeout(function () {

            thanks.classList.add("hidden");

            emailSignup.classList.remove("hidden");

            if (emailAddress) {

                emailAddress.focus();

            }

        }, 1500);

    }, 700);

});


/* =====================================
   NÁVRAT Z FORMULÁRA
===================================== */

if (backFromForm) {

    backFromForm.addEventListener(
        "click",
        function () {

            form.classList.add("hidden");

            intro.classList.remove("fadeOut");

            footer.classList.remove("fadeOut");

            opened = false;

            sendButton.disabled = false;

        }
    );

}


/* =====================================
   EMAIL – PRIHLÁSENIE
===================================== */

if (emailSubscribe) {

    emailSubscribe.addEventListener(
        "click",
        async function () {

            const email =
                emailAddress
                    ? emailAddress.value.trim()
                    : "";


            /* ---------------------------------
               PRÁZDNA ADRESA
            --------------------------------- */

            if (!email) {

                if (emailAddress) {
                    emailAddress.focus();
                }

                return;

            }


            /* ---------------------------------
               ZÁKLADNÁ KONTROLA EMAILU
            --------------------------------- */

            if (
                !email.includes("@") ||
                !email.includes(".")
            ) {

                alert(
                    "Zadaj platnú e-mailovú adresu."
                );

                if (emailAddress) {
                    emailAddress.focus();
                }

                return;

            }


            /* ---------------------------------
               ULOŽENIE DO FIREBASE
            --------------------------------- */

            try {

                emailSubscribe.disabled = true;

                const success =
                    await window.saveEmail(email);


                if (!success) {

                    alert(
                        "Nepodarilo sa uložiť e-mail."
                    );

                    emailSubscribe.disabled = false;

                    return;

                }


            } catch (err) {

                console.error(err);

                alert(
                    err.message ||
                    "Nepodarilo sa uložiť e-mail."
                );

                emailSubscribe.disabled = false;

                return;

            }


            /* ---------------------------------
               ÚSPEŠNÉ PRIHLÁSENIE
            --------------------------------- */

            emailSignup.classList.add("hidden");


            if (emailThanks) {

                setTimeout(function () {

                    emailThanks.classList.remove("hidden");

                }, 500);

            }

        }
    );

}


/* =====================================
   SPÄŤ NA HVIEZDNÚ OBLOHU
   Z EMAILOVEJ OBRAZOVKY
===================================== */

if (emailBackToSky) {

    emailBackToSky.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

            emailSignup.classList.add("hidden");

            location.reload();

        }
    );

}


/* =====================================
   SPÄŤ NA HVIEZDNÚ OBLOHU
   Z EMAILOVÉHO POĎAKOVANIA
===================================== */

if (emailThanksBack) {

    emailThanksBack.addEventListener(
        "click",
        function (e) {

            e.stopPropagation();

            emailThanks.classList.add("hidden");

            location.reload();

        }
    );

}