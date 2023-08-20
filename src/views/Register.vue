<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />
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
                                    <i class="bi bi-person-circle"></i> Register
                                </div>
                                <div class="card-body py-5 px-md-5">
                                    <div v-if="error" class="alert alert-danger">
                                        {{ error }}
                                    </div>
                                    <div v-if="successMessage" class="alert alert-success">
                                        {{ successMessage }}
                                    </div>
                                    <form>

                                        <div class="form-floating mb-3">
                                            <input type="text" v-model="username" class="form-control" id="floatingUsername"
                                                placeholder="Username">
                                            <label for="floatingUsername">Username</label>
                                        </div>
                                        <div class="form-floating mb-3">
                                            <input type="password" v-model="password" class="form-control"
                                                id="floatingPass" placeholder="Username">
                                            <label for="floatingPass">Password</label>
                                        </div>
                                        <button type="button" @click="register" :disabled="loading"
                                            class="btn btn-primary w-100">
                                            Register
                                            <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                                                aria-hidden="true"></span>
                                        </button>
                                        Already have an account? <RouterLink to="/login">Login</RouterLink>
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
        Footer,
    },
    data() {
        return {
            username: '',
            password: '',
            successMessage: null,
            error: null,
            loading: false,
        };
    },
    methods: {
        async register() {
            if (!this.username || !this.password) {
                this.error = 'Username and password are required.';
                return;
            }
            this.loading = true;

            axios.post('http://article-rm.free.nf/api/auth/register', {
                username: this.username,
                password: this.password,
            })
                .then(response => {
                    this.loading = false;
                    this.successMessage = "Successfully registered! Redirecting to Login...";  // <-- Add this line
                    setTimeout(() => {  // After 3 seconds, redirect to login page
                        this.$router.push('/login');
                    }, 1500);
                })

                .catch(error => {
                    this.loading = false;
                    this.error = error.response && error.response.data.message ? error.response.data.message : 'Registration failed';
                });
        },
    }
}
</script>

<style scoped>
/* Your styles here */
</style>
