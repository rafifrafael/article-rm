<template>
    <div class="d-flex flex-column min-vh-100">
        <Dashnav>
            <div class="container flex-grow-1">
                <div class="col-lg-12">
                    <h1>Add New Article </h1>
                    <div v-if="alert.show" class="alert alert-success" role="alert" v-html="alert.message"></div>
                    <form @submit.prevent="submitArticle" class="mb-5">
                        <!-- Title input field -->
                        <div class="form-group">
                            <label for="title">Title</label>
                            <input type="text" class="form-control" @input="generateSlug" id="title"
                                v-model="article.title" required>
                        </div>
        
                        <!-- Slug input field -->
                        <div class="form-group">
                            <label for="slug">Slug</label>
                            <input type="text" class="form-control" id="slug" v-model="article.slug" disabled>
                        </div>
        
                        <!-- Category input field -->
                        <div class="form-group">
                            <label for="category">Category</label>
                            <div class="input-group mb-3">
                                <select class="form-select" v-model="article.category" required>
                                    <option v-for="category in categories" :key="category.id" :value="category.id">
                                        {{ category.name }}
                                    </option>
                                </select>
                                <label class="input-group-text" for="inputGroupSelect02">Category</label>
                            </div>
                        </div>
        
                        <!-- author input field -->
                        <div class="form-group">
                            <input type="text" class="form-control" id="author" v-model="article.author_id" hidden>
                        </div>
        
                        <!-- Image input field -->
                        <div class="form-group">
                            <label for="image">Article Thumbnail</label>
                            <input type="file" class="form-control" id="image" ref="fileInput"
                                @change="handleFileUpload" required>
                        </div>
        
                        <!-- QuillEditor for content -->
                        <div class="form-group">
                            <label for="content">Content</label>
                            <QuillEditor theme="snow" class="form-control" v-model:content="article.content"
                                contentType="html" />
                            <div v-if="quillValidationError" class="text-danger">Content is required!</div>
                        </div>
        
                        <!-- Submit button -->
                        <button type="submit" class="btn btn-primary mt-3">Submit</button>
                    </form>
                </div>
            </div>
        </Dashnav>
        <Footer />
    </div>
</template>

<script>
import router from '@/router';
import axios from 'axios';
import Dashnav from '../../components/Dashnav.vue';
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import Footer from '../../components/Footer.vue';
import config from '../../config/config';

export default {
    components: {
        Dashnav,
        Footer,
        QuillEditor,
    },
    data() {
        return {
            user: null,
            contentError: false,
            alertMessage: '',
            quillValidationError: false,
            article: {
                title: '',
                slug: '',
                image: '',
                content: '',
                category: ''
            },
            alert: {
                show: false,
                message: '',
            },
            categories: []
        };
    },
    created() {
        this.fetchCategories();
        this.fetchUserDetails();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8080/category');
                console.log("Fetched categories:", response.data); // Add this
                this.categories = response.data;
            } catch (error) {
                console.error("Failed to fetch categories:", error.message);
            }
        },
        async fetchUserDetails() {
            try {
                const response = await axios.get('http://localhost:8080/auth/user-details');
                this.user = response.data.user;
                this.article.author_id = this.user.id;
            } catch (error) {
                console.error("Failed to fetch user:", error.message);
            }
        },
        handleFileUpload() {
            this.article.image = this.$refs.fileInput.files[0];
        },
        async submitArticle() {
            if (!this.article.content.trim()) { // Check if content is empty
                this.quillValidationError = true;
                return; // Exit the function early
            } else {
                this.quillValidationError = false; // Reset the validation error if the content exists
            }

            const formData = new FormData();
            formData.append('author_id', this.article.author_id);
            formData.append('title', this.article.title);
            formData.append('slug', this.article.slug);
            formData.append('image', this.article.image);
            formData.append('content', this.article.content);
            formData.append('category_id', this.article.category);

            try {
                const response = await axios.post('http://localhost:8080/article', formData);

                if (response.data) { // Check the response for success (this is a basic check, refine as per your backend's response structure)
                    // Set the alert to show a success message
                    window.scrollTo(0, 0);
                    this.alert.show = true;
                    this.alert.message = '<i class="bi bi-check-lg"></i> Article added successfully!';

                    // Wait for 2 seconds before redirecting
                    setTimeout(() => {
                        this.$router.push('/myarticle');
                    }, 2000); // 2000ms = 2 seconds
                }

            } catch (error) {
                console.error("Failed to submit:", error.message);
            }
        },

        generateSlug() {
            function stringToSlug(str) {
                return str
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-');
            }
            this.article.slug = stringToSlug(this.article.title);
        }
    }
};

</script>

<style>
#page-content-wrapper {
    padding-left: 30px;
    /* Adjust this value as needed */
}</style>