import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Get method
 * @param url
 * @returns {Promise<R>}
 */
const get = async (url, request) => {

    return new Promise((resolve, reject) => {

        fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json())
            .then((result) => {
                // console.log(`${request}-response: `, result)
                if (result) {
                    resolve(result);
                } else {
                    reject(result)
                }
            }).catch((error) => {
                console.log(`${request}-error`, error)
                reject(error);
                return error;
            });
    });
};

/**
 * Post method
 * @param url
 * @param data
 * @param method
 * @returns {Promise<R>}
 */


const post = async (url, dataStr, request = '', bearer, method = 'POST', isJson = true) => {
    let authHeader = bearer

    return new Promise((resolve, reject) => {

        fetch(url, {
            method: method,
            headers: {
                Accept: 'application/json',
                Authorization: authHeader ? `Bearer ${authHeader}` : "",
                'Content-Type': contentType,
            },
            body: dataStr,
            json: isJson
        }).then((res) => res.json())
            .then((result) => {
                console.log(`${request} response:`, result)
                if (result) {
                    resolve(result);
                } else {
                    reject(result?.message)
                }
            }).catch((error) => {
                console.log(`${request}-error`, error)
                reject(error);
            });
    });
};


export default {
    get,
    post,
};
