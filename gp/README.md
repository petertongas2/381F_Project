# Project name: Concert query system
A web application for querying concert information with user authentication. Only logged-in users can perform modify operations such as adding, editing, or deleting concerts.
## GP NO:43
- Group Member:
  - Name: Tong Tsz Ho, SID:12591345
  - Name: Ma Kam Chiu, SID:13687015
  - Name: Lee Chak Fung Bond, SID:13173016
  - Name: Liu Yan Zuo , SID: 12727610
## Project Structure:

## Project file instruction:
- server.js:
  Implements server-side logic, including user authentication, routing, and handling RESTful API requests for CRUD operations.And Defines the MongoDB data schemas and models for concerts and users.
- package.json:
  Contains the project dependencies, scripts, and metadata.
- public:
  Includes static files such as CSS, images, and JavaScript assets (if applicable).
- views:
  Contains EJS templates for rendering the user interface, such as login pages, concert management pages, and detail views.
## Project features instruction:
- 
## The cloud-based server URL for testing:
- https://381fproject-gp43-app-amgvb2a8dthfg9a8.eastus-01.azurewebsites.net/
## Operation guides
### user flow
-  Login: Authenticate using valid credentials.

![圖片](https://github.com/user-attachments/assets/e7c6f38b-b889-4199-97fd-531aaf8f4585)

-  Add New Concert: Create a new concert record via the "新增演唱會" button.

-  Favorite: Mark a concert as a favorite.
-  Check Details: View concert details by clicking on the concert entry.
-  Edit Concert: Modify existing concert information.
-  Delete Concert: Remove a concert record.
-  Logout: End the user session using the logout option.
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

