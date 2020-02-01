import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchTube } from '../../store/actions/youtubeAction';

import SearchBar from './SearchBar';
import List from './List';
import Detail from './Detail'
import _ from 'lodash';

class YoutubePage extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedVideo: null};
    
  }

  componentDidMount() {
    this.search('softuni react') 
  }

  search = (term) => {
     this.props.fetchTube(term)
  }

  onVideoSelect = (selectedVideo) => {
    this.setState({selectedVideo})
  }

  render() {
   
    return (
      <div className="container-fluid youtube">
        <div className="row">
          <div className="col s12">
            <SearchBar onSearchTerm={this.search} />
          </div>
        </div>
        <div className="row">
          <div className="col s12 m8">
            <Detail video={this.state.selectedVideo} />
          </div>
          <div className="col s12 m4">
            <List
              videos={this.props.videos}
              onVideoSelect={(selectedVideo) => { this.onVideoSelect(selectedVideo)}} 
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
console.log(state)
  return {videos: state.videos, selectedVideo: state.videos[0],};
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({fetchTube}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(YoutubePage);
