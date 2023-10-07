<template>
  <div>
    <div class="sku" v-for="(skuItem, skuIndex) in props.items" :key="skuIndex">
      <el-image
        v-show="skuItem.imageUrl"
        class="sku-left"
        :src="skuItem.imageUrl"
        :preview-src-list="[skuItem.imageUrl]"
        :initial-index="skuIndex"
        fit="cover"
        :z-index="9999"
        preview-teleported
      />
      <div class="sku-right">
        <div class="sku-title tw-line-clamp-2">
          {{ skuItem.productName }}
        </div>
        <div class="sku-attr single-line">
          {{ skuItem.collectionAttribute }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProductItem.vue' })

const props = defineProps<{
  items: any[]
}>()
</script>

<style lang="scss" scoped>
@import '../css/css.scss';
</style>
