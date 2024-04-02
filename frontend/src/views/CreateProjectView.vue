<template>
    <div class="create-project-view">
        <h1>Create Project</h1>
        <form @submit.prevent="submitForm">
            <div class="form-section">
                <input type="text" placeholder="Project Title" v-model="projectTitle" required>
            </div>
            <div class="form-section">
                <RadioButtonList
                    :title="groupProjectTitle"
                    :options="groupProjectOptions"
                    v-model="selectedGroupProject"
                    @update:deadline="handleDeadlineUpdate" />
            </div>
            <div class="form-section">
                <span v-if="isLoading">Loading teachers...</span>
                <span v-else-if="isError">Error loading teachers: {{ error.message }}</span>
                <CheckBox
                    v-else
                    :title="'Teacher(s)'"
                    :items="teachers"
                    description="Select available teachers for the course"
                    v-model="selectedTeachers"
                />
            </div>
            <div class="form-section">
                <button type="submit">Create Project</button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import RadioButtonList from '@/components/RadiobuttonList.vue';
import CheckBox from '@/components/CheckboxList.vue';
import { useCreateProjectMutation } from '@/queries/Project';
import type Project from "@/models/Project";
import {useSubjectQuery} from "@/queries/Subject";

const projectTitle = ref('');
const deadline = ref(new Date());
const selectedGroupProject = ref('course');
const selectedTeachers = ref([]);

const { data: teachersData, error, isLoading, isError } = useSubjectQuery('1631');

const teachers = computed(() => {
    return teachersData.value?.map(teacher => ({
        id: teacher.uid,
        label: teacher.given_name,
        checked: false,
    })) || [];
});

function handleDeadlineUpdate(newDeadlineIsoString) {
    deadline.value = new Date(newDeadlineIsoString);
}

const groupProjectTitle = 'Group Project';
const groupProjectOptions = [
    { label: 'Use Course Groups', value: 'course' },
    { label: 'Random Groups', value: 'random' },
    { label: 'Student Picked Groups', value: 'student' },
];

const createProjectMutation = useCreateProjectMutation();

async function submitForm() {
    const projectData: Project = {
        name: projectTitle.value,
        deadline: deadline.value.toISOString(),
        description: 'A default project description',
        subject_id: '1631',
        requirements: [],
        // Add other necessary fields from your form
    };
    console.log('Submitting project with deadline:', deadline.value.toISOString());

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



<style scoped>
.assignment-edit {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 16px;
    padding: 16px;
}

.assignment-edit-header {
    grid-column: span 12;
    display: flex;
    align-items: center;
    /* Add more styling */
}

.assignment-edit-form {
    grid-column: span 12;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* Add more styling */
}

.form-section {
    margin-bottom: 20px;
    /* Add more styling */
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    /* Add more styling */
}

input[type="text"], textarea, select {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    background-color: #0056b3;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #003d82;
}

/* Responsive Design */
@media (max-width: 768px) {
    .assignment-edit {
        grid-template-columns: 1fr;
    }
}
</style>
