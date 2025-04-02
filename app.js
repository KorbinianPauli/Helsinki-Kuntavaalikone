
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let councillorData = [];
let partyData = [];
let meetingData = [];
let initiativeData = []; // <-- ADDED Global variable for initiatives
let currentLanguage = 'en';

// Initialize application
async function initApp() {
    try {
        // Load JSON data
        await loadData();

        // Set up event listeners
        setupEventListeners();

        // Initial page setup
        setupPages();

        // Set up language switcher
        setupLanguageSwitcher();
        setTimeout(debugPartyData, 1000);

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Load data from JSON files
async function loadData() {
    try {
        // Fetch councillor data
        const councillorResponse = await fetch('councillor_data.json');
        councillorData = await councillorResponse.json();

        // Fetch party data
        const partyResponse = await fetch('party_data.json');
        partyData = await partyResponse.json();

        // Fetch meeting data
        const meetingResponse = await fetch('meeting_data.json');
        meetingData = await meetingResponse.json();

        // <-- ADDED Fetch initiative data -->
        const initiativeResponse = await fetch('initiatives_data.json');
        initiativeData = await initiativeResponse.json();
        // <-- END ADDED -->

// ==End of OCR for page 1==

// ==Start of OCR for page 2==
        // Sort meeting data by date (most recent first)
        meetingData.sort((a, b) => new Date(b.date) - new Date(a.date));

        // <-- ADDED Sort initiative data by date (most recent first) -->
        initiativeData.sort((a, b) => new Date(b.date) - new Date(a.date));
        // <-- END ADDED -->


        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        throw error; // Re-throw error to be caught by initApp
    }
}

// Setup individual pages
function setupPages() {
    // Populate party filter options
    populatePartyFilter();

    // Render parties
    renderParties();

    // Render initial councillors
    renderCouncillors();

    // Render meeting list and initial meeting
    renderMeetings();

    // <-- ADDED Render initiative list and initial initiative -->
    renderInitiatives();
    // <-- END ADDED -->


    // Check URL hash for direct navigation
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateToPage(hash);
    } else {
        navigateToPage('home'); // Default to home if no hash
    }


    console.log('Pages set up successfully');
}

// Setup language switcher
function setupLanguageSwitcher() {
    const langEn = document.getElementById('lang-en');
    const langFi = document.getElementById('lang-fi');

    langEn.addEventListener('click', function() {
        if (currentLanguage !== 'en') {
            currentLanguage = 'en';
            updateLanguage();
            langEn.classList.add('active');
            langFi.classList.remove('active');
        }
    });


    langFi.addEventListener('click', function() {
        if (currentLanguage !== 'fi') {
// ==End of OCR for page 2==

// ==Start of OCR for page 3==
            currentLanguage = 'fi';
            updateLanguage();
            langFi.classList.add('active');
            langEn.classList.remove('active');
        }
    });
}


// Update content based on selected language
function updateLanguage() {
    // Update meetingData if a meeting is selected
    if (meetingData.length > 0) {
        const activeMeetingLi = document.querySelector('.meeting-list li.active');
        if (activeMeetingLi) {
            const meetingIndex = activeMeetingLi.getAttribute('data-index');
            if (meetingIndex !== null) {
                displayMeetingSummary(parseInt(meetingIndex)); // Ensure index is number
            }
        }
    }

    renderInitiatives();
    // <-- ADDED Update initiativeData if an initiative is selected -->
    if (initiativeData.length > 0) {
        const activeInitiativeLi = document.querySelector('.initiative-list li.active');
        if (activeInitiativeLi) {
            const initiativeIndex = activeInitiativeLi.getAttribute('data-index');
             if (initiativeIndex !== null) {
                displayInitiativeDetails(parseInt(initiativeIndex)); // Ensure index is number
             }
        }
    }
     // <-- END ADDED -->


    // Update councillor details if modal is open
    const councillorModal = document.getElementById('councillor-modal');
    if (councillorModal && councillorModal.style.display === 'block') {
        const councillorId = councillorModal.getAttribute('data-id');
        if (councillorId) {
            displayCouncillorDetails(councillorId);
        }
    }

    // Update party details if modal is open
    // Update party details if modal is open
    const partyModal = document.getElementById('party-modal');
    if (partyModal && partyModal.style.display === 'block') {
        const partyName = partyModal.getAttribute('data-party');
        if (partyName) {
            displayPartyDetails(partyName);
        }
    } else {
        // If modals are not open, refresh the info buttons with the new language
        setTimeout(addInfoButtons, 100);
    }
    
    // Update manifesto section titles if they are visible
    const helsinkiTitle = document.querySelector('.party-summary h3:first-child');
    const nationalTitle = document.querySelector('.party-summary .national-manifesto-title');
    
    if (helsinkiTitle) {
        helsinkiTitle.textContent = currentLanguage === 'en' ? 'Helsinki Manifesto' : 'Helsingin Manifesti';
    }
    
    if (nationalTitle) {
        nationalTitle.textContent = currentLanguage === 'en' ? 'National Manifesto' : 'Kansallinen Manifesti';
    }
    // Refresh info buttons if modals are not open
    if (!(councillorModal && councillorModal.style.display === 'block') && !(partyModal && partyModal.style.display === 'block')) {
         setTimeout(addInfoButtons, 100); // Add delay to ensure DOM update
    }


    // Update static text elements
    updateUIText();


}


// Update UI text based on selected language
function updateUIText() {
    // Define text elements for both languages
    const translations = {
        en: {
            // Navigation tabs
            nav_home: "Home",
            nav_parties: "Parties",
            nav_councillors: "Councillors",
            nav_meetings: "Meetings",
            nav_initiatives: "Initiatives", // <-- ADDED
            nav_about: "About",

            // Home Page
            home_title: "Helsinki City Council Tracker",
            home_subtitle: "Track, analyse, and understand Helsinki's democratic processes.",
            councillor_profiles: "Councillor Profiles",
            councillor_desc: "Detailed information about each elected representative, including their speeches, political positions and voter geography.",
            party_positions: "Party Positions",
            party_desc: "Understand each party's stance on key issues through manifesto summaries and their councillors' left-right positions.",
            meeting_summaries: "Meeting Summaries",
            meeting_desc: "Stay informed with concise summaries of council meetings.",
            why_use: "Why Use Helsinki Council Tracker?",
            why_desc: "Whether you're a researcher, journalist, engaged citizen, or simply curious about local politics, this platform provides access to the workings of the Helsinki City Council and makes it easy to stay up to date on local politics.",
            explore_now: "Explore Now",
            disclaimer_title: "Disclaimer!",
            disclaimer_item1: "The contents of this website are generated with the help of AI and may contain unintended biases or inaccuracies.",
            disclaimer_item2: "The Finnish translations are AI-generated and may contain linguistic imperfections.",
            disclaimer_item3: "For the best performance and accuracy, use this website on a desktop and in English.",
            disclaimer_item4: "Consult the official Helsinki City Council website for definitive information.",

            // Parties Page
            parties_title: "Political Parties",
            parties_subtitle: "Explore the political parties represented in the Helsinki City Council.",

            // Councillors Page
            councillors_title: "City Councillors",
            search_councillors: "Search councillors...",
// ==End of OCR for page 4==

// ==Start of OCR for page 5==
            filter_by_party: "Filter by party:",
            all_parties: "All Parties",

            // Meetings Page
            meetings_title: "Council Meetings",
            search_meetings: "Search by date...",
            meeting_placeholder: "Select a meeting date to view its summary.",

            // <-- ADDED Initiatives Page -->
            initiatives_title: "Council Initiatives",
            search_initiatives: "Search by title, initiator, or date...",
            initiative_placeholder: "Select an initiative to view its details.",
            initiative_summary_heading: "Summary",
            initiative_signatories_heading: "Signatories",
            // <-- END ADDED -->

            // About Page
            about_title: "About Helsinki Council Tracker",
            faq_title: "Frequently Asked Questions",
            contact_title: "Contact Us", // Changed from "How to get in contact"
            contact_desc: "Have questions, feedback, or suggestions? Please reach out!",

            // Graph/Map Info Tooltips
            galtan: "This graph positions party councillors (or their speeches in the councillor tab) on left-right (economic) and gal-tan (social/cultural) axes, based on AI analysis of their speeches. Lower left scores indicate more left-leaning/progressive stances; higher right scores indicate more right-leaning/traditional stances. Each dot represents a councillor's overall position (or a single speech in the councillor tab). For councillors' self-assessed positions, see Yle's Kuntavaalikone.",
            topics: "This graph shows the average topic emphasis in council members' speeches. Each speech was classified by topic (e.g., Public Transport 70%, Environment 30%). The values indicate the percentage of speaking time dedicated to each topic, reflecting issue focus not content. Topics are based on a survey by kaks.fi.",
            geo: "These maps visualise 2021 municipal election results, showing vote concentration by district. Darker areas indicate higher vote share (party) or absolute votes (councillor), sourced from Statistics Finland.",

            // FAQ Questions and Answers
            faq_q1: "Who created this website?",
            faq_a1: "The website was created by me, Korbinian Pauli. I have a B.A. in Political and Computer Science from the University of Munich and a M.Sc. in Social Data Science from the University of Copenhagen. I made this website partially as a project to showcase my skills to potential employers and partially so that people in Helsinki have an alternative to Yle's Vaalikone. Traditional election compass tools are forward looking and are lacking detailed information on what has been decided in the past. This website aims to simplify getting information about current decision making, particularly for international residents who may have difficulties finding information in English.",
            faq_q2: "Where does the data come from and is the information displayed here accurate?",
// ==End of OCR for page 5==

// ==Start of OCR for page 6==
            faq_a2: "The data is primarily based on the meeting minutes of the Helsinki City Council, but also supplemented with the official voting results of 2021 from Statistics Finland. The summaries, classifications, and topic analyses presented on this website are generated using Artificial Intelligence (AI) and should be considered supplementary information. While considerable effort has been invested in validating the accuracy of the English language results, users are advised to exercise critical judgment and consult trusted, official sources such as the Helsinki City Council website (https://paatokset.hel.fi/fi) for definitive information.",
            faq_q3: "Is this legal according to GDPR?",
            faq_a3: "This website's data collection and processing practices are compliant with the General Data Protection Regulation (GDPR). Data is processed under the legal basis of Article 6(1)(e), as it is carried out in the public interest. The political data utilized falls within the scope of Article 9 GDPR concerning special categories of personal data but is limited to information manifestly made public by Helsinki City Council members. Data collected is restricted to name, party membership, all speeches in the City Council from the current legislative period, and number of votes received in the 2021 Municipal elections. We are committed to respecting privacy rights and ensuring data accuracy. If you believe any information to be inaccurate, please reach out.",
        },
        fi: {
            // Navigation tabs
            nav_home: "Etusivu",
            nav_parties: "Puolueet",
            nav_councillors: "Valtuutetut",
            nav_meetings: "Kokoukset",
            nav_initiatives: "Aloitteet", // <-- ADDED
            nav_about: "Tietoa",

            // Home Page
            home_title: "Helsingin Kuntavaalikone", // Note: Title might need adjustment based on context
            home_subtitle: "Seuraa, analysoi ja ymmärrä Helsingin demokraattisia prosesseja.",
            councillor_profiles: "Valtuutettujen profiilit",
            councillor_desc: "Yksityiskohtaista tietoa jokaisesta valitusta edustajasta, mukaan lukien heidän puheensa, poliittiset kannat ja äänestäjien maantiede.",
            party_positions: "Puolueiden kannat",
            party_desc: "Ymmärrä kunkin puolueen kanta keskeisiin kysymyksiin ohjelmayhteenvetojen ja heidän valtuutettujensa vasemmisto-oikeisto-asemien avulla.",
            meeting_summaries: "Kokousyhteenvedot",
            meeting_desc: "Pysy ajan tasalla valtuuston kokousten tiiviiden yhteenvetojen avulla.",
// ==End of OCR for page 6==

// ==Start of OCR for page 7==
            why_use: "Miksi käyttää Helsinki Council Trackeria?",
            why_desc: "Tämä alusta tarjoaa pääsyn Helsingin kaupunginvaltuuston käsittelyihin kansalaisille, toimittajille, julkisen politiikan puolestapuhujille ja kaikille, jotka seuraavat paikallishallinnon asioita. Se toimii resurssina kunnallisten päätöksentekoprosessien seurantaan ja sitä päivitetään jatkuvasti tulevaisuudessa uusilla ominaisuuksilla.", // Slightly shortened FI desc
            explore_now: "Tutustu nyt",
            disclaimer_title: "Vastuuvapauslauseke!",
            disclaimer_item1: "Tämän verkkosivuston sisältö on tuotettu tekoälyn avulla ja saattaa sisältää tahattomia ennakkoasenteita tai epätarkkuuksia.",
            disclaimer_item2: "Suomenkieliset käännökset ovat tekoälyn tuottamia ja saattavat sisältää kielellisiä puutteita.",
            disclaimer_item3: "Parhaan suorituskyvyn ja tarkkuuden varmistamiseksi käytä tätä verkkosivustoa tietokoneella ja englanniksi.",
            disclaimer_item4: "Tarkista viralliset tiedot Helsingin kaupunginvaltuuston viralliselta verkkosivustolta.",

            // Parties Page
            parties_title: "Poliittiset puolueet",
            parties_subtitle: "Tutustu Helsingin kaupunginvaltuustossa edustettuina oleviin poliittisiin puolueisiin.",

            // Councillors Page
            councillors_title: "Kaupunginvaltuutetut",
            search_councillors: "Etsi valtuutettuja...",
            filter_by_party: "Suodata puolueen mukaan:",
            all_parties: "Kaikki puolueet",

            // Meetings Page
            meetings_title: "Valtuuston kokoukset",
            search_meetings: "Etsi päivämäärän mukaan...",
            meeting_placeholder: "Valitse kokouspäivä nähdäksesi yhteenvedon.",

             // <-- ADDED Initiatives Page -->
            initiatives_title: "Valtuuston aloitteet",
            search_initiatives: "Etsi otsikon, alullepanijan tai päivämäärän mukaan...",
            initiative_placeholder: "Valitse aloite nähdäksesi sen tiedot.",
            initiative_summary_heading: "Yhteenveto",
            initiative_signatories_heading: "Allekirjoittajat",
            // <-- END ADDED -->

            // About Page
            about_title: "Tietoa Helsinki Council Trackerista",
            faq_title: "Usein kysytyt kysymykset",
            contact_title: "Ota yhteyttä",
            contact_desc: "Onko kysyttävää, palautetta tai ehdotuksia? Ota yhteyttä!",

            // Graph/Map Info Tooltips
            galtan: "Tämä kaavio sijoittaa puolueiden valtuutetut (tai heidän puheensa valtuutettujen välilehdellä) vasemmisto-oikeisto (taloudellinen) ja gal-tan (sosiaalinen/kulttuurinen) akseleille tekoälyanalyysin perusteella. Alemmat vasemman puoleiset arvot viittaavat enemmän vasemmistolaisiin/edistyksellisiin kantoihin; korkeammat oikean puoleiset arvot viittaavat enemmän oikeistolaisiin/perinteisiin kantoihin. Jokainen piste edustaa valtuutetun kokonaisasemaa (tai yksittäistä puhetta valtuutettujen välilehdellä). Valtuutettujen itsearvioidut asemat löytyvät Ylen Kuntavaalikoneesta.", // Combined FI galtan description
// ==End of OCR for page 7==

// ==Start of OCR for page 8==
            topics: "Tämä kaavio näyttää keskimääräisen aihepainotuksen valtuuston jäsenten puheissa. Jokainen puhe luokiteltiin aiheen mukaan (esim. Julkinen liikenne 70%, Ympäristö 30%). Arvot osoittavat kunkin aiheen puheajasta käytetyn prosenttiosuuden, kuvastaen huomion kohdetta sisällön sijaan. Aiheet perustuvat kaks.fi:n kyselyyn.",
            geo: "Nämä kartat visualisoivat vuoden 2021 kunnallisvaalien tuloksia, näyttäen äänten keskittymisen alueittain. Tummemmat alueet osoittavat korkeampaa ääniosuutta (puolue) tai absoluuttisia ääniä (valtuutettu), lähteenä Tilastokeskus.",

            // FAQ Questions and Answers
            faq_q1: "Kuka loi tämän verkkosivuston?",
            faq_a1: "Verkkosivuston loi minä, Korbinian Pauli. Minulla on kandidaatin tutkinto poliittisesta tieteestä ja tietojenkäsittelytieteestä Münchenin yliopistosta ja maisterin tutkinto sosiaalisessa datatieteessä Kööpenhaminan yliopistosta. Tein tämän verkkosivuston osittain projektina esitelläkseni taitojani potentiaalisille työnantajille ja osittain, jotta Helsingissä asuvilla ihmisillä olisi vaihtoehto Ylen Vaalikoneelle. Perinteiset vaalikompassityökalut ovat tulevaisuuteen suuntautuvia ja niistä puuttuu yksityiskohtaista tietoa siitä, mitä on päätetty aiemmin. Tämän verkkosivuston tavoitteena on yksinkertaistaa nykyiseen päätöksentekoon liittyvän tiedon saamista, erityisesti kansainvälisille asukkaille, joilla saattaa olla vaikeuksia löytää tietoa englanniksi.",
            faq_q2: "Mistä tieto on peräisin ja onko täällä esitetty tieto tarkkaa?",
            faq_a2: "Tieto perustuu pääasiassa Helsingin kaupunginvaltuuston kokouspöytäkirjoihin, mutta sitä on täydennetty vuoden 2021 virallisilla äänestysluvuilla Tilastokeskukselta. Tällä verkkosivustolla esitetyt yhteenvedot, luokittelut ja aiheanalyysit on tuotettu käyttäen tekoälyä (AI) ja niitä tulisi pitää täydentävänä tietona. Vaikka englanninkielisten tulosten tarkkuuden validointiin on käytetty huomattavasti vaivaa, käyttäjiä kehotetaan käyttämään kriittistä harkintaa ja tarkistamaan luotettavista, virallisista lähteistä kuten Helsingin kaupunginvaltuuston verkkosivustolta (https://paatokset.hel.fi/fi) lopullinen tieto.",
            faq_q3: "Onko tämä laillista GDPR:n mukaan?",
// ==End of OCR for page 8==

// ==Start of OCR for page 9==
            faq_a3: "Tämän verkkosivuston tiedonkeruu- ja käsittelykäytännöt ovat yleisen tietosuoja-asetuksen (GDPR) mukaisia. Tietoja käsitellään 6 artiklan 1 kohdan e alakohdan oikeusperustan mukaisesti, koska sitä tehdään yleisen edun nimissä. Käytetty poliittinen tieto kuuluu GDPR:n 9 artiklan erityisten henkilötietoluokkien piiriin, mutta rajoittuu tietoihin, jotka Helsingin kaupunginvaltuuston jäsenet ovat selvästi julkaisseet. Kerätyt tiedot rajoittuvat nimeen, puoluejäsenyyteen, kaikkiin puheisiin kaupunginvaltuustossa nykyisellä vaalikaudella ja vuoden 2021 kunnallisvaaleissa saatuihin äänimääriin. Olemme sitoutuneet kunnioittamaan yksityisyyden suojaa ja varmistamaan tietojen tarkkuuden. Jos uskot, että jokin tieto on epätarkkaa, ota yhteyttä."
        }
    };

    const lang = translations[currentLanguage];

    // Update navigation tabs
    document.querySelector('.nav-item[data-page="home"] a').textContent = lang.nav_home;
    document.querySelector('.nav-item[data-page="parties"] a').textContent = lang.nav_parties;
    document.querySelector('.nav-item[data-page="councillors"] a').textContent = lang.nav_councillors;
    document.querySelector('.nav-item[data-page="meetings"] a').textContent = lang.nav_meetings;
    document.querySelector('.nav-item[data-page="initiatives"] a').textContent = lang.nav_initiatives; // <-- ADDED
    document.querySelector('.nav-item[data-page="about"] a').textContent = lang.nav_about;

    // Update Home page (check if elements exist before updating)
    const heroH2 = document.querySelector('#home .hero h2');
    if (heroH2) heroH2.textContent = lang.home_title;
    const heroP = document.querySelector('#home .hero p');
    if (heroP) heroP.textContent = lang.home_subtitle;
    const featureCardsH3 = document.querySelectorAll('#home .feature-card h3');
    const featureCardsP = document.querySelectorAll('#home .feature-card p');
    if (featureCardsH3.length >= 3) {
        featureCardsH3[0].textContent = lang.councillor_profiles;
        featureCardsH3[1].textContent = lang.party_positions;
        featureCardsH3[2].textContent = lang.meeting_summaries;
    }
     if (featureCardsP.length >= 3) {
        featureCardsP[0].textContent = lang.councillor_desc;
        featureCardsP[1].textContent = lang.party_desc;
        featureCardsP[2].textContent = lang.meeting_desc;
    }
    const ctaH3 = document.querySelector('#home .cta-section h3');
    if (ctaH3) ctaH3.textContent = lang.why_use;
    const ctaP = document.querySelector('#home .cta-section p');
    if (ctaP) ctaP.textContent = lang.why_desc;
// ==End of OCR for page 9==

// ==Start of OCR for page 10==
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) exploreBtn.textContent = lang.explore_now;
    const disclaimerTitle = document.querySelector('#home .disclaimer-section h3');
     if(disclaimerTitle) disclaimerTitle.textContent = lang.disclaimer_title;
    const disclaimerItems = document.querySelectorAll('#home .disclaimer-section li');
    if (disclaimerItems.length >= 4) {
        disclaimerItems[0].textContent = lang.disclaimer_item1;
        disclaimerItems[1].textContent = lang.disclaimer_item2;
        disclaimerItems[2].textContent = lang.disclaimer_item3;
        disclaimerItems[3].textContent = lang.disclaimer_item4;
    }

    // Update Parties page
    const partiesH2 = document.querySelector('#parties h2');
    if (partiesH2) partiesH2.textContent = lang.parties_title;
    const partiesP = document.querySelector('#parties > .container > p'); // More specific selector
    if (partiesP) partiesP.textContent = lang.parties_subtitle;

    // Update Councillors page
    const councillorsH2 = document.querySelector('#councillors h2');
    if (councillorsH2) councillorsH2.textContent = lang.councillors_title;
    const councillorSearchInput = document.getElementById('councillor-search');
    if (councillorSearchInput) councillorSearchInput.placeholder = lang.search_councillors;
    const filterLabel = document.querySelector('#councillors label[for="party-filter"]');
    if (filterLabel) filterLabel.textContent = lang.filter_by_party;
    const allPartiesOption = document.querySelector('#party-filter option[value="all"]');
    if (allPartiesOption) allPartiesOption.textContent = lang.all_parties;


    // Update Meetings page
    const meetingsH2 = document.querySelector('#meetings h2');
    if(meetingsH2) meetingsH2.textContent = lang.meetings_title;
    const meetingSearchInput = document.getElementById('meeting-search');
    if(meetingSearchInput) meetingSearchInput.placeholder = lang.search_meetings;
    const meetingPlaceholder = document.querySelector('#meeting-summary .placeholder-message');
    if (meetingPlaceholder) {
        meetingPlaceholder.textContent = lang.meeting_placeholder;
    }

    // <-- ADDED Update Initiatives page -->
    const initiativesH2 = document.querySelector('#initiatives h2');
    if(initiativesH2) initiativesH2.textContent = lang.initiatives_title;
    const initiativeSearchInput = document.getElementById('initiative-search');
    if(initiativeSearchInput) initiativeSearchInput.placeholder = lang.search_initiatives;
    const initiativePlaceholder = document.querySelector('#initiative-details .placeholder-message');
    if (initiativePlaceholder) {
        initiativePlaceholder.textContent = lang.initiative_placeholder;
    }
    // <-- END ADDED -->


    // Update About page headers
    const aboutH2 = document.querySelector('#about h2');
    if(aboutH2) aboutH2.textContent = lang.about_title;
    const faqH3 = document.querySelector('#about .faq-section h3');
    if(faqH3) faqH3.textContent = lang.faq_title;
    const contactH3 = document.querySelector('#about .contact-section h3');
    if(contactH3) contactH3.textContent = lang.contact_title;
    const contactP = document.querySelector('#about .contact-section > p'); // Direct child p
    if(contactP) contactP.textContent = lang.contact_desc;
// ==End of OCR for page 10==

// ==Start of OCR for page 11==
    // Update About page - FAQ section
    const faqItems = document.querySelectorAll('#about .faq-item');
    if (faqItems.length >= 3) {
        // Update FAQ questions and answers
        const faq1h4 = faqItems[0].querySelector('h4');
        const faq1p = faqItems[0].querySelector('p');
        if(faq1h4) faq1h4.textContent = lang.faq_q1;
        if(faq1p) faq1p.textContent = lang.faq_a1;

        const faq2h4 = faqItems[1].querySelector('h4');
        const faq2p = faqItems[1].querySelector('p');
         if(faq2h4) faq2h4.textContent = lang.faq_q2;
        if(faq2p) faq2p.textContent = lang.faq_a2;

        const faq3h4 = faqItems[2].querySelector('h4');
        const faq3p = faqItems[2].querySelector('p');
        if(faq3h4) faq3h4.textContent = lang.faq_q3;
        if(faq3p) faq3p.textContent = lang.faq_a3;
    }
}


