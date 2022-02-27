# parking-lot
Design API and Maintain the state of the parking lot systems.

<!-- GETTING STARTED -->
## Getting Started
This project is use TypeScript, Node, and Mongo DB and Dependency Injection design pattern.

### Prerequisites
* node.js
* docker
* git cli

### Installation, Build & Run

1. Clone the repository
   ```sh
   git clone https://github.com/Songphon-Chamniansong/parking-lot.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create your config in  `/env/dev/.env` or `/env/prod/.env`
   ```JS
    PORT=3000
    DB_URL=Your_DB_URL
    DB_DB_NAME=Your_DB_DB_NAME
    DB_USERNAME=Your_DB_USERNAME
    DB_PASSWORD=Your_DB_PASSWORD
   ```
### Build and Run with Docker
4. Build project with Docker
   ```sh
   docker build -t parking-lot .
   ```
5. Run project
   ```sh
   docker run --name parking-lot-server -p 3000:3000
   ```
### Build and run without Docker
4-1. Build project with web pack
   ```sh
   npm run dev
   ```
   or 
   ```sh
   npm run prod
   ```
5-1. Run project
   ```sh
   npm run start
   ```
   
<!-- API Doc  -->
## API Doc
  ### GET /
    use for test is API works
    return 'Hellow World!!!'
  ### POST /parking-lot/
    use for create new parking lot
    @body `code` is Parking lot's Code
    @body `size` is size of the car (small, medium, large)
    @body `range` is distance from gate
  ### POST /parking-lot/park
    use for park the car
    @body `plateNumber` is plate number
    @body `size` is size of the car (small, medium, large)
    @body `code` [optional] use when you need to a specific parking lot
    @body `updateAt` [optional] use to verify is your information is up to date.
  ### POST /parking-lot/leave
    use for free parking lot
    @body `code` is parking lot code
  ### GET /parking-lot/status/:code
    use to get status of parking lot
    @param `code` is parking lot code
  ### GET /parking-lot/reg/:size
    get registration plate number list by car size
    @param `size` is size of the car (small, medium, large)
  ### GET /parking-lot/allocated/:size
    get registration allocated slot number list by car size
    @param `size` is size of the car (small, medium, large)
    

<!-- Framework  -->
## Framework
  ### Model
    model is represent collection object and I use mongoose library for ORM.
  ### Repository
    repository is layer that have responsibility for connecting with model.
    That's mean all query will implement in this layer.
  ### Service
    service is a business layer. All business logic should implementin this layer.
    So, this layer is must have unit test.
  ### Controller
    controller is a layer that have responsibility to contract with user.
  ### Data
    data is an object/interface for communicate betwenn layer.
