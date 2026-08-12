import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
    initializeAppCheck,
    ReCaptchaEnterpriseProvider
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app-check.js";


/* ==========================================
   FIREBASE CONFIG
========================================== */

const firebaseConfig = {

    apiKey:
        "AIzaSyAydrOovsamCVWpBqN0RB6Xc1yk0fyh7VA",

    authDomain:
        "elias26-308aa.firebaseapp.com",

    projectId:
        "elias26-308aa",

    storageBucket:
        "elias26-308aa.firebasestorage.app",

    messagingSenderId:
        "860858863725",

    appId:
        "1:860858863725:web:8abcab463b86f540d16f64"

};


/* ==========================================
   FIREBASE
========================================== */

const app =
    initializeApp(firebaseConfig);


/* ==========================================
   APP CHECK
========================================== */

const productionHosts = [
    "ktojeelias.sk",
    "www.ktojeelias.sk"
];


if (
    productionHosts.includes(
        window.location.hostname
    )
) {

    initializeAppCheck(app, {

        provider:
            new ReCaptchaEnterpriseProvider(
                "6LedTX4tAAAAAPol82Ht5xoeS6Qs12K_68TMvNL"
            ),

        isTokenAutoRefreshEnabled: true

    });

    console.log("Firebase App Check OK");

}


/* ==========================================
   FIRESTORE
========================================== */

const db =
    getFirestore(app);


/* ==========================================
   ULOŽENIE SNA
========================================== */

window.saveDream = async function(name, dream) {

    name =
        String(name || "").trim();

    dream =
        String(dream || "").trim();


    /* --------------------------------------
       ZÁKLADNÁ KONTROLA
    -------------------------------------- */

    if (dream.length === 0) {

        throw new Error(
            "Sen nemôže byť prázdny."
        );

    }


    if (name.length > 30) {

        throw new Error(
            "Meno môže mať maximálne 30 znakov."
        );

    }


    if (dream.length > 100) {

        throw new Error(
            "Sen môže mať maximálne 100 znakov."
        );

    }


    /* --------------------------------------
       ULOŽENIE
    -------------------------------------- */

    await addDoc(

        collection(db, "dreams"),

        {

            name: name,

            dream: dream,

            approved: false,

            createdAt:
                serverTimestamp(),

            x: null,

            y: null,

            size: null,

            color: null,

            pulse: null,

            views: 0,

            favorites: 0

        }

    );


    return true;

};


/* ==========================================
   ULOŽENIE EMAILU
========================================== */

window.saveEmail = async function(email) {

    email =
        String(email || "")
            .trim()
            .toLowerCase();


    /* --------------------------------------
       ZÁKLADNÁ KONTROLA
    -------------------------------------- */

    if (!email) {

        throw new Error(
            "Zadaj e-mailovú adresu."
        );

    }


    if (
        !email.includes("@") ||
        !email.includes(".")
    ) {

        throw new Error(
            "Zadaj platnú e-mailovú adresu."
        );

    }


    if (email.length > 150) {

        throw new Error(
            "E-mailová adresa je príliš dlhá."
        );

    }


    /* --------------------------------------
       EMAIL AKO DOCUMENT ID
       
       Každý email bude mať vlastný dokument.
       Rovnaký email preto nebude možné
       vytvoriť druhýkrát.
    -------------------------------------- */

    const emailId =
        encodeURIComponent(email);


    try {

        await setDoc(

            doc(
                db,
                "emailSubscribers",
                emailId
            ),

            {

                email: email,

                createdAt:
                    serverTimestamp()

            },

            {
                merge: false
            }

        );


    } catch (err) {

        console.error(
            "Email sa nepodarilo uložiť:",
            err
        );


        /*
         * Ak dokument už existuje,
         * Firestore zápis odmietne,
         * pretože pravidlá povoľujú
         * iba vytvorenie nového dokumentu.
         */

        if (
            err.code ===
            "permission-denied"
        ) {

            throw new Error(
                "Tento e-mail už je prihlásený."
            );

        }


        throw new Error(
            "Nepodarilo sa uložiť e-mail."
        );

    }


    return true;

};


console.log("Firebase OK");