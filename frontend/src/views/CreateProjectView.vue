<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4">
                <v-text-field
                    v-model="title"
                    label="Title"
                    required
                    placeholder="Text"
                ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
                <CheckBox
                    :title="'Teacher(s)'"
                    :items="teachers"
                    placeholder="Receive/answer questions from students"
                ></CheckBox>
            </v-col>
        </v-row>
        <v-row>
<!--            <v-col cols="12" md="4">-->
<!--                <v-select-->
<!--                    :items="courses"-->
<!--                    label="Course"-->
<!--                    required-->
<!--                    placeholder="Select Course"-->
<!--                ></v-select>-->
<!--            </v-col>-->
            <v-col cols="12" md="6">
                <CheckBox
                    :title="'Assistants'"
                    :items="assistants"
                    placeholder="Receive/answer questions from students"
                ></CheckBox>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="2">
                <DatePicker v-model="fucku" />
            </v-col>
<!--            <v-col cols="12" md="2">-->
<!--                <RadioButtonList-->
<!--                    v-model="selectedGroupProject"-->
<!--                    :title="groupProjectTitle"-->
<!--                    :options="groupProjectOptions"-->
<!--                    required-->
<!--                ></RadioButtonList>-->
<!--            </v-col>-->
        </v-row>
        <v-row>
<!--            <v-col cols="12" md="2">-->
<!--                <DatePicker-->
<!--                    v-model="publish_date"-->
<!--                    label="Publish Date"-->
<!--                    required-->
<!--                    placeholder="Select Date"-->
<!--                ></DatePicker>-->
<!--            </v-col>-->
        </v-row>
        <v-row>
            <v-btn @click="submitForm">Submit</v-btn>

        </v-row>

        <!-- Add any additional rows/columns for other fields that are needed -->

    </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import DatePicker from '@/components/DatePicker.vue';
import RadioButtonList from '@/components/RadiobuttonList.vue';
import CheckBox from '@/components/CheckboxList.vue';
import { useInstructorsForSubjectQuery } from '@/queries/Subject';
import {useCreateProjectMutation} from "@/queries/Project";
import type Project from "@/models/Project";

const title = ref('');
const fucku = ref(new Date());
// const publishDate = ref(new Date()); // add this line for publish date
// const project_deadline = ref(new Date());
// const selectedGroupProject = ref('course'); // Default selection or could be reactive based on a prop

// Teachers loading logic
const { data: teachersData } = useInstructorsForSubjectQuery('1631');

const teachers = computed(() => {
    return teachersData.value?.map(teacher => ({
        id: teacher.uid, // assuming teacher object has an id field
        label: `${teacher.given_name}`, // assuming teacher object has a family_name field
        checked: true // Initial unchecked state
        // available: teacher.available // assuming teacher object has an available field
    })) || [];
});

// Selected teachers - an array to store the IDs of selected teachers
const selectedTeachers = ref(teachers.value.filter(t => t.checked).map(t => t.id));

// Watch the teachers data and update the selectedTeachers accordingly
watch(teachers, (newTeachers) => {
    selectedTeachers.value = newTeachers.filter(t => t.checked).map(t => t.id);
}, { deep: true });


const assistants = ref([
    // Hardcoded data for assistants, replace with dynamic data if needed
    { id: 1, label: 'Assistant 1', checked: false, available: true },
    { id: 2, label: 'Assistant 2', checked: false, available: false },
]);

// Group project options passed to RadioButtonList component
const groupProjectOptions = [
    { label: 'Use Course Groups', value: 'course' },
    { label: 'Random Groups', value: 'random' },
    { label: 'Student Picked Groups', value: 'student' },
];
const createProjectMutation = useCreateProjectMutation();
async function submitForm() {
    const projectData: Project = {
        name: title.value,
        deadline: fucku.value.toISOString(),
        description: 'A default project description',
        subject_id: '1631',
        requirements: [],
        // Add other necessary fields from your form
    };
    console.log('Submitting project with deadline:', fucku.value.toISOString());
    createProjectMutation.mutate(projectData, {
        onSuccess: () => {
            console.log('Project created successfully');
            // Handle success, e.g., redirect or clear form
        },
        onError: (error) => {
            console.error('Error creating project', error);
            // Handle error, e.g., show notification
        },
    });
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
