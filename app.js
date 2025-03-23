document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();
});

// Global variables
let councillorData = [];
let partyData = [];
let meetingData = [];
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
        
        // Sort meeting data by date (most recent first)
        meetingData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
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
    
    // Check URL hash for direct navigation
    const hash = window.location.hash.substring(1);
    if (hash) {
        navigateToPage(hash);
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
            currentLanguage = 'fi';
            updateLanguage();
            langFi.classList.add('active');
            langEn.classList.remove('active');
        }
    });
}

// Update content based on selected language
function updateLanguage() {
    // Update meetingData
    if (meetingData.length > 0) {
        const activeMeeting = document.querySelector('.meeting-list li.active');
        if (activeMeeting) {
            const meetingIndex = activeMeeting.getAttribute('data-index');
            displayMeetingSummary(meetingIndex);
        }
    }
    
    const councillorModal = document.getElementById('councillor-modal');
    if (councillorModal && councillorModal.style.display === 'block') {
        const councillorId = councillorModal.getAttribute('data-id');
        if (councillorId) {
            displayCouncillorDetails(councillorId);
        }
    }
    
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
            nav_about: "About",
            
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


            parties_title: "Political Parties",
            parties_subtitle: "Explore the political parties represented in the Helsinki City Council.",
            councillors_title: "City Councillors",
            search_councillors: "Search councillors...",
            filter_by_party: "Filter by party:",
            all_parties: "All Parties",
            meetings_title: "Council Meetings",
            search_meetings: "Search by date...",
            meeting_placeholder: "Select a meeting date to view its summary.",
            about_title: "About Helsinki Council Tracker",
            faq_title: "Frequently Asked Questions",
            contact_title: "Contact Us",
            contact_desc: "Have questions, feedback, or suggestions? Please reach out!",

            galtan: "This graph positions party councillors (or their speeches in the councillor tab) on left-right (economic) and gal-tan (social/cultural) axes, based on AI analysis of their speeches. Lower left scores indicate more left-leaning/progressive stances; higher right scores indicate more right-leaning/traditional stances. Each dot represents a councillor's overall position (or a single speech in the councillor tab). For councillors' self-assessed positions, see Yle's Kuntavaalikone.",
            topics: "This graph shows the average topic emphasis in council members' speeches. Each speech was classified by topic (e.g., Public Transport 70%, Environment 30%). The values indicate the percentage of speaking time dedicated to each topic, reflecting issue focus not content. Topics are based on a survey by kaks.fi.",
            geo: "These maps visualise 2021 municipal election results, showing vote concentration by district. Darker areas indicate higher vote share (party) or absolute votes (councillor), sourced from Statistics Finland.",
                    
            // FAQ Questions and Answers
            faq_q1: "Who created this website?",
            faq_a1: "The website was created by me, Korbinian Pauli. I have a B.A. in Political and Computer Science from the University of Munich and a M.Sc. in Social Data Science from the University of Copenhagen. I made this website partially as a project to showcase my skills to potential employers and partially so that people in Helsinki have an alternative to Yle's Vaalikone. Traditional election compass tools are forward looking and are lacking detailed information on what has been decided in the past. This website aims to simplify getting information about current decision making, particularly for international residents who may have difficulties finding information in English.",
            
            faq_q2: "Where does the data come from and is the information displayed here accurate?",
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
            nav_about: "Tietoa",
            
            home_title: "Helsingin Kuntavaalikone",
            home_subtitle: "Seuraa, analysoi ja ymmärrä Helsingin demokraattisia prosesseja.",
            councillor_profiles: "Valtuutettujen profiilit",
            councillor_desc: "Yksityiskohtaista tietoa jokaisesta valitusta edustajasta, mukaan lukien heidän puheensa, poliittiset kannat ja äänestäjien maantiede.",
            party_positions: "Puolueiden kannat",
            party_desc: "Ymmärrä kunkin puolueen kanta keskeisiin kysymyksiin ohjelmayhteenvetojen ja heidän valtuutettujensa vasemmisto-oikeisto-asemien avulla.",
            meeting_summaries: "Kokousyhteenvedot",
            meeting_desc: "Pysy ajan tasalla valtuuston kokousten tiiviiden yhteenvetojen avulla.",
            why_use: "Miksi käyttää Helsinki Council Trackeria?",
            why_desc: "Tämä alusta tarjoaa pääsyn Helsingin kaupunginvaltuuston käsittelyihin kansalaisille, toimittajille, julkisen politiikan puolestapuhujille ja kaikille, jotka seuraavat paikallishallinnon asioita. Se toimii resurssina kunnallisten päätöksentekoprosessien seurantaan ja sitä päivitetään jatkuvasti tulevaisuudessa uusilla ominaisuuksilla..",
            explore_now: "Tutustu nyt",

            disclaimer_title: "Vastuuvapauslauseke!",
            disclaimer_item1: "Tämän verkkosivuston sisältö on tuotettu tekoälyn avulla ja saattaa sisältää tahattomia ennakkoasenteita tai epätarkkuuksia.",
            disclaimer_item2: "Suomenkieliset käännökset ovat tekoälyn tuottamia ja saattavat sisältää kielellisiä puutteita.",
            disclaimer_item3: "Parhaan suorituskyvyn ja tarkkuuden varmistamiseksi käytä tätä verkkosivustoa tietokoneella ja englanniksi.",
            disclaimer_item4: "Tarkista viralliset tiedot Helsingin kaupunginvaltuuston viralliselta verkkosivustolta.",

            parties_title: "Poliittiset puolueet",
            parties_subtitle: "Tutustu Helsingin kaupunginvaltuustossa edustettuina oleviin poliittisiin puolueisiin.",
            councillors_title: "Kaupunginvaltuutetut",
            search_councillors: "Etsi valtuutettuja...",
            filter_by_party: "Suodata puolueen mukaan:",
            all_parties: "Kaikki puolueet",
            meetings_title: "Valtuuston kokoukset",
            search_meetings: "Etsi päivämäärän mukaan...",
            meeting_placeholder: "Valitse kokouspäivä nähdäksesi yhteenvedon.",
            about_title: "Tietoa Helsinki Council Trackerista",
            faq_title: "Usein kysytyt kysymykset",
            contact_title: "Ota yhteyttä",
            contact_desc: "Onko kysyttävää, palautetta tai ehdotuksia? Ota yhteyttä!",

            galtan: "Tämä kaavio sijoittaa puolueiden valtuutetut (tai heidän puheensa valtuutettujen välilehdellä) vasemmisto-oikeisto (taloudellinen) ja gal-tan (sosiaalinen/kulttuurinen) akseleille tekoälyanalyysin perusteella. Alemmat vasemman puoleiset arvot viittaavat enemmän vasemmistolaisiin/edistyksellisiin kantoihin; korkeammat oikean puoleiset arvot viittaavat enemmän oikeistolaisiin/perinteisiin kantoihin. Jokainen piste edustaa valtuutetun kokonaisasemaa (tai yksittäistä puhetta valtuutettujen välilehdellä). Valtuutettujen itsearvioidut asemat löytyvät Ylen Kuntavaalikoneesta.",
            topics: "Tämä kaavio näyttää keskimääräisen aihepainotuksen valtuuston jäsenten puheissa. Jokainen puhe luokiteltiin aiheen mukaan (esim. Julkinen liikenne 70%, Ympäristö 30%). Arvot osoittavat kunkin aiheen puheajasta käytetyn prosenttiosuuden, kuvastaen huomion kohdetta sisällön sijaan. Aiheet perustuvat kaks.fi:n kyselyyn.",
            geo: "Nämä kartat visualisoivat vuoden 2021 kunnallisvaalien tuloksia, näyttäen äänten keskittymisen alueittain. Tummemmat alueet osoittavat korkeampaa ääniosuutta (puolue) tai absoluuttisia ääniä (valtuutettu), lähteenä Tilastokeskus.",
     
            // FAQ Questions and Answers
            faq_q1: "Kuka loi tämän verkkosivuston?",
            faq_a1: "Verkkosivuston loi minä, Korbinian Pauli. Minulla on kandidaatin tutkinto poliittisesta tieteestä ja tietojenkäsittelytieteestä Münchenin yliopistosta ja maisterin tutkinto sosiaalisessa datatieteessä Kööpenhaminan yliopistosta. Tein tämän verkkosivuston osittain projektina esitelläkseni taitojani potentiaalisille työnantajille ja osittain, jotta Helsingissä asuvilla ihmisillä olisi vaihtoehto Ylen Vaalikoneelle. Perinteiset vaalikompassityökalut ovat tulevaisuuteen suuntautuvia ja niistä puuttuu yksityiskohtaista tietoa siitä, mitä on päätetty aiemmin. Tämän verkkosivuston tavoitteena on yksinkertaistaa nykyiseen päätöksentekoon liittyvän tiedon saamista, erityisesti kansainvälisille asukkaille, joilla saattaa olla vaikeuksia löytää tietoa englanniksi.",
            
            faq_q2: "Mistä tieto on peräisin ja onko täällä esitetty tieto tarkkaa?",
            faq_a2: "Tieto perustuu pääasiassa Helsingin kaupunginvaltuuston kokouspöytäkirjoihin, mutta sitä on täydennetty vuoden 2021 virallisilla äänestysluvuilla Tilastokeskukselta. Tällä verkkosivustolla esitetyt yhteenvedot, luokittelut ja aiheanalyysit on tuotettu käyttäen tekoälyä (AI) ja niitä tulisi pitää täydentävänä tietona. Vaikka englanninkielisten tulosten tarkkuuden validointiin on käytetty huomattavasti vaivaa, käyttäjiä kehotetaan käyttämään kriittistä harkintaa ja tarkistamaan luotettavista, virallisista lähteistä kuten Helsingin kaupunginvaltuuston verkkosivustolta (https://paatokset.hel.fi/fi) lopullinen tieto.",
            
            faq_q3: "Onko tämä laillista GDPR:n mukaan?",
            faq_a3: "Tämän verkkosivuston tiedonkeruu- ja käsittelykäytännöt ovat yleisen tietosuoja-asetuksen (GDPR) mukaisia. Tietoja käsitellään 6 artiklan 1 kohdan e alakohdan oikeusperustan mukaisesti, koska sitä tehdään yleisen edun nimissä. Käytetty poliittinen tieto kuuluu GDPR:n 9 artiklan erityisten henkilötietoluokkien piiriin, mutta rajoittuu tietoihin, jotka Helsingin kaupunginvaltuuston jäsenet ovat selvästi julkaisseet. Kerätyt tiedot rajoittuvat nimeen, puoluejäsenyyteen, kaikkiin puheisiin kaupunginvaltuustossa nykyisellä vaalikaudella ja vuoden 2021 kunnallisvaaleissa saatuihin äänimääriin. Olemme sitoutuneet kunnioittamaan yksityisyyden suojaa ja varmistamaan tietojen tarkkuuden. Jos uskot, että jokin tieto on epätarkkaa, ota yhteyttä."
        }
    };
    
    const lang = translations[currentLanguage];
    
    // Update navigation tabs
    document.querySelector('.nav-item[data-page="home"] a').textContent = lang.nav_home;
    document.querySelector('.nav-item[data-page="parties"] a').textContent = lang.nav_parties;
    document.querySelector('.nav-item[data-page="councillors"] a').textContent = lang.nav_councillors;
    document.querySelector('.nav-item[data-page="meetings"] a').textContent = lang.nav_meetings;
    document.querySelector('.nav-item[data-page="about"] a').textContent = lang.nav_about;
    
    // Update Home page
    document.querySelector('.hero h2').textContent = lang.home_title;
    document.querySelector('.hero p').textContent = lang.home_subtitle;
    document.querySelectorAll('.feature-card h3')[0].textContent = lang.councillor_profiles;
    document.querySelectorAll('.feature-card p')[0].textContent = lang.councillor_desc;
    document.querySelectorAll('.feature-card h3')[1].textContent = lang.party_positions;
    document.querySelectorAll('.feature-card p')[1].textContent = lang.party_desc;
    document.querySelectorAll('.feature-card h3')[2].textContent = lang.meeting_summaries;
    document.querySelectorAll('.feature-card p')[2].textContent = lang.meeting_desc;
    document.querySelector('.cta-section h3').textContent = lang.why_use;
    document.querySelector('.cta-section p').textContent = lang.why_desc;
    document.getElementById('explore-btn').textContent = lang.explore_now;
    document.querySelector('.disclaimer-section h3').textContent = lang.disclaimer_title;
    const disclaimerItems = document.querySelectorAll('.disclaimer-section li');
    if (disclaimerItems.length >= 4) {
    disclaimerItems[0].textContent = lang.disclaimer_item1;
    disclaimerItems[1].textContent = lang.disclaimer_item2;
    disclaimerItems[2].textContent = lang.disclaimer_item3;
    disclaimerItems[3].textContent = lang.disclaimer_item4;
    }
    
    // Update Parties page
    document.querySelector('#parties h2').textContent = lang.parties_title;
    document.querySelector('#parties > div > p').textContent = lang.parties_subtitle;
    
    // Update Councillors page
    document.querySelector('#councillors h2').textContent = lang.councillors_title;
    document.getElementById('councillor-search').placeholder = lang.search_councillors;
    document.querySelector('label[for="party-filter"]').textContent = lang.filter_by_party;
    document.querySelector('#party-filter option').textContent = lang.all_parties;
    
    // Update Meetings page
    document.querySelector('#meetings h2').textContent = lang.meetings_title;
    document.getElementById('meeting-search').placeholder = lang.search_meetings;
    const placeholderMessage = document.querySelector('.meeting-summary .placeholder-message');
    if (placeholderMessage) {
        placeholderMessage.textContent = lang.meeting_placeholder;
    }
    
    // Update About page headers
    document.querySelector('#about h2').textContent = lang.about_title;
    document.querySelector('.faq-section h3').textContent = lang.faq_title;
    document.querySelector('.contact-section h3').textContent = lang.contact_title;
    document.querySelector('.contact-section > p').textContent = lang.contact_desc;
    
    // Update About page - FAQ section
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length >= 3) {
        // Update FAQ questions and answers
        faqItems[0].querySelector('h4').textContent = lang.faq_q1;
        faqItems[0].querySelector('p').textContent = lang.faq_a1;
        
        faqItems[1].querySelector('h4').textContent = lang.faq_q2;
        faqItems[1].querySelector('p').textContent = lang.faq_a2;
        
        faqItems[2].querySelector('h4').textContent = lang.faq_q3;
        faqItems[2].querySelector('p').textContent = lang.faq_a3;

    }
}

