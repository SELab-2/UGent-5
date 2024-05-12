<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="project_title"
                    label="Title"
                    required
                    placeholder="Enter Title"
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
                    label="Subject"
                    required
                    placeholder="Select Subject"
                />
            </v-col>
            <v-col cols="12" md="6">
                <RadioButtonList
                    v-if="!isEditMode"
                    :title="'Group Project Options'"
                    :options="groupProjectOptions"
                    @update:radio_date="handleRadioDateChange"
                    @update:capacity="handleCapacityChange"
                    required
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <DatePicker
                    :modelValue="deadlineModel"
                    @update:modelValue="updateDeadline"
                    label="Deadline"
                />
                <DatePicker
                    :modelValue="publishDateModel"
                    @update:modelValue="updatePublishDate"
                    label="Publish Date"
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
                        Note: Uploading new files will overwrite the existing ones.
                    </v-alert>
                </div>
                <FilesInput v-model="files" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-right">
                <v-btn @click="submitForm">Submit</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { nextTick } from "vue";
import type { CheckBoxItem } from "@/components/project/CheckboxList.vue";
import DatePicker from "@/components/project/DatePicker.vue";
import RadioButtonList from "@/components/project/RadiobuttonList.vue";
import FilesInput from "@/components/form_elements/FilesInput.vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { useRoute } from "vue-router";
import { useSubjectStudentsQuery } from "@/queries/Subject";
import { useMySubjectsQuery } from "@/queries/User";
import {
    useCreateProjectMutation,
    useDeleteProjectFilesMutation,
    useProjectFilesQuery,
    useProjectQuery,
    useUpdateProjectMutation,
    useUploadProjectFilesMutation,
} from "@/queries/Project";
import { useCreateGroupsMutation, useJoinGroupMutation } from "@/queries/Group";
import { ref, computed, reactive, watch } from "vue";
import type User from "@/models/User";
import type { ProjectForm } from "@/models/Project";
import type { GroupForm } from "@/models/Group";
import DisplayTestFiles from "@/components/project/DisplayTestFiles.vue";

const route = useRoute();
console.log("Route params:", route.params);

const project_title = ref("");
const projectSubjectId = ref<number | null>(null);
const deadline = ref(new Date());
const publishDate = ref(new Date());
const enrollDeadline = ref(null);
const selectedGroupProject = ref("student");
const capacity = ref(1);
const files = ref<File[]>([]);
const serverFiles = ref<File[]>([]);
const quillEditor = ref<typeof QuillEditor | null>(null);

const projectId = ref(route.params.projectId);
const isEditMode = computed(() => projectId.value !== undefined);
console.log("isEditMode:", isEditMode);

const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
} = useProjectQuery(projectId);
console.log(projectId);
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
            const description = project.description; // Assuming this is already proper HTML

            nextTick(() => {
                if (quillEditor.value && quillEditor.value.getQuill) {
                    let quill = quillEditor.value.getQuill();
                    quill.root.innerHTML = ""; // Clear existing content
                    quill.clipboard.dangerouslyPasteHTML(description); // Paste new HTML
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
            deadline.value = new Date(newValue);
        }
    },
});

