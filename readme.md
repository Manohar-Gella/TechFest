# Group Accommodation Allocation Application

## Overview
This web application facilitates the digitalization of the hospitality process for group accommodations in hostels. It allows users to upload two CSV files containing group information and hostel room details. The application then allocates rooms based on specified criteria, ensuring that group members with the same ID stay together and adhere to hostel capacities and gender-specific accommodations.

## Logic
### Backend (`index.js`)
- **Express Server**: Handles file uploads and allocation logic.
- **CSV Parsing**: Utilizes `csv-parser` to parse uploaded CSV files containing group and hostel information.
- **Room Allocation Algorithm**: 
  - Groups and hostels are parsed into arrays.
  - Hostels are mapped by name with details including room numbers, capacities, genders, and current occupancies.
  - Groups are allocated to rooms based on gender compatibility and room capacity constraints.
  - Allocation results are stored in an array containing `Group ID`, `Hostel Name`, `Room Number`, and `Members Allocated`.

### Frontend (`index.html`)
- **HTML Form**: Provides an interface to upload `group_info.csv` (group information) and `hostel_info.csv` (hostel information).
- **JavaScript Fetch API**: Sends POST request to `/upload` endpoint with uploaded files.
- **Results Display**: Renders allocation results in a formatted HTML table dynamically.

## Usage
### Setup
- Ensure Node.js and npm are installed on your system.

### Installation
1. Navigate to your project directory in the terminal.
2. Install required Node.js packages:
   ```bash
   npm install express multer csv-parser fs path
   ```

### Running the Application
1. Start the Node.js server:
   ```bash
   node index.js
   ```
2. The server will start running on `http://localhost:3000/`.

### Using the Application
1. Open a web browser and go to `http://localhost:3000/`.
2. Upload `group_info.csv` (containing group information) and `hostel_info.csv` (containing hostel information) using the provided form.
3. Click on "Upload and Allocate" button to initiate the allocation process.
4. Allocation results (including `Group ID`, `Hostel Name`, `Room Number`, and `Members Allocated`) will be displayed in a formatted table on the same page.

## Example CSV Files
- **group_info.csv**:
  ```
  Group ID,Members,Gender
  101,3,Boys
  102,4,Girls
  103,2,Boys
  104,5,Girls
  ```
- **hostel_info.csv**:
  ```
  Hostel Name,Room Number,Capacity,Gender
  Boys Hostel A,101,3,Boys
  Boys Hostel A,102,4,Boys
  Girls Hostel B,201,2,Girls
  Girls Hostel B,202,5,Girls
  ```

## Dependencies
- **Express**: Backend server framework.
- **Multer**: Middleware for handling file uploads.
- **csv-parser**: Parsing CSV files.
- **fs**: File system module for reading files.
- **path**: Path module for working with file paths.

## Notes
- Ensure CSV files are formatted correctly with headers (`Group ID`, `Members`, `Gender` for `group_info.csv` and `Hostel Name`, `Room Number`, `Capacity`, `Gender` for `hostel_info.csv`).
- Adjust CSS classes and styles using Tailwind CSS in `index.html` for customization.
