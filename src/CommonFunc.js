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

Date.prototype.getMonthName = function () {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
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

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

export function getTimes() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    var result = [];
    for (var idx = 0; idx < 24 * 4; idx++) {
        var m = (((d.getMinutes() + 7.5) / 15 | 0) * 15) % 60;
        var h = ((((d.getMinutes() / 105) + .5) | 0) + d.getHours()) % 24;
        d = new Date(d.getYear(), d.getMonth(), d.getDay(), h, m, 0, 0);

        // if (idx > 0) result += ", ";
        result.push(("0" + h).slice(-2) + ":" + ("0" + m).slice(-2));

        d = addMinutes(d, 15);
    }
    return result
}