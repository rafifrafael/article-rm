<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />
        <div class="container mt-5 flex-grow-1">
            <div class="row">
                <div class="col-lg-8">
                    <!-- Post content-->
                    <article>
                        <!-- Post header-->
                        <header class="mb-4">
                            <nav aria-label="breadcrumb">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><RouterLink :to="`/author/${article.author_id}`">{{ article.author_name }}</RouterLink></li>
                                    <li class="breadcrumb-item active" aria-current="page">{{ article.title }}</li>
                                </ol>
                            </nav>
                            <!-- Post title-->
                            <h1 class="fw-bolder mb-1">{{ article.title }}</h1>
                            <!-- Post meta content-->
                            <div class="text-muted fst-italic mb-2">
                                <i class="bi bi-calendar"></i> {{ article.published_on }} &nbsp;&nbsp;&nbsp;
                                <i class="bi bi-book"></i> {{ estimatedReadTime(article.content) }} &nbsp;&nbsp;&nbsp;
                                <i class="bi bi-eye"></i> {{ article.views }}
                            </div>
                            <!-- Post categories-->
                            <RouterLink :to="`/category/${article.category_id}`" class="badge bg-secondary text-decoration-none link-light" ><i class="bi bi-tag"></i> {{
                                article.category_name }}</RouterLink>
                        </header>
                        <!-- Preview image figure-->
                        <figure class="mb-4"><img class="img-fluid rounded"
                                :src="'http://localhost:8080/uploads/' + article.image"
                                :style="{ width: '900px', height: '400px' }" alt="..." /></figure>
                        <!-- Post content-->
                        <section class="mb-5">
                            <p class="fs-5 mb-4">
                                <span v-html="article.content"></span>
                            </p>
                        </section>
                    </article>
                </div>
                <!-- Side widgets-->
                <div class="col-lg-4">
                    <div class="sticky-top" style="top: 15px;">
                        <!-- Categories widget-->
                        <div class="card mb-4">
                            <div class="card-header">Categories</div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-6" v-for="category in categories" :key="category.id">
                                        <ul class="list-unstyled mb-0">
                                            <li><RouterLink :to="`/category/${category.id}`">{{ category.name }}</RouterLink></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>
  
<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import config from '../config/config';

export default {
    components: {
        Navbar,
        Footer,
    },
    data() {
        return {
            article: null,
            categories: []
        }
    },
    created() {
        this.fetchArticle();
        this.fetchCategory();
    },
    methods: {
        async fetchArticle() {
            const id = this.$route.params.id;
            try {
                const response = await axios.get(`http://localhost:8080/article/incv/${id}`);
                this.article = response.data.data;
            } catch (error) {
                console.error("Error fetching the article:", error);

            }
        },
        async fetchCategory() {
            try {
                axios.get('http://localhost:8080/category')
                    .then(response => {
                        this.categories = response.data;
                    })
            } catch (error) {
                console.error("Error fetching the categories:", error);
            }
        },
        estimatedReadTime(content) {
            const wordsPerMinute = 200;
            const wordCount = content.split(/\s+/).length;
            const time = Math.ceil(wordCount / wordsPerMinute);

            return time <= 1 ? '1 Minute Read' : `${time} Minutes Read`;
        },
    }
}
</script>
  
<style>
</style>
  