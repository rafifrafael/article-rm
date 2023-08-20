<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />
        <div class="container mt-5 flex-grow-1">
            <div class="row mb-2 mt-3">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Article</a></li>
                        <li class="breadcrumb-item">Category</li>
                        <li class="breadcrumb-item">{{ categoryName }}</li>
                    </ol>
                </nav>
                <div class="card-group" v-for="article in articles" :key="article.id">
                    <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                            <RouterLink :to="`/category/${article.category_id}`"><strong class="d-inline-block mb-2 text-primary">{{ article.category_name }}</strong></RouterLink>
                            <h3 class="mb-0">
                                <RouterLink :to="`/view/${article.id}`" class="text-dark">{{ article.title }}</RouterLink>
                            </h3>
                            <div class="mb-1 text-muted">{{ article.published_on }}</div>
                            <p class="card-text mb-auto"><span v-html="truncatedContent(article)"></span></p>
                            <div class="mb-1 text-muted">
                                <i class="bi bi-book"></i> {{ estimatedReadTime(article.content) }} &nbsp;&nbsp;&nbsp;
                                <i class="bi bi-eye"></i> {{ article.views }}
                            </div>
                            <RouterLink :to="`/view/${article.id}`" class="text-dark font-weight-bold">Read more</RouterLink>
                        </div>
                        <img class="card-img-right flex-auto d-none d-md-block" :src="'http://localhost:8080/uploads/' + article.image" height="250" width="200">
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
import { RouterLink } from 'vue-router';
import config from '../config/config';

export default {
    components: {
        Navbar,
        Footer,
        RouterLink
    },
    data() {
        return {
            articles: [],
            latestArticle: null,
        };
    },
    computed: {
        categoryName() {
            return this.articles.length > 0 ? this.articles[0].category_name : '';
        },
        truncatedContent() {
            return function (article) {
                if (article.content.length <= 100) { // or however many characters you want
                    return article.content;
                }
                return article.content.substring(0, 100) + '...';  // Display the first 100 characters followed by an ellipsis
            }
        },
    },
    methods: {
        estimatedReadTime(content) {
            const wordsPerMinute = 200; // You can adjust this value as per your need
            const wordCount = content.split(/\s+/).length;  // Counting words
            const time = Math.ceil(wordCount / wordsPerMinute); // Rounding up to ensure at least 1 minute is shown

            return time <= 1 ? '1 Minute Read' : `${time} Minutes Read`;
        },

    },
    created() {
        const categoryId = this.$route.params.id;
        axios.get(`http://localhost:8080/article/category/${categoryId}`)
            .then(response => {
                this.articles = response.data;
            })
            .catch(error => {
                console.error("There was an error fetching the data", error);
            });
    }
}
</script>

<style></style>
