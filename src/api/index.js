import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.REACT_APP_SERVER_API,
})

export const INIT_LOCAL_API = axios.create({
    baseURL: process.env.REACT_APP_INIT_LOCAL_API,
})

export const INIT_API = axios.create({
    baseURL: process.env.REACT_APP_INIT_SERVER_API,
})

export const PAYME_API = axios.create({
    baseURL: process.env.REACT_APP_PAYME_SERVER_API,
})

export const CLICK_API = axios.create({
    baseURL: process.env.REACT_APP_CLICK_SERVER_API,
})

export const API_LOCAL = axios.create({
    baseURL: process.env.REACT_APP_LOCAL_API,
})

export const PAYME_API_LOCAL = axios.create({
    baseURL: process.env.REACT_APP_PAYME_LOCAL_API,
})

export const CLICK_API_LOCAL = axios.create({
    baseURL: process.env.REACT_APP_CLICK_LOCAL_API,
})
