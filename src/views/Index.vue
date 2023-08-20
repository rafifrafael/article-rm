<template>
    <div class="d-flex flex-column min-vh-100">
        <Navbar />

        <div class="container mt-5 flex-grow-1">
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1"><i class="bi bi-search"></i></span>
                <input type="text" v-model="searchQuery" @input="filterArticles" class="form-control" placeholder="Search articles...">
            </div>

            <div class="row mb-2 mt-3">
                <div class="card-group" v-for="article in paginatedArticles" :key="article.id">
                    <div class="card flex-md-row mb-4 box-shadow h-md-250">
                        <div class="card-body d-flex flex-column align-items-start">
                            <RouterLink :to="`category/${article.category_id}`"><strong class="d-inline-block mb-2 text-primary">{{ article.category_name }}</strong></RouterLink>
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
                        <img class="card-img-right flex-auto d-none d-md-block" :src="'http://article-rm.free.nf/api/uploads/' + article.image" height="250" width="200">
                    </div>
                </div>
            </div>

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li class="page-item" :class="{ 'disabled': currentPage == 1 }">
                        <a class="page-link" href="#" @click.prevent="currentPage--">Previous</a>
                    </li>
                    <li class="page-item" v-for="number in totalPages" :key="number" :class="{ 'active': currentPage == number }">
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
        truncatedContent() {
            return function (article) {
                if (article.content.length <= 100) { 
                    return article.content;
                }
                return article.content.substring(0, 100) + '...'; 
            }
        },

        paginatedArticles() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredArticles.slice(start, end);
        },

        totalPages() {
            return Math.ceil(this.filteredArticles.length / this.itemsPerPage);
        }
    },

    methods: {
        estimatedReadTime(content) {
            const wordsPerMinute = 200; 
            const wordCount = content.split(/\s+/).length;  
            const time = Math.ceil(wordCount / wordsPerMinute); 

            return time <= 1 ? '1 Minute Read' : `${time} Minutes Read`;
        },

        filterArticles() {
            if (!this.searchQuery.trim()) {
                this.filteredArticles = this.articles;
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
                    this.articles = response.data.sort((a, b) => b.id - a.id);
                    this.filteredArticles = this.articles;
                }
            })
            .catch(error => {
                console.error("There was an error fetching the data", error);
            });
    }
}

</script>

<style></style>
