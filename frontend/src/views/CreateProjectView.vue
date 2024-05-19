<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="project_title"
                    :label="$t('project.assignment')"
                    required
                    :placeholder="$t('submit.submit_title')"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-select
                    v-if="!isEditMode"
                    v-model="selectedSubject"
                    :items="subjects"
                    item-value="value"
                    item-title="text"
                    :label="$t('project.selected_subject')"
                    required
                    :placeholder="$t('submit.submit_title')"
                />
            </v-col>
            <v-col cols="12" md="6">
                <v-alert v-if="!isEditMode" dense text class="custom-alert">
                    {{ $t("project.group_warning") }}
                </v-alert>
                <RadioButtonList
                    v-if="!isEditMode"
                    :title="$t('project.group_toggle')"
                    :options="groupProjectOptions"
                    :initialDate="enrollDeadline"
                    :initialCapacity="capacity"
                    @update:date="handleRadioDateChange"
                    @update:capacity="handleCapacityChange"
                    @update:selected-option="handleOptionChange"
                    required
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <DatePicker
                    :modelValue="deadlineModel"
                    @update:modelValue="updateDeadline"
                    :label="$t('project.deadline')"
                />
                <DatePicker
                    :modelValue="publishDateModel"
                    @update:modelValue="updatePublishDate"
                    :label="$t('project.publish_date')"
                    required
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <QuillEditor ref="quillEditor" theme="snow" class="quill-editor" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" style="margin-top: 2rem">
                <DisplayTestFiles
                    v-if="filesData && filesData.length && isEditMode"
                    :files="filesData"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div v-if="isEditMode" class="file-upload-disclaimer">
                    <v-alert class="custom-alert" dense text>
                        {{ $t("project.no_files") }}
                    </v-alert>
                </div>
                <FilesInput v-model="files" />
            </v-col>
            <v-col cols="12">
                <RequirementsInput
                    :model-value="requirements"
                    @update:modelValue="requirements = $event"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn @click="submitForm">{{ $t("submit.submit_button") }}</v-btn>
            </v-col>
        </v-row>
        <v-alert v-model="showErrorAlert" type="error" dense dismissible :value="true">
            {{ errorMessage }}
        </v-alert>
        <v-alert v-model="showSuccessAlert" type="success" dense dismissible :value="true">
            {{ successMessage }}
        </v-alert>
    </v-container>
</template>

<script setup lang="ts">
import { nextTick, toRaw, watch } from "vue";
import DatePicker from "@/components/project/DatePicker.vue";
import RadioButtonList from "@/components/project/RadiobuttonList.vue";
import FilesInput from "@/components/form_elements/FilesInput.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { useRoute } from "vue-router";
import {
    useSubjectsQuery,
    useSubjectInstructorsQuery,
    useSubjectStudentsQuery,
} from "@/queries/Subject";

import { useCreateGroupsMutation, useAddToGroupMutation } from "@/queries/Group";
import { ref, reactive, computed } from "vue";
import {
    useCreateProjectMutation,
    useProjectFilesQuery,
    useProjectQuery,
    useUpdateProjectMutation,
    useUploadProjectFilesMutation,
} from "@/queries/Project";
import type User from "@/models/User";
import DisplayTestFiles from "@/components/project/DisplayTestFiles.vue";
import router from "@/router";
import RequirementsInput from "@/components/RequirementsInput.vue";
import { useI18n } from "vue-i18n";
const route = useRoute();
const { t } = useI18n();

// Form data
const project_title = ref("");
const projectSubjectId = ref<number | null>(null);
const deadline = ref(new Date());
const publishDate = ref(new Date());
const enrollDeadline = ref(null);
const selectedGroupProject = ref("student");
const capacity = ref(1);
const files = ref<File[]>([]);
const quillEditor = ref<typeof QuillEditor | null>(null);
const showErrorAlert = ref(false);
const showSuccessAlert = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const requirements = ref([]);

const projectId = ref(route.params.projectId);
const isEditMode = computed(() => projectId.value !== undefined);

const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
} = useProjectQuery(projectId);

const {
    data: filesData,
    isLoading: isFilesLoading,
    isError: isFilesError,
} = useProjectFilesQuery(projectId.value);

