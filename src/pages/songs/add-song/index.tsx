import React, { useReducer, useState, useRef } from 'react'
import { generateClient } from 'aws-amplify/api';
import { uploadData } from 'aws-amplify/storage';

//APIs
import { createSong } from 'graphql/mutations';
//styles
import './index.css'
//types
import { IAction } from 'types'
import { CreateSongInput, Song } from 'API'

// Generate client for graphQL
const client = generateClient({ authMode: 'apiKey' });

const initialFormValues = {
    title: '',
    description: '',
    owner: '',
    filePath: '',
    like: 0
}

const addSongReducer = (state: CreateSongInput, action: IAction) => {
    switch (action.type) {
        case 'ADD_TITLE':
            return { ...state, title: action.value || '' }
        case 'ADD_DESCRIPTION':
            return { ...state, description: action.value || '' }
        case 'ADD_OWNER':
            return { ...state, owner: action.value || '' }
        default: return state
    }

}
const AddSong = ({ onSongAdded }: { onSongAdded: (newSong: Song) => void }) => {
    const formRef = useRef<HTMLFormElement>(null)
    const [addSongPayload, dispatch] = useReducer(addSongReducer, initialFormValues,)
    const [mp3Data, setMp3Data] = useState<File>()

    const addSong = async () => {
        if (!mp3Data) return

        try {
            const { key } = await uploadData({
                key: `song_${Date.now()}.mp3`,
                data: mp3Data,
                options: { contentType: 'audio/mp3' }

            }).result;


            const result = await client.graphql({
                query: createSong,
                variables: {
                    input: {
                        ...addSongPayload,
                        filePath: key
                    }
                }
            });


            formRef.current?.reset()
            setMp3Data(undefined)
            onSongAdded(result.data.createSong)
        } catch (error) {
            console.log('Error while creating new song' + JSON.stringify(error))
        }

    }

    return (
        <div className='add-song'>
            <form ref={formRef} onSubmit={(e) => {
                e.preventDefault()
                addSong()
            }}>
                <div className='input-container'>
                    <input type='text' placeholder='Add title' required onChange={e => dispatch({ type: 'ADD_TITLE', value: e.target.value })} />
                    <input type='text' placeholder='Add description' required onChange={e => dispatch({ type: 'ADD_DESCRIPTION', value: e.target.value })} />
                </div>
                <div className='input-container'>
                    <input type='text' placeholder='Add owner' required onChange={e => dispatch({ type: 'ADD_OWNER', value: e.target.value })} />
                    <input type='file' accept='audio/mp3' placeholder=' Add song file' required onChange={e => setMp3Data(e.target?.files![0])} />
                </div>
                <div className='button-container'>
                    <button className='add-song-button' type='submit'>Add Song</button>
                </div>
            </form>
        </div >
    )
}

export default AddSong