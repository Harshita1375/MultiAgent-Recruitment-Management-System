import { useState } from "react";

function Profile({ user }) {
    const [profileData, setProfileData] = useState(null);

    return (
        <div>
            <h1>Welcome, {user ? user.name : "Guest"}!</h1>
            
            </div>
    );
}
export default Profile;    
