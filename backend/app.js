// Import required libraries
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
  PutCommand,
  DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

// Constants
const REGION = 'us-east-1';
const TABLE_NAME = 'crud-dynamodb-table';
const BUCKET_NAME = 'crud-app-image-12345';

// AWS Clients
const s3 = new S3Client({ region: REGION });
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

// Express setup
const app = express();
app.use(cors());
app.use(express.json());

// Multer-S3 setup
const upload = multer({
  storage: multerS3({
    s3,
    bucket: BUCKET_NAME,
    metadata: (req, file, cb) => cb(null, { fieldName: file.fieldname }),
    key: (req, file, cb) => cb(null, `uploads/${Date.now()}-${file.originalname}`),
  }),
});

// Utility functions
const handleError = (res, message, error) => {
  console.error(message, error);
  res.status(500).json({ message, error: error?.message });
};

const deleteS3Image = async (imageKey) => {
  if (!imageKey) return;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: imageKey }));
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw new Error('Image deletion failed');
  }
};

// Routes
app.get('/name', (req, res) => res.send('Hello Biswajit'));

app.get('/', async (req, res) => {
  try {
    const { Items } = await ddbDocClient.send(new ScanCommand({ TableName: TABLE_NAME }));
    res.status(200).json(Items || []);
  } catch (error) {
    handleError(res, 'Failed to fetch data', error);
  }
});

app.post('/user', upload.single('image'), async (req, res) => {
  const { name } = req.body;
  const imageKey = req.file?.key;
  if (!name || !imageKey) return res.status(400).json({ message: 'Name and image are required' });

  const newItem = { id: `user-${Date.now()}`, name, image: imageKey };
  try {
    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: newItem }));
    res.status(201).json({ message: 'User added successfully', user: newItem });
  } catch (error) {
    handleError(res, 'Failed to add user', error);
  }
});

app.get('/user/:id', async (req, res) => {
  try {
    const { Item } = await ddbDocClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: req.params.id } }));
    if (!Item) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(Item);
  } catch (error) {
    handleError(res, 'Failed to retrieve user', error);
  }
});

app.put('/user/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const newImageKey = req.file?.key;

  try {
    const { Item: existingItem } = await ddbDocClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id } }));
    if (!existingItem) return res.status(404).json({ message: 'User not found' });

    if (newImageKey && existingItem.image) {
      await deleteS3Image(existingItem.image);
    }

    const updatedItem = {
      ...existingItem,
      name: name || existingItem.name,
      image: newImageKey || existingItem.image,
    };

    await ddbDocClient.send(new PutCommand({ TableName: TABLE_NAME, Item: updatedItem }));
    res.status(200).json({ message: 'User updated successfully', user: updatedItem });
  } catch (error) {
    handleError(res, 'Failed to update user', error);
  }
});

app.delete('/user/:id', async (req, res) => {
  try {
    const { Item } = await ddbDocClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { id: req.params.id } }));
    if (!Item) return res.status(404).json({ message: 'User not found' });

    await deleteS3Image(Item.image);
    await ddbDocClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: req.params.id } }));
    res.status(200).json({ message: `User with ID ${req.params.id} deleted successfully` });
  } catch (error) {
    handleError(res, 'Failed to delete user', error);
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;