// Set up event listeners
function setupEventListeners() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            navigateToPage(page);
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
        searchBtn.addEventListener('click', function() {
            filterCouncillors();
        });
        
        councillorSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterCouncillors();
            }
        });
    }
    
    // Party filter
    const partyFilter = document.getElementById('party-filter');
    if (partyFilter) {
        partyFilter.addEventListener('change', function() {
            filterCouncillors();
        });
    }
    
    // Meeting search functionality
    const meetingSearch = document.getElementById('meeting-search');
    const meetingSearchBtn = document.getElementById('meeting-search-btn');
    if (meetingSearch && meetingSearchBtn) {
        meetingSearchBtn.addEventListener('click', function() {
            filterMeetings();
        });
        
        meetingSearch.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                filterMeetings();
            }
        });
    }
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeAllModals();
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Escape key to close modals
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Handle window hashchange
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            navigateToPage(hash);
        }
    });
    
    console.log('Event listeners set up successfully');
}
// Simplified function to add info buttons
// Add info buttons to chart containers
function addInfoButtons() {
    console.log("Adding info buttons...");
    
    // Get current translations using the same approach as elsewhere in the code
    const lang = currentLanguage === 'en' ? 'en' : 'fi';
    
    // Define the info texts directly in this function
    const infoTexts = {
        en: {
            galtan: "This graph positions party councillors (or their speeches in the councillor tab) on left-right (economic) and gal-tan (social/cultural) axes, based on AI analysis of their speeches. Lower left scores indicate more left-leaning/progressive stances; higher right scores indicate more right-leaning/traditional stances. Each dot represents a councillor's overall position (or a single speech in the councillor tab). For councillors’ self-assessed positions, see Yle's Kuntavaalikone.",
            topics: "This graph shows the average topic emphasis in council members' speeches. Each speech was classified by topic (e.g., Public Transport 70%, Environment 30%). The values indicate the percentage of speaking time dedicated to each topic, reflecting issue focus not content. Topics are based on a survey by kaks.fi.",
            geo: "These maps visualise 2021 municipal election results, showing vote concentration by district. Darker areas indicate higher vote share (party) or absolute votes (councillor), sourced from Statistics Finland."
        },
        fi: {
            galtan: "Tämä kaavio sijoittaa puolueiden valtuutetut (tai heidän puheensa valtuutettujen välilehdellä) vasemmisto-oikeisto (taloudellinen) ja gal-tan (sosiaalinen/kulttuurinen) akseleille tekoälyanalyysin perusteella. Alemmat vasemman puoleiset arvot viittaavat enemmän vasemmistolaisiin/edistyksellisiin kantoihin; korkeammat oikean puoleiset arvot viittaavat enemmän oikeistolaisiin/perinteisiin kantoihin. Jokainen piste edustaa valtuutetun kokonaisasemaa (tai yksittäistä puhetta valtuutettujen välilehdellä). Valtuutettujen itsearvioidut asemat löytyvät Ylen Kuntavaalikoneesta.",
            topics: "Tämä kaavio näyttää keskimääräisen aihepainotuksen valtuuston jäsenten puheissa. Jokainen puhe luokiteltiin aiheen mukaan (esim. Julkinen liikenne 70%, Ympäristö 30%). Arvot osoittavat kunkin aiheen puheajasta käytetyn prosenttiosuuden, kuvastaen huomion kohdetta sisällön sijaan. Aiheet perustuvat kaks.fi:n kyselyyn.",
            geo: "Nämä kartat visualisoivat vuoden 2021 kunnallisvaalien tuloksia, näyttäen äänten keskittymisen alueittain. Tummemmat alueet osoittavat korkeampaa ääniosuutta (puolue) tai absoluuttisia ääniä (valtuutettu), lähteenä Tilastokeskus.",
      }
    };
    
    // Find all chart containers
    const galtanContainer = document.querySelector('.chart-container:first-child');
    const topicsContainer = document.querySelector('.chart-container:last-child');
    const mapContainer = document.querySelector('.map-container');
    
    // Add buttons to each container
    if (galtanContainer) {
        addInfoButton(galtanContainer, infoTexts[lang].galtan);
    }
    
    if (topicsContainer) {
        addInfoButton(topicsContainer, infoTexts[lang].topics);
    }
    
    if (mapContainer) {
        addInfoButton(mapContainer, infoTexts[lang].geo);
    }
}


