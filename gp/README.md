# Project name: Concert query system
A web application for querying concert information with user authentication. Only logged-in users can perform modify operations such as adding, editing, or deleting concerts.
## GP NO:43
- Group Member:
  - Name: Tong Tsz Ho, SID:12591345
  - Name: Ma Kam Chiu, SID:13687015
  - Name: Lee Chak Fung Bond, SID:13173016
  - Name: Liu Yan Zuo , SID: 12727610
## Project Structure:
```
├── public/
│   ├── images/
│   │   └── noimage.jpg
│   ├── uploads/
│   │   ├── upload_10...jpg
│   │   ├── upload_47...jpg
│   │   ├── upload_72...jpg
│   │   ├── upload_77...jpg
│   │   ├── upload_85...jpg
│   │   ├── upload_cf...jpg
│   │   ├── upload_d0...jpg
│   │   └── upload_e4...jpg
│   └── style.css
├── test_images/
│   └── test_concert.jpg
├── views/
│   ├── create.ejs                  
│   ├── details.ejs                 
│   ├── edit.ejs                  
│   ├── home.ejs                
│   ├── info.ejs               
│   ├── list.ejs                
│   ├── login.ejs                 
│   ├── profile.ejs               
│   ├── register.ejs               
│   └── reset-password.ejs         
├── -F
├── -b
├── FETCH_HEAD
├── README.md
├── cookies.txt
├── package-lock.json
├── package.json
└── server.js
```
## Project file instruction:
- server.js:
  Implements server-side logic, including user authentication, routing, and handling RESTful API requests for CRUD operations.And Defines the MongoDB data schemas and models for concerts and users.
  
- package.json:
  Contains the project dependencies, scripts, and metadata.
  
- public:
  Includes static files such as CSS, images, and JavaScript assets (if applicable).
  
- create.ejs:
  For creating new concerts entries.
  
- details.ejs:
  For displaying detailed information about a specific concert.
  
- edit.ejs:
  For editing existing concert data.
  
- home.ejs:
  For the home page of the application.
  
- info.ejs:
  For dynamically adjust its content and display relevant system messages based on the user's verification status.
  
- list.ejs:
  For presenting a concert listing. It includes search and sorting capabilities, a navigation bar, and the ability to bookmark concerts and view concert details.
  
- login.ejs:
  For the login page(login in local or facebook, github login only for localhost).

- profile.ejs:
  For displaying user profiles and display favorite concert.

- register.ejs:
  For user registration.

- reset-password.ejs:
  For resetting user passwords.
  
## Project features instruction:

### User Authentication:
- Users must log in to access and use the system.
- Unauthorized users cannot perform CRUD operations.
- Authentication is implemented using cookie-session or a similar method(facebook).

### Concert Management (CRUD Functionality)
- Create:
Users can add new concert records by filling out a form with details such as title, date, time, location, description, artist, and ticket fee.

- Read:
Users can view a list of concerts and use advanced query filters to search by conditions like artist, date, or location.

- Update:
Logged-in users can edit concert information directly through the UI.

- Delete:
Users can delete specific concert entries, which are removed from the database.

### Favorites System
Logged-in users can mark concerts as favorites for quick access.

### Responsive User Interface
Web pages built with EJS templates for consistent and dynamic rendering.

### RESTful API Services
Exposes CRUD operations as RESTful APIs to allow testing and third-party integrations.

### Cloud Hosting
The application is deployed on Azure for easy accessibility.

### Logout Functionality
Users can securely log out of the system, clearing their session and preventing unauthorized access.

## The cloud-based server URL for testing:
- https://381fproject-gp43-app-amgvb2a8dthfg9a8.eastus-01.azurewebsites.net/
## Operation guides
### user flow
-  Login: Authenticate using valid credentials.Can Login by Username, Password / Facebook / github(local)