// Set up event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default if it's a real link, but handle page change
            const page = this.getAttribute('data-page');
            if (page) {
                 // e.preventDefault(); // Prevent default only if it's just a hash link for SPA nav
                 navigateToPage(page);
            }
        });
    });

    // "Explore Now" button
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', function() {
            navigateToPage('councillors');
        });
    }

    // Councillor search functionality
    const councillorSearch = document.getElementById('councillor-search');
    const searchBtn = document.getElementById('search-btn');
    if (councillorSearch && searchBtn) {
        searchBtn.addEventListener('click', filterCouncillors); // Use named function
// ==End of OCR for page 11==

// ==Start of OCR for page 12==
        councillorSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterCouncillors();
            }
        });
    }

    // Party filter
    const partyFilter = document.getElementById('party-filter');
    if (partyFilter) {
        partyFilter.addEventListener('change', filterCouncillors); // Use named function
    }

    // Meeting search functionality
    const meetingSearch = document.getElementById('meeting-search');
    const meetingSearchBtn = document.getElementById('meeting-search-btn');
    if (meetingSearch && meetingSearchBtn) {
        meetingSearchBtn.addEventListener('click', filterMeetings); // Use named function

        meetingSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterMeetings();
            }
        });
    }

     // <-- ADDED Initiative search functionality -->
    const initiativeSearch = document.getElementById('initiative-search');
    const initiativeSearchBtn = document.getElementById('initiative-search-btn');
    if (initiativeSearch && initiativeSearchBtn) {
        initiativeSearchBtn.addEventListener('click', filterInitiatives); // Use named function

        initiativeSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterInitiatives();
            }
        });
    }
    // <-- END ADDED -->


    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', closeAllModals); // Use named function
    });

    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
