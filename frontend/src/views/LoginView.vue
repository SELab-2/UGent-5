<template>
  <div class="login">
    <img alt="white logo" class="logo" src="@/assets/logo_white_ transparant.png"  height="100" />
    <h3> De officiële indienapplicatie van de Universiteit Gent</h3>
    <p> Aanmelden</p>
    <a class="login-button"> Apollo login </a>
    <img alt="ugent logo" class="ugent-logo" src="@/assets/universiteit-gent-logo-white.png"  height="50" />
  </div>
</template>

<script>
import '../assets/login.css'

export default {
name: "LoginView",
methods:{
  redirect_to_CAS(event){
    event.preventDefault();
    window.location.href = 'CAS_LOGIN'
  }
}
}
</script>

<style scoped>

</style>