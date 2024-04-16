<template>
    <div :class="getBackgroundClass()" @click="navigateToProject">
        <div class="leftcontent">
            <h3>{{ name }}</h3>
            <p class="p"> {{ course }} </p>
        </div>
        <div class="rightcontent">
            {{ formattedDate }}
        </div>
    </div>
</template>

<script setup lang="ts">

import router from "@/router";

const props = defineProps<{
    id: number,
    name: string,
    course: string,
    deadline: Date,
    status: string
}>();

const getBackgroundClass = () => {
    return {
        'projectbtn': true,
        'accepted': props.status === 'accepted',
        'rejected': props.status === 'rejected',
        'none': props.status === 'none'
    };
};

const formattedDate = props.deadline.toLocaleTimeString([], {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'});

const navigateToProject = () => {
    router.push(`/project/${props.id}`);
}

</script>

<style scoped>
.projectbtn{
    margin: 10px;
    width: calc(100% - 20px);
    background-color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
    border-radius: 10px;
    cursor:pointer;
}

.none{
    background-color: #EEEEEE;
}

.accepted{
    background-color: #E3F7E4;
}

.rejected{
    background-color: #FFCACA;
}

.accepted:hover {
    background-color: #c3f2c6;
}

.rejected:hover {
    background-color: #ff9898;
}

.none:hover{
    background-color: lightgray;
}

.rightcontent {
    margin-right: 20px;
    position: absolute;
    right: 0;
}

.p{
    color: lightslategrey;
}
</style>
