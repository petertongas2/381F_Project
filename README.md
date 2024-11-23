GP NO:43
Group Member:
Name:Tong Tsz Ho
ID:12591345
# Concert Management System

A web application for managing concert information with authentication using Facebook and GitHub OAuth.

## Features

- User Authentication
  - Facebook OAuth login
  - GitHub OAuth login
- Concert Management
  - Create new concerts
  - View concert listings
  - View detailed concert information
  - Edit existing concerts
  - Delete concerts
- MongoDB Integration
- Responsive Design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Facebook Developer account (for OAuth)
- GitHub Developer account (for OAuth)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - MongoDB connection string
   - Facebook OAuth credentials
   - GitHub OAuth credentials

## Configuration

Update the following configurations in `server.js`:

```javascript
// MongoDB Configuration
const mongourl = 'your-mongodb-connection-string';

// Facebook OAuth Configuration
passport.use(new FacebookStrategy({
  clientID: 'your-facebook-client-id',
  clientSecret: 'your-facebook-client-secret',
  callbackURL: 'your-callback-url'
}));

// GitHub OAuth Configuration
passport.use(new GitHubStrategy({
  clientID: 'your-github-client-id',
  clientSecret: 'your-github-client-secret',
  callbackURL: 'your-callback-url'
}));
```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at `http://localhost:8099`

## Project Structure

```
├── server.js          # Main application file
├── package.json       # Project dependencies
└── views/            # EJS templates
    ├── create.ejs    # Concert creation form
    ├── details.ejs   # Concert details view
    ├── edit.ejs      # Concert edit form
    ├── info.ejs      # Information messages
    ├── list.ejs      # Concert listing
    └── login.ejs     # Login page
```

## Dependencies

- express
- passport
- passport-facebook
- passport-github
- express-session
- express-formidable
- mongodb
- ejs

## Features in Detail

### Authentication
- Secure user authentication using Facebook and GitHub OAuth
- Session management for logged-in users
- Protected routes requiring authentication

### Concert Management
- Create concerts with title, date, location, and description
- View all concerts in a list format
- View detailed information for each concert
- Edit existing concert details
- Delete concerts with confirmation

### Error Handling
- Comprehensive error handling for database operations
- User-friendly error messages
- Proper HTTP status codes for different scenarios

## Security Features

- Session-based authentication
- OAuth 2.0 integration
- Protected routes
- Input validation
- Secure database operations

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
