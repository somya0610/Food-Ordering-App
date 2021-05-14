import {
  GET_RESTAURANT_URL,
  GET_RESTAURANT_BY_NAME_URL,
  GET_RESTAURANT_BY_ID_URL
} from "../common";

/** Functional component to retrieve all restaurants */
export function getRestaurant() {
  return new Promise(function (resolve, reject) {
    fetch(GET_RESTAURANT_URL)
      .then(resp => {
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

/** Functional component to retrieve all restaurants for the given name */
export function getRestaurantByName(restaurantName) {
  return new Promise(function (resolve, reject) {
    fetch(`${GET_RESTAURANT_BY_NAME_URL}${restaurantName}`)
      .then(resp => {
        resp.json().then(res => {
          return resolve(res);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}

/** Functional component to retrieve the restaurant for the given restaurant UUID */
export function getRestaurantById(restaurantID) {
  return new Promise(function (resolve, reject) {
    fetch(`${GET_RESTAURANT_BY_ID_URL}${restaurantID}`)
      .then(resp => {
        resp.json().then(res => {
          if (resp.status === 200) {
            return resolve(res);
          } else {
            reject(res);
          }
        });
      })
      .catch(error => {
        reject(error);
      });
  });
}