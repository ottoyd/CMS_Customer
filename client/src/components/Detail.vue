<template>
  <div id="modal1" class="modal">
    <div class="modal-content">
      <h4>Modal Header</h4>
      <p>A bunch of text</p>
    </div>
    <div class="modal-footer">
      <a class="modal-close waves-effect waves-green btn-flat">Agree</a>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.modal{
  max-width: 500px;
  padding: 80px;
}
.exit {
  position: absolute;
  top: 8px;
  right: 16px;
  font-size: 18px;
}
</style>
