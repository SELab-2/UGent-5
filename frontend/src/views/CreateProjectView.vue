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
    </v-container>
    <v-container>
        <!-- Header for the Editor -->
        <v-row>
            <v-col cols="12">
                <v-card class="mb-0">
                    <v-card-title class="headline">Assignment</v-card-title>
                </v-card>
            </v-col>
        </v-row>

        <!-- Quill Editor -->
        <v-row>
            <v-col cols="12">
                <QuillEditor v-model="quillContent" theme="snow" class="quill-editor" />
            </v-col>
        </v-row>

        <!-- Other form components... -->
        <!-- ... -->

        <!-- Submit Button -->
    </v-container>
    <v-container>
        <v-row>
            <v-col cols="16">
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
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const quillContent = ref('');
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
