    <template>
    <v-container>
        <SubmitCard :projectId="projectId" />
    </v-container>
</template>

<script setup lang="ts">
import SubmitCard from "@/components/project/submit/SubmitCard.vue";

defineProps<{
    projectId: number;
}>();
</script>

<style scoped></style>
