<template>
    <div class="d-flex flex-column min-vh-100">
        <Dashnav />
        <div class="container">
            <!-- Page Content -->
            <div id="page-content-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1>My Article</h1>
                            <div class="mt-3"></div>
                            <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]" role="alert" v-html="alert.message"></div>
                            <table id="myarticle" class="table" style="width:100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Published</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="article in allArticles" :key="article.id">
                                        <td>{{ article.id }}</td>
                                        <td>{{ article.title }}</td>
                                        <td>{{ article.category_name }}</td>
                                        <td>{{ article.published_on }}</td>
                                        <td>
                                            <button @click="showEditModal(article)" class="btn btn-warning btn-sm"><i
                                                    class="bi bi-pencil-fill"></i> Edit</button>
                                            &nbsp;
                                            <button @click="prepareDelete(article.id)" class="btn btn-danger btn-sm"><i
                                                    class="bi bi-trash-fill"></i> Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="modal modal-xl fade" id="editModal" tabindex="-1" role="dialog"
                                aria-labelledby="editModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="editModalLabel">Edit Article</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="submitArticle">
                                                <!-- Title input field -->
                                                <div class="form-group">
                                                    <label for="title">Title</label>
                                                    <input type="text" class="form-control" @input="generateSlug" id="title"
                                                        v-model="selectedArticle.title" required>
                                                </div>

                                                <!-- Slug input field -->
                                                <div class="form-group">
                                                    <label for="slug">Slug</label>
                                                    <input type="text" class="form-control" id="slug"
                                                        v-model="selectedArticle.slug" disabled>
                                                </div>


                                                <!-- Category input field -->
                                                <div class="form-group">
                                                    <label for="category">Category</label>
                                                    <div class="input-group mb-3">
                                                        <select class="form-select" v-model="selectedArticle.category_id"
                                                            required>
                                                            <option v-for="category in categories" :key="category.id"
                                                                :value="category.id">
                                                                {{ category.name }}
                                                            </option>
                                                        </select>
                                                        <label class="input-group-text"
                                                            for="inputGroupSelect02">Category</label>
                                                    </div>
                                                </div>

                                                <!-- author input field -->
                                                <div class="form-group">
                                                    <input type="text" class="form-control" id="author"
                                                        v-model="selectedArticle.author_id" hidden>
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
                                                    <QuillEditor theme="snow" class="form-control"
                                                        v-model:content="selectedArticle.content" contentType="html" />
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" @click="updateArticle">Save
                                                changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" role="dialog"
                                aria-labelledby="deleteModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            Are you sure you want to delete this article?
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-danger"
                                                @click="deleteConfirmed">Delete</button>
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
        QuillEditor
    },
    data() {
        return {
            user: null,
            allArticles: null,
            selectedArticle: {},
            categories: [],
            articleToDelete: null,
            alert: {
                show: false,
                message: '',
                type: '' // default to success, can be changed to 'danger' or any other type
            }
        };
    },
    watch: {
        $route(to, from) {
            // Check for the success query param whenever the route changes
            if (to.query.success) {
                // Check the type of action and set the alert message and type accordingly
                if (to.query.type === 'add') {
                    this.alert.message = 'Article added successfully!';
                    this.alert.type = 'success';
                } else if (to.query.type === 'delete') {
                    this.alert.message = 'Article deleted successfully!';
                    this.alert.type = 'danger';
                }
                this.alert.show = true;

                // Optionally, hide the alert after some time
                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);
            }
        }
    },
    created() {
        this.fetchUserDetails();
        this.fetchCategories();
        if (this.$route.query.success) {
            this.showAlert = true;
            setTimeout(() => {
                this.showAlert = false;
            }, 3000);  // Hide after 3 seconds
        }

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

                    this.allArticles = articleResponse.data.all_article;
                }

            } catch (error) {
                console.error("Failed to fetch details:", error.message);
            }
            this.$nextTick(() => {
                if ($.fn.DataTable.isDataTable('#myarticle')) {
                    $('#myarticle').DataTable().destroy();
                }

                $('#myarticle').DataTable({
                    "order": [[0, "desc"]]
                });
            });
        },
        async fetchCategories() {
            try {
                const response = await axios.get('http://localhost:8080/category/');
                this.categories = response.data;
            } catch (error) {
                console.error("Failed to fetch categories:", error.message);
            }
        },
        prepareDelete(articleId) {
            this.articleToDelete = articleId;
            $('#deleteConfirmationModal').modal('show');
        },

        deleteConfirmed() {
            if (this.articleToDelete) {
                this.deleteArticle(this.articleToDelete);
                this.articleToDelete = null; // Reset after deletion
            }
            $('#deleteConfirmationModal').modal('hide');
        },
        async deleteArticle(articleId) {
            try {
                await axios.delete(`http://localhost:8080/article/${articleId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token')
                    }
                });

                // Remove the deleted article from the allArticles array
                this.allArticles = this.allArticles.filter(article => article.id !== articleId);

                // Destroy and Reinitialize the DataTable
                $('#myarticle').DataTable().destroy();
                $('#myarticle').DataTable({
                    "order": [[0, "desc"]]
                });

                this.$router.push({ path: '/myarticle', query: { success: 'true', type: 'delete' } });

            } catch (error) {
                console.error("Failed to delete article:", error.message);
            }
        },

        confirmDelete(articleId, event) {
            event.stopPropagation();
            if (confirm('Are you sure you want to delete this article?')) {
                this.deleteArticle(articleId);
            }
        },

        showEditModal(article) {
            this.selectedArticle = JSON.parse(JSON.stringify(article));  // This clones the article
            $('#editModal').modal('show');  // Use jQuery to show the modal
        },

        handleFileUpload() {
            this.selectedArticle.imageFile = this.$refs.fileInput.files[0];
        },

        async updateArticle() {
            let formData = new FormData();

            formData.append('title', this.selectedArticle.title);
            formData.append('slug', this.selectedArticle.slug);
            formData.append('category_id', this.selectedArticle.category_id);
            formData.append('content', this.selectedArticle.content);
            formData.append('author_id', this.selectedArticle.author_id);

            // Only append the image if it has been changed
            if (this.selectedArticle.imageFile) {
                formData.append('image', this.selectedArticle.imageFile);
            }

            try {
                await axios.post(`http://localhost:8080/article/${this.selectedArticle.id}`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                        'Content-Type': 'multipart/form-data',
                    }
                });

                // Add this after the axios call is successful:
                this.alert.message = 'Article updated successfully!';
                this.alert.type = 'success';
                this.alert.show = true;

                // Optionally, you can hide the alert after a few seconds
                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);

                this.fetchUserDetails();
                $('#editModal').modal('hide');

            } catch (error) {
                console.error("Failed to update article:", error.message);
            }
        },

        generateSlug() {
            function stringToSlug(str) {
                return str
                    .toLowerCase()
                    .replace(/[^\w ]+/g, '')
                    .replace(/ +/g, '-');
            }
            this.selectedArticle.slug = stringToSlug(this.selectedArticle.title);
        }
    },
}
</script>

<style></style>