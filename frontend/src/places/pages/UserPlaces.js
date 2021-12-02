import React from "react";
import {useParams} from 'react-router-dom';
import PlaceList from "../components/PlaceList";

const Dummy_Places = [
    {
    id:"1",
    title:"Hushroo",
    description:"Test React ",
    imageUrl:"https://www.bing.com/th?id=OIP._h7s27M_cYLoJ7SzE7XRZQHaEK&w=200&h=119&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2",
    address:"Hushroo Chadoora Budgam",
    location: {
        lat:40.7484405,
        lng:-73.9878584
    },
    creator:"u1"
},
{
    id:"2",
    title:"Hushroo",
    description:"Test React ",
    imageUrl:"https://www.bing.com/th?id=OIP.QW_dPaKSU-NMlBMMgFkpQgHaE9&w=200&h=141&c=8&rs=1&qlt=90&o=6&dpr=2&pid=3.1&rm=2",
    address:"Hushroo Chadoora Budgam",
    location: {
        lat:40.7484405,
        lng:-73.9878584
    },
    creator:"u2"
}
];
const UserPlaces = ()=>{
    const userId = useParams().userId;
    const loadedPlaces = Dummy_Places.filter(place=>place.creator === userId);
    return <PlaceList items={loadedPlaces} />;
}

export default UserPlaces;