const publishDateModel = computed({
    get: () => publishDate.value,
    set: (newValue) => {
        if (newValue.toISOString() !== publishDate.value.toISOString()) {
            publishDate.value = new Date(newValue);
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
    data: mySubjectsData,
    isLoading: isSubjectsLoading,
    isError: isSubjectsError,
    error: subjectsError,
} = useMySubjectsQuery();
let studentsData;
if (!isEditMode.value) {
    const queryResult = useSubjectStudentsQuery(selectedSubject);
    studentsData = queryResult.data;
}

const subjects = computed(
    () =>
        mySubjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []
);

const groupProjectOptions = [
    { label: "Random Groups", value: "random" },
    { label: "Student Picked Groups", value: "student" },
];

const createProjectMutation = useCreateProjectMutation();
const createGroupsMutation = useCreateGroupsMutation();
const joinGroupMutation = useJoinGroupMutation();
const uploadProjectFilesMutation = useUploadProjectFilesMutation();
const deleteProjectFilesMutation = useDeleteProjectFilesMutation();
const updateProjectMutation = useUpdateProjectMutation();

function handleRadioDateChange(newDate) {
    enrollDeadline.value = newDate;
}

async function submitForm() {
    const formattedDeadline = deadline.value.toISOString();
    const formattedPublishDate = publishDate.value.toISOString();
    const formattedEnrollDeadline = !enrollDeadline.value
        ? null
        : enrollDeadline.value.toISOString();

    const projectData: ProjectForm = {
        name: project_title.value,
        deadline: formattedDeadline,
        description: quillEditor.value?.getQuill().root.innerHTML || "",
        subject_id: selectedSubject.value,
        is_visible: true,
        capacity: capacity.value,
        requirements: [],
        publish_date: formattedPublishDate,
        enroll_deadline: formattedEnrollDeadline,
    };

    try {
        if (isEditMode.value) {
            try {
                // const addedFiles = calculateAddedFiles();
                // const deletedFiles = calculateDeletedFiles();

                // Update the project details first
                await updateProjectMutation.mutateAsync({
                    projectId: projectId.value,
                    projectData,
                });

                if (files.value.length > 0) {
                    const formData = new FormData();
                    files.value.forEach((file) => {
                        formData.append("files", file);
                    });
                    await uploadProjectFilesMutation.mutateAsync({
                        projectId: projectId.value,
                        formData,
                    });
                    console.log("Files uploaded successfully");
                }

                console.log("Project and files updated successfully");
            } catch (error) {
                console.error("Failed to update project and files", error);
                alert("Failed to update project and files. Please try again.");
            }
        } else {
            const createdProjectId = await createProjectMutation.mutateAsync(projectData);
            console.log("project created with ID:", createdProjectId);

            if (selectedGroupProject.value === "student") {
                const emptyGroup: GroupForm = {
                    project_id: createdProjectId,
                    score: 0,
                    team_name: "Group 1",
                };
                await createGroupsMutation.mutateAsync({
                    projectId: createdProjectId,
                    groups: [emptyGroup],
                });
            } else if (selectedGroupProject.value === "random") {
                const groups = divideStudentsIntoGroups(studentsData.value || [], capacity.value);
                const groupsToCreate = groups.map((_, i) => ({
                    project_id: createdProjectId,
                    score: 0,
                    team_name: "Group " + (i + 1),
                }));
                const createdGroups = await createGroupsMutation.mutateAsync({
                    projectId: createdProjectId,
                    groups: groupsToCreate,
                });

                createdGroups.forEach((group, index) => {
                    groups[index].forEach((student) => {
                        joinGroupMutation.mutateAsync({
                            groupId: group.id,
                            uid: student.uid,
                        });
                    });
                });
            }
            if (files.value.length > 0) {
                const formData = new FormData();
                files.value.forEach((file) => {
                    formData.append("files", file);
                });
                await uploadProjectFilesMutation.mutateAsync({
                    projectId: createdProjectId,
                    formData,
                });
                console.log("Files uploaded successfully");
            }
        }
    } catch (error) {
        console.error("Error during project or group creation or file upload:", error);
    }
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

function formatInstructor(user: User): CheckBoxItem {
    const checked = false;
    return { id: user.uid, label: user.given_name, checked };
}

const handleCapacityChange = (newCapacity: number) => {
    capacity.value = newCapacity;
};
</script>

<style>
.flex-container {
    display: flex;
    flex-direction: column;
}

.v-row:not(:last-child) {
    margin-bottom: 16px; /* Adjust as needed */
}

.quill-editor {
    min-height: 200px; /* Adjust the height as needed */
    margin-bottom: 2rem; /* Ensures space between the Quill editor and the file display component */
}
.file-display-container {
    padding: 1rem;
    border-top: 1px solid #e0e0e0; /* Aesthetic top border for separation */
}

.file-upload-disclaimer {
    margin-top: 1rem;
    margin-bottom: 1rem;
}

.custom-alert {
    background-color: #eef1f5; /* A light grey-blue background */
    color: #000000; /* Darker text for better readability */
    border-left: 4px solid #1d357eff; /* A blue left border for emphasis */
}
</style>