// Helper function to add an info button to a container
function addInfoButton(container, infoText) {
    // Get or create heading
    let heading = container.querySelector('h4');
    if (!heading) return;
    
    // Remove any existing buttons to avoid duplicates
    const existingButtons = heading.querySelectorAll('.info-button');
    existingButtons.forEach(btn => btn.remove());
    
    // Create info button
    const infoBtn = document.createElement('button');
    infoBtn.className = 'info-button';
    infoBtn.innerHTML = 'i';
    infoBtn.setAttribute('title', 'Click for information');
    heading.appendChild(infoBtn);
    
    // Create info modal if it doesn't exist
    let infoModal = container.querySelector('.graph-info-modal');
    if (infoModal) {
        infoModal.innerHTML = infoText;
    } else {
        infoModal = document.createElement('div');
        infoModal.className = 'graph-info-modal';
        infoModal.innerHTML = infoText;
        container.appendChild(infoModal);
    }
    
    // Add click event to show/hide the modal
    infoBtn.onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // Hide all other modals first
        document.querySelectorAll('.graph-info-modal').forEach(modal => {
            if (modal !== infoModal) modal.style.display = 'none';
        });
        
        // Toggle this modal
        infoModal.style.display = infoModal.style.display === 'block' ? 'none' : 'block';
        console.log("Info button clicked, modal visible:", infoModal.style.display === 'block');
    };
}

