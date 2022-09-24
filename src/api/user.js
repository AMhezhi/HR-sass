import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'POST',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '',
//     method: ''
//   })
// }

// export function logout() {
//   return request({
//     url: '',
//     method: ''
//   })
// }
