# How To: Vue Query

Om in de frontend data op te halen van de backend wordt gebruik gemaakt van
[vue-query](https://tanstack.com/query/v4/docs/framework/vue/overview). Hierdoor
wordt fetching, caching, ... en heel pak makkelijker.

Het aanmaken en gebruiken van een query bestaat uit 4 stappen:

1. [Een model maken](#model)
2. [Een service maken](#service)
3. [Een query maken](#de-query)
4. [Het gebruiken van een query](#gebruik)

Voor het updaten van data worden mutations gebruikt, meer info hierover onder:

5. [Mutations](#mutations)

Meer info over andere bijzonderheden vind je hier:

5. [Extras](#extras)

## Model

Data komt van de backend API in de vorm van een JSON object. Om dit in de
frontend voor te stellen moet hier een model voor aangemaakt worden aan de hand
van een interface. Een gebruiker zou er dus zo uit zien:

```ts
interface User {
    uid: string;
    given_name: string;
    mail: string;
    is_admin: boolean;
}
```

Let er hier bij op dat de velden dezelfde naam en hetzelfde type moeten hebben
als wat van de backend komt. Als niet alle velden die de backend terug geeft
nodig zijn, moeten die niet in het model gedefinieerd worden. Extra velden zijn
echter niet zomaar mogelijk. Bij grote veranderingen van de API kan het zijn dat
deze modellen gewijzigd moeten worden.

Het is uiteraard mogeljk dat verschillende queries hetzelfde model kunnen
gebruiken, in dat geval moet er hiervoor geen nieuw model gemaakt worden.

Modellen worden aangemaakt in de `src/models/` folder.

## Service

De query moet weten hoe data van de backend kan opgevraagd worden. Dit gebeurd
door middel van services. Deze functies zullen de effectieve request uitvoeren.

Een voorbeeld om een gebruiker op te halen zou er dus zo uit kunnen zien:

```ts
async function getUser(uid: string): Promise<User> {
    const response = await fetch(`/api/users/${uid}`, { method: "GET" });
    return response.json();
}
```

Omdat voor elke request een `Authorization`-header moet meegegeven worden, is er
een `authorized_fetch` functie geïmplementeerd. Deze werkt op exact dezelfde
manier als `fetch`, maar voegt de juiste `Authorization`-header toe.

Services worden aangemaakt in `src/services/`.

## De Query

Een query aanmaken is heel simpel. Elke query heeft een key nodig, en een functie
die de data ophaalt. Voor het voorbeeld met de gebruiker ziet dit er zo uit:

```ts
function useUserQuery(uid: Ref<string>): UseQueryReturnType<User, Error> {
    return useQuery<User, Error>({
        queryKey: USER_QUERY_KEY(uid.value),
        queryFn: () => getUser(uid.value)
    });
}
```

Bemerk dat deze query zelf nog in een hook zit. Zo kan eenzelfde query makkelijk
door verschillende componenten gebruikt worden. Let er ook op dat de `uid`
parameter is voor verscheidene redenen een `Ref` is. (Zie later [dependent
queryies](#dependent-queries))

### Keys

Om aan caching te kunnen doen is het heel belangrijk dat elke query een unieke
key heeft. Een key kan verschillende vormen aannemen, maar het makkelijkste is
een lijst van strings. De key uit het voorbeeld ziet er als volgt uit:

```ts
const USER_QUERY_KEY = (uid: string) => ["user", uid]
```

Op deze manier wordt voor elke gebruiker die opgevraagd zou kunnen worden een
unieke query aangemaakt.

Queries worden aangemaakt in `src/queries/`

## Gebruik

Een query gebruiken is heel simpel. Elke query heeft een `data`-veld, waar de
opghehaalde data in zit nadat de applicatie antwoord heeft gekregen van de API.
Ook houd de query bij of de data bezig is met opgehaald worden (`isLoading`), of
er een error opgetreden is (`isError`), en of de query succesvol is uitgevoerd
(`isSuccess`).
In geval van een error kan hier meer info over opgevraagd worden met het
`error`-veld. Een component die de query voor het opvragen van een gebruiker
gebruikt zou er als volgt uit kunnen zien:

```html
<template>
    <span v-if="isLoading">Loading...</span>
    <span v-else-if="isError">Error: {{ error.message }}</span>
    <span v-else-if="data">{{ data.given_name }}</span>
</template>
<script setup lang="ts">
import { useUserQuery } from "@/src/queries/user";
import { toRefs } from "vue";
const props = defineProps<{
    userId: string;
}>();
const { userId } = toRefs(props);
const { data, error, isLoading, isError } = useUserQuery(userId)
</script>
```

## Mutations

> WARNING: De documentatie van mutations is nog niet aangepast om met Refs
> overweg te kunnen.

Om data in de backend te kunnen updaten worden mutations gebruikt. De werking
hiervan is vrij analoog aan die van queries. Er is een service nodig die een
`POST`, `PATCH` of `DELETE` request doet, en een mutation kan ook bijhouden
of er een error optrad etc.

Een mutation om het e-mail adres te veranderen ziet er zo uit:

```ts
// services/user.ts
async function updateEmail(uid: string, new_mail: string) {
    authorized_fetch(`/api/users/{uid}`,
        {
            method: "PATCH",
            body: { mail: new_mail },
        },
    );
}

// queries/user.ts
function useEmailMutation(): UseMutationReturnType<void, Error, User, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: User, new_mail: string) => updateEmail(user.uid, new_mail),
        onSettled: (data, error, { user: User }) => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY(user.uid) });
        },
        onError: () => {
            alert("Could not update user");
        },
    });
}
```

`mutationFn` is de functie die de mutation zal uitvoeren, in dit geval een
`PATCH` request. `onSettled` is een functie die wordt uitgevoerd na de mutation,
ongeacht of de mutation geslaagd is of niet. Om ervoor te zorgen dat na het
aanpassen van het e-mail adres de applicatie hier ook van op de hoogte is wordt
de query die gebruikers opvraagt, horend bij de gewenste gebruiker,
geïnvalideerd. Dit zal er voor zorgen dat de query automatisch een nieuwe `GET`
request stuurt om de nieuwe aangepaste gebruiker op te vragen.
`onError` zal uitgevoerd worden wanneer de mutation gefaald is.

Meer informatie over de argumenten die `onError` en `onSettled` kunnen
ontvangen kan in de
[documentatie](https://tanstack.com/query/v4/docs/framework/vue/reference/useMutation)
gevonden worden.

Een voorbeeldcomponent die dit gebruikt kan er zo uit zien:

```html
<template>
    <span>Current email: {{ user.mail }}</span>
    <form @submit.prevent="handleSubmit">
        <input type="email" v-model="new_email"/>
        <button type="submit">Submit</button>
    </form>
</template>

<script setup lang="ts">
import { useEmailMutation } from "@/src/queries/user";

defineProps<{
    user: User;
}>();
const new_email = ref("");

const { mutateAsync } = useEmailMutation();

function onSubmit() {
    mutateAsync(user, new_email.value)
}
</script>
```

Hier is te zien dat de `useMutation` hook een `mutateAsync`-veld ter beschikking
stelt. Voor niet-asynchrone functies bestaat ook gewoon `mutate`, maar dit is
bij ons niet echt van toepassing.

### Optimistic Updates

Wanneer bij het gegeven voorbeeld op de submit-knop gedrukt wordt, zal het even
duren voor `Current email` aangepast wordt. Dit is omdat het even kan duren voor
de request afgehandeld wordt, zeker over een traag netwerk. Dit is niet echt een
goede gebruikerservaring. Hier is echter een oplossing voor: optimistic updates.
Het idee hier is dat wanneer de mutation wordt gestart, er van uit gegaan wordt
dat die zal slagen. We kunnen dan manueel de data in de query gaan aanpassen,
zodat de verandering onmiddelijk zichtbaar is. Hiervoor kunnen we de `onMutate`
functie gebruiken:

```ts
function useEmailMutation(): UseMutationReturnType<void, Error, User, void> {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: User, new_mail: string) => updateEmail(user.uid, new_mail),
        onMutate: (user: User, new_email: string) => {
            await queryClient.cancelQueries({ queryKey: USER_QUERY_KEY(user.uid) });
            const new_user = { ...user, mail: new_email };
            queryClient.setQueryData<User>(
                USER_QUERY_KEY(user.uid),
                () => new_user,
            );
        },
        onSettled: (data, { user: User }) => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY(user.uid) });
        },
        onError: () => {
            alert("Could not update user");
        },
    });
}
```

In `onMutate` zorgen we er eerst voor dat de query die gebruikers ophaalt
tijdelijk stopt, zodat dit geen ongewenste effecten heeft op onze mutation.
Daarna maken we een nieuw `User`-object aan, met een aangepast e-mail adres, en
stellen we handmatig de data van de query in zodat dit de nieuwe gebruiker is.
Door wat magie (het gebruik van refs achter de schermen) wordt deze aanpassing
onmiddellijk weergegeven. Eenmaal de mutation gedaan is, wordt `onSettled`
opgeroepen en de query geïnvalideerd zodat het frontend model weer up to date is
met het backend model. Indien de mutation zou falen gebeurt dit ook, en zal de
oude data terug in de query komen te zitten. Het gebruik van deze verbeterde
mutation in een component blijft identiek als zonder optimistic updates.

## Extras

### Dependent Queries

Soms kan het gebeuren dat de input voor een query afhangt van de output van een
andere. Hiermee omgaan is een van de redenen dat refs gebruikt worden als input
voor een query.

Neem bijvoobeeld een component die data van een vak weergeeft:

```html
<template>
    <h1 v-if="project">{{ project.name }}</h1>
    <h2 v-if="subject">{{ subject.name }}</h2>
</template>

<script setup lang="ts">
const props = defineProps<{
    projectId: string;
}>();
const { projectId } = toRefs(props);
const { data: project } = useProjectQuery(projectId);
const { data: subject } = useSubjectQuery(/* Get subjectId somehow */);
</script>
```

De query voor project is een gewone query. Echter, het opvragen van het
subjectId is geen gemakkelijke opgave. Zolang de project query niet klaar is is
de waarde van project undefined. Het argument van `useSubjectQuery` zal dus niet
zomaar `Ref<number>` kunnen zijn. We zullen de signatuur van deze functie dus
veranderen naar `useSubjectQuery(subjectId: Ref<number | undefined)`. We krijgen
dan:

```ts
const { data: subject } = useSubjectQuery(computed(() => project.value?.subject_id));
```

De implementatie van `useSubjectQuery` ziet er dan zo uit:

```ts
function useSubjectQuery(subjectId: Ref<number | undefined>): UseQueryReturnType<Subject, Error> {
    return useQuery<Subject, Error>({
        queryKey: computed(() => USER_QUERY_KEY(uid.value)),
        queryFn: () => getUser(uid.value),
        enabled: () => subjectId.value !== undefined,
    });
}
```

Door `enabled` te laten afhangen van het gedefinieerd zijn van de waarde van
`subjectId`, zal de query niet uitgevoerd worden zolang er geen waarde voor is.
Doordat de query key een computed ref is, zal deze veranderen eenmaal het
project opgehaald is en `subject_id` ingevuld is. Eenmaal deze key veranderd,
wordt achter de schermen een nieuwe query aangemaakt, die dit keer wel enabled
is, en dus gewoon zal uivoeren. Om problemen voor later te vermijden worden alle
queries best aangemaakt op deze manier. Zo kan een query heel snel en makkelijk
ook een afhankelijke query worden.