// Helper function to add an info button to a container
function addInfoButtonToContainer(container, heading, infoText) {
    // Remove any existing info buttons to avoid duplicates
    const existingBtn = heading.querySelector('.info-button');
    if (existingBtn) {
        existingBtn.remove();
    }
    
    // Remove any existing info modals
    const existingModal = container.querySelector('.graph-info-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create button
    const infoBtn = document.createElement('button');
    infoBtn.className = 'info-button';
    infoBtn.innerHTML = 'i';
    infoBtn.setAttribute('aria-label', 'Show information about this graph');
    heading.appendChild(infoBtn);
    
    // Create info modal
    const infoModal = document.createElement('div');
    infoModal.className = 'graph-info-modal';
    infoModal.innerHTML = infoText;
    container.appendChild(infoModal);
    
    // Add click event
    infoBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        infoModal.style.display = infoModal.style.display === 'block' ? 'none' : 'block';
    });
    
    // Close when clicking outside
    document.addEventListener('click', function() {
        infoModal.style.display = 'none';
    });
    
    // Prevent modal from closing when clicking inside it
    infoModal.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Get info text based on graph type
function getGraphInfo(chartType) {
    const info = {
        'GAL-TAN Position': 'This graph shows the position on the GAL-TAN scale (Green-Alternative-Libertarian vs Traditional-Authoritarian-Nationalist). Data is computed by analyzing voting patterns and public statements on key social issues.',
        'Key Topics': 'This visualization displays the main policy areas the councillor/party focuses on. Topics are identified through natural language processing of speeches, motions, and public statements.',
        'Geographical Support': 'This map displays areas of strong support based on voting data from the latest municipal elections, broken down by district.'
    };
    
    return info[chartType] || 'Information about this visualization methodology is not available.';
}

