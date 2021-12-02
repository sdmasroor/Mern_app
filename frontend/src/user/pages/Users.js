import React from 'react';

import UsersList from '../components/UsersList';


const Users = ()=>{
    const USERS = [
        {
            id:"u1",name:"sdmasroor", image:"https://th.bing.com/th/id/R.5ffeb9b88264485f1b265ff3c94e2dc2?rik=q1VHggJH5dpvmQ&riu=http%3a%2f%2fthewowstyle.com%2fwp-content%2fuploads%2f2015%2f01%2fnature-image.jpg&ehk=1zrBUw2Jkcik7R719ZPnOjG8MrGPNepNGF1KdErFfw4%3d&risl=&pid=ImgRaw&r=0",places:3
        },
        {
            id:"u2",name:"sdmasroor", 
            image:"https://th.bing.com/th/id/OIP.5TFdq1ah-13yRK4aqMqt8wHaFj?w=214&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
            places:3
        },
        {
            id:"u3",name:"sdmasroor", 
            image:"https://th.bing.com/th/id/OIP.OcdKodm_a3FiAYKlUAjFdgHaE8?w=240&h=180&c=7&r=0&o=5&dpr=2&pid=1.7",
            places:3
        }
    ];
return <UsersList items={USERS}/>
};

export default Users;