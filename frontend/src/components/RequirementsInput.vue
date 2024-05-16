<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-form @submit.prevent="addRequirement">
                    <v-text-field
                        v-model="newRequirement"
                        label="Enter requirement"
                        append-icon="mdi-file-plus"
                        @click:append="addRequirement"
                        :rules="[rules.required]"
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
                    :label="req.mandatory ? 'Mandatory' : 'Forbidden'"
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
import { watch, ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: Array
});

const emit = defineEmits(['update:modelValue']);

// Reactive internal state based on the initial modelValue
const internalRequirements = ref([...props.modelValue]);

// Input field model
const newRequirement = ref('');

// Validation rules
const rules = {
    required: value => !!value || 'Required.'
};

// Function to add a new requirement
const addRequirement = () => {
    if (newRequirement.value) {
        const newReq = { value: newRequirement.value, mandatory: true };
        internalRequirements.value.push(newReq);
        emit('update:modelValue', internalRequirements.value);
        newRequirement.value = ''; // Clear the input field
    }
};

// Function to delete a requirement
const deleteRequirement = (index) => {
    internalRequirements.value.splice(index, 1);
    emit('update:modelValue', internalRequirements.value);
};

// Watching the props.modelValue to update internalRequirements accordingly
watch(() => props.modelValue, (newVal) => {
    if (newVal !== internalRequirements.value) {
        internalRequirements.value = [...newVal];
    }
}, { deep: true });


</script>



