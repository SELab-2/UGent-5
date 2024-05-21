<template>
    <v-dialog v-model="dialog" max-width="290" persistent>
        <v-card>
            <v-card-title class="headline">
                {{ $t("create_subject.cancel_dialog") }}
            </v-card-title>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" @click="dialog = false">
                    {{ $t("default.no_capital") }}
                </v-btn>
                <v-btn color="blue darken-1" @click="$emit('confirm-button-clicked')">
                    {{ $t("default.yes_capital") }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">

import {toRefs, watch} from "vue";

const props = defineProps<{
    dialog: boolean;
}>();

const {dialog} = toRefs(props);

defineEmits<{
    (e: "update:dialog", dialog: boolean): void;
    (e: "confirm-button-clicked"): void;
}>();

watch(dialog, (value) => {
    emit("update:dialog", value);
});

</script>



<style scoped>

</style>
