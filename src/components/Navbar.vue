<template>
  <nav class="navbar">
    <h3>Agencia Web</h3>

    <button @click="logout">Salir</button>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  router.push('/');
};
</script>

<style>
.navbar {
  background: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
}

button {
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
}
</style>
