<template>
    <v-card variant="flat">
        <v-card-item>
            <v-card-title>
                {{ $t("project.requirements") }}
            </v-card-title>
        </v-card-item>
        <v-card-text>
            <v-card-subtitle v-if="mandatory.length > 0">{{ $t("project.mandatory") }}</v-card-subtitle>
            <v-list>
                <v-list-item v-for="req in mandatory" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>

                    <template v-if="unmet_extensions.includes(req.value)" v-slot:append>
                        <v-tooltip :text="$t('project.unmet_mandatory')">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-alert" class="warning-content"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-list-item>
            </v-list>

            <v-card-subtitle v-if="forbidden.length > 0">{{ $t("project.forbidden") }}</v-card-subtitle>
            <v-list>
                <v-list-item v-for="req in forbidden" :key="req.value">
                    <v-list-item-title>{{ req.value }}</v-list-item-title>

                    <template v-if="unmet_extensions.includes(req.value)" v-slot:append>
                        <v-tooltip>
                            <h3>
                                {{ $t("project.unmet_forbidden") }}
                            </h3>

                            <ul>
                                <li v-for="illegal_file in unmetRequirements.find(r => r.requirement.value == req.value)!.files" :key="illegal_file">
                                    {{ illegal_file }}
                                </li>
                            </ul>

                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" icon="mdi-alert" class="warning-content"></v-icon>
                            </template>
                        </v-tooltip>
                    </template>
                </v-list-item>
            </v-list>
            <v-card-subtitle v-if="unmetRequirements.length > 0" class="warning-content">{{ $t("project.unmet_reqs_warning") }}</v-card-subtitle>
        </v-card-text>
    </v-card>

</template>

<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { Requirement, UnmetRequirement } from "@/models/Project";

const props = defineProps<{
    requirements: Requirement[];
    unmetRequirements: UnmetRequirement[];
}>();

const { requirements, unmetRequirements } = toRefs(props);

const mandatory = computed(() => requirements.value.filter(r => r.mandatory));
const forbidden = computed(() => requirements.value.filter(r => !r.mandatory));

const unmet_extensions = computed(() => unmetRequirements.value.map(r => r.requirement.value));


</script>

<style scoped>
.v-card, .v-list {
    width: 100%;
    background-color: rgb(var(--v-theme-secondary));
}

ul li {
    list-style-position: inside;
}

.warning-content {
    color: red;
}

</style>
