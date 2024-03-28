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
                                        {{ project?.name }}
                                    </v-card-title>
                                    <v-card-subtitle>
                                        {{ subject?.name }}
                                    </v-card-subtitle>
                                </v-card-item>
                                <v-card-text v-if="!isLoading">
                                    <b>{{ $t("project.deadline") }}:</b>
                                    <p>{{ $d(project.deadline, 'long') }}</p>
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
import { ref, onMounted, computed } from "vue";
import { useRoute } from 'vue-router'
import { VForm } from 'vuetify/components';
import { useProjectQuery, useProjectSubjectQuery } from "@/queries/Project";
import { useAuthStore } from "@/stores/auth-store";


const route = useRoute()

const props = defineProps({
    'projectId': Number
})

const { data: project, isLoading, isError } = useProjectQuery(props.projectId!);
const { data: subject } = useProjectSubjectQuery(computed(() => props.projectId!));

const apiUrl = import.meta.env.VITE_API_URL;
const { token } = useAuthStore();

// const subjectId = ref<number | null>(null);
// const subjectName = ref<string | null>(null);

const fileInputs = ref<File[] | null>(null);
const remarksInput = ref<string | null>(null);

onMounted(async () => {
    //await fetchSubject();
});


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