// ==End of OCR for page 12==

// ==Start of OCR for page 13==
        modals.forEach(modal => {
            if (event.target === modal) {
                // modal.style.display = 'none'; // Direct close
                 closeAllModals(); // Use function to ensure cleanup if needed
            }
        });
        // Close graph info modals on outside click
        const graphInfoModals = document.querySelectorAll('.graph-info-modal');
        let clickedInsideInfo = false;
        graphInfoModals.forEach(modal => {
            if (modal.contains(event.target) || (event.target.classList && event.target.classList.contains('info-button'))) {
                clickedInsideInfo = true;
            }
        });
        if (!clickedInsideInfo) {
             graphInfoModals.forEach(modal => modal.style.display = 'none');
        }
    });


    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
             // Also close graph info modals
            document.querySelectorAll('.graph-info-modal').forEach(modal => modal.style.display = 'none');
        }
    });

    // Handle window hashchange (e.g., back/forward buttons)
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        // Only navigate if hash is a valid page, otherwise default might be needed
        const validPages = Array.from(document.querySelectorAll('.nav-item')).map(el => el.getAttribute('data-page'));
        if (hash && validPages.includes(hash)) {
             navigateToPage(hash);
        } else if (!hash) {
            navigateToPage('home'); // Go home if hash is removed
        }
    });

    console.log('Event listeners set up successfully');
}


