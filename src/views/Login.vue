<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>

    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />

      <button type="submit">Entrar</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../config/axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const error = ref(null);

const userStore = useUserStore();
const router = useRouter();

const login = async () => {
  try {
    const response = await api.post('/login', {
      email: email.value,
      password: password.value,
    });

    userStore.setUser(response.data);

    router.push('/dashboard');
  } catch (err) {
    error.value = 'Credenciales incorrectas';
  }
};
</script>

<style>
.login {
  max-width: 300px;
  margin: 50px auto;
}

.error {
  color: red;
}
</style>
