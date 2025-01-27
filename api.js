import {$api} from "./instance.js";


export const fetchPosts = async () => {
  return await $api.get('/posts')
}


export const fetchComments = async () => {
  return await $api.get('/comments')
}

export const fetchEmployees = async () => {
  return await $api.get('/profile')
}
