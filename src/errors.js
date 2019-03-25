import { toast } from 'react-toastify';

/**
* displays an error message on the bottom right of the page
* @param err the dict of the error which should be displayed
*/
export function handleFetch(err) {
    toast.error(err.message, {
        position: toast.POSITION.BOTTOM_RIGHT
    });
};

/**
* parses the json of a response and returns an error message if response is not ok
* @param {Promise} response the response of a fetch 
* @return correct json data or an error message
*/
export function parseJSON(response) {
    if(response.ok) {
        // Either successful request or invalid data
        return response.json();
    } else {
        // Internal Server Error
        return Promise.reject({
            message: response.statusText + ' ' + response.url.match(/https?:\/\/(.*?)(\/.*)/)[2],
        });
    };
}
