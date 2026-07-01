<template>
  <Navbar />

  <div class="dashboard">
    <h1>Bienvenido, {{ userStore.user?.name }}</h1>
    <p>Panel principal del sistema Agencia Web {{ msj[0] }}</p>

    <a href="/paises">Ir a paises</a>
  </div>

</template>

<script setup>
import { ref, } from 'vue';
import { useUserStore } from '../stores/user';
import Navbar from '../components/Navbar.vue';
import api from '../config/axios';

const userStore = useUserStore();

const msj = ref([]);

const loadApi = async () => {
  try {
    const response = await api.get('/paises');
    msj.value = response.data;
    console.log('Datos de la API:', msj.value);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

loadApi();

</script>

<style>
.dashboard {
  padding: 20px;
}
</style>