// Simplified function to add info buttons
// Add info buttons to chart containers
function addInfoButtons() {
    // console.log("Adding info buttons..."); // Keep console logs minimal for production

    // Get current translations using the same approach as elsewhere in the code
    const lang = currentLanguage; // Use global currentLanguage directly
    const uiText = updateUIText(); // Call updateUIText to get translations object (assuming it returns it or sets a global)
    // Or better: Access translations directly if updateUIText doesn't return them
    const infoTexts = { // Define texts directly here based on currentLanguage
         en: {
            galtan: "This graph positions party councillors (or their speeches in the councillor tab) on left-right (economic) and gal-tan (social/cultural) axes, based on AI analysis of their speeches. Lower left scores indicate more left-leaning/progressive stances; higher right scores indicate more right-leaning/traditional stances. Each dot represents a councillor's overall position (or a single speech in the councillor tab). For councillors' self-assessed positions, see Yle's Kuntavaalikone.",
            topics: "This graph shows the average topic emphasis in council members' speeches. Each speech was classified by topic (e.g., Public Transport 70%, Environment 30%). The values indicate the percentage of speaking time dedicated to each topic, reflecting issue focus not content. Topics are based on a survey by kaks.fi.",
            geo: "These maps visualise 2021 municipal election results, showing vote concentration by district. Darker areas indicate higher vote share (party) or absolute votes (councillor), sourced from Statistics Finland."
        },
        fi: {
             galtan: "Tämä kaavio sijoittaa puolueiden valtuutetut (tai heidän puheensa valtuutettujen välilehdellä) vasemmisto-oikeisto (taloudellinen) ja gal-tan (sosiaalinen/kulttuurinen) akseleille tekoälyanalyysin perusteella. Alemmat vasemman puoleiset arvot viittaavat enemmän vasemmistolaisiin/edistyksellisiin kantoihin; korkeammat oikean puoleiset arvot viittaavat enemmän oikeistolaisiin/perinteisiin kantoihin. Jokainen piste edustaa valtuutetun kokonaisasemaa (tai yksittäistä puhetta valtuutettujen välilehdellä). Valtuutettujen itsearvioidut asemat löytyvät Ylen Kuntavaalikoneesta.",
            topics: "Tämä kaavio näyttää keskimääräisen aihepainotuksen valtuuston jäsenten puheissa. Jokainen puhe luokiteltiin aiheen mukaan (esim. Julkinen liikenne 70%, Ympäristö 30%). Arvot osoittavat kunkin aiheen puheajasta käytetyn prosenttiosuuden, kuvastaen huomion kohdetta sisällön sijaan. Aiheet perustuvat kaks.fi:n kyselyyn.",
            geo: "Nämä kartat visualisoivat vuoden 2021 kunnallisvaalien tuloksia, näyttäen äänten keskittymisen alueittain. Tummemmat alueet osoittavat korkeampaa ääniosuutta (puolue) tai absoluuttisia ääniä (valtuutettu), lähteenä Tilastokeskus."
        }
    };


// ==End of OCR for page 13==

// ==Start of OCR for page 14==
    const currentInfoTexts = infoTexts[lang];
    if (!currentInfoTexts) {
        console.error("Info texts not found for language:", lang);
        return;
    }


    // Find all chart containers dynamically
    const chartContainers = document.querySelectorAll('.chart-container, .map-container');

    chartContainers.forEach(container => {
        const heading = container.querySelector('h4');
        if (!heading) return; // Skip if no heading found

        let infoTextKey = '';
        const headingText = heading.textContent.toLowerCase();

        // Determine which info text to use based on heading content
        if (headingText.includes('gal-tan')) {
            infoTextKey = 'galtan';
        } else if (headingText.includes('key topics') || headingText.includes('avainaiheet')) { // Check FI too
            infoTextKey = 'topics';
        } else if (headingText.includes('geographical support') || headingText.includes('maantieteellinen tuki')) { // Check FI too
            infoTextKey = 'geo';
        }

        if (infoTextKey && currentInfoTexts[infoTextKey]) {
            addInfoButton(container, currentInfoTexts[infoTextKey]);
        } else {
             // console.warn("No specific info text found for heading:", heading.textContent);
             // Optionally add a generic button or no button
        }
    });
}


// ==End of OCR for page 14==

