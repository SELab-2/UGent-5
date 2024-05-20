<template>
    <v-card variant="text" class="title-card" width="100%" height="35vh">
        <v-card-title class="title">
            {{ title }}
        </v-card-title>

        <v-card-text>
            <v-text-field
                v-model="subjectName"
                :rules="[rules.required, rules.length]"
                :label="$t('create_subject.title')"
                required
                variant="outlined"
                :placeholder="$t('create_subject.enter_title')"
                :hint="$t('create_subject.enter_title_hint')"
                clearable
                hide-details="auto"
                @keydown.enter.prevent
                :error="isFormError"
                class="form-elem"
            ></v-text-field>

            <v-row>
                <v-col>
                    <v-select
                        v-model="activeAcademicYear"
                        variant="outlined"
                        :items="academicYearItems"
                        :item-title="(item) => `20${item}-20${item + 1}`"
                        :item-value="(item) => item"
                        :label="$t('subject.academy_year')"
                        required
                        class="form-elem-academic"
                    ></v-select>
                </v-col>
                <v-col>
                    <v-checkbox
                        :label="$t('create_subject.assign_self')"
                        v-model="checkbox"
                        color="primary"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
    title: string;
    subjectName: string;
    academicYear: number;
    currentUserAsInstructor: boolean;
    isFormError: boolean;
}>();

const { currentUserAsInstructor} = toRefs(props);

const checkbox = ref(currentUserAsInstructor.value);

watch(currentUserAsInstructor, (newValue) => {
    checkbox.value = newValue;
});

const subjectName = ref(props.subjectName);
const activeAcademicYear = ref<number>(props.academicYear);

const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
const rules = {
    required: (value: string) => !!value || t("create_subject.field_required"),
    length: (value: string) => value.length > 2 || t("create_subject.field_length"),
};

const emit = defineEmits<{
    (e: "update:current-user-as-instructor", value: boolean): void;
    (e: "update:subject-name", value: string): void;
    (e: "update:active-academic-year", value: number): void;
}>();

watch(subjectName, (newValue) => {
    emit("update:subject-name", newValue);
});

watch(activeAcademicYear, (newValue) => {
    emit("update:active-academic-year", newValue);
});

watch(checkbox, (newValue) => {
    emit("update:current-user-as-instructor", newValue);
});
</script>

<style scoped>
.title-card {
    background-color: var(--color-secondary);
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
