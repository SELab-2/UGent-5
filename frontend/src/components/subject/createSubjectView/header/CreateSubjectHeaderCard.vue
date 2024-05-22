<template>
    <v-card variant="text" class="title-card" width="100%" height="45vh">
        <v-card-title class="title">
            {{ $t("create_subject.new_subject") }}
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
import { ref, toRefs, watch } from "vue";
import useAcademicYear from "@/composables/useAcademicYear";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
    currentUserAsInstructor: boolean;
    isSubjectNameError: boolean;
    isSubjectMailError: boolean;
}>();

const { currentUserAsInstructor } = toRefs(props);

const checkbox = ref(currentUserAsInstructor.value);

watch(currentUserAsInstructor, (newValue) => {
    checkbox.value = newValue;
});

const subjectName = ref("");
const subjectMail = ref("");
const activeAcademicYear = ref<number>(useAcademicYear());

const academicYearItems = [activeAcademicYear.value, activeAcademicYear.value + 1];
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
    margin-bottom: 2vh;
    margin-top: -3vh;
}

.form-elem-academic {
    max-width: 20vw;
}
.title {
    font-size: 32px;
    letter-spacing: -0.5px;
    text-transform: capitalize;
    font-weight: bold;
    margin-bottom: 4vh;
    font-family: "Poppins", sans-serif;
}
</style>
