<template>
    <div class="submit">
        <v-container>
            <v-card>
                <v-card-item>
                    <v-card-title>{{ $t("submit.submit_title") }}</v-card-title>
                </v-card-item>
                <v-container class="card-container">
                    <v-row>
                        <v-col>
                            <v-card>
                                <v-card-item>
                                    <v-card-title>
                                        {{ projectName }}
                                    </v-card-title>
                                    <v-card-subtitle>
                                        {{ subjectName }}
                                    </v-card-subtitle>
                                </v-card-item>
                                <v-card-text v-if="projectDeadline != null">
                                    <b>{{ $t("project.deadline") }}:</b>
                                    <p>{{ $d(projectDeadline, 'long') }}</p>
                                </v-card-text>
                                <v-card-actions>
                                    <v-btn>Project details</v-btn>
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
                            <v-form validate-on="submit lazy" @submit.prevent="formOnSubmit">
                                <v-file-input
                                    counter
                                    multiple
                                    show-size
                                    chips
                                    dense
                                    name="files"
                                    v-model="fileInputs">
                                </v-file-input>
                                <v-textarea
                                    :label="$t('submit.remarks')"
                                    name="remarks"
                                    v-model="remarksInput"
                                ></v-textarea>
                                <label>
                                    test
                                    <v-btn type="submit">{{ $t("submit.submit_button") }}</v-btn>
                                </label>
                            </v-form>
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
import { VForm } from 'vuetify/components';

const apiUrl = import.meta.env.VITE_API_URL;
const { token } = useAuthStore();

const projectName = ref<string | null>(null);
const projectDeadline = ref<Date | null>(null);

const subjectId = ref<number | null>(null);
const subjectName = ref<string | null>(null);

const fileInputs = ref<File[] | null>(null);
const remarksInput = ref<string | null>(null);

onMounted(async () => {
    await fetchProject();
    await fetchSubject();
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
            projectName.value = projectObj.name;
            subjectId.value = projectObj.subject_id;
            projectDeadline.value = new Date(projectObj.deadline);

        })
        .catch((error) => console.log(error));
}

async function fetchSubject() {
    if (!token) {
        return;
    }
    await fetch(`${apiUrl}/api/subjects/${subjectId.value}`, {
        headers: { Authorization: `${token?.token_type} ${token?.token}` },
    })
        .then((data) => data.json())
        .then((subjectObj) => {
            subjectName.value = subjectObj.name;
        })
        .catch((error) => console.log(error));
}

const formOnSubmit = (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);
    //const formData = new FormData();
    formData.append('remarks', remarksInput.value.toString());
    //
    // for (let file of fileInputs.value) {
    //     formData.append("files", file, file.name);
    // }
    console.log(fileInputs.value)
    console.log(Object.fromEntries(formData))

    fetch(`${apiUrl}/api/projects/${route.params.projectId}`, {
        method: 'post',
        headers: {
            Authorization: `${token?.token_type} ${token?.token}`,
        },
        body: formData
    })
        .then(data => data.json())
        .then(json => {
            console.log('Request succeeded with JSON response', json);
        })
        .catch(error => {
            console.log('Request failed', error);
        });
}

</script>



<style scoped>

.submit {
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.card-container {
    background-color: var(--gray-8);
}
</style>

