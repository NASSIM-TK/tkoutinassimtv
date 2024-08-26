import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, addDoc, query, orderBy, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';

// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCuo4iAmNbiPLpqawyDbC4mjk6KZG1GwHA",
    authDomain: "nassimtv-2d9e9.firebaseapp.com",
    projectId: "nassimtv-2d9e9",
    storageBucket: "nassimtv-2d9e9.appspot.com",
    messagingSenderId: "714523165832",
    appId: "1:714523165832: web:7119c7efe18c1aef014b3d"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// وظيفة لعرض نموذج إدخال الملاحظات
function showForm() {
    const formContainer = document.getElementById('formContainer');
    formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
}

// وظيفة لحفظ الملاحظات
async function saveNote() {
    const note = {
        phone: document.getElementById('phone').value,
        paperNumber: document.getElementById('paperNumber').value,
        letter: document.getElementById('letter').value,
        cost: parseFloat(document.getElementById('cost').value),
        totalCost: parseFloat(document.getElementById('totalCost').value),
        issue: document.getElementById('issue').value,
        date: document.getElementById('date').value
    };

    try {
        await addDoc(collection(db, "notes"), note);
        console.log("Note added successfully");
        loadNotes(); // تحميل الملاحظات بعد الإضافة
        document.getElementById('formContainer').reset(); // إعادة تعيين النموذج بعد الإضافة
    } catch (error) {
        console.error("Error adding note: ", error);
    }
}

// وظيفة لتحميل الملاحظات
async function loadNotes(order = 'desc') {
    const notesContainer = document.getElementById('notesContainer');
    notesContainer.innerHTML = '<h2>الملاحظات</h2>'; // تهيئة العنصر

    const notesRef = collection(db, "notes");
    const q = query(notesRef, orderBy("date", order));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const note = doc.data();
        notesContainer.innerHTML += `<div class="note">
            <p>رقم الهاتف: ${note.phone}</p>
            <p>رقم الورقة: ${note.paperNumber}</p>
            <p>الحرف: ${note.letter}</p>
            <p>سعر التكلفة: ${note.cost}</p>
            <p>السعر الإجمالي: ${note.totalCost}</p>
            <p>المشكلة: ${note.issue}</p>
            <p>التاريخ: ${note.date}</p>
        </div>`;
    });
}

// وظيفة للبحث في الملاحظات
function searchNotes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        const text = note.textContent.toLowerCase();
        note.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
}

// وظيفة لتصفية الملاحظات حسب التاريخ
async function filterByDate() {
    const filterDate = prompt("أدخل السنة والشهر (YYYY-MM):");
    if (filterDate) {
        const notesContainer = document.getElementById('notesContainer');
        notesContainer.innerHTML = '<h2>الملاحظات</h2>'; // تهيئة العنصر

        const notesRef = collection(db, "notes");
        const q = query(notesRef, where("date", "==", filterDate));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const note = doc.data();
            notesContainer.innerHTML += `<div class="note">
                <p>رقم الهاتف: ${note.phone}</p>
                <p>رقم الورقة: ${note.paperNumber}</p>
                <p>الحرف: ${note.letter}</p>
                <p>سعر التكلفة: ${note.cost}</p>
                <p>السعر الإجمالي: ${note.totalCost}</p>
                <p>المشكلة: ${note.issue}</p>
                <p>التاريخ: ${note.date}</p>
            </div>`;
        });
    }
}

// وظيفة لفرز الملاحظات
function sortNotes(order) {
    loadNotes(order);
}

// تحميل الملاحظات عند تحميل الصفحة
window.onload = () => {
    loadNotes(); // افتراضيًا تحميل الملاحظات بترتيب تنازلي حسب التاريخ
};