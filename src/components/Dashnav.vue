<template>
    <div :class="{ 'toggled': toggled }" id="wrapper">

        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <ul class="sidebar-nav">
                <li class="sidebar-brand">
                    <RouterLink to="/">
                        Article RM
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/dashboard"><i class="bi bi-speedometer"></i> Dashboard</RouterLink>
                </li>
                <li>
                    <RouterLink to="/myarticle"><i class="bi bi-journal"></i> My Article</RouterLink>
                </li>
                <li>
                    <RouterLink to="/add"><i class="bi bi-journal-plus"></i> Add New Article</RouterLink>
                </li>
                <li>
                    <RouterLink to="/categorydash"><i class="bi bi-tag"></i> Category</RouterLink>
                </li>
                <li>
                    <hr>
                </li>
                <li>
                    <a href="#" @click="logout"><i class="bi bi-box-arrow-in-left"></i> Logout</a>
                </li>
            </ul>
        </div>
        <a href="#" class="btn btn-default" @click="toggleMenu"><i class="bi bi-list"></i></a>
    </div>
    <!-- /#sidebar-wrapper -->

    <!-- Page Content -->
    <div :class="{ 'toggled': toggled }" id="wrapper">
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
    <!-- /#page-content-wrapper -->
</template>

<script>
export default {
    data() {
        return {
            toggled: false
        };
    },
    methods: {
        toggleMenu() {
            this.toggled = !this.toggled;
        },
        logout() {
            localStorage.removeItem('user-token');
            this.$router.push('/');
        },
    }
}
</script>

<style scoped>
body {
    overflow-x: hidden;
}

#wrapper {
    padding-left: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled {
    padding-left: 250px;
}

#sidebar-wrapper {
    z-index: 1000;
    position: fixed;
    left: 250px;
    width: 0;
    height: 100%;
    margin-left: -250px;
    overflow-y: auto;
    background: #000;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
}

#wrapper.toggled #sidebar-wrapper {
    width: 250px;
}

#page-content-wrapper {
    width: 100%;
    position: absolute;
    padding: 15px;
}

#wrapper.toggled #page-content-wrapper {
    position: absolute;
    margin-right: -250px;
}

/* Sidebar Styles */

.sidebar-nav {
    position: absolute;
    top: 0;
    width: 250px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.sidebar-nav li {
    text-indent: 20px;
    line-height: 40px;
}

.sidebar-nav li a {
    display: block;
    text-decoration: none;
    color: #999999;
}

.sidebar-nav li a:hover {
    text-decoration: none;
    color: #fff;
    background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav li a:active,
.sidebar-nav li a:focus {
    text-decoration: none;
}

.sidebar-nav>.sidebar-brand {
    height: 65px;
    font-size: 18px;
    line-height: 60px;
}

.sidebar-nav>.sidebar-brand a {
    color: #999999;
}

.sidebar-nav>.sidebar-brand a:hover {
    color: #fff;
    background: none;
}

@media(min-width:768px) {
    #wrapper {
        padding-left: 250px;
    }

    #wrapper.toggled {
        padding-left: 0;
    }

    #sidebar-wrapper {
        width: 250px;
    }

    #wrapper.toggled #sidebar-wrapper {
        width: 0;
    }

    #page-content-wrapper {
        padding: 20px;
        position: relative;
    }

    #wrapper.toggled #page-content-wrapper {
        position: relative;
        margin-right: 0;
    }
}
</style>