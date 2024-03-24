<script setup lang="ts">
</script>

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
                                    Titel project
                                </v-card-title>
                                <v-card-subtitle>
                                    Course project
                                </v-card-subtitle>
                            </v-card-item>
                            <v-card-text>
                                Deadline
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

<style scoped>

.submit {
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>

