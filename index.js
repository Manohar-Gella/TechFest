// const express = require('express');
// const multer = require('multer');
// const csv = require('csv-parser');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.use(express.static('public'));

// app.post('/upload', upload.fields([{ name: 'groupFile' }, { name: 'hostelFile' }]), (req, res) => {
//     const groupFile = req.files['groupFile'][0];
//     const hostelFile = req.files['hostelFile'][0];

//     let groups = [];
//     let hostels = [];

//     fs.createReadStream(groupFile.path)
//         .pipe(csv())
//         .on('data', (data) => groups.push(data))
//         .on('end', () => {
//             fs.createReadStream(hostelFile.path)
//                 .pipe(csv())
//                 .on('data', (data) => hostels.push(data))
//                 .on('end', () => {
//                     const allocation = allocateRooms(groups, hostels);
//                     res.json(allocation);
//                 });
//         });
// });

// function allocateRooms(groups, hostels) {
//     let allocationResult = [];
//     let hostelMap = {};

//     hostels.forEach((row) => {
//         const hostelName = row['Hostel Name'];
//         if (!hostelMap[hostelName]) {
//             hostelMap[hostelName] = [];
//         }
//         hostelMap[hostelName].push({
//             roomNumber: row['Room Number'],
//             capacity: parseInt(row['Capacity']),
//             gender: row['Gender'],
//             currentOccupancy: 0,
//         });
//     });

//     groups.forEach((group) => {
//         const groupId = group['Group ID'];
//         const members = parseInt(group['Members']);
//         const gender = group['Gender'];

//         let allocated = false;
//         for (let hostelName in hostelMap) {
//             let rooms = hostelMap[hostelName];
//             for (let room of rooms) {
//                 if (
//                     room.gender === gender &&
//                     room.currentOccupancy + members <= room.capacity
//                 ) {
//                     room.currentOccupancy += members;
//                     allocationResult.push({
//                         'Group ID': groupId,
//                         'Hostel Name': hostelName,
//                         'Room Number': room.roomNumber,
//                         'Members Allocated': members,
//                     });
//                     allocated = true;
//                     break;
//                 }
//             }
//             if (allocated) break;
//         }
//     });

//     return allocationResult;
// }

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });



const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// POST endpoint to handle file uploads and allocation
app.post('/upload', upload.fields([{ name: 'groupFile' }, { name: 'hostelFile' }]), (req, res) => {
    const groupFile = req.files['groupFile'][0];
    const hostelFile = req.files['hostelFile'][0];

    let groups = [];
    let hostels = [];

    // Read and parse group information CSV
    fs.createReadStream(groupFile.path)
        .pipe(csv())
        .on('data', (data) => {
            groups.push({
                'Group ID': data['Group ID'], // Ensure correct field name
                'Members': parseInt(data['Members']),
                'Gender': data['Gender']
            });
        })
        .on('end', () => {
            // Read and parse hostel information CSV
            fs.createReadStream(hostelFile.path)
                .pipe(csv())
                .on('data', (data) => {
                    hostels.push({
                        'Hostel Name': data['Hostel Name'],
                        'Room Number': data['Room Number'],
                        'Capacity': parseInt(data['Capacity']),
                        'Gender': data['Gender']
                    });
                })
                .on('end', () => {
                    // Allocate rooms based on parsed data
                    const allocation = allocateRooms(groups, hostels);
                    // Send allocation results as JSON response
                    res.json(allocation);
                });
        });
});

// Function to allocate rooms based on group and hostel information
function allocateRooms(groups, hostels) {
    let allocationResult = [];
    let hostelMap = {};

    // Map hostels by name and initialize current occupancy
    hostels.forEach((row) => {
        const hostelName = row['Hostel Name'];
        if (!hostelMap[hostelName]) {
            hostelMap[hostelName] = [];
        }
        hostelMap[hostelName].push({
            roomNumber: row['Room Number'],
            capacity: parseInt(row['Capacity']),
            gender: row['Gender'],
            currentOccupancy: 0,
        });
    });

    // Allocate rooms for each group
    groups.forEach((group) => {
        const groupId = group['Group ID'];
        const members = group['Members'];
        const gender = group['Gender'];

        let allocated = false;
        for (let hostelName in hostelMap) {
            let rooms = hostelMap[hostelName];
            for (let room of rooms) {
                if (room.gender === gender && room.currentOccupancy + members <= room.capacity) {
                    room.currentOccupancy += members;
                    allocationResult.push({
                        'Group ID': groupId, // Include Group ID in allocation result
                        'Hostel Name': hostelName,
                        'Room Number': room.roomNumber,
                        'Members Allocated': members,
                    });
                    allocated = true;
                    break;
                }
            }
            if (allocated) break;
        }
    });

    return allocationResult;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



