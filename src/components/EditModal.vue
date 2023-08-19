<template>
    <div class="modal" tabindex="-1" role="dialog" v-if="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Article</h5>
                    <button type="button" class="close" @click="closeModal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Your form fields go here -->
                    <input v-model="article.title" />
                    <!--... other fields ...-->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
                    <button type="button" class="btn btn-primary" @click="updateArticle">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['show', 'article'],
    methods: {
        closeModal() {
            this.$emit('close');
        },
        updateArticle() {
            // Your update logic here, then:
            this.closeModal();
        }
    }
}
</script>