function htmlDecode(input) {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

watch(
    projectData,
    (project) => {
        if (project) {
            project_title.value = project.name;
            deadline.value = new Date(project.deadline);
            publishDate.value = new Date(project.publish_date);
            requirements.value = project.requirements.map((req) => ({ ...req }));
            const description = project.description;
            selectedSubject.value = project.subject_id;
            nextTick(() => {
                if (quillEditor.value && quillEditor.value.getQuill) {
                    let quill = quillEditor.value.getQuill();
                    quill.root.innerHTML = "";
                    quill.clipboard.dangerouslyPasteHTML(description);
                } else {
                    console.error("Quill Editor is not initialized");
                }
            });
        }
    },
    { deep: true }
);

const deadlineModel = computed({
    get: () => deadline.value,
    set: (newValue) => {
        if (newValue.toISOString() !== deadline.value.toISOString()) {
            deadline.value = new Date(newValue);  // Make sure newValue is correctly formatted
        }
    },
});

const publishDateModel = computed({
    get: () => publishDate.value,
    set: (newValue) => {
        if (newValue.toISOString() !== publishDate.value.toISOString()) {
            publishDate.value = new Date(newValue);  // Make sure newValue is correctly formatted
        }
    },
});

function updateDeadline(val) {
    deadlineModel.value = val;
}

function updatePublishDate(val) {
    publishDateModel.value = val;
}

const selectedSubject = ref<number>(
    isEditMode.value
        ? projectSubjectId.value ?? Number(route.params.subjectId)
        : Number(route.params.subjectId)
);

const {
    data: subjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
} = useSubjectsQuery();
const { data: instructorsData } = useSubjectInstructorsQuery(selectedSubject);
const { data: studentsData } = useSubjectStudentsQuery(selectedSubject);

const subjects = computed(
    () => subjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []
);

const groupProjectOptions = computed(() => [
    { label: t("project.random"), value: "random" },
    { label: t("project.student_groups"), value: "student" },
]);

const createProjectMutation = useCreateProjectMutation();
const createGroupsMutation = useCreateGroupsMutation();
const joinGroupMutation = useAddToGroupMutation();
const uploadProjectFilesMutation = useUploadProjectFilesMutation();
const updateProjectMutation = useUpdateProjectMutation();

function handleRadioDateChange(newDate) {
    enrollDeadline.value = newDate;
}

function handleOptionChange(newVal) {
    selectedGroupProject.value = newVal;
}

const handleCapacityChange = (newCapacity: number) => {
    capacity.value = newCapacity;
};

function setSuccessAlert(message) {
    successMessage.value = message;
    showSuccessAlert.value = true;
}

function setErrorAlert(message) {
    errorMessage.value = message; // Set the error message
    showErrorAlert.value = true; // Show the error alert
}

async function submitForm() {
    const projectData = formatProjectData();
    try {
        if (isEditMode.value) {
            await updateProject(projectData);
        } else {
            await createProject(projectData);
        }
        handleFiles(projectData.project_id);
        navigateToProject(projectData.project_id);
    } catch (error) {
        console.error("Error during project or group creation or file upload:", error);
        setErrorAlert("An unexpected error occurred. Please try again.");
    }
}

function formatProjectData() {
    return {
        name: project_title.value,
        deadline: deadline.value.toISOString(),
        description: quillEditor.value?.getQuill().root.innerHTML || "",
        subject_id: selectedSubject.value,
        is_visible: true,
        capacity: capacity.value,
        requirements: toRaw(requirements.value),
        publish_date: publishDate.value.toISOString(),
        enroll_deadline: enrollDeadline.value ? enrollDeadline.value.toISOString() : null,
    };
}

async function updateProject(projectData) {
    projectData.id = projectId.value;
    await updateProjectMutation.mutateAsync({
        projectId: projectId.value,
        projectData,
    });
    setSuccessAlert("Project updated successfully.");
}

async function createProject(projectData) {
    const createdProjectId = await createProjectMutation.mutateAsync(projectData);
    projectData.project_id = createdProjectId;
    await handleGroupCreation(createdProjectId);
    setSuccessAlert("Project created successfully.");
}

async function handleGroupCreation(projectId) {
    if (selectedGroupProject.value === "student" && capacity.value != 1) {
        const emptyGroups = generateEmptyGroups(projectId);
        await createGroupsMutation.mutateAsync({ projectId, groups: emptyGroups });
    } else if (selectedGroupProject.value === "random" || capacity.value === 1) {
        const groups = divideStudentsIntoGroups(studentsData.value || [], capacity.value);
        const groupsToCreate = groups.map((_, i) => ({
            project_id: projectId,
            score: 0,
            team_name: "Group " + (i + 1),
        }));
        const createdGroups = await createGroupsMutation.mutateAsync({
            projectId: projectId,
            groups: groupsToCreate,
        });
        joinStudentsToGroups(createdGroups, groups);
    }
}

async function joinStudentsToGroups(createdGroups, studentGroups) {
    for (let i = 0; i < createdGroups.length; i++) {
        const group = createdGroups[i];
        const students = studentGroups[i];
        for (const student of students) {
            await joinGroupMutation.mutateAsync({
                groupId: group.id,
                uid: student.uid,
            });
        }
    }
}

function generateEmptyGroups(projectId) {
    const numberOfGroups = Math.ceil(studentsData.value.length / capacity.value);
    const emptyGroups = [];
    for (let i = 0; i < numberOfGroups; i++) {
        emptyGroups.push({
            project_id: projectId,
            score: 0,
            team_name: `Group ${i + 1}`,
        });
    }
    return emptyGroups;
}

async function handleFiles(projectId) {
    if (files.value.length > 0) {
        const formData = new FormData();
        files.value.forEach((file) => {
            formData.append("files", file);
        });
        await uploadProjectFilesMutation.mutateAsync({
            projectId: projectId,
            formData,
        });
    }
}

function navigateToProject(projectId) {
    router.push({ name: "project", params: { projectId } });
}

function shuffle(array: any[]) {
    let shuffledArray = [...array];
    let currentIndex = shuffledArray.length,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
            shuffledArray[randomIndex],
            shuffledArray[currentIndex],
        ];
    }

    return shuffledArray;
}

function divideStudentsIntoGroups(students: User[], capacity: number) {
    students = shuffle(students);
    let groups = [];
    const numberOfGroups = Math.ceil(students.length / capacity);
    for (let i = 0; i < numberOfGroups; i++) {
        groups.push(students.slice(i * capacity, (i + 1) * capacity));
    }

    return groups;
}
</script>

<style>
.flex-container {
    display: flex;
    flex-direction: column;
}

.v-row:not(:last-child) {
    margin-bottom: 16px;
}

.quill-editor {
    min-height: 200px;
    margin-bottom: 2rem;
}

.file-upload-disclaimer {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.custom-alert {
    background-color: #eef1f5;
    color: #000000;
    border-left: 4px solid #1d357eff;
}
</style>