![image](https://github.com/user-attachments/assets/62b162d1-4f57-4024-a4c6-e9263b346927)
![image](https://github.com/user-attachments/assets/ec4b0dd6-e88c-4a64-b93f-d20fa313bb22)

![image](https://github.com/user-attachments/assets/39f32170-9826-464f-97fc-a22556e8c766)
![image](https://github.com/user-attachments/assets/2fa90dd0-8f4c-4483-a8e2-204b6c7164e7)
![image](https://github.com/user-attachments/assets/7cb2b06b-9661-4743-8234-0d4a8b952ee6)

-  Add New Concert: Create a new concert record via the "新增演唱會" button.

![image](https://github.com/user-attachments/assets/044ebc7e-4300-47ed-92b4-6a43a4130a66)
![image](https://github.com/user-attachments/assets/a123b619-2cd5-4372-84d8-e6305c5f2c92)
![image](https://github.com/user-attachments/assets/8439d2d7-d3e0-43c8-983c-4068db7924a7)

-  Favorite: Mark a concert as a favorite.

![image](https://github.com/user-attachments/assets/ffca414f-5cef-44ab-b4b0-4fe9802c3ef1)
![image](https://github.com/user-attachments/assets/643c7b94-b702-4489-88bf-510ba59db0fe)


-  Check Details: View concert details by clicking on the concert entry.

![image](https://github.com/user-attachments/assets/df5315c5-a1e6-457c-8d40-4687f83619e1)
![image](https://github.com/user-attachments/assets/cf7ec709-668b-4d22-af5c-421525d54f85)

-  Edit Concert: Modify existing concert information.

![image](https://github.com/user-attachments/assets/72cb5980-9e51-47c6-8f56-83ec0c0143ef)
![image](https://github.com/user-attachments/assets/15fec24b-d7c6-4b4b-ae65-fd36194ae06f)
![image](https://github.com/user-attachments/assets/b67b9a19-d1ee-4a44-a03d-d480d393ec86)

-  Delete Concert: Remove a concert record.

![image](https://github.com/user-attachments/assets/faa59b14-17c0-4b50-a3a8-6b374478b573)
![image](https://github.com/user-attachments/assets/78dbdde8-8682-4ab3-a945-9daf01c5ad5f)
![image](https://github.com/user-attachments/assets/29ba64fb-ac70-4830-bb32-02c018e70e71)

-  Logout: End the user session using the logout option.

![image](https://github.com/user-attachments/assets/4b5822c0-d95a-4457-b7f4-126f64111aa6)

## RESTful API Testing with CURL
Ensure you are logged in before testing these APIs.
### Login

```curl -X POST http://localhost:8099/login/local -c cookies.txt -F "username=ooo" -F "password=222222"```

![螢幕快照 2024-11-28 00-35-17](https://github.com/user-attachments/assets/7d6bb8cc-1707-4bfc-bcae-1b0c386c7bbf)

### Get (Read)

- Fetch concert details by ID:

```curl -X GET http://localhost:8099/api/concerts/6741f3b1c8b902551e7d23ce```

![螢幕快照 2024-11-28 00-43-03](https://github.com/user-attachments/assets/cb308619-6287-4f82-be2e-d60c478f6f8a)

### Add (Create)

- Create a new concert:
  
```
  curl -X POST http://localhost:8099/api/concerts \
  -H "Content-Type: application/json" \
  -d '{
  "title": "測試演唱會",
  "date": "2024-04-01",
  "time": "19:00",
  "location": "測試場地",
  "description": "測試描述",
  "content": "測試內容",
  "artist": "測試藝人",
  "ticketFee": 1000
  }'
```

![螢幕快照 2024-11-28 00-36-45](https://github.com/user-attachments/assets/f8dfd00f-7b96-4854-8e48-4dbe40b280a6)

### Update (Edit)

- Update concert information:

```
  curl -X PUT http://localhost:8099/api/concerts/6741f3b1c8b902551e7d23ce \
  -H "Content-Type: application/json" \
  -d '{
  "title": "更新的演唱會"
  }'
```

![螢幕快照 2024-11-28 00-39-59](https://github.com/user-attachments/assets/2db29451-cdfb-4be6-aac2-e4a9e7658578)

### Delete

- Delete a concert by ID:

```curl -X DELETE "http://localhost:8099/concerts/6747433f3f86a0a6af1e5498" -b cookies.txt```

![螢幕快照 2024-11-28 00-40-36](https://github.com/user-attachments/assets/02419d2a-f7b3-4a5e-9ca8-77486eeff155)

