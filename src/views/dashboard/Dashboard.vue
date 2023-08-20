<template>
    <div class="d-flex flex-column min-vh-100">
      <Dashnav />
      <div class="container flex-grow-1">
      <!-- Page Content -->
      <div id="page-content-wrapper">
              <div class="container-fluid">
                  <div class="row">
                      <div class="col-lg-12">
                          <h1>Welcome, {{ user ? user.username : 'user' }}! </h1>
                          <div class="row row-cols-1 row-cols-md-3 g-4 mt-3">
                            <div class="col">
                              <div class="card text-bg-success mb-3">
                                <div class="card-body">
                                  <h5 class="card-title">Your Total Article</h5>
                                  <p class="card-text">{{ totalArticles }}</p>
                                </div>
                              </div>
                            </div>
                            <div class="col">
                              <div class="card text-bg-info mb-3">
                                <div class="card-body">
                                  <h5 class="card-title">Your Latest Article</h5>
                                  <p class="card-text">{{ latestArticle ? latestArticle.title : 'None' }}</p>
                                </div>
                              </div>
                            </div>
                            <div class="col">
                              <div class="card text-bg-warning mb-3">
                                <div class="card-body">
                                  <h5 class="card-title">Manage Article</h5>
                                  <p class="card-text"><RouterLink to="/manage">Manage</RouterLink></p>
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- /#page-content-wrapper -->
      </div>
      <Footer />
    </div>
</template>


<script>
import Dashnav from '../../components/Dashnav.vue';
import axios from 'axios';
import Footer from '../../components/Footer.vue';
import config from '../../config/config';


export default {
    components: {
        Dashnav,
        Footer,
    },
    data() {
        return {
            user: null,
            totalArticles: 0,
            latestArticle: null,
        };
    },
    created() {
        this.fetchUserDetails();
    },
    methods: {
      async fetchUserDetails() {
        try {
            // Fetch user details first
            let userResponse = await axios.get('http://localhost:8080/auth/user-details', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                }
            });

            // Check if user data is returned and set it to the user data property
            if (userResponse.data && userResponse.data.user) {
                this.user = userResponse.data.user;

                // Now, fetch the article details for this user
                let articleResponse = await axios.get(`http://localhost:8080/article/by/${this.user.id}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                    }
                });

                this.totalArticles = articleResponse.data.total_articles;
                this.latestArticle = articleResponse.data.latest_article;
            }

        } catch (error) {
            console.error("Failed to fetch details:", error.message);
        }
      }

    }
}
</script>


<style>

</style>