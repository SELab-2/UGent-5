<template>
    <v-card variant="text" class="title-card" width="100%" height="325">
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
                clearable
                hide-details="auto"
                @keydown.enter.prevent
                :error="isSubjectNameError"
                class="form-elem"
            ></v-text-field>

            <v-row>
                <v-col>
                    <v-select
                        v-model="activeAcademicYear"
                        variant="outlined"
                        :items="academicYearItems"
                        :item-title="(item) => `${item}-${item + 1}`"
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
                        color="text"
                        class="checkbox"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <v-text-field
                v-model="subjectMail"
                type="email"
                variant="outlined"
                :rules="[rules.email]"
                :label="$t('create_subject.email')"
                clearable
                :placeholder="$t('create_subject.enter_email')"
                :hint="$t('create_subject.email_hint')"
                hide-details="auto"
                @keydown.enter.prevent
                :error="isSubjectMailError"
                class="form-elem"
            >
            </v-text-field>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import useAcademicYear from "@/composables/useAcademicYear";
import { computed, ref, toRefs, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
    title: string;
    subjectName: string;
    academicYear: number;
    subjectMail: string;
    currentUserAsInstructor: boolean;
    isSubjectNameError: boolean;
    isSubjectMailError: boolean;
}>();

const { currentUserAsInstructor } = toRefs(props);

const checkbox = ref(currentUserAsInstructor.value);

watch(currentUserAsInstructor, (newValue) => {
    checkbox.value = newValue;
});

const subjectName = ref(props.subjectName);
const activeAcademicYear = ref<number>(props.academicYear);
const subjectMail = ref(props.subjectMail);
const currentAcademicYear = useAcademicYear();

const academicYearItems = computed(() => {
    const years = [currentAcademicYear];
    if (activeAcademicYear.value !== currentAcademicYear) {
        years.push(activeAcademicYear.value);
    }
    years.push(activeAcademicYear.value + 1);
    return years;
});
const rules = {
    required: (value: string) => !!value || t("create_subject.field_required"),
    length: (value: string) => value.length > 2 || t("create_subject.field_length"),
    email: (value: string) =>
        !value || /.+@.+\..+/.test(value) || t("create_subject.email_invalid"),
};

const emit = defineEmits<{
    (e: "update:current-user-as-instructor", value: boolean): void;
    (e: "update:subject-name", value: string): void;
    (e: "update:active-academic-year", value: number): void;
    (e: "update:subject-mail", value: string): void;
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

watch(subjectMail, (newValue) => {
    emit("update:subject-mail", newValue);
});
</script>

<style scoped>
.title-card {
    background-color: rgb(var(--v-theme-secondary));
    padding: 20px;
}

.form-elem {
    margin-bottom: 20px;
}

.form-elem-academic {
}
.title {
    font-size: 32px;
    margin-bottom: 5px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    font-family: "Poppins", sans-serif;
}
</style>
