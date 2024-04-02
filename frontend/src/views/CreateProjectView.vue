<template>
    <div class="create-project-view">
        <h1>Create Project</h1>
        <form @submit.prevent="submitForm">
            <div class="form-section">
                <input type="text" placeholder="Project Title" v-model="projectTitle" required>
            </div>
            <!-- Radio Button List for Group Project Options -->
            <div class="form-section">
                <RadioButtonList
                    :title="groupProjectTitle"
                    :options="groupProjectOptions"
                    v-model="selectedGroupProject"
                />
            </div>

            <!-- Check Box for Teacher Selection -->
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
import DatePicker from '@/components/DatePicker.vue';
import RadioButtonList from '@/components/RadiobuttonList.vue';
import CheckBox from '@/components/CheckboxList.vue';
import { useSubjectQuery } from '@/queries/Subject';

const projectTitle = ref('');
const projectDate = ref(new Date());
const selectedGroupProject = ref('course'); // Default selection or could be reactive based on a prop

// Teachers loading logic
const { data: teachersData, error, isLoading, isError } = useSubjectQuery('1631');

const teachers = computed(() => {
    return teachersData.value?.map(teacher => ({
        id: teacher.uid,
        label: teacher.given_name,
        checked: false, // Initial unchecked state
    })) || [];
});

// Selected teachers - an array to store the IDs of selected teachers
const selectedTeachers = ref([]);

const groupProjectTitle = 'Group Project';
const groupProjectOptions = [
    { label: 'Use Course Groups', value: 'course' },
    { label: 'Random Groups', value: 'random' },
    { label: 'Student Picked Groups', value: 'student' },
];

function submitForm() {
    // Implement project creation logic here
    console.log('Creating project:', projectTitle.value, 'with date:', projectDate.value, 'group project option:', selectedGroupProject.value, 'selected teachers:', selectedTeachers.value);
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
