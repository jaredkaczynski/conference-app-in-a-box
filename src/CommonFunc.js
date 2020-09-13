import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as faStarO} from "@fortawesome/free-regular-svg-icons";
import React from "react";

export function getSelected(subscribed, id) {
    console.log(subscribed)
    console.log(id)
    if (subscribed.includes(id)) {
        return <FontAwesomeIcon icon={faStar}/>
    } else {
        return <FontAwesomeIcon icon={faStarO}/>
    }
}
