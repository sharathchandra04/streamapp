import React, { useRef, useState, useEffect, Fragment } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import Hls from 'hls.js';
// import 'videojs-http-source-selector';
import 'videojs-contrib-quality-levels';
import qualitySelector from "videojs-hls-quality-selector";
// import 'videojs-http-source-selector';

const LiveStreamingPlayer = ({ streamUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [player, setPlayer] = useState(undefined);
  useEffect(() => {
    console.log('1 --------------------')
    let player;
    if (videoRef.current) {
        console.log('2 --------------------')
        const videoElement = videoRef.current;
        player = videojs(videoElement, {
            liveui: true,
            plugins: {
                qualityLevels: {}
            },
            controlBar: {
              playToggle: true,
              volumePanel: {
                inline: false,
              },
              currentTimeDisplay: true,
              timeDivider: true,
              durationDisplay: true,
              fullscreenToggle: true,
              customControlSpacer: true,
            //   seekToLive: true, // Option to seek to live (if applicable)
            //   progressControl: false,
            },
          });
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
        hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
          console.log('Available levels:', hls.levels);
        });
        // Auto-refresh logic
        // const refreshInterval = setInterval(() => {
        //   hls.loadSource(streamUrl);
        //   hls.nextLevel = hls.currentLevel;
        //   hls.startLoad();
        // }, 5000); // Adjust the interval as needed
        // return () => {
        //   clearInterval(refreshInterval);
        //   hls.destroy();
        // };
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = streamUrl;
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play();
        });
      }
      console.log('3.0 --------------------')
    //   var player = videojs('some-player-id', {liveui: true});
    //   var p = videojs(videoElement, {
    //     liveui: true,
    //     preload: "auto",
    //     controls: true,
    //     poster: "",
    //     // sources: [
    //     //   {
    //     //     src: "http://localhost:8080/output/playlist.m3u8",
    //     //     type: "application/x-mpegURL",
    //     //     withCredentials: false
    //     //   }
    //     // ],
    //     plugins: {
    //         httpSourceSelector: {
    //             default: 'auto'
    //         },
    //         // httpSourceSelector: {
    //         //   default: 'auto',
    //         // },
    //         qualityLevels: {}
    //     },
    //     fluid: true,        
    //     html5: { 
    //         vhs: {
    //             overrideNative: true,
    //             //enableLowInitialPlaylist: true // see https://github.com/videojs/http-streaming
    //             //bandwidth: 10285391,
    //             limitRenditionByPlayerDimensions: false,
    //             smoothQualityChange: false,
    //             //experimentalBufferBasedABR: true,
    //             //handlePartialData: true
    //         },        
    //         nativeCaptions: false ,
    //         nativeAudioTracks: false,
    //         nativeVideoTracks: false
    //     }
    //   });
      player.hlsQualitySelector({
        displayCurrentQuality: true,
      });
      setPlayer(player);
    //   player.httpSourceSelector();
      console.log('3 --------------------')
    //   console.log(p.qualityLevels());
      var q = player.qualityLevels();
      console.log(q)
      console.log('4 --------------------')
    //   playerRef.current.hlsQualitySelector();

    // return () => {
    //     if (playerRef.current) {
    //       playerRef.current.dispose();
    //     }
    //   };
    }
  }, [streamUrl]);
  useEffect(() => {
    if (player) {
        player.hlsQualitySelector({ displayCurrentQuality: true });
    }
  }, [player]);
  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" controls preload="auto" />
    </div>

  );
};



// import React from 'react';
// import ReactDOM from 'react-dom';
// import LiveStreamingPlayer from './LiveStreamingPlayer';

const App = () => {
  const streamUrl = 'http://localhost:8080/output/playlist.m3u8'; // Replace with your actual HLS stream URL  
  return (
    <div>
      <h1>Live Streaming Example</h1>
      <LiveStreamingPlayer streamUrl={streamUrl} />
    </div>
  );
};
export default App;




















{/* <head>

<link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.11.4/video-js.min.css" rel="stylesheet" />

<!-- If you'd like to support IE8 (for Video.js versions prior to v7) -->
<!-- <script src="https://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script> -->
</head>

<body>
<div style="margin: 50px auto; max-width: 70%;">
    <video id="my-video" class="video-js">
        <source
            src="https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd"
            type="application/dash+xml">
    </video>
    <button id="setMinLevel" disabled>Set min quality level</button>
    <button id="setMaxLevel" disabled>Set max quality level</button>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/7.11.4/video.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-quality-levels/2.0.9/videojs-contrib-quality-levels.min.js"></script>

<script>
    var player = videojs('my-video', {
        controls: true,
        fluid: true,        
        html5: { 
            vhs: {
                overrideNative: true,
                //enableLowInitialPlaylist: true // see https://github.com/videojs/http-streaming
                //bandwidth: 10285391,
                limitRenditionByPlayerDimensions: false,
                smoothQualityChange: false,
                //experimentalBufferBasedABR: true,
                //handlePartialData: true
            },        
            nativeCaptions: false ,
            nativeAudioTracks: false,
            nativeVideoTracks: false
        }
           
    });

    let qualityLevels = player.qualityLevels();

</script>

</body> */}