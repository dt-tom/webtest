import './Feed.css';
import React, { useState, useEffect } from 'react';
import AWS from "aws-sdk";

function Feed() {
  const [feedElements, setFeedElements]= useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetch('https://apu15an183.execute-api.us-west-2.amazonaws.com/TestStage/PullFeedLambda', {
      mode: 'cors'})
      .then(response => response.json())
      .then(json => {
        // feedElements.push(json);
        if(!feedElements.includes(json))
        {
          setFeedElements(oldState => [...oldState, json]);
          console.log(feedElements);
        }
      })
      .catch(error => console.error(error));
    }, []);

    const uploadFile = async () => {
      const S3_BUCKET = "feed-ejoverse";
      const REGION = "us-west-2";

      console.log(file);

    
      AWS.config.update({

      });
      const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
      });
    
      const params = {
        Bucket: S3_BUCKET,
        Key: file.name,
        Body: file,
        ContentEncoding: 'base64'
      };
    
      var upload = s3
        .putObject(params)
        .on("httpUploadProgress", (evt) => {
          console.log(
            "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
          );
        })
        .promise();
    
      await upload.then((err, data) => {
        console.log(err);
        alert("File uploaded successfully.");
      });

      // call put feed lambda here
      // record url/key in database
    };

    // Function to handle file and store it to file state
  const handleFileChange = (e) => {
      // Uploaded file
      const file = e.target.files[0];
      // Changing file state
      setFile(file);
    };

  return (
    <div className='Feed'>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
      <div className='Element-container'> 
        <ul>{feedElements.map(feedElement => <li key={feedElement.uuid}>{Element(feedElement.username, feedElement.data)}</li>)}</ul>
      </div>
    </div>
  );
}

function Element(username, text) {
  console.log("username: " + username);
  return (
    <div className='element'>
      <img className='postimage' src='https://feed-ejoverse.s3.us-west-2.amazonaws.com/cowboy.png'></img>
      <div className='username'>{username}</div>
      <div className='text'>{text}</div>
    </div>
    
  )
}



export default Feed;

