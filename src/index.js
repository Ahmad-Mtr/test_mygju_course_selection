// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, onSnapshot, addDoc, setDoc, doc, query, where, getDocs, orderBy, startAt, endAt
} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4jHlMLQ-Q5J7qYaNQBnY9aXIDK1vuUKM",
  authDomain: "mygju-cc9f0.firebaseapp.com",
  projectId: "mygju-cc9f0",
  storageBucket: "mygju-cc9f0.appspot.com",
  messagingSenderId: "952211347313",
  appId: "1:952211347313:web:fcfca56b3ab8798c7488d0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();

// collection ref
const colRef = collection(db, "courses")




function _displayCourses(courses) {
  const coursesTable = document.getElementById("coursesTable");
  coursesTable.innerHTML = ""; // Clear existing table content
  // Create table header
  const tableHeader = coursesTable.createTHead();
  const headerRow = tableHeader.insertRow();
  headerRow.insertCell().textContent = "Course ID";
  headerRow.insertCell().textContent = "Course Name";
  headerRow.insertCell().textContent = "Instructor";
  headerRow.insertCell().textContent = "Section Num.";
  headerRow.insertCell().textContent = "Time";
  headerRow.insertCell().textContent = "Room Name";
  headerRow.insertCell().textContent = "Capacity";
  headerRow.insertCell().textContent = "Curr. num of Students";
  headerRow.insertCell().textContent = "Credit hrs.";
  headerRow.insertCell().textContent = "Financial hrs.";
  headerRow.insertCell().textContent = "isblocked";

  // Create table body
  const tableBody = coursesTable.createTBody();
  courses.forEach((course) => {
    let instructor = `${course.instructor.firstName} ${course.instructor.lastName}`;
    let time = `${course.schedule.day} | ${course.schedule.fromTime}-${course.schedule.toTime}`;
    let isBlocked = course.otherInfo.isBlocked ? "blocked" : "_";

    const row = tableBody.insertRow();
    row.insertCell().textContent = course.courseId;
    row.insertCell().textContent = course.courseName;
    row.insertCell().textContent = instructor;
    row.insertCell().textContent = course.sectionNum;
    row.insertCell().textContent = time;
    row.insertCell().textContent = course.schedule.roomName;
    row.insertCell().textContent = course.otherInfo.maxStudents;
    row.insertCell().textContent = course.otherInfo.currStudents;
    row.insertCell().textContent = course.otherInfo.creditHrs;
    row.insertCell().textContent = course.otherInfo.financialHrs;
    row.insertCell().textContent = isBlocked;
  });
}


// getDocs
getDocs(colRef).then((snapshot) => {
  let courses = []
  snapshot.docs.forEach((doc) => {
    courses.push({ ...doc.data(), id: doc.id })
  }
  )
  _displayCourses(courses);
  console.log(courses)
  
})

async function insertDocs(docId, courseData) {
  const docRef = await setDoc(doc(db, "courses", docId), courseData);
  return docRef;
}

// adding documents
const addCourseForm = document.querySelector('.add')
if (addCourseForm != null) {

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
        isBlocked: addCourseForm.is_blocked.checked
      }
    };

    let q = query(colRef, where("year", "==", courseData.year));

    q = courseData.semester != "all_sems" ? query(q, where("semester", "==", courseData.semester)) : q;
    q = courseData.degree != "all_degs" ? query(q, where("degree", "==", courseData.degree)) : q;
    q = courseData.faculty != "all_faculty" ? query(q, where("faculty", "==", courseData.faculty)) : q;
    q = courseData.department != "all_departments" ? query(q, where("department", "==", courseData.department)) : q;
    q = courseData.courseId != '' ? query(q, orderBy("courseId"), startAt(courseData.courseId), endAt(courseData.courseId+'\uf8ff')) : q;
    q = courseData.courseName != '' ? query(q,  orderBy("courseName"), startAt(courseData.courseName), endAt(courseData.courseName+'\uf8ff')) : q;

    //q = courseData.sectionNum == 0 ? q : query(q, where("sectionNum", "==", courseData.sectionNum));
    //q = courseData.instructor.firstName != '' ? query(q, where("firstName", " " == "", courseData.instructor.firstName)) : q;
    //q = courseData.instructor.lastName != '' ? query(q, where("lastName", "==", courseData.instructor.lastName)) : q;
    //q = courseData.schedule.day != '' ? query(q, where("day", "==", courseData.schedule.day)) : q;
    //q = courseData.schedule.fromTime != '' ? query(q, where("fromTime", "==", courseData.schedule.fromTime)) : q;
    //q = courseData.schedule.toTime != '' ? query(q, where("toTime", "==", courseData.schedule.toTime)) : q;
    q = courseData.schedule.roomName != '' ? query(q, orderBy("roomName"), startAt(courseData.schedule.roomName), endAt(courseData.schedule.roomName+ '\uf8ff')) : q;
    //q = courseData.otherInfo.creditHrs != 0 ? query(q, where("creditHrs", "==", courseData.otherInfo.creditHrs)) : q;
    //q = courseData.otherInfo.financialHrs != 0 ? query(q, where("financialHrs", "==", courseData.otherInfo.financialHrs)) : q;
    //q = courseData.otherInfo.maxStudents != 0 ? query(q, where("maxStudents", "==", courseData.otherInfo.maxStudents)) : q;
    //q = courseData.otherInfo.currStudents != 0 ? query(q, where("currStudents", "==", courseData.otherInfo.currStudents)) : q;
    //q = query(q,where("courseName", "==", courseData.otherInfo.isBlocked));


    getDocs(q).then((querySnapshot) => {
      let courses = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        courses.push({ ...doc.data(), id: doc.id });
        // Process the fetched data
      });
      console.log('here are courses: ',courses)
      _displayCourses(courses);
    }).catch((error) => {
      console.error("Error fetching documents: ", error);
    });


    //insertDocs(docId, courseData);
    //console.log('Course Added Succesfully!')
  })




}
else {
  // ---------------------------------------------------------------------
  const insertionCourseForm = document.querySelector('.insertion');
  const resultElement = document.getElementById("result");

  insertionCourseForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const courseData = {
      year: insertionCourseForm.year.value,
      semester: insertionCourseForm.semester.value,
      courseId: insertionCourseForm.course_id.value,
      courseName: insertionCourseForm.course_name.value,
      sectionNum: parseInt(insertionCourseForm.section_no.value),
      degree: insertionCourseForm.degree.value,
      department: insertionCourseForm.department.value,
      faculty: insertionCourseForm.faculty.value,
      instructor: {
        firstName: insertionCourseForm.instructor_first_name.value,
        lastName: insertionCourseForm.instructor_last_name.value
      },
      schedule: {
        day: insertionCourseForm.day.value,
        roomName: insertionCourseForm.room_name.value,
        fromTime: insertionCourseForm.from_time.value,
        toTime: insertionCourseForm.to_time.value
      },
      otherInfo: {
        maxStudents: parseInt(insertionCourseForm.max_students.value),
        currStudents: parseInt(insertionCourseForm.curr_students.value),
        creditHrs: parseInt(insertionCourseForm.credit_hrs.value),
        financialHrs: parseInt(insertionCourseForm.financial_hrs.value),
        isBlocked: insertionCourseForm.is_blocked.checked
      }
    };
    // Construct the document ID using the composite key fields
    const docId = `${courseData.year}_${courseData.semester}_${courseData.courseId}_${courseData.sectionNum}`;

    const docRef = insertDocs(docId, courseData);
    resultElement.textContent = "Success! added course: " + docId ;
    console.log('Course Added Succesfully!')
  })

}