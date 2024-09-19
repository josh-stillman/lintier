import express from 'express';

const app = express();

app.use(express.json());

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
app.get<{}, { message: string }>('/', (req, res) => {
  res.json({
    message: 'hello world',
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
