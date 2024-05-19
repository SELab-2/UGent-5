<template>
    <v-card variant="text" class="title-card" width="100%" max-height="35vh">
        <v-card-title class="title">
            New Subject
        </v-card-title>

        <v-card-text>
            <v-form
                ref="form"
            >
                <v-text-field
                    v-model="project_name"
                    :rules="[rules.required, rules.length]"
                    label="Title"
                    required
                    variant="outlined"
                    placeholder="Enter Title"
                    hint="Enter your password to access this website"
                    clearable
                    hide-details="auto"
                    @keydown.enter.prevent
                    class="form-elem"
                ></v-text-field>

                <v-row>
                    <v-col>
                        <v-select
                            v-model="activeAcademicYear"
                            variant="outlined"
                            :items="academicYearItems"
                            :item-title="item => `20${item}-20${item + 1}`"
                            :item-value="item => item"
                            label="Academic Year"
                            required
                            class="form-elem-academic"
                        ></v-select>
                    </v-col>
                    <v-col>
                        <v-checkbox
                            label="Assign myself as instructor"
                            v-model="checkbox"
                            color="primary"
                        ></v-checkbox>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

    </v-card>
</template>

<script setup lang="ts">
import {computed, ref, toRef, toRefs, watch} from "vue";
import useAcademicYear from "@/composables/useAcademicYear";

const props = defineProps<{
    currentUserAsInstructor: boolean;
}>();

const {currentUserAsInstructor} = toRefs(props);

const checkbox = ref(currentUserAsInstructor.value);

watch(currentUserAsInstructor, (newValue) => {
    checkbox.value = newValue;
});

const form = ref(null);
const project_name = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());

const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || "Field is required.",
    length: (value: string) => value.length > 2 || "Title must be at least 3 characters long.",
};


const emit = defineEmits<{
    (e: "update:current-user-as-instructor", value: boolean): void;
}>();


watch(checkbox, (newValue) => {
    emit("update:current-user-as-instructor", newValue);
});



</script>

<style scoped>

.title-card {
    background-color: white;
    padding: 20px;
}

.form-elem {
    margin-bottom: 2vh;
}

.form-elem-academic {
    margin-bottom: 2vh;
    max-width: 20vw;
}

.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 12px;
    font-family: "Poppins", sans-serif;
}

</style>
