<template>
  <header class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap">
            <use xlink:href="#bootstrap"></use>
          </svg>
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" class="nav-link px-2 text-secondary">ASSIST</a></li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
          <input type="search" class="form-control form-control-dark" placeholder="Search..." aria-label="Search">
        </form>

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
      <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
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
                    v-model="login.email"
                    type="email"
                    class="form-control"
                    id="loginEmail"
                    placeholder="example@gmail.com"
                >
              </div>
              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input
                    v-model="login.password"
                    type="password"
                    class="form-control"
                    id="loginPassword"
                    placeholder="*************"
                >
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
import CustomButton from "@/components/ui/CustomButton.vue";
import axios from "axios";
import {mapActions, mapState} from "vuex";
import * as bootstrap from "bootstrap/dist/js/bootstrap.bundle";


export default {
  name: "Navbar",
  // inject: ["bootstrap"],
  components: {CustomButton},
  data() {
    return {
      login: {
        email: '',
        password: ''
      }
    }
  },
  computed: {
    // Используем Vuex state для проверки, есть ли пользователь
    ...mapState('auth', ['user']), // Получаем пользователя из модуля 'auth'
    isAuthenticated() {
      return !!this.user; // Проверяем, есть ли пользователь (null или объект)
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
      } catch (error) {
        console.error('Ошибка при попытке входа:', error);
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