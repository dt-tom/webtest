import './Feed.css';
import React, { useState, useEffect } from 'react';
import AWS from "aws-sdk";
import { encodeBase32 } from 'geohashing';
import { useSearchParams } from "react-router-dom";

function Feed() {
  const [feedElements, setFeedElements]= useState([]);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("Empty");
  // eslint-disable-next-line no-unused-vars
  const [urlParams, _] = useSearchParams();

  console.log("here");
  console.log(urlParams.get("lat"));
  console.log(urlParams.get("long"));
  console.log(encodeBase32(urlParams.get("lat"), urlParams.get("long"), 5));

  const makeAPICall = async () => {
    fetch('https://apu15an183.execute-api.us-west-2.amazonaws.com/TestStage/PullFeedLambda', {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify({
        "location": encodeBase32(urlParams.get("lat"), urlParams.get("long"), 5),
      })})
      .then(response => response.json())
      .then(json => {
        console.log(json['resar'])
        json['resar'].forEach(element => {
          if(!feedElements.includes(element))
          {
            setFeedElements(oldState => [...oldState, JSON.parse(element)]);
          }
        });
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
      makeAPICall();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const uploadFile = async () => {
      const S3_BUCKET = "feed-ejoverse";
      const REGION = "us-west-2";

      let determinedKey = 'null';
      if(file && file.name)
      {
        determinedKey = `https://feed-ejoverse.s3.us-west-2.amazonaws.com/nyc/' + ${file.name}`;
      }

      let locLat = urlParams.get("lat");
      let locLong = urlParams.get("long");
      fetch('https://n7tskrvxfc.execute-api.us-west-2.amazonaws.com/PushStage/UploadToFeedLambda', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          "message": message,
          "image": determinedKey,
          "location": encodeBase32(locLat, locLong, 5),
          "username": "rodney",
          "date": Date.now()
        })})
        .then(response => response.json())
        .then(json => {
          console.log("here");
        })
        .catch(error => console.error(error));
    
      AWS.config.update({
        region: "us-west-2",
        credentials: new AWS.CognitoIdentityCredentials({
            IdentityPoolId: "us-west-2:2ed868fe-51e6-4417-b324-0f4586983d0d"
        })
      });
      const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
      });

      const params = {
        Bucket: S3_BUCKET,
        Key: determinedKey,
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

      await new Promise(r => setTimeout(r, 100));
      setFeedElements([]);
      makeAPICall();

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

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  }

  return (
    <div className='Feed'>
      <div className='headerSection'>
        Ejoverse Feed
      </div>
      <h3>
        {urlParams.get("lat")} | {urlParams.get("long")}
      </h3>
      <div className='feedSection'>
        <div className='wholeInput'>  
          <div className='messageSection'>
            <textarea className='messageInput' onChange={handleMessageChange} placeholder="what's on your mind..?"></textarea>
              <label htmlFor="file-upload" className="custom-file-upload">
                  Attach Image
              </label>
              <input id="file-upload" type="file" onChange={handleFileChange} />
              {/* <input id="file-upload" type="file"/> */}
          </div>
          <div className='post-buttonSection'>
            <button className='post-button' onClick={uploadFile}>Post</button>
          </div>
        </div>
      <div>

      </div>
        <div className='Element-container'> 
          <ul>{feedElements.map(feedElement => <li key={feedElement.uuid}>{Element(feedElement.username, feedElement.data, feedElement.imgUrl)}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}

function Element(username, text, imgUrl) {
  console.log("imgUrl: " + imgUrl);
  return (
    <div className='feedelement'>
      <div className='info'>
        <img alt="alt" className='userImage' src='https://feed-ejoverse.s3.us-west-2.amazonaws.com/cowboy.png'></img>
        <div alt="alt" className='username'>{username}</div>
      </div>
      <div className='message'>
        <div className='message-text'>{text}</div>
        {imgUrl !== 'null' ? <img className='postimage' alt='alt' src={imgUrl}></img> : <div></div> }
      </div>
    </div>
    
  )

  
}



export default Feed;