// Navigate to a specific page
function navigateToPage(pageName) {
    // Update active state in nav links
    const navLinks = document.querySelectorAll('.nav-item');
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
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
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0);
        window.location.hash = pageName;
    }
}

// Populate party filter dropdown
function populatePartyFilter() {
    const partyFilter = document.getElementById('party-filter');
    if (!partyFilter) return;
    
    // Get unique parties
    const uniqueParties = [...new Set(councillorData.map(councillor => councillor.party))];
    
    // Sort parties alphabetically
    uniqueParties.sort();
    
    // Create and append options
    uniqueParties.forEach(party => {
        const option = document.createElement('option');
        option.value = party;
        option.textContent = party;
        partyFilter.appendChild(option);
    });
}

// Render parties grid
function renderParties() {
    const partyGrid = document.getElementById('party-grid');
    if (!partyGrid) return;
    
    // Clear existing content
    partyGrid.innerHTML = '';
    
    // Define custom party order
    const partyOrder = ["Kokoomus", "Vihreät", "Sosiaalidemokraatit", "Vasemmistoliitto", "Perussuomalaiset", "Ruotsalainen Kansanpuolue", "Liike Nyt", "Keskusta", "Kristillisdemokraatit"];
    
    // Sort parties according to custom order
    const sortedParties = [...partyData].sort((a, b) => {
        const indexA = partyOrder.indexOf(a.party);
        const indexB = partyOrder.indexOf(b.party);
        
        // If both parties are in the ordered list, use the custom order
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        
        // If only one party is in the ordered list, prioritize it
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        // For parties not in the ordered list, sort alphabetically
        return a.party.localeCompare(b.party);
    });
    
    // Create party cards
    sortedParties.forEach(party => {
        const partyCard = document.createElement('div');
        partyCard.className = 'party-card';
        partyCard.setAttribute('data-party', party.party);
        
        const partyLogo = document.createElement('div');
        partyLogo.className = 'party-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = party.logo || 'default-party-logo.png';
        logoImg.alt = `${party.party} logo`;
        partyLogo.appendChild(logoImg);
        
        const partyInfo = document.createElement('div');
        partyInfo.className = 'party-info';
        
        const partyName = document.createElement('h3');
        partyName.textContent = party.party;
        partyInfo.appendChild(partyName);
        
        partyCard.appendChild(partyLogo);
        partyCard.appendChild(partyInfo);
        
        // Add click event to show party details
        partyCard.addEventListener('click', function() {
            displayPartyDetails(party.party);
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
        return;
    }
    
    // Set modal data attribute
    partyModal.setAttribute('data-party', partyName);
    
    // Build party details content
    const summaryKey = currentLanguage === 'en' ? 'manifesto_summary_en' : 'manifesto_summary_fi';
    
    let detailsHTML = `
        <div class="party-detail-header">
            <img src="${party.logo || 'default-party-logo.png'}" alt="${party.party} logo" class="party-detail-logo">
            <h2>${party.party}</h2>
        </div>
        <div class="party-summary">
            ${formatMarkdown(party[summaryKey] || 'No manifesto summary available.')}
        </div>
        <div class="councillor-charts">
            <h3>Position Analysis</h3>
            <div class="charts-container">
                <div class="chart-container">
                    <h4>GAL-TAN Position</h4>
                    <img src="${party.galtan}" alt="GAL-TAN position chart">
                </div>
                <div class="chart-container">
                    <h4>Key Topics</h4>
                    <img src="${party.topics}" alt="Key topics chart">
                </div>
            </div>
            <div class="map-container">
                <h4>Geographical Support</h4>
                <img src="${party.map}" alt="Geographical support map">
            </div>
        </div>
    `;
    
    partyDetails.innerHTML = detailsHTML;
    
    // Show modal
    partyModal.style.display = 'block';

    setTimeout(addInfoButtons, 100);
}

// Render councillors grid
function renderCouncillors(filteredData = null) {
    const councillorGrid = document.getElementById('councillor-grid');
    if (!councillorGrid) return;
    
    // Clear existing content
    councillorGrid.innerHTML = '';
    
    // Use filtered data or all data
    const dataToRender = filteredData || councillorData;
    
    // Sort councillors by number of votes (descending)
    const sortedData = [...dataToRender].sort((a, b) => b.votes - a.votes);
    
    // Limit to 24 councillors
    const limitedData = sortedData.slice(0, 24);
    
    // Create councillor cards
    limitedData.forEach(councillor => {
        const councillorCard = document.createElement('div');
        councillorCard.className = 'councillor-card';
        councillorCard.setAttribute('data-id', councillor.name);
        
        const councillorImage = document.createElement('div');
        councillorImage.className = 'councillor-image';
        
        const img = document.createElement('img');
        img.src = councillor.img_filepath || 'default-profile.png';
        img.alt = councillor.name;
        councillorImage.appendChild(img);
        
        const councillorInfo = document.createElement('div');
        councillorInfo.className = 'councillor-info';
        
        const name = document.createElement('h3');
        name.textContent = councillor.name;
        councillorInfo.appendChild(name);
        
        const party = document.createElement('p');
        party.className = 'party-name';
        party.textContent = councillor.party;
        councillorInfo.appendChild(party);
        
        const votes = document.createElement('p');
        votes.textContent = `Votes: ${councillor.votes.toLocaleString()}`;
        councillorInfo.appendChild(votes);
        
        const speeches = document.createElement('p');
        speeches.textContent = `Speeches: ${councillor['number of speeches']}`;
        councillorInfo.appendChild(speeches);
        
        councillorCard.appendChild(councillorImage);
        councillorCard.appendChild(councillorInfo);
        
        // Add click event to show councillor details
        councillorCard.addEventListener('click', function() {
            displayCouncillorDetails(councillor.name);
        });
        
        councillorGrid.appendChild(councillorCard);
    });
    
    // Show message if no results
    if (limitedData.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No councillors found matching your criteria.';
        councillorGrid.appendChild(noResults);
    }
}

// Filter councillors based on search and party filter
function filterCouncillors() {
    const searchInput = document.getElementById('councillor-search');
    const partyFilter = document.getElementById('party-filter');
    
    if (!searchInput || !partyFilter) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedParty = partyFilter.value;
    
    // Apply filters
    const filteredData = councillorData.filter(councillor => {
        const nameMatch = councillor.name.toLowerCase().includes(searchTerm);
        const partyMatch = selectedParty === 'all' || councillor.party === selectedParty;
        return nameMatch && partyMatch;
    });
    
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
        return;
    }
    
    // Set modal data attribute
    councillorModal.setAttribute('data-id', councillorName);
    
    // Determine which summary to use based on language
    const summaryKey = currentLanguage === 'en' ? 'ai_summary' : 'ai_summary_fi';
    
    // Build councillor details content
    let detailsHTML = `
        <div class="councillor-detail-header">
            <div class="councillor-detail-image">
                <img src="${councillor.img_filepath || 'default-profile.png'}" alt="${councillor.name}">
            </div>
            <div class="councillor-detail-info">
                <h2>${councillor.name}</h2>
                <p class="party-name">${councillor.party}</p>
                <p><strong>Votes:</strong> ${councillor.votes.toLocaleString()}</p>
                <p><strong>Speeches:</strong> ${councillor['number of speeches']}</p>
            </div>
        </div>
        <div class="councillor-summary">
            <h3>Summary</h3>
            ${formatMarkdown(councillor[summaryKey] || 'No summary available.')}
        </div>
        <div class="councillor-charts">
            <h3>Position Analysis</h3>
            <div class="charts-container">
                <div class="chart-container">
                    <h4>GAL-TAN Position</h4>
                    <img src="${councillor.galtan_filepath}" alt="GAL-TAN position chart">
                </div>
                <div class="chart-container">
                    <h4>Key Topics</h4>
                    <img src="${councillor.topic_filepath}" alt="Key topics chart">
                </div>
            </div>
            <div class="map-container">
                <h4>Geographical Support</h4>
                <img src="${councillor.map_filepath}" alt="Geographical support map">
            </div>
        </div>
    `;
    
    councillorDetails.innerHTML = detailsHTML;
    
    // Show modal
    councillorModal.style.display = 'block';

    // After modal is shown and content is added
    setTimeout(addInfoButtons, 100);
}

// Render meeting list and initial meeting
function renderMeetings() {
    const meetingList = document.getElementById('meeting-list');
    if (!meetingList) return;
    
    // Clear existing content
    meetingList.innerHTML = '';
    
    // Create meeting list items
    meetingData.forEach((meeting, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', index);
        
        // Format date: DD Month, YYYY
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
    
    // Select first meeting by default
    if (meetingData.length > 0) {
        const firstMeeting = meetingList.querySelector('li');
        if (firstMeeting) {
            firstMeeting.classList.add('active');
            displayMeetingSummary(0);
        }
    }
}

// Filter meetings based on search
function filterMeetings() {
    const meetingSearch = document.getElementById('meeting-search');
    const meetingList = document.getElementById('meeting-list');
    
    if (!meetingSearch || !meetingList) return;
    
    const searchTerm = meetingSearch.value.toLowerCase().trim();
    
    // Show all items if search is empty
    if (searchTerm === '') {
        meetingList.querySelectorAll('li').forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    // Filter list items
    meetingList.querySelectorAll('li').forEach(item => {
        const date = item.textContent.toLowerCase();
        if (date.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Display meeting summary based on index
function displayMeetingSummary(index) {
    const meetingSummary = document.getElementById('meeting-summary');
    if (!meetingSummary) return;
    
    const meeting = meetingData[index];
    if (!meeting) {
        console.error('Meeting not found at index:', index);
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
            ${formatMarkdown(meeting[summaryKey] || 'No summary available.')}
        </div>
    `;
    
    meetingSummary.innerHTML = summaryHTML;
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Format markdown text to HTML
function formatMarkdown(markdownText) {
    if (!markdownText) return '';
    
    // Replace headers
    markdownText = markdownText.replace(/^### (.*$)/gm, '<h4>$1</h4>');
    markdownText = markdownText.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    markdownText = markdownText.replace(/^# (.*$)/gm, '<h2>$1</h2>');
    
    // Replace bold
    markdownText = markdownText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace italic
    markdownText = markdownText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace lists
    markdownText = markdownText.replace(/^\s*- (.*$)/gm, '<li>$1</li>');
    markdownText = markdownText.replace(/<li>(.*)<\/li>/g, '<ul><li>$1</li></ul>');
    markdownText = markdownText.replace(/<\/ul><ul>/g, '');
    
    // Replace paragraphs
    markdownText = markdownText.replace(/^(?!<[h|u|l|p])(.*$)/gm, '<p>$1</p>');
    markdownText = markdownText.replace(/<p><\/p>/g, '');
    
    return markdownText;
}