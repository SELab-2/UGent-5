import { createRouter, createWebHistory } from "vue-router";
import { type Middleware, type MiddlewareContext } from "./middleware/index";
import isAuthenticated from "./middleware/isAuthenticated";
import loginMiddleware from "./middleware/login";
import useCanVisit, {
    useIsAdminCondition,
    useIsStudentOfSubjectCondition,
    useIsInstructorOfSubjectCondition,
    useIsStudentOfProjectCondition,
    useIsInstructorOfProjectCondition,
    useIsInGroupCondition,
    useIsInstructorOfGroupCondition,
    useOrCondition,
    useIsInGroupOfProjectCondition,
    useIsTeacherCondition,
} from "./middleware/canVisit";

declare module "vue-router" {
    interface RouteMeta {
        requiresAuth?: boolean;
        hideHeader?: boolean;
        middleware?: Middleware | Middleware[];
    }
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: { name: "home" },
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/AboutView.vue"),
            meta: {
                requiresAuth: false,
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
            meta: {
                requiresAuth: false,
                hideHeader: true,
                middleware: loginMiddleware,
            },
        },
        {
            path: "/home",
            name: "home",
            component: () => import("../views/HomeScreenView.vue"),
        },
        {
            path: "/projects",
            name: "projects",
            component: () => import("../views/ProjectsView.vue"),
        },
        {
            path: "/project/:projectId(\\d+)",
            name: "project",
            component: () => import("../views/ProjectView.vue"),
            props: (route) => ({ projectId: Number(route.params.projectId) }),
            meta: {
                middleware: useCanVisit(
                    useOrCondition(
                        useIsStudentOfProjectCondition,
                        useIsInstructorOfProjectCondition
                    )
                ),
            },
        },
        {
            path: "/project/:projectId(\\d+)/submit",
            name: "onSubmit",
            component: () => import("../views/SubmitView.vue"),
            props: (route) => ({ projectId: Number(route.params.projectId) }),
            meta: {
                middleware: useCanVisit(useIsInGroupOfProjectCondition),
            },
        },
        {
            path: "/project/:projectId(\\d+)/groups",
            name: "groups",
            component: () => import("../views/GroupsView.vue"),
            props: (route) => ({ projectId: Number(route.params.projectId) }),
            meta: {
                middleware: useCanVisit(
                    useOrCondition(
                        useIsStudentOfProjectCondition,
                        useIsInstructorOfProjectCondition
                    )
                ),
            },
        },
        {
            path: "/groups/:groupId(\\d+)",
            name: "group",
            component: () => import("../views/GroupView.vue"),
            props: (route) => ({ groupId: Number(route.params.groupId) }),
            meta: {
                middleware: useCanVisit(
                    useOrCondition(useIsInGroupCondition, useIsInstructorOfGroupCondition)
                ),
            },
        },
        {
            path: "/project/:projectId(\\d+)/submissions",
            name: "projectSubmissions",
            component: () => import("../views/SubmissionsTeacherView.vue"),
            props: (route) => ({ projectId: Number(route.params.projectId) }),
            meta: {
                middleware: useCanVisit(useIsInstructorOfProjectCondition),
            },
        },
        {
            path: "/subjects",
            name: "subjects",
            component: () => import("../views/subject/SubjectsView.vue"),
        },
        {
            path: "/subjects/create",
            name: "create-subject",
            component: () => import("../views/subject/CreateSubjectView.vue"),
            meta: {
                middleware: useCanVisit(useOrCondition(useIsAdminCondition, useIsTeacherCondition)),
            },
        },
        {
            path: "/subjects/:subjectId(\\d+)",
            name: "subject",
            component: () => import("../views/subject/SubjectView.vue"),
            props: (route) => ({ subjectId: Number(route.params.subjectId) }),
            meta: {
                middleware: useCanVisit(
                    useOrCondition(
                        useIsStudentOfSubjectCondition,
                        useIsInstructorOfSubjectCondition
                    )
                ),
            },
        },
        {
            path: "/subjects/:subjectId(\\d+)/create-project",
            name: "create-project",
            component: () => import("../views/CreateProjectView.vue"),
            props: (route) => ({ subjectId: Number(route.params.subjectId) }),
            meta: {
                middleware: useCanVisit(useIsInstructorOfSubjectCondition),
            },
        },
        {
            path: "/project/:projectId(\\d+)/edit",
            name: "edit-project",
            component: () => import("../views/CreateProjectView.vue"), // Ensure this is correct
            props: (route) => ({ projectId: Number(route.params.projectId), isEditMode: true }),
            meta: {
                middleware: useCanVisit(useIsInstructorOfProjectCondition),
            },
        },
        {
            path: "/subjects/register/:uuid",
            name: "registerSubject",
            component: () => import("../views/SubjectRegisterView.vue"),
            props: (route) => ({ uuid: String(route.params.uuid) }),
        },
        {
            path: "/submissions/:submissionId(\\d+)",
            name: "submission",
            component: () => import("../views/SubmissionView.vue"),
            props: (route) => ({ submissionId: Number(route.params.submissionId) }),
        },
        {
            path: "/settings",
            name: "settings",
            component: () => import("../views/SettingsView.vue"),
        },
        {
            path: "/admin",
            name: "admin",
            component: () => import("../views/AdminView.vue"),
            meta: {
                middleware: useCanVisit(useIsAdminCondition),
            },
        },
        {
            path: "/:pathMatch(.*)",
            name: "default",
            component: () => import("../views/NotFoundView.vue"),
            meta: {
                requiresAuth: false,
            },
        },
    ],
});

router.beforeEach(async (to, from, next) => {
    const middlewares: Middleware[] = [];

    // Always check for authentication
    middlewares.push(isAuthenticated);

    // Add additional middleware if specified
    if (to.meta.middleware) {
        const meta_middleware = Array.isArray(to.meta.middleware)
            ? to.meta.middleware
            : [to.meta.middleware];
        middlewares.push(...meta_middleware.filter((m) => m !== isAuthenticated));
    }

    let new_next = next;
    for (let middleware of middlewares) {
        const context: MiddlewareContext = { to, from, next: new_next, router };
        const { next: returned_next, final } = await middleware(context);
        if (final) {
            return returned_next();
        }
        new_next = returned_next;
    }
    return new_next();
});

export default router;
