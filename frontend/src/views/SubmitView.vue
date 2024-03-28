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
                            <ProjectMiniCard :projectId="projectId"/>
                        </v-col>
                        <v-spacer/>
                        <v-spacer/>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h1>
                                {{ $t("submit.add_files") }}
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
                                <v-btn type="submit">{{ $t("submit.submit_button") }}</v-btn>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-container>
    </div>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { VForm } from 'vuetify/components';
import { useAuthStore } from "@/stores/auth-store";
import ProjectMiniCard from "@/components/project/ProjectMiniCard.vue";

const props = defineProps({
    'projectId': Number
})

const apiUrl = import.meta.env.VITE_API_URL;
const { token } = useAuthStore();

const fileInputs = ref<File[]>([]);
const remarksInput = ref<string | null>(null);


const formOnSubmit = (event: SubmitEvent) => {
    const formData = new FormData(event.target as HTMLFormElement);

    fetch(`${apiUrl}/api/projects/${props.projectId}`, {
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

