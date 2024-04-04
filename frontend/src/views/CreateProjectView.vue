<!--<template>-->
<!--    <QuillEditor theme="snow" />-->
<!--</template>-->

<!--<script>-->
<!--import { QuillEditor } from '@vueup/vue-quill'-->
<!--import '@vueup/vue-quill/dist/vue-quill.snow.css';-->

<!--export default {-->
<!--    components:{-->
<!--        QuillEditor-->
<!--    }-->
<!--}-->
<!--</script>-->





<template>
    <v-container>
        <!-- Row for Title and Teachers -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field v-model="title" label="Title" required placeholder="Enter Title" />
            </v-col>
            <v-col cols="12" md="6">
                <CheckBox :title="'Teacher(s)'" :items="teachers" placeholder="Assign Teachers" />
            </v-col>
        </v-row>

        <!-- Row for Course and Assistants -->
        <v-row>
            <v-col cols="12" md="6">
                <span v-if="isLoading">Loading subjects...</span>
                <span v-else-if="isError">Error loading subjects: {{ error.message }}</span>
                <v-select v-model="selectedCourse" :items="courses" item-value="value" item-title="text" label="Course" required placeholder="Select Course" />
            </v-col>
            <v-col cols="12" md="6">
                <CheckBox :title="'Assistants'" :items="assistants" placeholder="Assign Assistants" />
            </v-col>
        </v-row>

        <!-- Row for Deadline Dates and Radio Buttons for Grouping -->
        <v-row>
            <v-col cols="12" md="6">
                <DatePicker v-model="deadline" label="Deadline" required />
                <DatePicker v-model="publishDate" label="Publish Date" required />
            </v-col>
            <v-col cols="12" md="6">
                <RadioButtonList v-model="selectedGroupProject" :title="'Group Project Options'" :options="groupProjectOptions" required />
            </v-col>
        </v-row>

        <!-- Row for Submit Button -->
        <v-row>
            <v-col cols="12">
                <v-btn @click="submitForm">Submit</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import CheckBox from '@/components/CheckboxList.vue';
import DatePicker from '@/components/DatePicker.vue';
import RadioButtonList from '@/components/RadiobuttonList.vue';
import type Project from "@/models/Project";
import {useInstructorsForSubjectQuery} from "@/queries/Subject";
import {useMySubjectsQuery} from "@/queries/User";
import {useCreateProjectMutation} from "@/queries/Project";

const title = ref('');
const deadline = ref(new Date());
const selectedCourse = ref(undefined);
const publishDate = ref(new Date());
const selectedGroupProject = ref('course');

const { data: instructorsData, error, isLoading, isError } = useInstructorsForSubjectQuery(selectedCourse);

const teachers = computed(() => instructorsData.value?.filter(t => t.is_teacher).map(formatInstructor) || []);
const assistants = computed(() => instructorsData.value?.filter(a => !a.is_teacher).map(formatInstructor) || []);

const { data: mySubjectsData } = useMySubjectsQuery();
const courses = computed(() => mySubjectsData.value?.as_instructor.map(({ name, id }) => ({ text: name, value: id })) || []);

watchEffect(() => console.log('Loading:', isLoading.value, 'Data:', mySubjectsData.value));

const groupProjectOptions = [
    { label: 'Use Course Groups', value: 'course' },
    { label: 'Random Groups', value: 'random' },
    { label: 'Student Picked Groups', value: 'student' },
];

const createProjectMutation = useCreateProjectMutation();

async function submitForm() {
    const projectData: Project = {
        name: title.value,
        deadline: deadline.value.toISOString(),
        description: 'A default project description',
        subject_id: selectedCourse.value,
        // Additional fields here
    };
    createProjectMutation.mutate(projectData, {
        onSuccess: () => console.log('Project created successfully'),
        onError: (error) => console.error('Error creating project', error),
    });
}

function formatInstructor({ uid, given_name, checked = false }) {
    return { id: uid, label: given_name, checked };
}
</script>

<!--<style scoped>-->
<!--.v-container {-->
<!--    /* Dark theme adjustments */-->
<!--    background-color: #121212; /* Dark background for the container */-->
<!--    color: #fff; /* Light text for better readability on dark backgrounds */-->
<!--}-->

<!--/* Text fields, select, date pickers, and switch */-->
<!--.v-text-field,-->
<!--.v-select,-->
<!--.v-date-picker,-->
<!--.v-switch {-->
<!--    background-color: #1e1e1e; /* Slightly lighter dark background for input fields */-->
<!--    color: #ffffff; /* White text for better readability */-->
<!--}-->

<!--/* Labels inside components for better readability */-->
<!--.v-label {-->
<!--    color: #ffffff !important; /* Ensuring the label text is white */-->
<!--}-->

<!--/* Remove borders from card-like components, and adjust padding/margins */-->
<!--.radio-button-list,-->
<!--.checkbox-list,-->
<!--.v-card {-->
<!--    border: none; /* Remove borders */-->
<!--    background-color: transparent; /* Match the container's background color */-->
<!--    box-shadow: none; /* Remove any shadow to make it blend into the background */-->
<!--}-->

<!--/* Buttons */-->
<!--.v-btn {-->
<!--    background-color: #2979ff; /* A brighter blue for buttons */-->
<!--    color: #fff; /* White text on buttons */-->
<!--}-->

<!--/* Radio buttons - customize the color and remove border */-->
<!--.v-radio .v-icon {-->
<!--    color: #2979ff; /* Same blue as the button for the radio button icon */-->
<!--}-->

<!--/* Checkbox - customize the color and remove border */-->
<!--.v-checkbox .v-icon {-->
<!--    color: #2979ff; /* Same blue as the button for the checkbox icon */-->
<!--}-->

<!--/* Helper text and other small text adjustments for better readability */-->
<!--.v-messages__message,-->
<!--.v-helper-text,-->
<!--.v-input__slot {-->
<!--    color: #ffffff; /* White text for helper and messages */-->
<!--}-->

<!--/* Vuetify components like v-select and v-text-field use a .v-input__control class */-->
<!--.v-input__control {-->
<!--    /* This adjusts the inner content alignment and spacing */-->
<!--}-->

<!--/* Submit button specifically */-->
<!--.submit-btn {-->
<!--    color: #fff; /* Ensuring the text is white for readability */-->
<!--    background-color: #2979ff; /* A consistent blue for easy identification */-->
<!--}-->

<!--/* Any other specific adjustments for the components or their inner elements can be added here */-->

<!--/* Responsive adjustments for smaller screens */-->
<!--@media (max-width: 600px) {-->
<!--    /* Adjust styles for mobile view if needed */-->
<!--}-->
<!--</style>-->