// ==Start of OCR for page 15==
// Helper function to add an info button to a container
function addInfoButton(container, infoText) {
    // Get or create heading
    let heading = container.querySelector('h4');
    if (!heading) return; // Should not happen based on caller logic, but safe check

    // Ensure heading is relative for absolute positioning of button/modal
    if (window.getComputedStyle(heading).position === 'static') {
        heading.style.position = 'relative';
    }
     // Ensure container is relative for absolute positioning of modal
    if (window.getComputedStyle(container).position === 'static') {
        container.style.position = 'relative';
    }


    // Remove any existing buttons to avoid duplicates
    const existingButtons = heading.querySelectorAll('.info-button');
    existingButtons.forEach(btn => btn.remove());
    // Remove any existing modals associated with this container
    const existingModals = container.querySelectorAll('.graph-info-modal');
    existingModals.forEach(modal => modal.remove());


    // Create info button
    const infoBtn = document.createElement('button');
    infoBtn.className = 'info-button';
    infoBtn.innerHTML = 'i';
    infoBtn.setAttribute('title', 'Click for information'); // Tooltip
    infoBtn.setAttribute('aria-label', 'Show information about this graph'); // Accessibility
    heading.appendChild(infoBtn);

    // Create info modal
    let infoModal = document.createElement('div');
    infoModal.className = 'graph-info-modal';
    infoModal.innerHTML = infoText; // Set content
    infoModal.style.display = 'none'; // Initially hidden
    container.appendChild(infoModal); // Append modal to container, not heading


    // Add click event to show/hide the modal
    infoBtn.onclick = function(e) {
        e.stopPropagation(); // Prevent click from bubbling to window listener
        // e.preventDefault(); // Not needed for button unless it's type="submit" in a form

        // Hide all *other* graph info modals first
        document.querySelectorAll('.graph-info-modal').forEach(modal => {
            if (modal !== infoModal) modal.style.display = 'none';
        });

        // Toggle *this* modal
        const isVisible = infoModal.style.display === 'block';
        infoModal.style.display = isVisible ? 'none' : 'block';
        // console.log("Info button clicked, modal visible:", !isVisible);
    };

     // Prevent modal from closing when clicking inside it
     infoModal.onclick = function(e) {
         e.stopPropagation();
     };
}


// ==End of OCR for page 15==

// ==Start of OCR for page 16==
// --- REMOVED duplicate helper function addInfoButtonToContainer ---
// The improved addInfoButton function above handles this now.


// ==End of OCR for page 16==

// ==Start of OCR for page 17==
// --- REMOVED getGraphInfo function ---
// Info text is now handled directly within addInfoButtons


// Navigate to a specific page
function navigateToPage(pageName) {
    // Update active state in nav links
    const navLinks = document.querySelectorAll('.nav-item');
    let pageFound = false;
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
            pageFound = true;
        } else {
            link.classList.remove('active');
        }
    });

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage && pageFound) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0); // Scroll to top
        // Update hash only if it's different to prevent loop with hashchange listener
        if (window.location.hash !== `#${pageName}`) {
             window.location.hash = pageName;
        }
         // Special handling after page load
        if (pageName === 'parties' || pageName === 'councillors') {
             setTimeout(addInfoButtons, 150); // Re-add info buttons after potential modal content load
        }

    } else if (!pageFound) {
        console.warn(`Page "${pageName}" not found, navigating to home.`);
        navigateToPage('home'); // Fallback to home if page doesn't exist
    } else {
         console.error(`Element with ID "${pageName}" not found.`);
         navigateToPage('home'); // Fallback if element missing
    }
}
// ==End of OCR for page 17==

// ==Start of OCR for page 18==
// Populate party filter dropdown
function populatePartyFilter() {
    const partyFilter = document.getElementById('party-filter');
    if (!partyFilter) return;

    // Clear existing options except the "All Parties" default
    partyFilter.innerHTML = '<option value="all">All Parties</option>';


    // Get unique parties from councillor data
    // Ensure councillorData is loaded
    if (!councillorData || councillorData.length === 0) {
        console.warn("Councillor data not available for party filter population.");
        return;
    }
    const uniqueParties = [...new Set(councillorData.map(councillor => councillor.party))]
                            .filter(party => party); // Filter out potential null/empty party names

    // Sort parties alphabetically (Finnish collation)
    uniqueParties.sort((a, b) => a.localeCompare(b, 'fi'));


    // Create and append options
    uniqueParties.forEach(party => {
        const option = document.createElement('option');
        option.value = party;
        option.textContent = party;
        partyFilter.appendChild(option);
    });

     // Update the "All Parties" text based on current language initially
     updateUIText(); // Ensure this runs after population
}

// Render parties grid
function renderParties() {
    const partyGrid = document.getElementById('party-grid');
    if (!partyGrid) return;
     if (!partyData || partyData.length === 0) {
        partyGrid.innerHTML = '<p>No party data available.</p>'; // Inform user
        return;
    }


    // Clear existing content
    partyGrid.innerHTML = '';

    // Define custom party order
    const partyOrder = ["Kokoomus", "Vihreät", "Sosiaalidemokraatit", "Vasemmistoliitto", "Perussuomalaiset", "Ruotsalainen kansanpuolue", "Liike Nyt", "Keskusta", "Kristillisdemokraatit"]; // Updated RKP name

    // Sort parties according to custom order
    const sortedParties = [...partyData].sort((a, b) => {
        const indexA = partyOrder.indexOf(a.party);
        const indexB = partyOrder.indexOf(b.party);

        // If both parties are in the ordered list, use the custom order
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB; // Corrected subtraction
        }
// ==End of OCR for page 18==

// ==Start of OCR for page 19==
        // If only one party is in the ordered list, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // For parties not in the ordered list, sort alphabetically (Finnish collation)
        return a.party.localeCompare(b.party, 'fi');
    });

    // Create party cards
    sortedParties.forEach(party => {
        const partyCard = document.createElement('div');
        partyCard.className = 'party-card';
        partyCard.setAttribute('data-party', party.party); // Use party name for data attribute

        const partyLogoDiv = document.createElement('div'); // Changed variable name
        partyLogoDiv.className = 'party-logo';
    // --- MODIFICATION START ---
    if (party.logo) { // Only create image element if logo path exists
        const logoImg = document.createElement('img');
        logoImg.src = party.logo; // Set src directly
        logoImg.alt = `${party.party} logo`;
        logoImg.onerror = function() { // Handle image loading errors
            console.warn(`Party logo not found or invalid for ${party.party} at ${this.src}. Hiding image.`);
            this.style.display = 'none'; // Hide the image element itself
            this.onerror = null; // Prevent infinite loop if error persists somehow
        };
        partyLogoDiv.appendChild(logoImg);
    } else {
        // Optional: Log if logo is missing in data, or just leave the div empty
         console.warn(`No logo path provided for party: ${party.party}`);
         // You could add placeholder text or style the empty div if desired
         // partyLogoDiv.textContent = 'No Logo'; // Example placeholder text
    }

        const partyInfo = document.createElement('div');
        partyInfo.className = 'party-info';

        const partyName = document.createElement('h3');
        partyName.textContent = party.party;
        partyInfo.appendChild(partyName);

        partyCard.appendChild(partyLogoDiv); // Append logo div
        partyCard.appendChild(partyInfo);

        // Add click event to show party details
        partyCard.addEventListener('click', function() {
            displayPartyDetails(party.party); // Pass party name
        });

        partyGrid.appendChild(partyCard);
    });
}

// Display party details in modal
function displayPartyDetails(partyName) {
    const partyModal = document.getElementById('party-modal');
    const partyDetails = document.getElementById('party-details');
    if (!partyModal || !partyDetails) return;

    // Find party data
    const party = partyData.find(p => p.party === partyName);

    if (!party) {
        console.error('Party not found:', partyName);
        // Display error message within the modal details area
        partyDetails.innerHTML = `<p>Party details not available for ${partyName}.</p>`;
        // Set attribute even on error, so language switching might clear the error later
        partyModal.setAttribute('data-party', partyName);
        partyModal.style.display = 'block'; // Show modal to display the error
        return;
    }

    // Set modal data attribute (useful for language updates)
    partyModal.setAttribute('data-party', partyName);

    // Determine which summaries to use based on language
    const helsinkiSummaryKey = currentLanguage === 'en' ? 'manifesto_helsinki_en' : 'manifesto_helsinki_fi';
    const nationalSummaryKey = currentLanguage === 'en' ? 'manifesto_national_en' : 'manifesto_national_fi';

    // Ensure fallback images are defined or handled gracefully
    const fallbackLogo = 'images/default-party-logo.png'; // Define a fallback if needed
    const fallbackGraph = 'images/placeholder-graph.png';
    const fallbackMap = 'images/placeholder-map.png';

    let detailsHTML = `
        <div class="party-detail-header">
            <img src="${party.logo || ''}"  
                 alt="${party.party} logo"
                 class="party-detail-logo"
                 onerror="this.onerror=null; this.style.display='none'; console.warn('Party detail logo could not be loaded for ${party.party}: ${this.src}')"> 
                 
            <h2>${party.party}</h2>
        </div>


        <div class="party-summary">
            <h3>${currentLanguage === 'en' ? 'Helsinki Manifesto' : 'Helsingin Manifesti'}</h3>
            ${formatMarkdown(party[helsinkiSummaryKey] || (currentLanguage === 'en' ? 'No Helsinki manifesto summary available.' : 'Helsingin manifestin yhteenvetoa ei ole saatavilla.'))}

            <h3 class="national-manifesto-title">${currentLanguage === 'en' ? 'National Manifesto' : 'Kansallinen Manifesti'}</h3>
            ${formatMarkdown(party[nationalSummaryKey] || (currentLanguage === 'en' ? 'No national manifesto summary available.' : 'Kansallisen manifestin yhteenvetoa ei ole saatavilla.'))}
        </div>

        <div class="party-charts">
            <h3>Position Analysis</h3>
            <div class="charts-container">
                <div class="chart-container">
                    <h4>GAL-TAN Position</h4>
                    <img src="${party.galtan || fallbackGraph}" alt="GAL-TAN position chart" onerror="this.onerror=null; this.style.display='none'; console.warn('Missing GAL-TAN chart for ${party.party}')">
                </div>
                <div class="chart-container">
                    <h4>Key Topics</h4>
                    <img src="${party.topics || fallbackGraph}" alt="Key topics chart" onerror="this.onerror=null; this.style.display='none'; console.warn('Missing Topics chart for ${party.party}')">
                </div>
            </div>
            <div class="map-container">
                <h4>Geographical Support</h4>
                <img src="${party.map || fallbackMap}" alt="Geographical support map" onerror="this.onerror=null; this.style.display='none'; console.warn('Missing Map for ${party.party}')">
            </div>
        </div>
    `;

    partyDetails.innerHTML = detailsHTML;

    // Show modal
    console.log("Helsinki Manifesto:", party[helsinkiSummaryKey]);
    console.log("National Manifesto:", party[nationalSummaryKey]);
    partyModal.style.display = 'block';

    // Add info buttons after modal content is rendered and visible
    // Use a minimal timeout to ensure DOM update
    setTimeout(addInfoButtons, 50); // Reduced timeout slightly
}


