/*
 * @Author: coderzhaolu && izhaicy@163.com
 * @Date: 2022-07-23 11:01:04
 * @LastEditors: coderzhaolu && izhaicy@163.com
 * @LastEditTime: 2022-08-28 16:05:50
 * @FilePath: /pinkmoe_index/hooks/slideAuthor.ts
 * @Description: https://github.com/Coder-ZhaoLu/pinkmoe   (如需用于商业用途或者二开，请联系作者捐助任意金额即可)
 * QQ:2419857357;支付宝:13135986153
 * Copyright (c) 2022 by coderzhaolu, All Rights Reserved.
 */
import { useUserStore } from '/@/store/modules/user'
import type { ReqFollowStatus } from '/@/api/follow/types'
import { createFollow, deleteFollow, followStatus } from '/@/api/follow'
import { useUtil } from './util'

export const useSlideAuthor = (props) => {
  const status = ref<boolean>(false)
  const auth = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance()
  const { getLevel } = useUtil()
  const lev = getLevel(props.author?.exp)

  const formParams: ReqFollowStatus = reactive({
    toUid: props.author?.uuid as string,
  })

  const getFollowStatus = async () => {
    if (auth.isLogin)
      status.value = await followStatus(formParams)
  }

  const follow = async () => {
    if (!auth.isLogin) {
      proxy.$login({
        type: 'login',
        router,
        route,
      })
    }
    else {
      proxy.$message({
        successMsg: '取消关注成功',
        failedMsg: '取消关注失败',
        loadFun: async () => {
          const { code, message } = await deleteFollow(formParams)
          return { code, message }
        },
      }).then(async (res) => {
        if (res === 200)
          await getFollowStatus()
      })
    }
  }

  const unFollow = async () => {
    if (!auth.isLogin) {
      proxy.$login({
        type: 'login',
        router,
        route,
      })
    }
    else {
      proxy.$message({
        successMsg: '关注成功',
        failedMsg: '关注失败',
        loadFun: async () => {
          const { code, message } = await createFollow(formParams)
          return { code, message }
        },
      }).then(async (res) => {
        if (res === 200)
          await getFollowStatus()
      })
    }
  }

  const jump = () => {
    if (!auth.isLogin) {
      proxy.$login({
        type: 'login',
        router,
        route,
      })
    }
    else {
      router.push({
        path: '/user-center/im',
        query: { sendId: props.author?.uuid },
      })
    }
  }

  onMounted(() => {
    getFollowStatus()
  })

  return {
    jump,
    unFollow,
    follow,
    lev,
    status,
  }
}
