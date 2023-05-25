
import requests from "./requset";

export const login = (userInfo) => requests({url: 'http://127.0.0.1:8000/api/login', method: 'post',  headers: {'Content-Type': 'application/json'}, data: userInfo})
export const car = () => requests({url: 'http://127.0.0.1:8000/api/car', method: 'GET'})
export const checkLoginState = () => requests({url: 'http://127.0.0.1:8000/api/checkLoginState', method: 'post', headers: {'authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json'}})
export const getParkingInfo = () => requests({url: 'http://127.0.0.1:8000/api/parking', method: 'GET'})
export const reservationOfParking = (parkingid) => requests({url: 'http://127.0.0.1:8000/api/changeParkingStatus', method:'post', headers: {'Content-Type': 'application/json'}, data: parkingid})
export const getUserInfo = () => requests({url: 'http://127.0.0.1:8000/api/userInfo', method: 'GET'})
export const editUserInfo = (userInfo) => requests({url: 'http://127.0.0.1:8000/api/editUserInfo', method: 'POST', headers: {'Content-Type': 'application/json'}, data: userInfo})
export const getSelfParking = (username) => requests({url: 'http://127.0.0.1:8000/api/selfParking', method: 'POST', headers: {'Content-Type': 'application/json'}, data: username}) 