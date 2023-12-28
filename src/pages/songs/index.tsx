import React, { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';

//Apis
import { listSongs } from 'graphql/queries';
//components
import SongItem from 'components/SongItem';
import AddEditSong from './add-edit-song';
//styles
import './index.css'
//types
import { Song } from 'API';



// Generate client for graphQL
const client = generateClient({ authMode: 'apiKey' });

const Songs = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [showAddSong, setShowAddSong] = useState(false)
    const [songToEdit, setSongToEdit] = useState<Song>()
    const [songIndex, setSongIndex] = useState(-1)
    const [songURL, setSongURL] = useState<string>()

    useEffect(() => {
        fetchSongs()
    }, [])


    const getAWSSongUrl = async (key: string, index: number) => {
        if (songIndex === index) {
            setSongIndex(-1)
            return setSongURL(undefined)
        }

        try {
            const result = await getUrl({
                key
            });
            setSongURL(result.url.toString())
            setSongIndex(songIndex === index ? -1 : index)
        } catch (error) {
            setSongURL(undefined)
            setSongIndex(-1)
            console.log('Erroe occured while fetching aws song url' + JSON.stringify(error))
        }

    }

    const fetchSongs = async () => {
        try {
            const songsData = await client.graphql({
                query: listSongs,
            });
            const songs = songsData.data.listSongs.items;
            setSongs(songs);
        } catch (err) {
            console.log('error fetching songs' + JSON.stringify(err));
        }
    }

    return (
        <div className='songs'>
            <div className='header'>
                <h2>Songs List</h2>
                <button className='add-new-song' onClick={() => {
                    setSongToEdit(undefined)
                    setShowAddSong(!showAddSong)
                }}>{showAddSong ? 'Close' : 'Add New Song'}</button>
            </div>
            {showAddSong && <AddEditSong
                songToEdit={songToEdit}
                onSongAdded={(song) => setSongs([...songs, song])}
                onSongUpdated={(song) => {
                    const newSongs = [...songs]
                    const index = newSongs.findIndex(s => s.id === song.id)
                    if (index > -1) {
                        newSongs[index] = song
                        setSongs(newSongs)
                    }
                    setShowAddSong(false)
                }} />}
            {songs.length === 0
                ? <p className='no-items-found'>No songs found.</p>
                : songs.map((song, index) =>
                    <SongItem
                        key={song.id}
                        song={song}
                        isPlaying={songIndex === index}
                        songURL={songURL}
                        onSongStateToggle={() =>
                            getAWSSongUrl(song.filePath, index)
                        }
                        onEditClick={(song) => {
                            setSongToEdit(song)
                            setShowAddSong(true)
                        }}
                    />
                )}
        </div>
    )
}

export default Songs