// Render councillors grid
function renderCouncillors(filteredData = null) {
    const councillorGrid = document.getElementById('councillor-grid');
    if (!councillorGrid) return;
     if (!councillorData || councillorData.length === 0) {
        councillorGrid.innerHTML = '<p>No councillor data available.</p>';
        return;
    }


    // Clear existing content
    councillorGrid.innerHTML = '';

    // Use filtered data or all data
    const dataToRender = filteredData || councillorData;

    // Sort councillors by number of votes (descending)
    // Ensure votes is a number for sorting
    const sortedData = [...dataToRender].sort((a, b) => (Number(b.votes) || 0) - (Number(a.votes) || 0));


    // Limit to 24 councillors (or adjust as needed)
    const limit = 24;
    const limitedData = sortedData.slice(0, limit);

    // Create councillor cards
    limitedData.forEach(councillor => {
        const councillorCard = document.createElement('div');
        councillorCard.className = 'councillor-card';
        councillorCard.setAttribute('data-id', councillor.name); // Use name as ID

        const councillorImageDiv = document.createElement('div'); // Changed variable name
        councillorImageDiv.className = 'councillor-image';

        const img = document.createElement('img');
        const defaultProfileImg = 'images/default-profile.png'; // Define default image path
        img.src = councillor.img_filepath || defaultProfileImg;
        img.alt = councillor.name;
         img.onerror = () => { // Handle image loading errors
             console.warn(`Profile image not found for ${councillor.name} at ${img.src}. Using default.`);
             img.src = defaultProfileImg; // Fallback
        };
        councillorImageDiv.appendChild(img);

        const councillorInfo = document.createElement('div');
        councillorInfo.className = 'councillor-info';

        const name = document.createElement('h3');
        name.textContent = councillor.name;
        councillorInfo.appendChild(name);

        const party = document.createElement('p');
// ==End of OCR for page 21==

// ==Start of OCR for page 22==
        party.className = 'party-name';
        party.textContent = councillor.party || 'Independent'; // Handle missing party
        councillorInfo.appendChild(party);

        const votes = document.createElement('p');
        // Format votes with locale string for better readability
        votes.textContent = `Votes: ${ (Number(councillor.votes) || 0).toLocaleString(currentLanguage === 'en' ? 'en-US' : 'fi-FI') }`;
        councillorInfo.appendChild(votes);

        const speeches = document.createElement('p');
        // Use bracket notation for property names with spaces/special chars
        speeches.textContent = `Speeches: ${councillor['number of speeches'] || 0}`;
        councillorInfo.appendChild(speeches);

        councillorCard.appendChild(councillorImageDiv); // Append image div
        councillorCard.appendChild(councillorInfo);

        // Add click event to show councillor details
        councillorCard.addEventListener('click', function() {
            displayCouncillorDetails(councillor.name); // Pass name
        });

        councillorGrid.appendChild(councillorCard);
    });

    // Show message if no results after filtering
    if (dataToRender.length === 0) { // Check the source data length
        const noResults = document.createElement('div');
        noResults.className = 'no-results'; // Add class for potential styling
        noResults.textContent = currentLanguage === 'en' ? 'No councillors found matching your criteria.' : 'Valtuutettuja ei löytynyt hakuehdoillasi.';
        councillorGrid.appendChild(noResults);
    }
}


// Filter councillors based on search and party filter
function filterCouncillors() {
    const searchInput = document.getElementById('councillor-search');
    const partyFilter = document.getElementById('party-filter');

    if (!searchInput || !partyFilter) return;
     if (!councillorData || councillorData.length === 0) return; // Don't filter if no data


    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedParty = partyFilter.value;

    // Apply filters
    const filteredData = councillorData.filter(councillor => {
        // Match name (case-insensitive)
        const nameMatch = councillor.name.toLowerCase().includes(searchTerm);
        // Match party (allow 'all')
        const partyMatch = selectedParty === 'all' || councillor.party === selectedParty;
        return nameMatch && partyMatch;
    });

// ==End of OCR for page 22==

// ==Start of OCR for page 23==
    // Render filtered results
    renderCouncillors(filteredData);
}


// Display councillor details in modal
function displayCouncillorDetails(councillorName) {
    const councillorModal = document.getElementById('councillor-modal');
    const councillorDetails = document.getElementById('councillor-details');

    if (!councillorModal || !councillorDetails) return;

    // Find councillor data
    const councillor = councillorData.find(c => c.name === councillorName);
    if (!councillor) {
        console.error('Councillor not found:', councillorName);
         councillorDetails.innerHTML = '<p>Councillor details not available.</p>';
         councillorModal.style.display = 'block';
        return;
    }

    // Set modal data attribute
    councillorModal.setAttribute('data-id', councillorName);

    // Determine which summary to use based on language
    const summaryKey = currentLanguage === 'en' ? 'ai_summary' : 'ai_summary_fi';
    const defaultProfileImg = 'images/default-profile.png'; // Define default image path

    // Build councillor details content
    let detailsHTML = `
        <div class="councillor-detail-header">
            <div class="councillor-detail-image">
                <img src="${councillor.img_filepath || defaultProfileImg}"
                     alt="${councillor.name}"
                     onerror="this.onerror=null; this.src='${defaultProfileImg}'; console.warn('Councillor detail image error for ${councillor.name}')">
            </div>
            <div class="councillor-detail-info">
                <h2>${councillor.name}</h2>
                <p class="party-name">${councillor.party || 'Independent'}</p>
                <p><strong>Votes:</strong> ${(Number(councillor.votes) || 0).toLocaleString(currentLanguage === 'en' ? 'en-US' : 'fi-FI')}</p>
                <p><strong>Speeches:</strong> ${councillor['number of speeches'] || 0}</p>
            </div>
        </div>
        <div class="councillor-summary">
            <h3>${currentLanguage === 'en' ? 'AI Summary' : 'Tekoälyn yhteenveto'}</h3>
            ${formatMarkdown(councillor[summaryKey] || (currentLanguage === 'en' ? 'No summary available.' : 'Yhteenvetoa ei saatavilla.'))}
        </div>
        <div class="councillor-charts">
            <h3>Position Analysis</h3>
            <div class="charts-container">
                <div class="chart-container">
                    <h4>GAL-TAN Position</h4>
                    <img src="${councillor.galtan_filepath || 'images/placeholder-graph.png'}" alt="GAL-TAN position chart" onerror="this.style.display='none'; console.warn('Missing GAL-TAN chart for ${councillor.name}')">
                </div>
                <div class="chart-container">
                    <h4>Key Topics</h4>
                    <img src="${councillor.topic_filepath || 'images/placeholder-graph.png'}" alt="Key topics chart" onerror="this.style.display='none'; console.warn('Missing Topics chart for ${councillor.name}')">
                </div>
            </div>
            <div class="map-container">
                <h4>Geographical Support</h4>
                <img src="${councillor.map_filepath || 'images/placeholder-map.png'}" alt="Geographical support map" onerror="this.style.display='none'; console.warn('Missing Map for ${councillor.name}')">
            </div>
        </div>
    `; // Added fallback images and error handling

    councillorDetails.innerHTML = detailsHTML;

    // Show modal
    councillorModal.style.display = 'block';

    // After modal is shown and content is added, add info buttons
    setTimeout(addInfoButtons, 100);
}


