import cv2
import face_recognition
import numpy as np
from datetime import datetime, timedelta
import pymongo
from bson import ObjectId
from pytz import utc

# Connect to the MongoDB database
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["system_facial"]
collection = db["stagiaire"]

# Load face encodings from MongoDB
def load_face_encodings_from_db():
    encoded_faces = []
    names = []
    for person in collection.find():
        if "face_encoding" in person:
            encoded_faces.append(np.array(person["face_encoding"], dtype=np.float64))
            names.append(person)
    return encoded_faces, names

def get_students_with_current_session():
    inscriptions_collection = db['inscriptions']
    emploi_collection = db['emploi']
    stagiaire_collection = db['stagiaire']
    groups_collection = db['groups']

    current_time = datetime.now(utc)
    print("Current UTC time in function:", current_time)

    ongoing_sessions = emploi_collection.find({
        'start': {'$lte': current_time},
        'end': {'$gte': current_time}
    })

    ongoing_sessions_list = list(ongoing_sessions)
    print("Ongoing sessions found:", len(ongoing_sessions_list))
    for session in ongoing_sessions_list:
        print("Session start:", session['start'], "Session end:", session['end'])

    if ongoing_sessions_list:
        ongoing_group_ids = [session['id_group'] for session in ongoing_sessions_list]
        print("Ongoing group IDs:", ongoing_group_ids)
        
        # طباعة كل بيانات مجموعة inscriptions للتأكد من البيانات
        print("All inscriptions data:")
        for ins in inscriptions_collection.find():
            print(ins)
        
        students_in_sessions = inscriptions_collection.find({'id_group': {'$in': ongoing_group_ids}})
        students_in_sessions_list = list(students_in_sessions)
        
        # طباعة بيانات الطلاب في الجلسة الحالية
        print("Students in sessions data:")
        for student in students_in_sessions_list:
            print(student)

        student_details = []
        for student_in_session in students_in_sessions_list:
            student_id = student_in_session['id_stagiaire']
            
            # تحويل student_id إلى سلسلة نصية إذا لم يكن كذلك بالفعل
            student_id_str = str(student_id)
            
            # محاولة العثور على الطالب باستخدام كلاً من القيم العددية والنصية للـ id_stagiaire
            student = stagiaire_collection.find_one({'id_stagiaire': student_id_str})
            if not student:
                student = stagiaire_collection.find_one({'id_stagiaire': int(student_id)})

            if student:
                id_inscription = student_in_session['_id']
                id_emploi = emploi_collection.find_one({'id_group': student_in_session['id_group']})['_id']

                group = groups_collection.find_one({'_id': student_in_session['id_group']})
                group_name = group['nom_group'] if group else "Unknown"

                session = next(session for session in ongoing_sessions_list if session['id_group'] == student_in_session['id_group'])
                start_time = session['start'].astimezone(utc)
                end_time = session['end'].astimezone(utc)

                student_details.append({
                    'id': student['_id'],
                    'nom': student.get('nom', ''),
                    'prenom': student.get('prenom', ''),
                    'id_inscription': id_inscription,
                    'id_emploi': id_emploi,
                    'start_time': start_time,
                    'end_time': end_time,
                    'group_name': group_name
                })
            else:
                print(f"Student with id_stagiaire {student_id_str} not found in 'stagiaire' collection.")
        
        print("Student details:", student_details)
        return student_details
    else:
        return []

def compare_face_encodings(known_encodings, face_encoding):
    matches = face_recognition.compare_faces(known_encodings, face_encoding)
    if True in matches:
        return True, matches.index(True)
    else:
        return False, None

def mark_attendance_in_db(nom, prenom, id_inscription, id_emploi, status):
    now = datetime.now(utc)
    time = now.strftime('%I:%M:%S:%p')
    date = now.strftime('%d-%B-%Y')
    attendance_record = {
        "nom": nom,
        "prenom": prenom,
        "id_inscription": id_inscription,
        "id_emploi": id_emploi,
        "date": date,
        "time": time,
        "status": status
    }
    if status == "present":
        db["presences"].insert_one(attendance_record)
    elif status == "absent":
        db["abscents"].insert_one(attendance_record)
    elif status == "late":
        db["retards"].insert_one(attendance_record)

# كود الكاميرا لالتقاط الصور ومسح الوجوه
cap = None
for i in range(3):
    cap = cv2.VideoCapture(i)
    if cap.isOpened():
        break

if cap is None or not cap.isOpened():
    print("Error: Unable to open webcam.")
else:
    known_encodings, known_names = load_face_encodings_from_db()
    current_students = get_students_with_current_session()

    if len(current_students) > 0:
        print("Students in Current Session:")
        for student in current_students:
            print(student['nom'], student['prenom'])

        class_end_time = current_students[0]['end_time']

        marked_attendance = set()
        all_student_names = {f"{student['prenom']} {student['nom']}".lower() for student in current_students}

        while datetime.now(utc) < class_end_time:
            success, img = cap.read()
            if img is not None:
                imgS = cv2.resize(img, (0, 0), None, 0.5, 0.5)
                imgS = cv2.cvtColor(imgS, cv2.COLOR_BGR2RGB)
                faces_in_frame = face_recognition.face_locations(imgS, number_of_times_to_upsample=2)
                encoded_faces = face_recognition.face_encodings(imgS, faces_in_frame)

                for encode_face, faceloc in zip(encoded_faces, faces_in_frame):
                    match, match_index = compare_face_encodings(known_encodings, encode_face)
                    if match:
                        nom = known_names[match_index]["nom"].upper().lower()
                        prenom = known_names[match_index]["prenom"].upper().lower()
                        student_name = f"{prenom} {nom}"
                        print(f"Checking student: {student_name}")  # تتبع الأسماء

                        if student_name in all_student_names:
                            print(f"Found student in session: {student_name}")
                            if student_name not in marked_attendance:
                                for student_in_session in current_students:
                                    if student_name == f"{student_in_session['prenom']} {student_in_session['nom']}".lower():
                                        start_time = student_in_session['start_time']
                                        end_time = student_in_session['end_time']
                                        start_time = start_time.astimezone(utc)
                                        end_time = end_time.astimezone(utc)
                                        time_elapsed = datetime.now(utc) - start_time
                                        if time_elapsed <= timedelta(minutes=15):
                                            status = "present"
                                        elif start_time + timedelta(minutes=15) < datetime.now(utc) <= end_time:
                                            status = "late"
                                        else:
                                            status = "absent"
                                        mark_attendance_in_db(nom, prenom, student_in_session['id_inscription'], student_in_session['id_emploi'], status)
                                        marked_attendance.add(student_name)
                            y1, x2, y2, x1 = faceloc
                            y1, x2, y2, x1 = y1*2, x2*2, y2*2, x1*2
                            cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            cv2.rectangle(img, (x1, y2 - 35), (x2, y2), (0, 255, 0), cv2.FILLED)
                            cv2.putText(img, student_name, (x1 + 6, y2 - 6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
                        else:
                            print(f"Student not in current session: {student_name}")
                    else:
                        print("No matching student found for detected face.")

            cv2.imshow("Webcam", img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    else:
        print("No students found for the current session.")

    cap.release()
    cv2.destroyAllWindows()
