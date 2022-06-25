import React from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import ProfilePage from '../profile-page'

const Profile = ({ location }) => {

    // if (!location) return <ErrorIndicator />
    return (
        <>
            <Header />
            <ProfilePage />
            <Footer />
        </>
    )
}

export default Profile;