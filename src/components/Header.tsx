import React from 'react'

const Header = ({ onSignOutClick }: { onSignOutClick: () => void }) => {
    return (
        <header>
            <h2>SongsNation</h2>
            <h3>
                Hey, Welcome!
            </h3>
            <button onClick={onSignOutClick}>Sign out</button>
        </header>
    )
}

export default Header