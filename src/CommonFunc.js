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

Date.prototype.getMonthName = function() {
    var monthNames = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    return monthNames[this.getMonth()];
}

export function getDatesBetweenDates(startDate, endDate) {
    var dateArray = [];
    //to avoid modifying the original date
    startDate = new Date(parseFloat(startDate * 1000));
    endDate = new Date(parseFloat(endDate * 1000));
    while (startDate <= endDate) {
        var tempDate = new Date(startDate);
        dateArray.push(tempDate.getMonthName() + ' ' + tempDate.getDate());
        startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray
}