import express from 'express';

const app = express();

app.use(express.json());

app.get<{}, { message: string }>('/', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
});
