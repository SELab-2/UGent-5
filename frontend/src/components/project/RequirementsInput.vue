<template>
    <v-alert class="custom-alert" dense text>
        <span class="alert-text">
            {{ $t("project.requirements_disclaimer") }}
            <a
                href="https://github.com/SELab-2/UGent-5/wiki/Automatische-testen#vereiste-en-verboden-bestanden"
                target="_blank"
                rel="noopener noreferrer"
            >
                wiki </a
            >.
        </span>
    </v-alert>
    <v-row>
        <v-col cols="12">
            <!-- Form with simpler validation trigger -->
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
            <v-btn icon="mdi-delete" @click="deleteRequirement(index)" />
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { ref, defineEmits, watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import type { Requirement } from "@/models/Project";

const { t } = useI18n();
const props = defineProps<{
    modelValue: Array<Requirement>;
}>();
const emit = defineEmits(["update:modelValue"]);
const internalRequirements = ref<Requirement[]>([...props.modelValue]);
const newRequirement = ref<string>("");
const errorMessages = ref<string[]>([]);

const addRequirement = () => {
    errorMessages.value = [];
    if (!newRequirement.value.trim()) {
        errorMessages.value.push(t("project.required"));
        return;
    }
    const newReq = { value: newRequirement.value.trim(), mandatory: true };
    internalRequirements.value.push(newReq);
    emit("update:modelValue", internalRequirements.value);
    newRequirement.value = "";
};

watchEffect(() => {
    internalRequirements.value = [...props.modelValue];
});

const deleteRequirement = (index) => {
    internalRequirements.value.splice(index, 1);
    emit("update:modelValue", internalRequirements.value);
};
</script>
<style scoped>
.v-btn {
    background-color: rgb(var(--v-theme-secondary));
}

.files {
    margin-top: 15px;
}

.custom-alert .alert-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.custom-alert a {
    display: inline;
    white-space: normal;
}

.custom-alert {
    margin-bottom: 15px;
}
</style>
