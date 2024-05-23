export default {
    default: {
        error: {
            "not-found": "Page not found",
            "something-went-wrong": "Something went wrong",
        },
        loading: {
            loading_page: "Loading...",
        },
        no: "no",
        to: "to ",
        no_capital: "No",
        yes_capital: "Yes",
        cancel: "Cancel",
        confirm: "Confirm",
        search: "Search",
        add: "Add",
    },
    logo: "ghent-university-logo-white.png",
    logout: "logout",
    login: {
        about: "The official submission application of Ghent University",
        login: "Login",
    },
    home: {
        welcome: "Welcome {name} {surname}",
        logout: "Logout",
    },
    submit: {
        submit_title: "Submit solution",
        create_title_tip: "Choose a title",
        submit_button: "Submit",
        remarks: "Remarks",
        files: "Files",
        add_files_button: "Add files",
        no_files_added: "No files have been added yet.",
        no_files_warning: "Please add at least one file to submit a solution.",
        submissions: "Submission zone",
        latest_submission: "Latest submission:",
        new_submission: "Submit new",
        status_submission: "Submission is: {status}",
        no_submission_files: "No submissions found",
        files_disclaimer: "For info on the usage of testfiles please visit our",
    },
    submission: {
        status: "Submission status:",
        datetime: "Submission time:",
        remarks: "Remarks",
        remarks_empty: "No remarks for this submission",
        files: "Files",
        download_info: "Click on filename to download",
        after_deadline: "After deadline",
        submissions_title: "Submissions:",
        no_submissions: "No submissions yet",
        teacher_submissions_info:
            "This page contains a list of the latest submission of each group for this project.",
        docker_test: "Tests Output",
        download_all_files: "Download all files",
    },
    project: {
        deadline: "Deadline",
        details_button: "Project details",
        group_button: "Join group",
        needhelp_button: "Need help",
        group: "Group {number}",
        no_group: "Not yet in a group",
        assignment: "Assignment:",
        myProject: "My projects",
        capacity_group: "Capacity: ",
        edit: "Edit project",
        submissions_list: "All submissions from this person/group",
        submissions_list_teacher: "All submissions for this project",
        submissions_zip: "Download all submissions",
        not_found: "No projects found.",
        finished: "Finished",
        not_found2: "Project not found",
        requirements: "File requirements",
        mandatory: "Mandatory",
        forbidden: "Forbidden",
        unmet_mandatory: "This mandatory file was not included in your submission.",
        unmet_forbidden: "These submitted files are not allowed:",
        unmet_reqs_warning: "Your submission did not satisfy all file requirements.",
        to_subject: "To subject",
        to_groups: "To groups",
        selected_subject: "Selected subject",
        group_warning: "Once the project has been created groups can no longer be edited",
        group_toggle: "Group project",
        random: "Random groups",
        student_groups: "Student chosen groups",
        enroll_deadline: "Enroll deadline",
        publish_date: "Publish date",
        no_files: "No project files found",
        requirement: "Add mandatory or forbidden extension (ie: assignment.pdf)",
        invalid_format:
            "Please enter a valid file type, including the extension (e.g., 'image.png')",
        files_will_be_overwritten: "By uploading another file current files will be overwritten.",
        testfiles: "Testfiles",
        requirements_disclaimer: "For info on the usage of requirements please visit our",
        to_project: "To Project",
    },
    navigation: {
        home: "Home",
        subjects: "Subjects",
        projects: "Projects",
        settings: "Settings",
        help: "Help",
        admin: "Admin panel",
        login: "Login",
        about: "About",
    },
    homescreen: {
        deadlines: "Project deadlines",
        subjects: "My subjects",
        announcements: "Announcements",
    },
    admin: {
        users: "Users",
        search: "Search",
        userTable: {
            name: "Name",
            surname: "Surname",
            uid: "UGent ID",
            email: "Email",
            isTeacher: "Is Teacher",
            isAdmin: "Is Admin",
        },
    },
    subject: {
        register: "Register to subject:",
        yes: "Yes",
        no: "No",
        registered: "You are already registered to this course",
        academy_year: "Academic year",
        projects: "Projects",
        announcements: "Announcements",
        groups: "Groups",
        projectsPage: {
            all: "All",
            active: "Active",
            completed: "Completed",
            no_projects: "No projects found.",
            show_assignment: "Show more",
            hide_assignment: "Hide less",
        },
        project: {
            assignment: "Assignment",
            group: "Group",
            submissions: "Submissions",
        },
        error: "Error when loading subjects",
        create_project: "Create project",
        register_link_button: {
            title: "Register link",
            snackbar: "Register link copied to clipboard.",
            tooltip:
                "Copy register link for this subject, this can be shared with students to register for the subject.",
        },
    },
    subjects: {
        title: "My Subjects",
        create_subject: "Create subject",
        instructor_subjects: "Show instructor subjects",
        student_subjects: "Show student subjects",
        no_subjects: "No subjects found.",
    },

    create_subject: {
        error_snackbar: "There needs to be at least one teacher amongst the subject instructors.",
        cancel_dialog: "Cancel subject creation?",
        new_subject: "New subject",
        title: "Title",
        enter_title: "Enter title",
        enter_title_hint: "Enter a valid title for the new subject",
        assign_self: "Assign myself as instructor",
        field_required: "This field is required",
        field_length: "Title must be at least 3 characters long",
        subject_instructors: "Subject instructors",
        search_for_instructors: "Search for instructors",
        email: "Subject email",
        enter_email: "Enter email",
        email_hint: "Field is optional",
        email_invalid: "Provided email is invalid",
    },

    patch_subject: {
        cancel_dialog: "Cancel editing subject?",
        edit_subject: "Edit subject",
    },

    group: {
        not_found: "Group not found",
        not_found2: "No groups found",
        error: "Error loading page",
        groups: "Groups:",
        members: "Members:",
        actions: "Actions:",
        no_members_found: "No members found.",
        remove: "Remove",
        join_group: "Join group",
        leave_group: "Leave group",
        remove_group: "Delete group",
        create_group: "New group",
        no_students: "No students found",
        close: "close",
        all_students: "All students",
        all_students_course: "All students in course:",
        to_grouppage: "To grouppage",
    },
    about: {
        about: "About this project",
        p_1: "This project was made as part of the course",
        p_2: "The source code is publicly available at",
        developers: "Our developers",
    },
};
