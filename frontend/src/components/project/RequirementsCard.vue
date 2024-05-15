<template>
    <v-card variant="flat">
        <v-card-item>
            <v-card-title>
                {{ $t("project.requirements") }}
            </v-card-title>
        </v-card-item>
        <v-card-text>
            <v-card-subtitle>{{ $t("project.mandatory") }}</v-card-subtitle>

            <v-list>
                <v-list-item v-for="req in requirements.filter(r => r.mandatory)" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>

                    <template v-if="unmetRequirements?.map(r => r.requirement.value).includes(req.value)" v-slot:append>
                        <v-tooltip :text="$t('project.unmet_mandatory')">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-alert" color="red"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-list-item>
            </v-list>
            <v-card-subtitle>{{ $t("project.forbidden") }}</v-card-subtitle>
            <v-list>
                <v-list-item v-for="req in requirements.filter(r => !r.mandatory)" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>

                    <template v-if="unmetRequirements?.map(r => r.requirement.value).includes(req.value)" v-slot:append>
                        <v-tooltip>
                            <h3>
                                {{ $t('project.unmet_forbidden') }}
                            </h3>

                            <ul>
                                <li v-for="unmet in unmetRequirements?.find(r => r.requirement.value == req.value)!.files" :key="unmet">
                                    {{ unmet }}
                                </li>
                            </ul>

                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-alert" color="red"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>

</template>

<script setup lang="ts">
import { toRefs } from "vue";
import type { Requirement, UnmetRequirement } from "@/models/Project";

const props = defineProps<{
    requirements: Requirement[];
    unmetRequirements: UnmetRequirement[] | null;
}>();

const { requirements } = toRefs(props);

</script>

<style scoped>
.v-card, .v-list {
    width: 100%;
    background-color: rgb(var(--v-theme-secondary));
}

ul li {
    list-style-position: inside;
}
</style>
