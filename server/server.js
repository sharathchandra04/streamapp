
import express from 'express'
import cors from 'cors'
import fsPromises from 'fs/promises'
import fs from 'fs'
// const path = require('path');
import path from 'path';
const app = express()
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors())
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));


// app.get('/api/:id', async (req, res) => {
//   const rangeHeader = req.headers.range
//   console.log('rangeHeader --> ', rangeHeader)
//   // check req header if it contains a rage attr
//   if (!rangeHeader) throw new Error('Requires Range header')
  
//   // get file stat with fs module to access size
//   const videoPath = `./videos/video.mp4`
//   const fileData = await fsPromises.stat(videoPath)
//     const videoSize = fileData.size
    
//     // split the range header
//     const splittedRange = rangeHeader.replace(/bytes=/, '').split('-')
    
//     // get the starting byte from req header's range
//     const start = parseInt(splittedRange[0])
    
//     // decide the end byte considering chunk size
//     const end = splittedRange[1] ? parseInt(splittedRange[1], 10) : videoSize - 1
    
    
//     // calculate content length
//     const contentLength = end - start + 1
    
//     // create and set response headers
//     const headers = {
//       "Content-Range": `bytes ${start}-${end}/${videoSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": contentLength,
//       "Content-Type": "video/mp4",
//     }
//     const videoStream = fs.createReadStream(videoPath, { start, end })
    
//     res.writeHead(206, headers)
//     videoStream.pipe(res)
// })

const movies = [
    { id: 1, title: 'Movie 1', poster: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Movie 2', poster: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Movie 3', poster: 'https://via.placeholder.com/150' },
  { id: 4, title: 'Movie 4', poster: 'https://via.placeholder.com/150' },
  { id: 5, title: 'Movie 5', poster: 'https://via.placeholder.com/150' },
  { id: 6, title: 'Movie 6', poster: 'https://via.placeholder.com/150' },
  { id: 7, title: 'Movie 7', poster: 'https://via.placeholder.com/150' },
  { id: 8, title: 'Movie 8', poster: 'https://via.placeholder.com/150' },
  { id: 9, title: 'Movie 9', poster: 'https://via.placeholder.com/150' },
  { id: 10, title: 'Movie 10', poster: 'https://via.placeholder.com/150' },
  // Add more movies as needed
];

// Endpoint to get paginated movies
app.get('/api/movies', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const resultMovies = movies.slice(startIndex, endIndex);
  
  res.json({
    page,
    limit,
    total: movies.length,
    movies: resultMovies
  });
});

app.get('/api/movies/:id', (req, res) => {
  const movieId = parseInt(req.params.id);
  const movie = movies.find(movie => movie.id === movieId);
  if (!movie) {
    return res.status(404).json({ error: 'Movie not found' });
  }
  res.json(movie);
})

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app




