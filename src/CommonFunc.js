import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as faStarO} from "@fortawesome/free-regular-svg-icons";
import React from "react";

export function getSelected(subscribed, id) {
    // console.log(subscribed)
    // console.log(id)
    if (subscribed.includes(id)) {
        return <FontAwesomeIcon icon={faStar}/>
    } else {
        return <FontAwesomeIcon icon={faStarO}/>
    }
}

export function getSelectedBool(subscribed, id) {
    // console.log(subscribed)
    // console.log(id)
    if (subscribed.includes(id)) {
        return true
    } else {
        return false
    }
}

export function getDatesBetweenDates(startDate, endDate) {
    var dateArray = [];
    //to avoid modifying the original date
    startDate = new Date(parseFloat(startDate * 1000));
    endDate = new Date(parseFloat(endDate * 1000));
    while (startDate <= endDate) {
        var tempDate = new Date(startDate)
        dateArray.push(tempDate.getMonth() + ' ' + tempDate.getDay());
        startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray
}