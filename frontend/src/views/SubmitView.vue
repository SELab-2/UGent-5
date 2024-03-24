<template>
    <div class="submit">
        <v-container>
            <v-card>
                <v-card-item>
                    <v-card-title>{{ $t("submit.submit_title") }}</v-card-title>
                    <v-card-subtitle> Subtitle </v-card-subtitle>
                </v-card-item>
                <v-container class="bg-surface-variant">
                    <v-row>
                        <v-col>
                            <v-card>
                                <v-card-item>
                                    <v-card-title>
                                        {{ projectName }}
                                    </v-card-title>
                                    <v-card-subtitle>
                                        {{ projectDesc }}
                                    </v-card-subtitle>
                                </v-card-item>
                                <v-card-text v-if="projectDeadline != null">
                                    {{ $t("project.deadline") }}: {{ $d(projectDeadline, 'long') }}
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn>Submission Details</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                        <v-spacer/>
                        <v-spacer/>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h1>
                                Voeg bestanden toe
                            </h1>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-form @submit.prevent>
                                <v-file-input>
                                    bla
                                </v-file-input>
                                <v-textarea
                                    :label="$t('submit.submit_button')"
                                ></v-textarea>
                            </v-form>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn>{{ $t("submit.submit_button") }}</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth-store";
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router'

const apiUrl = import.meta.env.VITE_API_URL;
const projectName = ref<string | null>(null);
const projectDesc = ref<string | null>(null);
const projectDeadline = ref<Date | null>(null);

const { token } = useAuthStore();
onMounted(async () => {
    await fetchProject();
});

const route = useRoute()

async function fetchProject() {
    if (!token) {
        return;
    }
    await fetch(`${apiUrl}/api/projects/${route.params.projectId}`, {
        headers: { Authorization: `${token?.token_type} ${token?.token}` },
    })
        .then((data) => data.json())
        .then((projectObj) => {
            console.log(projectObj)
            projectName.value = projectObj.name;
            projectDesc.value = projectObj.description;
            projectDeadline.value = new Date(projectObj.deadline);
            console.log(projectDeadline.value)

        })
        .catch((error) => console.log(error));
}
</script>



<style scoped>

.submit {
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>

