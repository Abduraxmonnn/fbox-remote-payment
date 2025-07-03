import axios from 'axios'

export const API = axios.create({
    baseURL: process.env.REACT_APP_SERVER_API,
})

export const DATA_LOCAL_API = axios.create({
	baseURL: process.env.REACT_APP_DATA_LOCAL_API,
})

export const DATA_API = axios.create({
	baseURL: process.env.REACT_APP_DATA_SERVER_API,
})

export const INIT_LOCAL_API = axios.create({
    baseURL: process.env.REACT_APP_INIT_LOCAL_API,
})

export const INIT_API = axios.create({
    baseURL: process.env.REACT_APP_INIT_SERVER_API,
})
