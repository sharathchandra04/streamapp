import React, { useRef, useState, useEffect, Fragment } from "react";
import videojs from "video.js";
import _ from "videojs-contrib-quality-levels";
import qualitySelector from "videojs-hls-quality-selector";
import "video.js/dist/video-js.css";
// // those imports are important


import { useParams } from 'react-router-dom';

const VideoPlayerHLS = () => {
  const videoRef = useRef();
  const { id } = useParams();
  const [liveURL, setLink] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [player, setPlayer] = useState(undefined);
  const [callFinishVideoAPI, setCallFinishVideoAPI] = useState(false);
  const [vidDuration, setVidDuration] = useState(50000);
  const videoId = "e2280eeb-4cdb-43e7-a34f-36868326b8cb";
  const thumbnailURL = "https://vz-a2adf92d-b24.b-cdn.net/e2280eeb-4cdb-43e7-a34f-36868326b8cb/thumbnail.jpg";
//   const liveURL = "https://vz-b4f1e97e-483.b-cdn.net/65c65840-de66-4c27-afd0-a3b5a904b768/playlist.m3u8";
//   const liveURL = "http://localhost:8080/output/playlist.m3u8";
  
  const geturl = (mid) => {
    return `http://localhost:8080/output/playlist.m3u8`
    // return `http://localhost:8080/streams/${mid}/playlist.m3u8`
    // return `https://d1kjyiyoodsezf.cloudfront.net/${mid}/playlist.m3u8`
  }
  useEffect(() => {
    if (player) {
      const lurl = geturl(id);
      player.src({
        src: lurl,
        type: "application/x-mpegURL",
        withCredentials: false
      });
      player.poster("");
      setCallFinishVideoAPI(false);
      setVidDuration(50000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId, liveURL, thumbnailURL]);

  useEffect(() => {
    if (callFinishVideoAPI) {
      //finishesVideo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callFinishVideoAPI]);

//   useEffect(() => {
//     const videoJsOptions = {
//       autoplay: false,
//       preload: "auto",
//       controls: true,
//       poster: "",
//       sources: [
//         {
//           src: liveURL,
//           type: "application/x-mpegURL",
//           withCredentials: false
//         }
//       ],
//       html5: {
//         nativeAudioTracks: true,
//         nativeVideoTracks: true,
//         nativeTextTracks: true
//       }
//     };

//     const p = videojs(
//       videoRef.current,
//       videoJsOptions,
//       function onPlayerReady() {
//         // console.log('onPlayerReady');
//       }
//     );

//     setPlayer(p);
//     console.log(p.qualityLevels());

//     return () => {
//       if (player) player.dispose();
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
  const setupPlayer = (mid) => {
    const lurl = geturl(mid);
    const videoJsOptions = {
      liveui: true,
      autoplay: false,
      preload: "auto",
      controls: true,
      poster: "",
      sources: [
        {
          src: lurl,
          type: "application/x-mpegURL",
          withCredentials: false
        }
      ],
      html5: {
        nativeAudioTracks: true,
        nativeVideoTracks: true,
        nativeTextTracks: true
      }
    };
    const p = videojs(
      videoRef.current,
      videoJsOptions,
      function onPlayerReady() {
        // console.log('onPlayerReady');
      }
    );
    setPlayer(p);
    console.log(p.qualityLevels());
  }
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${id}`);
        const data = await response.json();
        console.log('data --> ', data)
        setMovie(data);
        const mid = data['id'];
        // setLink(`http://localhost:8080/streams/${mid}/playlist.m3u8`)
        setupPlayer(mid);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
    return () => {
        if (player) player.dispose();
    };
  }, [id]);

  useEffect(() => {
    if (player) {
      player.hlsQualitySelector({ displayCurrentQuality: true });
    }
  }, [player]);
  return (
    <div data-vjs-player>
      <video
        ref={videoRef}
        onLoadedMetadata={(e, px) => {
          // console.log(e.target.duration);
          setVidDuration(e.target.duration);
        }}
        onTimeUpdate={(e) => {
          if (e.target.currentTime >= vidDuration - 10) {
            setCallFinishVideoAPI(true);
          }
        }}
        className="vidPlayer video-js vjs-default-skin vjs-big-play-centered"
      ></video>
      {/* <ReactHlsPlayer
        // src="https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
        src="http://localhost:8080/output/playlist.m3u8"
        autoPlay={false}
        controls={true}
        width="100%"
        height="auto"
      /> */}
    </div>
  );
};

export default VideoPlayerHLS;