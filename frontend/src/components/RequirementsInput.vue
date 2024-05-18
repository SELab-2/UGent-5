<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <!-- Form with manual validation trigger -->
                <v-form @submit.prevent="addRequirement" ref="form">
                    <v-text-field
                        v-model="newRequirement"
                        :label="$t('project.requirement')"
                        :error-messages="errorMessages"
                        append-icon="mdi-file-plus"
                        @click:append="addRequirement"
                        dense
                        solo
                        autocomplete="off"
                    />
                </v-form>
            </v-col>
        </v-row>
        <v-row v-for="(req, index) in internalRequirements" :key="index" class="align-center my-1">
            <v-col cols="10">
                <v-chip class="me-2" color="blue" text-color="white">
                    {{ req.value }}
                </v-chip>
            </v-col>
            <v-col cols="2" class="d-flex justify-space-between align-center">
                <v-switch
                    v-model="req.mandatory"
                    :label="req.mandatory ? $t('project.mandatory') : $t('project.forbidden')"
                    :color="req.mandatory ? 'green' : 'red'"
                    hide-details
                    inset
                ></v-switch>
                <v-btn icon @click="deleteRequirement(index)">
                    <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
    modelValue: Array,
});
const emit = defineEmits(["update:modelValue"]);
const internalRequirements = ref([...props.modelValue]);
const newRequirement = ref("");
const errorMessages = ref([]);

const addRequirement = () => {
    errorMessages.value = []; // Clear previous error messages
    const validationResult = validateRequirement(newRequirement.value);
    if (validationResult !== true) {
        errorMessages.value.push(validationResult);
        return; // Stop further execution if validation fails
    }
    const newReq = { value: newRequirement.value, mandatory: true };
    internalRequirements.value.push(newReq);
    emit("update:modelValue", internalRequirements.value);
    newRequirement.value = ""; // Clear the input field after adding
};

const validateRequirement = (value) => {
    if (!value) {
        return t("project.required"); // Check if the input is empty
    }
    if (!/.+\..+/.test(value)) {
        return t("project.invalid_format"); // Check if the input matches the expected format
    }
    return true;
};

const deleteRequirement = (index) => {
    internalRequirements.value.splice(index, 1);
    emit("update:modelValue", internalRequirements.value);
};
</script>