// Render meeting list and initial meeting
function renderMeetings() {
    const meetingList = document.getElementById('meeting-list');
    if (!meetingList) return;
     if (!meetingData || meetingData.length === 0) {
        meetingList.innerHTML = '<p>No meeting data available.</p>';
         // Clear summary area too
         const meetingSummary = document.getElementById('meeting-summary');
         if(meetingSummary) {
            const placeholder = meetingSummary.querySelector('.placeholder-message');
            if(placeholder) placeholder.textContent = currentLanguage === 'en' ? 'No meetings available.' : 'Kokouksia ei saatavilla.';
            else meetingSummary.innerHTML = `<div class="placeholder-message">${currentLanguage === 'en' ? 'No meetings available.' : 'Kokouksia ei saatavilla.'}</div>`;
         }
        return;
    }


    // Clear existing content
    meetingList.innerHTML = '';

    // Create meeting list items
    meetingData.forEach((meeting, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', index);
// ==End of OCR for page 24==

// ==Start of OCR for page 25==
        // Format date: DD Month, YYYY based on language
        const date = new Date(meeting.date);
        const formattedDate = date.toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : 'fi-FI', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        listItem.textContent = formattedDate;

        // Add click event to show meeting summary
        listItem.addEventListener('click', function() {
            // Remove active class from all items
            meetingList.querySelectorAll('li').forEach(item => {
                item.classList.remove('active');
            });
            // Add active class to clicked item
            listItem.classList.add('active');
            // Display meeting summary
            displayMeetingSummary(index);
        });

        meetingList.appendChild(listItem);
    });


    // Select first meeting by default if data exists
    if (meetingData.length > 0) {
        const firstMeeting = meetingList.querySelector('li');
        if (firstMeeting) {
            firstMeeting.classList.add('active');
            displayMeetingSummary(0); // Display summary for the first meeting
        }
    } else {
         // Ensure placeholder is shown if no data after loading
         displayMeetingSummary(-1); // Call with invalid index to show placeholder
    }
}


// Filter meetings based on search
function filterMeetings() {
    const meetingSearch = document.getElementById('meeting-search');
    const meetingList = document.getElementById('meeting-list');

    if (!meetingSearch || !meetingList) return;
// ==End of OCR for page 25==

// ==Start of OCR for page 26==
    const searchTerm = meetingSearch.value.toLowerCase().trim();

    let firstVisibleIndex = -1; // Track the first matching item

    // Filter list items
    const items = meetingList.querySelectorAll('li');
    items.forEach((item, index) => {
        const dateText = item.textContent.toLowerCase();
        // Basic date search (matches any part of the formatted date string)
        if (searchTerm === '' || dateText.includes(searchTerm)) {
            item.style.display = 'block';
            if (firstVisibleIndex === -1) {
                firstVisibleIndex = item.getAttribute('data-index'); // Get original index
            }
            item.classList.remove('active'); // Remove active class during filtering
        } else {
            item.style.display = 'none';
            item.classList.remove('active');
        }
    });

    // Display the summary of the first visible item, or placeholder if none
    if (firstVisibleIndex !== -1) {
         const firstVisibleItem = meetingList.querySelector(`li[data-index="${firstVisibleIndex}"]`);
         if(firstVisibleItem) {
            firstVisibleItem.classList.add('active'); // Highlight the first match
            displayMeetingSummary(parseInt(firstVisibleIndex));
         } else {
             displayMeetingSummary(-1); // Should not happen, but fallback
         }
    } else {
        displayMeetingSummary(-1); // No items match, show placeholder
    }
}


// Display meeting summary based on index
function displayMeetingSummary(index) {
    const meetingSummary = document.getElementById('meeting-summary');
    if (!meetingSummary) return;

    // Handle invalid index (e.g., no selection or no results)
    if (index < 0 || index >= meetingData.length) {
         const placeholderText = currentLanguage === 'en' ? 'Select a meeting date to view its summary.' : 'Valitse kokouspäivä nähdäksesi yhteenvedon.';
         const existingPlaceholder = meetingSummary.querySelector('.placeholder-message');
         if(existingPlaceholder) {
            existingPlaceholder.textContent = placeholderText;
            meetingSummary.innerHTML = ''; // Clear previous content if any
            meetingSummary.appendChild(existingPlaceholder);
         } else {
            meetingSummary.innerHTML = `<div class="placeholder-message">${placeholderText}</div>`;
         }
        return;
    }


    const meeting = meetingData[index];
    if (!meeting) {
        console.error('Meeting not found at index:', index);
        meetingSummary.innerHTML = `<div class="placeholder-message">${currentLanguage === 'en' ? 'Error loading meeting summary.' : 'Virhe ladattaessa kokouksen yhteenvetoa.'}</div>`;
        return;
    }

    // Determine which summary to use based on language
    const summaryKey = currentLanguage === 'en' ? 'summary_en' : 'summary_fi';

    // Format date: DD Month, YYYY
    const date = new Date(meeting.date);
    const formattedDate = date.toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : 'fi-FI', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    // Build meeting summary content
    let summaryHTML = `
        <div class="meeting-date">${formattedDate}</div>
        <div class="meeting-content">
            ${formatMarkdown(meeting[summaryKey] || (currentLanguage === 'en' ? 'No summary available.' : 'Yhteenvetoa ei saatavilla.'))}
        </div>
    `;
// ==End of OCR for page 26==

// ==Start of OCR for page 27==
    meetingSummary.innerHTML = summaryHTML;
}


// --- ADDED Initiative Functions ---

// Render initiative list and initial details
function renderInitiatives() {
    const initiativeList = document.getElementById('initiative-list');
    if (!initiativeList) return;
    if (!initiativeData || initiativeData.length === 0) {
        initiativeList.innerHTML = `<p>${currentLanguage === 'en' ? 'No initiatives available.' : 'Aloitteita ei saatavilla.'}</p>`;
        // Clear details area too
        const initiativeDetails = document.getElementById('initiative-details');
        if(initiativeDetails) {
            const placeholder = initiativeDetails.querySelector('.placeholder-message');
            if(placeholder) placeholder.textContent = currentLanguage === 'en' ? 'No initiatives available.' : 'Aloitteita ei saatavilla.';
            else initiativeDetails.innerHTML = `<div class="placeholder-message">${currentLanguage === 'en' ? 'No initiatives available.' : 'Aloitteita ei saatavilla.'}</div>`;
        }
        return;
    }

    // Clear existing content
    initiativeList.innerHTML = '';

    // Create initiative list items (data is already sorted by date in loadData)
    initiativeData.forEach((initiative, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', index);

        // Format date: DD Month, YYYY
        const date = new Date(initiative.date);
        const formattedDate = date.toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : 'fi-FI', {
            day: 'numeric', month: 'short', year: 'numeric' // Use short month for list
        });

        // Display Title and Date in the list item
        // ADDED: Display title based on current language
        const title = currentLanguage === 'en' ? initiative.title_en : initiative.title;
        listItem.innerHTML = `
            <span class="initiative-title">${title}</span>
            <span class="initiative-date">${formattedDate}</span>
        `;

        // Add click event to show initiative details
        listItem.addEventListener('click', function() {
            initiativeList.querySelectorAll('li').forEach(item => item.classList.remove('active'));
            listItem.classList.add('active');
            displayInitiativeDetails(index);
        });

        initiativeList.appendChild(listItem);
    });

    // Select first initiative by default if data exists
    if (initiativeData.length > 0) {
        const firstInitiative = initiativeList.querySelector('li');
        if (firstInitiative) {
            firstInitiative.classList.add('active');
            displayInitiativeDetails(0);
        }
    } else {
        displayInitiativeDetails(-1); // Show placeholder if no data
    }
}

