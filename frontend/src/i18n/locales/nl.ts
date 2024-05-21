export default {
    default: {
        error: {
            "not-found": "Pagina niet gevonden",
        },
        loading: {
            loading_page: "Aan het laden...",
        },
        no: "geen",
        to: "naar ",
        no_capital: "Neen",
        yes_capital: "Ja",
        cancel: "Annuleren",
        confirm: "Bevestigen",
        search: "Zoeken",
        add: "Toevoegen",
    },
    logo: "universiteit-gent-logo-white.png",
    logout: "uitloggen",
    login: {
        about: "De officiële indienapplicatie van de Universiteit Gent",
        login: "Inloggen",
    },
    home: {
        welcome: "Welkom {name} {surname}",
        logout: "Uitloggen",
    },
    submit: {
        submit_title: "Oplossing indienen",
        create_title_tip: "Kies een titel",
        submit_button: "Indienen",
        remarks: "Opmerkingen",
        files: "Bestanden",
        add_files_button: "Bestanden toevoegen",
        no_files_added: "Je hebt nog geen bestanden toegevoegd.",
        no_files_warning: "Voeg ten minste een bestand toe om een indiening te maken.",
        submissions: "Indieningszone",
        latest_submission: "Laatste indiening:",
        new_submission: "Nieuwe indiening",
        status_submission: "Indiening is: {status}",
        no_submission_files: "Geen indieningen gevonden",
        files_usage_note: "Info voor het gebruik van testbestanden",
        files_disclaimer: "Voor info over het gebruik van testbestanden, bezoek onze  ",
    },
    submission: {
        status: "Status indiening:",
        datetime: "Indiening tijdstip:",
        remarks: "Opmerkingen",
        remarks_empty: "Geen opmerkingen voor deze indiening",
        files: "Bestanden",
        download_info: "Klik op bestandsnaam om te downloaden",
        after_deadline: "Na deadline",
        submissions_title: "Indieningen voor project {project}",
        no_submissions: "Nog geen indieningen",
        teacher_submissions_info:
            "Deze pagina bevat een lijst van de laatste indiening van elke groep voor dit project.",
        docker_test: "Testen Output",
        download_all_files: "Download alle bestanden",
    },
    project: {
        deadline: "Deadline",
        details_button: "Naar project",
        group_button: "Vind groep",
        needhelp_button: "Hulp nodig",
        group: "Groep {number}",
        assignment: "Opdracht:",
        myProject: "Mijn projecten",
        capacity_group: "Capaciteit: ",
        edit: "Bewerk project",
        submissions_list: "Alle indieningen",
        submissions_list_teacher: "Alle indieningen voor dit project",
        submissions_zip: "Download alle indieningen",
        not_found: "Geen projecten teruggevonden.",
        finished: "Afgerond",
        not_found2: "Project niet teruggevonden",
        requirements: "Bestandsvereisten",
        mandatory: "Verplicht",
        forbidden: "Verboden",
        unmet_mandatory: "Dit verplichte bestand is niet aanwezig in je indiening.",
        unmet_forbidden: "Deze ingediende bestanden zijn verboden:",
        unmet_reqs_warning: "Opgelet: je indiening voldoet niet aan alle bestandsvereisten.",
        to_subject: "Naar vak",
        to_groups: "Naar groepen",
        selected_subject: "Gekozen vak",
        group_warning:
            "Eens het project aangemaakt is is het niet meer mogelijk de groepen aan te passen",
        group_toggle: "Groepswerk",
        random: "Willekeurige groepen",
        student_groups: "Studenten gekozen groepen",
        enroll_deadline: "Inschrijvingsdeadline",
        publish_date: "Publiceringsdatum",
        no_files: "Geen bestanden voor het project teruggevonden",
        requirement: "Voeg verplichte of verboden extensie toe (bv: verslag.pdf)",
        invalid_format:
            "Voer een geldig bestandstype in, inclusief de extensie (bv. 'afbeelding.png')",
        files_will_be_overwritten:
            "Bij het uploaden van een nieuw testbestand zullen alle huidige testbestanden verwijderd worden.",
        testfiles: "Testbestanden",
        requirements_disclaimer: "Voor info over het gebruik van bestandsvereisten, bezoek onze ",
        to_project: "Naar project",
    },
    navigation: {
        home: "Hoofdscherm",
        subjects: "Vakken",
        projects: "Projecten",
        settings: "Instellingen",
        help: "Help",
        admin: "Beheerderspaneel",
        login: "Inloggen",
        about: "Meer Info",
    },
    homescreen: {
        deadlines: "Project deadlines",
        subjects: "Mijn vakken",
        announcements: "Meldingen",
    },
    admin: {
        users: "Gebruikers",
        search: "Zoeken",
        userTable: {
            name: "Naam",
            uid: "UGent ID",
            email: "Email",
            isTeacher: "Is Lesgever",
            isAdmin: "Is Beheerder",
        },
    },
    subject: {
        register: "Inschrijven voor vak:",
        yes: "Ja",
        no: "Nee",
        registered: "Je bent al ingeschreven voor dit vak",
        academy_year: "Academiejaar",
        projects: "Projecten",
        announcements: "Meldingen",
        groups: "Groepen",
        projectsPage: {
            all: "Alle",
            active: "Actief",
            completed: "Voltooid",
            no_projects: "Geen projecten gevonden.",
            show_assignment: "Meer",
            hide_assignment: "Minder",
        },
        project: {
            assignment: "Opdracht",
            group: "Groep",
            submissions: "Indieningen",
        },
        create_project: "Nieuw project",
        register_link_button: {
            title: "Registratie link",
            snackbar: "Registratie link gekopieerd naar klembord.",
            tooltip:
                "Kopieer de registratie link voor dit vak, deze kan gedeeld worden met studenten om zich te registreren voor het vak.",
        },
        error: "Fout bij het inladen van vakken",
    },

    subjects: {
        title: "Mijn vakken",
        create_subject: "Nieuw vak",
        instructor_subjects: "Toon lesgever vakken",
        student_subjects: "Toon student vakken",
        no_subjects: "Geen vakken gevonden.",
    },

    create_subject: {
        error_snackbar:
            "Er moet minstens één lesgever bij de geselecteerde vakverantwoordelijken aanwezig zijn.",
        cancel_dialog: "Vak aanmaken annuleren?",
        new_subject: "Nieuw vak",
        title: "Titel",
        enter_title: "Voer titel in",
        enter_title_hint: "Voer een geldige titel in voor het nieuwe vak",
        assign_self: "Wijs mezelf toe als lesgever",
        field_required: "Dit veld is verplicht",
        field_length: "Titel moet minstens 3 tekens lang zijn",
        subject_instructors: "Vak verantwoordelijken",
        search_for_instructors: "Zoek naar vak verantwoordelijken",
        email: "Vak email",
        enter_email: "Voer email in",
        email_hint: "Veld is optioneel",
        email_invalid: "Ingevoerde email is ongeldig",
    },

    group: {
        not_found: "Groep niet gevonden",
        not_found2: "Geen groepen teruggevonden",
        error: "Fout bij het laden van de pagina",
        groups: "Groepen:",
        members: "Leden:",
        actions: "Acties:",
        no_members_found: "Geen leden teruggevonden.",
        remove: "Verwijderen",
        join_group: "Aansluiten",
        leave_group: "Verlaten",
        remove_group: "Groep verwijderen",
        create_group: "Nieuwe groep",
        no_students: "Geen studenten gevonden",
        close: "sluiten",
        all_students: "Alle studenten",
        all_students_course: "Alle studenten in vak:",
        to_grouppage: "Naar groepspagina",
    },
    about: {
        about: "Over dit project",
        p_1: "Dit project is gemaakt in het kader van het vak",
        p_2: "De broncode is publiek beschikbaar op",
        developers: "Onze developers",
    },
};
