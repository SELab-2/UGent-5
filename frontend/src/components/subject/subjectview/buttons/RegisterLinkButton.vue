<template>
    <v-btn v-if="!isLoading"
        prepend-icon="mdi-content-copy"
        @click="copyRegisterLink"
    >
        {{ $t("subject.register_link_button.title") }}
    </v-btn>
</template>

<script setup lang="ts">

import {computed, toRefs, watch} from "vue";
import {useUuidSubjectQuery} from "@/queries/Subject";
import {useRouter} from "vue-router";

const props = defineProps<{
    subjectId: number;
}>();

const { subjectId } = toRefs(props);

const {
    data: subjectUuid,
    isLoading,
    isError,
} = useUuidSubjectQuery(subjectId);

const router = useRouter();

const registerLink = computed(() => {
    return router.resolve({
        name: "registerSubject",
        params: { uuid: subjectUuid.value },
    }).path;
});

const emit = defineEmits<{
    (e: "register-link-btn-pressed"): void;
    (e: "is-uuid-error"): void;
}>();

const copyRegisterLink = () => {
    const baseAddress = window.location.origin;
    navigator.clipboard.writeText(`${baseAddress}${registerLink.value}`);
    emit("register-link-btn-pressed");
};

watch(isError, (newVal: boolean) => {
    if (newVal) {
        emit("is-uuid-error");
    }
});

</script>

<style scoped>

</style>