// Display initiative details based on index
function displayInitiativeDetails(index) {
    const initiativeDetails = document.getElementById('initiative-details');
    if (!initiativeDetails) return;

    // Handle invalid index
    if (index < 0 || index >= initiativeData.length) {
        const placeholderText = currentLanguage === 'en' ? 'Select an initiative to view its details.' : 'Valitse aloite nähdäksesi sen tiedot.';
        const existingPlaceholder = initiativeDetails.querySelector('.placeholder-message');
         if(existingPlaceholder) {
            existingPlaceholder.textContent = placeholderText;
            initiativeDetails.innerHTML = ''; // Clear previous content
            initiativeDetails.appendChild(existingPlaceholder);
         } else {
            initiativeDetails.innerHTML = `<div class="placeholder-message">${placeholderText}</div>`;
         }
        return;
    }

    const initiative = initiativeData[index];
    if (!initiative) {
        console.error('Initiative not found at index:', index);
        initiativeDetails.innerHTML = `<div class="placeholder-message">${currentLanguage === 'en' ? 'Error loading initiative details.' : 'Virhe ladattaessa aloitteen tietoja.'}</div>`;
        return;
    }

    // Determine summary key
    const summaryKey = currentLanguage === 'en' ? 'summary_en' : 'summary_fi';

    // Format date
    const date = new Date(initiative.date);
    const formattedDate = date.toLocaleDateString(currentLanguage === 'en' ? 'en-GB' : 'fi-FI', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    // Format signatories into an HTML list
    let signatoriesHTML = '';
    if (initiative.signatories && initiative.signatories.length > 0) {
        signatoriesHTML = `
            <h3>${currentLanguage === 'en' ? 'Signatories' : 'Allekirjoittajat'}</h3>
            <ul class="signatories-list">
                ${initiative.signatories.map(name => `<li>${name}</li>`).join('')}
            </ul>
        `;
    } else {
         signatoriesHTML = `<p>${currentLanguage === 'en' ? 'No signatories listed.' : 'Allekirjoittajia ei listattu.'}</p>`;
    }


    // Build details HTML
    const detailsHTML = `
        <div class="initiative-detail-title">${currentLanguage === 'en' ? initiative.title_en : initiative.title}</div>
        <div class="initiative-meta">
            <span><strong>${currentLanguage === 'en' ? 'Initiator' : 'Alullepanija'}:</strong> ${initiative.initiator || 'N/A'}</span>
            <span><strong>${currentLanguage === 'en' ? 'Date' : 'Päivämäärä'}:</strong> ${formattedDate}</span>
            <span><strong>${currentLanguage === 'en' ? 'Topic' : 'Aihe'}:</strong> ${currentLanguage === 'en' ? initiative.topics_en || 'N/A' : initiative.topics_fi || 'N/A'}</span>
        </div>
        <div class="initiative-summary-content">
            ${formatMarkdown(initiative[summaryKey] || (currentLanguage === 'en' ? 'No summary available.' : 'Yhteenvetoa ei saatavilla.'))}
        </div>
        <div class="initiative-meta"></div>
        <div class="initiative-signatories">
            ${signatoriesHTML}
        </div>
    `;

    initiativeDetails.innerHTML = detailsHTML;
}

// Filter initiatives based on search
function filterInitiatives() {
    const searchInput = document.getElementById('initiative-search');
    const initiativeList = document.getElementById('initiative-list');

    if (!searchInput || !initiativeList) return;
    if (!initiativeData || initiativeData.length === 0) return; // No data to filter

    const searchTerm = searchInput.value.toLowerCase().trim();
    let firstVisibleIndex = -1;

    const items = initiativeList.querySelectorAll('li');
    items.forEach((item) => {
         const index = parseInt(item.getAttribute('data-index')); // Get original index
         const initiative = initiativeData[index]; // Get data for this item

         if (!initiative) { // Safety check
             item.style.display = 'none';
             item.classList.remove('active');
             return;
         }

        // ADDED: Get title based on current language
        const title = currentLanguage === 'en' ? initiative.title_en : initiative.title;

        // Check title, initiator, and date (as string)
        const titleMatch = title.toLowerCase().includes(searchTerm);
        const initiatorMatch = initiative.initiator.toLowerCase().includes(searchTerm);
        // Get formatted date from list item for simpler matching
        const dateText = item.querySelector('.initiative-date')?.textContent.toLowerCase() || '';
        const dateMatch = dateText.includes(searchTerm);

        if (searchTerm === '' || titleMatch || initiatorMatch || dateMatch) {
            item.style.display = 'block'; // Use block or reset to default display style
             if (firstVisibleIndex === -1) {
                firstVisibleIndex = index; // Store original index
            }
            item.classList.remove('active');
        } else {
            item.style.display = 'none';
            item.classList.remove('active');
        }
    });

     // Display the summary of the first visible item, or placeholder if none
    if (firstVisibleIndex !== -1) {
         const firstVisibleItem = initiativeList.querySelector(`li[data-index="${firstVisibleIndex}"]`);
         if(firstVisibleItem) {
            firstVisibleItem.classList.add('active'); // Highlight the first match
            displayInitiativeDetails(firstVisibleIndex);
         } else {
             displayInitiativeDetails(-1); // Fallback
         }
    } else {
        displayInitiativeDetails(-1); // No items match, show placeholder
    }
}

function debugPartyData() {
    console.log('===== DEBUGGING PARTY DATA =====');
    console.log('partyData type:', typeof partyData);
    console.log('partyData length:', partyData ? partyData.length : 'undefined');
    
    if (!partyData || !partyData.length) {
        console.error('Party data is empty or undefined');
        return;
    }
    
    // Check first party
    const firstParty = partyData[0];
    console.log('First party:', firstParty.party);
    console.log('Available fields:', Object.keys(firstParty));
    
    // Check for manifesto fields specifically
    console.log('manifesto_helsinki_en exists:', 'manifesto_helsinki_en' in firstParty);
    console.log('manifesto_helsinki_fi exists:', 'manifesto_helsinki_fi' in firstParty);
    console.log('manifesto_national_en exists:', 'manifesto_national_en' in firstParty);
    console.log('manifesto_national_fi exists:', 'manifesto_national_fi' in firstParty);
    
    // Check Vihreat party specifically
    const vihreat = partyData.find(p => p.party === 'Vihreät');
    if (vihreat) {
        console.log('Found Vihreät in party data');
        console.log('Vihreät has manifesto_helsinki_en:', 'manifesto_helsinki_en' in vihreat);
        console.log('Vihreät manifesto_helsinki_en type:', typeof vihreat.manifesto_helsinki_en);
        console.log('Vihreät manifesto_helsinki_en sample:', 
            vihreat.manifesto_helsinki_en ? vihreat.manifesto_helsinki_en.substring(0, 50) : 'empty');
    } else {
        console.log('Could not find Vihreät in party data');
    }
    
    console.log('===== END DEBUG =====');
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal'); // Selects party and councillor modals
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function formatMarkdown(markdownText) {
    if (!markdownText) return '<p>No content available.</p>';

    let htmlText = markdownText;

    // Replace headers
    htmlText = htmlText.replace(/^####\s+(.*$)/gm, '<h5>$1</h5>');
    htmlText = htmlText.replace(/^###\s+(.*$)/gm, '<h4>$1</h4>');
    htmlText = htmlText.replace(/^##\s+(.*$)/gm, '<h3>$1</h3>');
    htmlText = htmlText.replace(/^#\s+(.*$)/gm, '<h2>$1</h2>');

    // Replace bold
    htmlText = htmlText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    htmlText = htmlText.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Replace italic
    htmlText = htmlText.replace(/\*([^\*\n]+)\*/g, '<em>$1</em>');
    htmlText = htmlText.replace(/_([^_\n]+)_/g, '<em>$1</em>');

    // Replace lists
    // First convert lines starting with * or - to <li>
    htmlText = htmlText.replace(/^\s*[\*\-]\s+(.*$)/gm, '<li>$1</li>');
    
    // Then wrap consecutive <li> elements in <ul> tags
    const lines = htmlText.split('\n');
    let result = [];
    let inList = false;
    
    for (const line of lines) {
        if (line.trim().startsWith('<li>')) {
            if (!inList) {
                result.push('<ul>');
                inList = true;
            }
            result.push(line);
        } else {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push(line);
        }
    }
    
    if (inList) {
        result.push('</ul>');
    }
    
    htmlText = result.join('\n');

    // Handle paragraphs - wrap text not already in HTML tags
    const paragraphs = htmlText.split('\n\n');
    htmlText = paragraphs.map(para => {
        para = para.trim();
        if (para.length === 0) return '';
        if (para.startsWith('<') && !para.startsWith('<li>')) return para;
        if (!para.startsWith('<li>') && !para.includes('</li>')) {
            return `<p>${para}</p>`;
        }
        return para;
    }).join('\n\n');

    return htmlText;
}

/* Basic HTML escaping function (optional, use if summaries might contain HTML)
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, """)
         .replace(/'/g, "'");
}
*/

