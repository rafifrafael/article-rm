<template>
    <div class="container">
        <header class="blog-header py-3">
        <div class="row flex-nowrap justify-content-between align-items-center">
          <div class="col-4 pt-1">
            <RouterLink to="/" class="text-dark" style="text-decoration: none;">Home</RouterLink>
          </div>
          <div class="col-4 text-center">
            <RouterLink to="/" class="text-dark" style="text-decoration: none;"><h1 class="fw-bold ls-tight">Article RM</h1></RouterLink>
          </div>
          <div class="col-4 d-flex justify-content-end align-items-center">
            <ul class="navbar-nav mb-2 mb-lg-0">
                <li class="nav-item" v-if="!isLoggedIn">
                    <RouterLink to="/login" class="nav-link"><i class="bi bi-box-arrow-in-right"></i> Login
                    </RouterLink>
                </li>
                <li class="nav-item" v-if="isLoggedIn">
                    <button @click="dashboard" class="nav-link btn btn-link"><i class="bi bi-box-arrow-in-right"></i> Login</button>
                </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            
        };
    },
    computed: {
        isLoggedIn() {
            // checks if 'user-token' exists in local storage.
            return !!localStorage.getItem('user-token');
        }
    },
    methods: {
        dashboard() {
            this.$router.push('/dashboard');
        }
    }
};
</script>


<style></style>
