<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">


        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <router-link class="nav-link px-2 text-secondary" to="/">ASSIST</router-link>
          </li>
          <li
              v-if="isAuthenticated"
          >
            <router-link to="/admin/notes">
              Notes
            </router-link>
          </li>
        </ul>

        <div class="text-end">
          <custom-button
              v-if="!isAuthenticated"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
          >
            Login
          </custom-button>
        </div>



        <div
            v-if="isAuthenticated"
            class="dropdown text-end"
        >
          <a href="#"
             class="d-block link-dark text-decoration-none dropdown-toggle text-warning"
             id="dropdownUser1"
             data-bs-toggle="dropdown"
             aria-expanded="false"
          >
            ADMIN
          </a>
          <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1" style="">

            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li>
              <a
                  @click.prevent="logout"
                  class="dropdown-item"
                  href="#"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>


      <!-- Modal Login -->
      <div
          class="modal fade"
          id="loginModal"
          tabindex="-1"
          aria-labelledby="loginModalLabel"
          aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email</label>
                <input
                    v-focus
                    v-model="login.email"
                    type="email"
                    class="form-control"
                    id="loginEmail"
                    placeholder="example@gmail.com"
                    @focus="clearValidation('email')"
                    :class="{ 'is-invalid': validationMessages.email }"
                >
                <div v-if="validationMessages.email" class="invalid-feedback">
                  <span v-for="(error, index) in validationMessages.email" :key="index">{{ error }}</span>
                </div>
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input
                    v-model="login.password"
                    type="password"
                    class="form-control"
                    id="loginPassword"
                    placeholder="*************"
                    @focus="clearValidation('password')"
                    :class="{ 'is-invalid': validationMessages.password }"

                >
                <div v-if="validationMessages.password" class="invalid-feedback">
                  <span v-for="(error, index) in validationMessages.password" :key="index">{{ error }}</span>
                </div>
              </div>

            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button
                  type="button"
                  class="btn btn-warning"
                  @click="sendLogin"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>




  </header>
</template>

<script>
import CustomButton from "@/components/ui/button/CustomButton.vue";
import axios from "axios";
import {mapActions, mapState} from "vuex";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle";


export default {
  name: "Navbar",
  components: {CustomButton},
  data() {
    return {
      login: {
        email: '',
        password: ''
      },
      validationMessages: {}
    }
  },
  computed: {
    // Используем Vuex state для проверки, есть ли пользователь
    ...mapState('auth', ['user']), // Получаем пользователя из модуля 'auth'
    isAuthenticated() {
      return !!this.user; // Проверяем, есть ли пользователь (null или объект)
    }
  },
  mounted() {
    const modalElement = document.getElementById('loginModal');

    // при открытие модалки устанавливаем фокус на первое поле
    modalElement.addEventListener('shown.bs.modal', this.setFocus);

    // Добавляем слушатель закрытия модального окна, для очистки полей
    modalElement.addEventListener("hide.bs.modal", this.resetLoginForm);
  },
  beforeUnmount() {
    const modalElement = document.getElementById('loginModal');

    if (modalElement) {
      modalElement.removeEventListener('shown.bs.modal', this.setFocus);
      modalElement.removeEventListener("hide.bs.modal", this.resetLoginForm);
    }
  },

  methods: {
    // Подключаем действия из Vuex
    ...mapActions('auth', ['logout']),

    async sendLogin() {
      try {
        const loginResponse = await axios.post('http://192.168.193.1/api/login', {
          email: this.login.email,
          password: this.login.password,
        });

        if (loginResponse.status === 200) {
          const token = loginResponse.data.token; // Полученный токен

          // Закрытие модального окна
          const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          modal.hide();

          // Сохранение authToken и получение профиля
          await this.$store.dispatch('auth/getProfile', { token });
        }

        console.log(loginResponse);

      } catch (error) {
        if (error.response && error.response.status === 422) {
          // Обработка ошибок валидации
          const validationErrors = error.response.data.errors;
          console.log('Ошибки валидации:', validationErrors);

          // Вывод ошибок, например, в пользовательский интерфейс
          this.validationMessages = validationErrors;
        } else {
          // Обработка других ошибок
          console.error('Ошибка при попытке входа:', error);
        }

      }
    },

    setFocus() {
      const input = document.getElementById('loginEmail');
      if (input) {
        input.focus();
      }
    },
    // Метод для сброса формы
    resetLoginForm() {
      this.login.email = '';
      this.login.password = '';
      this.validationMessages = {};
    },
    // Убираем ошибку валидации для конкретного поля
    clearValidation(field) {
      if (this.validationMessages[field]) {
        delete this.validationMessages[field]; // Убираем ошибку из объекта
      }
    },
  }
}
</script>

<style scoped>

.modal-title {
  display: block !important;
  color: black !important;
  font-size: 1.5rem !important;
}

.modal-body {
  display: block !important;
  color: black !important;
  font-size: 1rem !important;
}

</style>