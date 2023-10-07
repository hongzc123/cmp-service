<template>
  <div class="tw-h-full tw-flex tw-items-center tw-justify-center tw-bg-no-repeat tw-bg-center tw-bg-cover"
    :style="`background-image: url(${getRemoteImage('login-bg.jpg')})`">
    <el-card class="tw-p-5 tw-w-1/3 tw-pb-0">
      <h1 class="tw-mb-8 tw-text-center tw-text-2xl tw-font-bold">CMpanda服务平台</h1>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item class="!tw-mb-6" label="用户名" prop="username">
          <el-input class="tw-h-10" v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item class="!tw-mb-6" label="密码" prop="password">
          <el-input class="tw-h-10" v-model="form.password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="!tw-h-12 !tw-w-2/3 !tw-rounded-full" :loading="store.loading" @click="handleSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '@/stores/app';
import { getRemoteImage } from '@/utils/util';
import { reactive, ref } from 'vue';

defineOptions({ name: 'LoginIndex.vue' })

const store = useAppStore()

const formRef = ref<any>(null)
const rules = ref<any>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '长度至少 3 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 10, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ]
})
const form = reactive({})

const handleSubmit = async () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    store.login(form)
  })
}
</script>

<style lang="scss" scoped></style>
