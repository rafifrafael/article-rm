<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />
        <!-- Section: Design Block -->
        <section class="">
            <!-- Jumbotron -->
            <div class="px-4 py-5 px-md-5 text-center text-lg-start" style="background-color: hsl(0, 0%, 96%)">
                <div class="container">
                    <div class="row gx-lg-5 align-items-center">
                        <div class="col-lg-6 mb-5 mb-lg-0">
                            <h1 class="my-5 display-3 fw-bold ls-tight">
                                The best offer <br />
                                <span class="text-primary">for your business</span>
                            </h1>
                            <p style="color: hsl(217, 10%, 50.8%)">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Eveniet, itaque accusantium odio, soluta, corrupti aliquam
                                quibusdam tempora at cupiditate quis eum maiores libero
                                veritatis? Dicta facilis sint aliquid ipsum atque?
                            </p>
                        </div>

                        <div class="col-lg-6 mb-5 mb-lg-0">
                            <div class="card">
                                <div class="card-header text-center">
                                    <i class="bi bi-person-circle"></i> Login
                                </div>
                                <div class="card-body py-5 px-md-5">
                                    <div v-if="error" class="alert alert-danger">
                                        {{ error }}
                                    </div>
                                    <form>

                                        <div class="form-floating mb-3">
                                            <input type="text" v-model="username" class="form-control" id="floatingUsername" placeholder="Username">
                                            <label for="floatingUsername">Username</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input type="password" v-model="password" class="form-control" id="floatingPass" placeholder="Username">
                                            <label for="floatingPass">Password</label>
                                        </div>
                                        <button type="button" @click="login" :disabled="loading"
                                            class="btn btn-primary w-100">
                                            Login
                                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                                                aria-hidden="true"></span>
                                        </button>
                                        Doesn't have an account? <RouterLink to="/register">Register</RouterLink>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Jumbotron -->
        </section>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import Footer from '../components/Footer.vue';
import config from '../config/config';


export default {
    components: {
        Navbar,
        Footer
    },
    data() {
        return {
            username: '',
            password: '',
            error: null,
            loading: false,
        };
    },
    methods: {
        async login() {
            if (!this.username || !this.password) {
                this.error = 'Username and password are required.';
                return;
            }
            this.loading = true;

            axios.post('http://article-rm.free.nf/api/auth/login', {
                username: this.username,
                password: this.password,
            })
                .then(response => {
                    this.loading = false;
                    if (response.data && response.data.token) {
                        localStorage.setItem('user-token', response.data.token);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                        this.$router.push('/dashboard');
                    } else {
                        this.error = response.data.message || 'Login failed';
                    }
                })
                .catch(error => {
                    this.loading = false;
                    if (error.response && error.response.status === 401) {
                        this.handle401Error();
                    } else {
                        this.error = error.response ? error.response.data.message : 'An error occurred during login';
                    }
                });
        },

        handle401Error() {
            alert("Wrong Credentials");
            localStorage.removeItem('user-token');
            location.reload();
        },
    }
}
</script>

<style scoped></style>
