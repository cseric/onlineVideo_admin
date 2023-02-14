import request from '@/utils/request'

/**
 * 管理员登录API
 * @param username
 * @param password
 * @returns {Promise<AxiosResponse<any>>}
 */
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/admin/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

/**
 * 管理员修改密码API
 * @param old_password
 * @param new_password
 * @param re_password
 * @returns {Promise<AxiosResponse<any>>}
 */
// eslint-disable-next-line camelcase
export const updatePassAPI = ({ old_password, new_password, re_password }) => {
  return request({
    url: '/admin/update_pass',
    method: 'put',
    data: {
      old_password,
      new_password,
      re_password
    }
  })
}

export const getTotalDataAPI = () => {
  return request({
    url: '/admin/total_data',
    method: 'get'
  })
}

/**
 * 获取管理员列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAdminListAPI = ({ page, pageSize }) => {
  return request({
    url: '/admin/admin_list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 添加管理员
 * @param username
 * @param password
 * @param authority
 * @returns {Promise<AxiosResponse<any>>}
 */
export const addAdminAPI = ({ username, password, authority }) => {
  return request({
    url: '/admin/admin_add',
    method: 'post',
    data: {
      username,
      password,
      authority: parseInt(authority)
    }
  })
}

/**
 * 修改管理员
 * @param id
 * @param authority
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateAdminAPI = ({ id, authority }) => {
  return request({
    url: '/admin/admin_update',
    method: 'put',
    data: {
      id,
      authority: parseInt(authority)
    }
  })
}

export const deleteAdminAPI = id => {
  return request({
    url: '/admin/admin_delete',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 管理员获取用户列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getUserListAPI = ({ page, pageSize }) => {
  return request({
    url: '/admin/user_list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员搜索用户
 * @param keyword
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchUserAPI = ({ keyword, page, pageSize }) => {
  return request({
    url: '/admin/user_search',
    method: 'get',
    params: {
      keyword,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员删除用户
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteUserAPI = id => {
  return request({
    url: '/admin/user_delete',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 管理员获取视频列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getVideoListAPI = ({ page, pageSize }) => {
  return request({
    url: '/admin/video_list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员搜索视频
 * @param keyword
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchVideoAPI = ({ keyword, page, pageSize }) => {
  return request({
    url: '/admin/video_search',
    method: 'get',
    params: {
      keyword,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员删除视频
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteVideoAPI = id => {
  return request({
    url: '/admin/video_delete',
    method: 'delete',
    data: {
      id
    }
  })
}

/**
 * 管理员获取审核视频列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAuditVideoListAPI = ({ page, pageSize }) => {
  return request({
    url: '/admin/audit_list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员审核视频通过
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const AuditPassAPI = id => {
  return request({
    url: '/admin/audit_pass',
    method: 'put',
    data: {
      id
    }
  })
}

/**
 * 管理员审核视频不通过
 * @param id
 * @param remark
 * @returns {Promise<AxiosResponse<any>>}
 * @constructor
 */
export const AuditFailAPI = ({ id, remark }) => {
  return request({
    url: '/admin/audit_fail',
    method: 'put',
    data: {
      id,
      remark
    }
  })
}

/**
 * 管理员获取评论列表
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCommentList = ({ page, pageSize }) => {
  return request({
    url: '/admin/comment_list',
    method: 'get',
    params: {
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员搜索评论
 * @param keyword
 * @param page
 * @param pageSize
 * @returns {Promise<AxiosResponse<any>>}
 */
export const searchCommentAPI = ({ keyword, page, pageSize }) => {
  return request({
    url: '/admin/comment_search',
    method: 'get',
    params: {
      keyword,
      page,
      page_size: pageSize
    }
  })
}

/**
 * 管理员删除评论
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteCommentAPI = id => {
  return request({
    url: '/admin/comment_delete',
    method: 'delete',
    data: {
      id
    }
  })
}
