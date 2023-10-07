<template>
  <el-dialog title="添加商品" v-model="dialogVisible" width="50%" @close="resetForm">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="商品图片" prop="fileList">
        <el-upload
          :action="`${uploadUrl}/api-file/files-anon?platform=wms`"
          list-type="picture-card"
          :with-credentials="true"
          :limit="1"
          :file-list="form.fileList"
          :before-upload="handleBeforeUpload"
          :on-success="handleUploadSuccess"
          :on-remove="handleUploadRemove"
          :on-exceed="handleUploadExceed"
          :on-error="handleUploadError"
          :on-preview="handleUploadPreview"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="form.productName" placeholder="请输入商品名称" autocomplete="off" />
      </el-form-item>
      <el-form-item label="商品规格" prop="collectionAttribute">
        <el-input
          v-model="form.collectionAttribute"
          placeholder="请输入规格名称，用；隔开"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="商品链接">
        <el-input
          v-model="form.purchaseUrl"
          placeholder="请输入商品链接"
          type="textarea"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { uploadUrl } from '@/utils/request'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const formRef: any = ref(null)
const form: any = reactive({
  productName: '',
  collectionAttribute: '',
  fileList: [],
  purchaseUrl: ''
})
const rules: any = reactive({
  productName: [
    {
      required: true,
      message: '商品名称不能为空',
      trigger: 'blur'
    }
  ],
  collectionAttribute: [
    {
      required: true,
      message: '商品规格不能为空',
      trigger: 'blur'
    }
  ],
  fileList: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        console.log(rule, value)
        if (form.fileList && form.fileList.length > 0) {
          callback()
        } else {
          callback(new Error('图片不能为空'))
        }
      },
      trigger: 'blur'
    }
  ]
})
const handleBeforeUpload = (file: any) => {
  const isLt10M = file.size / 10104 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10 M')
  }
  return isLt10M
}
const handleUploadSuccess = (res: any, file: any, fileList: any[]) => {
  //   console.log(res, file, fileList)
  form.fileList = fileList
  ElMessage.success('上传成功')
  form.imageUrl = res.path
  console.log(form.fileList, form.imageUrl)
}
const handleUploadRemove = (file: any, fileList: any[]) => {
  form.fileList = fileList
}
const handleUploadExceed = () => {
  ElMessage.error('最多可上传1个文件')
}
const handleUploadError = () => {
  ElMessage.error('上传失败')
}
const handleUploadPreview = (file: any) => {
  console.log(file)
  window.open(file.url)
}
const submit = () => {
  formRef.value.validate((valid: any) => {
    if (valid) {
      form.gid = Math.random()
      emit('addProduct', form)
      ElMessage.success('添加成功')
      dialogVisible.value = false
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    form.purchaseUrl = ''
    dialogVisible.value = false
  }
}

const emit = defineEmits(['addProduct'])
defineExpose({
  dialogVisible
})
defineOptions({ name: 'AddProduct.vue' })
</script>

<style lang="scss" scoped></style>
