const API_KEY = 'AIzaSyB4PSX3Wrr3iThJmpYfFljtAGQllIsZBqY';
                // 'AIzaSyDx-6bU4qukzRXOQE-nOSfkF9yKUvX5XM0'
import fetch from 'node-fetch';
async function getVideoCategory(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data)
    if (data.items.length === 0) {
      throw new Error('Video not found');
    }

    const category = data.items[0].snippet.categoryId;
	console.log(data.items[0].snippet)
    return category;
  } catch (error) {
    console.error('Error fetching video category:', error.message);
  }
}


function extractVideoId(url) {
  // Regular expression to match YouTube video URLs
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null; // URL doesn't match the expected format
  }
}

const youtubeUrl = 'https://www.youtube.com/watch?v=kBMv3E2KS7s';
const videoId = extractVideoId(youtubeUrl);

const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
getVideoCategory(apiUrl)
  .then((category) => {
    console.log('Video category:', category);
  })
  .catch((error) => {
    console.error('Error:', error);
  });


if (videoId) {
  console.log('YouTube Video ID:', videoId);
} else {
  console.error('Invalid YouTube URL');
}

cat_map = {
	1: "Film & Animation"
	2: "Autos & Vehicles"
	10: "Music"
	15: "Pets & Animals"
	17: "Sports"
	18: "Short Movies"
	19: "Travel & Events"
	20: "Gaming"
	21: "Videoblogging"
	22: "People & Blogs"
	23: "Comedy"
	24: "Entertainment"
	25: "News & Politics"
	26: "Howto & Style"
	27: "Education"
	28: "Science & Technology"
	29: "Nonprofits & Activism"
	30: "Movies"
	31: "Anime/Animation"
	32: "Action/Adventure"
	33: "Classics"
	34: "Comedy"
	35: "Documentary"
	36: "Drama"
	37: "Family"
	38: "Foreign"
	39: "Horror"
	40: "Sci-Fi/Fantasy"
	41: "Thriller"
	42: "Shorts"
	43: "Shows"
	44: "Trailers"
};
