### Commands
```bash
npm run build # run WebPack on a different Terminal
```
```bash
firebase deploy
firebase deploy --only hosting:course-selection-mygju
```
---------------------------------------------
### JS

##### fetch documents from `Firestore`
```js
import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, getDoc, 

} from 'firebase/firestore'

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAqZB4493JLzo-EgjiH9ECmRMzGs3f08hs",
    authDomain: "mygju-cs-test.firebaseapp.com",
    databaseURL: "https://mygju-cs-test-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mygju-cs-test",
    storageBucket: "mygju-cs-test.appspot.com",
    messagingSenderId: "114912863938",
    appId: "1:114912863938:web:9557ca705f24c6eed4fd5b",
    measurementId: "G-JTWZC64K9H"
};

initializeApp(firebaseConfig)

const db = getFirestore()

// Collection ref
const colRef = collection(db, 'courses')

// get collection data
getDocs(colRef).then((snapshot) => {
     let courses = []
     snapshot.docs.forEach((doc) => {
        courses.push({...doc.data(), id: doc.id})
     })
     console.log(courses)
}).catch(err =>{console.log(err.message)})
```
--------------------------------------------
##### Collection Data `get collection data()`
```js
import { getDocs } from 'firebase/firestore

// get collection data

getDocs(colRef).then((snapshot) => {
    let courses = []
    snapshot.docs.forEach((doc) => {
        courses.push({ ...doc.data(), id: doc.id })
    })
    console.log(courses)
}).catch(err => { console.log(err.message) })
```
---------------------------------
##### Fetch Data
```js
import { onSnapshot } from 'firebase/firestore


// Real time Data Collection
onSnapshot(colRef, (snapshot)=>{
    let courses = []
    snapshot.docs.forEach((doc) => {
        courses.push({...doc.data(), id: doc.id})
    }
    )
    console.log(courses)}
)
```
-------------------------
##### Adding Docs
```js
// adding documents
const addCourseForm = document.querySelector('.add')
addCourseForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const courseData = {
    year: addCourseForm.year.value,
    semester: addCourseForm.semester.value,
    courseId: addCourseForm.course_id.value,
    courseName: addCourseForm.course_name.value,
    sectionNum: addCourseForm.section_no.value,
    degree: addCourseForm.degree.value,
    department: addCourseForm.department.value,
    faculty: addCourseForm.faculty.value,
    instructor: {
      firstName: addCourseForm.instructor_first_name.value,
      lastName: addCourseForm.instructor_last_name.value
    },
    schedule: {
      day: addCourseForm.day.value,
      roomName: addCourseForm.room_name.value,
      fromTime: addCourseForm.from_time.value,
      toTime: addCourseForm.to_time.value
    },
    otherInfo: {
      maxStudents: addCourseForm.max_students.value,
      currStudents: addCourseForm.curr_students.value,
      creditHrs: addCourseForm.credit_hrs.value,
      financialHrs: addCourseForm.financial_hrs.value,
      isBlocked: addCourseForm.is_blocked.value
    }
  };
  // Construct the document ID using the composite key fields
  const docId = `${courseData.year}_${courseData.semester}_${courseData.courseId}_${courseData.sectionNum}`;

  addDoc(collection(db, "courses", docId), courseData)
    .then((docRef) => {
      addCourseForm.reset()
      console.log("Course added successfully! DOC ID: ", docRef.id );
    })
    .catch((error) => {
      console.error("Error adding course:", error);
    });
})
```
---------------------------------------------------
### json
#### `firebase.json`
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "hosting": {
    "site": "course-selection-mygju",
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```