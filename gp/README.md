# Project name: Concert query system
A web application for query concert information with authentication. (modify function only for login user)
## GP NO:43
- Group Member:
  - Name: Tong Tsz Ho, SID:12591345
  - Name: Ma Kam Chiu, SID:13687015
  - Name: Lee Chak Fung Bond, SID:13173016
  - Name:
## Project Structure:

## Project file instruction:
- server.js:
- package.json:
- public
- views
## Project features instruction:
- 
## The cloud-based server URL for testing:
- https://381fproject-gp43-app-amgvb2a8dthfg9a8.eastus-01.azurewebsites.net/
## Operation guides
### user flow
- Login
- add new concert
- favourite
- check detail of concert
- edit concert
- delete concert
- Logout
## CURL test
Must Login first
```curl -X POST http://localhost:8099/login/local -c cookies.txt -F "username=ooo" -F "password=222222"```
![螢幕快照 2024-11-28 00-35-17](https://github.com/user-attachments/assets/7d6bb8cc-1707-4bfc-bcae-1b0c386c7bbf)

- get
```curl -X GET http://localhost:8099/api/concerts/6741f3b1c8b902551e7d23ce```
![螢幕快照 2024-11-28 00-43-03](https://github.com/user-attachments/assets/cb308619-6287-4f82-be2e-d60c478f6f8a)

- add / post
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

- update / PUT
```
  curl -X PUT http://localhost:8099/api/concerts/6741f3b1c8b902551e7d23ce \
  -H "Content-Type: application/json" \
  -d '{
  "title": "更新的演唱會"
  }'
```
![螢幕快照 2024-11-28 00-39-59](https://github.com/user-attachments/assets/2db29451-cdfb-4be6-aac2-e4a9e7658578)

- delete
```curl -X DELETE "http://localhost:8099/concerts/6747433f3f86a0a6af1e5498" -b cookies.txt```
![螢幕快照 2024-11-28 00-40-36](https://github.com/user-attachments/assets/02419d2a-f7b3-4a5e-9ca8-77486eeff155)

