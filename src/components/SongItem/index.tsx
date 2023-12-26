import React from 'react'
import ReactPlayer from 'react-player'

//styles
import './index.css'
//types
import { Song } from 'API'

const SongItem = ({ song, isPlaying, songURL, onSongStateToggle }: { song: Song, isPlaying: boolean, songURL: string | undefined; onSongStateToggle: () => void }) => {
    return (
        <div className='song'>
            <div className="song-info">
                <p className='text'>{song.title}</p>
                <p className='text'>{song.description}</p>
                <p className='text'>{song.like}</p>
                <p className='text'>{song.owner}</p>
                <button className={`${!isPlaying ? 'success' : 'danger'}`} onClick={onSongStateToggle}>{isPlaying ? 'Close Player' : 'Open Player'}</button>
            </div >
            {isPlaying && <div className='player-container'>
                <ReactPlayer playing controls width='100%' height={50} url={songURL} />
            </div>}
        </div>
    )
}

export default SongItem