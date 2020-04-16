import React from 'react'
import { connect } from 'react-redux'
import { storage } from '../../firebase/index'

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filenames: [],
            downloadURLs: [],
        };
    }


    handleChange = e => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            this.setState(() => ({ image }));
        }
    };

    handleUpload = () => {
        const { image } = this.state;
        const { profile } = this.props
        const filename = profile.firstName + "_" + image.name;
        const uploadTask = storage.ref(`UploadedFiles/${filename}`).put(image);
        uploadTask.on(
            "state_changed",
            snapshot => {
                // progress function ...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                this.setState({ progress });
            },
            error => {
                // Error function ...
                console.log(error);
            },
            () => {
                // complete function ...
                storage
                    .ref("UploadedFiles")
                    .child(filename)
                    .getDownloadURL()
                    .then(url => {
                        this.setState({ url });
                    });
            }
        );
    };

    render() {
        return (
            <div>
                <div className="card-action">
             <h1 class="header center orange-text">My Profile</h1>
            <p> <span >Username: </span>{this.props.profile.firstName} </p>
            <p> <span >Last Name: </span>{this.props.profile.lastName} </p>
            <p> <span>Email: </span>{this.props.profile.email} </p>
            <p> <span>City: </span>{this.props.profile.city} </p>
            <p> <span>Telephone number: </span>{this.props.profile.telephone} </p>
        </div>
                <div className="center">
                    <br />
                    <h2 className="green-text">Soilview File Uploader</h2>
                    <br />
                    <br />
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>File</span>
                            <input type="file" onChange={this.handleChange} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>
                    <button onClick={this.handleUpload} className="waves-effect waves-light btn" > Upload  </button>
                    <br />
                    <br />
                    <img src={this.state.url || "https://via.placeholder.com/400x300"}
                        alt="Uploaded Images"
                        height="300"
                        width="400"
                    />
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

export default connect(mapStateToProps)(Profile)