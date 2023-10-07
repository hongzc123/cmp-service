<template>
  <header
    class="tw-h-16 tw-flex tw-items-center tw-border-b tw-border-[var(--el-menu-border-color)] tw-px-5 tw-fixed tw-z-[110] tw-bg-white tw-w-full tw-top-0"
  >
    <div class="tw-flex-[2]">
      <img class="tw-w-32" :src="getRemoteImage('fw-logo.png')" />
    </div>
    <LayoutMenu />
    <div class="tw-flex-[2] tw-flex tw-justify-end tw-items-center">
      <div class="tw-mr-6">
        <DownloadFileList />
      </div>
      <el-dropdown>
        <div class="focus-visible:tw-outline-none tw-flex tw-items-center">
          <img class="tw-w-10 tw-h-10 tw-rounded-full" :src="userInfo.headImgUrl" />
          <!-- <span class="tw-px-2">{{ userInfo.username }}</span> -->
          <el-icon>
            <ArrowDown />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>修改密码</el-dropdown-item> -->
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { getRemoteImage } from '@/utils/util'
import LayoutMenu from './LayoutMenu.vue'
import DownloadFileList from '../DownloadFileList.vue'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
const data: any = store.userInfo.data
const userInfo = data.datas

defineOptions({ name: 'LayoutHeader.vue' })

const handleLogout = async () => {
  store.logout()
}
</script>

<style lang="scss" scoped></style>
