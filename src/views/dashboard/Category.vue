<template>
    <div class="d-flex flex-column min-vh-100">
        <Dashnav />
        <div class="container flex-grow-1">
            <!-- Page Content -->
            <div id="page-content-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-lg-12">
                            <h1>Category</h1>
                            <div class="mt-3"></div>
                            <div v-if="alert.show" :class="['alert', `alert-${alert.type}`]" role="alert" v-html="alert.message"></div>
                            <button @click="showAddCategoryModal(category)" class="btn btn-primary mb-3">
                                <i class="bi bi-plus-square"></i> Category
                            </button>
                            <table id="category" class="table" style="width:100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="category in categories" :key="category.id">
                                        <td>{{ category.id }}</td>
                                        <td>{{ category.name }}</td>
                                        <td>
                                            <button @click="showEditCategoryModal(category)"
                                                class="btn btn-warning btn-sm"><i class="bi bi-pencil-fill"></i>
                                                Edit</button> &nbsp;
                                            <button @click="showDeleteModal(category.id)" class="btn btn-danger btn-sm"><i
                                                    class="bi bi-trash-fill"></i> Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <div class="modal fade" id="addCategoryModal" tabindex="-1" role="dialog"
                                aria-labelledby="addCategoryModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="addCategoryModalLabel">Add Category</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="addCategory">

                                                <!-- Category input field -->
                                                <div class="form-group">
                                                    <label for="categoryName">Category Name</label>
                                                    <input type="text" class="form-control" id="categoryName"
                                                        v-model="newCategory.name" required>
                                                </div>

                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" @click="addCategory">Add
                                                Category</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal modal fade" id="editCategoryModal" tabindex="-1" role="dialog"
                                aria-labelledby="editModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="editModalLabel">Edit Article</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <form @submit.prevent="submitCategory">

                                                <!-- category input field -->
                                                <div class="form-group">
                                                    <label for="image">Category</label>
                                                    <input type="text" class="form-control" id="author"
                                                        v-model="category.name">
                                                </div>
                                            </form>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" @click="updateCategory">Save
                                                changes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="modal fade" id="deleteCategoryModal" tabindex="-1" role="dialog"
                                aria-labelledby="deleteCategoryModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="deleteCategoryModalLabel">Confirm Delete</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            Are you sure you want to delete this category?
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary"
                                                data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-danger"
                                                @click="confirmDelete">Delete</button>
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
import Footer from '../../components/Footer.vue';
import config from '../../config/config';

export default {
    components: {
        Dashnav,
        Footer,
    },
    data() {
        return {
            categories: [],
            category: {},
            alert: {
                show: false,
                message: '',
                type: 'success' // 'success' for success alert, 'danger' for error alert
            },
            newCategory: {
                name: ''
            }
        };
    },
    created() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('http://article-rm.free.nf/api/category');
                this.categories = response.data;

                this.$nextTick(() => {
                    let dataTableInstance = $('#category').DataTable();

                    if (dataTableInstance) {
                        dataTableInstance.destroy(); // destroy the existing datatable instance
                    }

                    $('#category').DataTable(); // reinitialize datatable
                });

            } catch (error) {
                console.error("Failed to fetch categories:", error.message);
            }
        },

        showAddCategoryModal() {
            $('#addCategoryModal').modal('show');
        },

        async addCategory() {
            let formData = new FormData();
            formData.append('name', this.newCategory.name);

            try {
                await axios.post('http://article-rm.free.nf/api/category', formData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                    }
                });

                // Set the alert to show the success message
                this.alert.message = '<i class="bi bi-check-lg"></i> Category added successfully!';
                this.alert.type = 'success';
                this.alert.show = true;

                // Optionally, hide the alert after a few seconds
                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);

                $('#category').DataTable().destroy();
                await this.fetchCategories();
                $('#addCategoryModal').modal('hide');

                // Reset newCategory data after adding
                this.newCategory.name = '';

            } catch (error) {
                console.error("Failed to add category:", error.message);
            }
        },

        showEditCategoryModal(category) {
            this.category = JSON.parse(JSON.stringify(category));
            $('#editCategoryModal').modal('show');
        },
        async updateCategory() {
            let formData = new FormData();
            formData.append('name', this.category.name);

            try {
                await axios.post(`http://article-rm.free.nf/api/category/${this.category.id}`, formData, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                    }
                });

                // Set the alert to show the success message
                this.alert.message = '<i class="bi bi-check-lg"></i> Category updated successfully!';
                this.alert.type = 'success';
                this.alert.show = true;

                // Optionally, hide the alert after a few seconds
                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);

                this.fetchCategories();
                $('#editCategoryModal').modal('hide');

            } catch (error) {
                console.error("Failed to update category:", error.message);
            }
        },
        async deleteCategory(categoryId) {
            try {
                await axios.delete(`http://article-rm.free.nf/api/category/${categoryId}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('user-token'),
                    }
                });

                // Set the alert to show the success message
                this.alert.message = '<i class="bi bi-x-lg"></i> Category deleted successfully!';
                this.alert.type = 'danger';
                this.alert.show = true;

                // Optionally, hide the alert after a few seconds
                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);

                // Remove the deleted category from the categories array
                this.categories = this.categories.filter(category => category.id !== categoryId);

            } catch (error) {
                console.error("Failed to delete category:", error.message);
                onsole.error("Error Response:", error.response);
                

                // Show an error alert
                this.alert.message = 'Failed to delete category!';
                this.alert.type = 'danger';
                this.alert.show = true;

                setTimeout(() => {
                    this.alert.show = false;
                }, 3000);
            }
        },

        showDeleteModal(categoryId) {
            this.categoryToDelete = categoryId;  // Save the ID of the category to delete
            $('#deleteCategoryModal').modal('show');  // Show the Bootstrap modal
        },

        async confirmDelete() {
            await this.deleteCategory(this.categoryToDelete);  // Delete the category
            this.categoryToDelete = null;  // Reset the ID after deletion
            $('#deleteCategoryModal').modal('hide');  // Hide the Bootstrap modal
        },
    }
}
</script>


<style></style>