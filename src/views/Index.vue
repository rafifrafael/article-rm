<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />

        <div class="container mt-5 flex-grow-1">
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><i class="bi bi-search"></i></span>
                <input type="text" v-model="searchQuery" @input="filterArticles" class="form-control"
                    placeholder="Search articles...">
            </div>

            <div class="jumbotron p-3 p-md-5 text-white rounded bg-dark" v-if="latestArticle">
                <div class="col-md-6 px-0">
                    <h1 class="display-4 fst-italic">{{ latestArticle.title }}</h1>
                    <p class="lead my-3 text-white"><span v-html="truncatedContent(latestArticle)"></span></p>
                    <p class="lead mb-0">
                        <RouterLink :to="`/view/${latestArticle.id}`" class="text-white fw-bold">Read more</RouterLink>
                    </p>
                </div>
            </div>

            <div class="row mb-2 mt-3">
                <div class="col-md-6" v-for="article in paginatedArticles" :key="article.id">
                    <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                            <RouterLink :to="`category/${article.category_id}`"><strong
                                    class="d-inline-block mb-2 text-primary">{{ article.category_name }}</strong>
                            </RouterLink>
                            <h3 class="mb-0">
                                <RouterLink :to="`/view/${article.id}`" class="text-dark">{{ article.title }}</RouterLink>
                            </h3>
                            <div class="mb-1 text-muted">{{ article.published_on }}</div>
                            <p class="card-text mb-auto"><span v-html="truncatedContent(article)"></span></p>
                            <div class="mb-1 text-muted">
                                <i class="bi bi-book"></i> {{ estimatedReadTime(article.content) }} &nbsp;&nbsp;&nbsp;
                                <i class="bi bi-eye"></i> {{ article.views }}
                            </div>
                            <RouterLink :to="`/view/${article.id}`" class="text-dark font-weight-bold">Read more
                            </RouterLink>
                        </div>
                        <img class="card-img-right flex-auto d-none d-md-block"
                            :src="'http://article-rm.free.nf/api/uploads/' + article.image" height="250" width="200">
                    </div>
                </div>
            </div>

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item" :class="{ 'disabled': currentPage == 1 }">
                        <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
                    </li>
                    <li class="page-item" v-for="number in totalPages" :key="number"
                        :class="{ 'active': currentPage == number }">
                        <a class="page-link" href="#" @click.prevent="goToPage(number)">{{ number }}</a>
                    </li>
                    <li class="page-item" :class="{ 'disabled': currentPage == totalPages }">
                        <a class="page-link" href="#" @click.prevent="currentPage++">Next</a>
                    </li>
                </ul>
            </nav>

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
            searchQuery: '',
            filteredArticles: [],
            currentPage: 1,
            itemsPerPage: 4,
        };

    },

    watch: {
        currentPage(newVal, oldVal) {
            if (newVal < 1) this.currentPage = 1;
            else if (newVal > this.totalPages) this.currentPage = this.totalPages;
        }
    },

    computed: {
        otherArticles() {
            return this.articles.filter(article => article.id !== this.latestArticle.id);
        },

        truncatedContent() {
            return function (article) {
                if (article.content.length <= 100) { // or however many characters you want
                    return article.content;
                }
                return article.content.substring(0, 100) + '...';  // Display the first 100 characters followed by an ellipsis
            }
        },

        paginatedArticles() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredArticles.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredArticles.length / this.itemsPerPage);
        },

        otherArticles() {
            if (this.latestArticle) {
                return this.filteredArticles.filter(article => article.id !== this.latestArticle.id);
            }
            return this.filteredArticles;
        },
    },
    methods: {
        estimatedReadTime(content) {
            const wordsPerMinute = 200; // You can adjust this value as per your need
            const wordCount = content.split(/\s+/).length;  // Counting words
            const time = Math.ceil(wordCount / wordsPerMinute); // Rounding up to ensure at least 1 minute is shown

            return time <= 1 ? '1 Minute Read' : `${time} Minutes Read`;
        },

        filterArticles() {
            if (!this.searchQuery.trim()) {
                // Exclude the latestArticle when no search term
                this.filteredArticles = this.articles.filter(article => article.id !== this.latestArticle.id);
                return;
            }

            this.filteredArticles = this.articles.filter(article => {
                return article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    article.content.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                    (article.author && article.author.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
                    (article.category_name && article.category_name.toLowerCase().includes(this.searchQuery.toLowerCase()));
            });
        },

        goToPage(pageNumber) {
            if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber;
            }
        },
    },
    created() {
        axios.get('http://article-rm.free.nf/api/article')
            .then(response => {
                if (response.data && response.data.length > 0) {
                    // Sort articles by ID in descending order
                    this.articles = response.data.sort((a, b) => b.id - a.id);

                    // Set the latestArticle to the first article in this sorted list
                    this.latestArticle = this.articles[0];

                    // Filter out the latestArticle from the list
                    this.filteredArticles = this.articles.filter(article => article.id !== this.latestArticle.id);

                    axios.get(`http://article-rm.free.nf/api/article/${this.latestArticle.id}`)
                        .then(res => {
                            if (res.data) {
                                this.latestArticle = res.data;
                            }
                        })
                    axios.get(`http://article-rm.free.nf/api/article/${this.articles.id}`)
                        .then(res => {
                            if (res.data) {
                                this.articles = res.data;
                            }
                        })
                        .catch(error => {
                            console.error("Error incrementing the views:", error);
                        });
                }
            })
            .catch(error => {
                console.error("There was an error fetching the data", error);
            });
    }

}
</script>

<style></style>
