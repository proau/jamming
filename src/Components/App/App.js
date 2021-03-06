import React, { Component } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResult/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

export default class App extends Component {
  constructor(props){
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);    
    this.savePlaylist = this.savePlaylist.bind(this);  
    this.search = this.search.bind(this); 
    this.state = {
      searchResults : [],
      deepResults:[],
       playlistName : 'My playlist',
       playlistTracks:[]
    }
    /*
      {name:'name1',artist:'artist1',album:'album1',id:1},
      {name:'name2',artist:'artist2',album:'album2',id:2},
      {name:'name3',artist:'artist3',album:'album3',id:3},
      {name:'name4',artist:'artist4',album:'album4',id:4}
       
       {name:'name1',artist:'artist1',album:'album1',id:1},
       {name:'name2',artist:'artist2',album:'album2',id:2}
    */
  }

  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({
      playlistTracks:tracks
    })
  }

  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
     console.log(tracks)
    this.setState({
      playlistTracks:tracks
    })
  }

  updatePlaylistName(name){
    this.setState({playlistName:name})
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track =>track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackUris).then(()=>{
      this.setState({playlistName:'New Playlist',
      playlistTracks:[]
      })
    })
  }

  search(term){
    Spotify.search(term).then(searchResult => {
      this.setState({
        deepResults : searchResult
      })
      console.log(this.state.searchResult)
    })
  }

  render() {
    return (
      <div>
      <h1>Ja<span class="highlight">mmm</span>ing</h1>
      <div class="App">
        <SearchBar onSearch={this.search}/>
        <div class="App-playlist">
         <SearchResults searchResults={this.state.deepResults}
                        onAdd={this.addTrack}/>
         <Playlist playlistName = {this.state.playlistName} 
                    playlistTracks = {this.state.playlistTracks}
                    onRemove={this.removeTrack}
                    onNameChange = {this.updatePlaylistName}
                    onSave = {this.savePlaylist}/>
        </div>
      </div>
    </div>
    )
  }
}
