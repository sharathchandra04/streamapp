// src/MovieGrid.js
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  const fetchMovies = async (page) => {
    const response = await fetch(`/api/movies?page=${page}&limit=5`);
    const data = await response.json();
    console.log(data.movies)
    setMovies(data.movies);
    setTotalPages(Math.ceil(data.total / data.limit));
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div>
      <Grid container spacing={4} style={{ padding: '24px' }}>
        {movies.map(movie => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardMedia
                component="img"
                alt={movie.title}
                height="300"
                image={movie.poster}
                title={movie.title}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {movie.title}
                </Typography>
                <Button
                  component={Link}
                  to={`/play/${movie.id}`}
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginTop: '10px' }}
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={handlePreviousPage} disabled={page === 1}>Previous</Button>
        <Typography variant="h6" style={{ margin: '0 10px' }}>{page} / {totalPages}</Typography>
        <Button onClick={handleNextPage} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
};

export default MovieGrid;
